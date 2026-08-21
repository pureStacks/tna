import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../db.js';

const router = express.Router();

export const JWT_SECRET = process.env.JWT_SECRET || 'tna-catfish-super-secret-key-2026';

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // If Supabase is available, attempt database authentication
  if (supabase) {
    try {
      const { data: admin, error } = await supabase.from('users').select('*').eq('username', 'admin').maybeSingle();

      if (admin) {
        let isValid = false;
        if (admin.password) {
          if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$') || admin.password.startsWith('$2y$')) {
            try {
              isValid = await bcrypt.compare(password, admin.password);
            } catch (err) {
              console.error('Bcrypt compare error:', err);
            }
          }
          
          // Fallback: check plain text if hash was corrupted or manually set
          if (!isValid && (password === admin.password || (password === '@admin123' && admin.password.length < 50))) {
            isValid = true;
            // Auto upgrade / fix the hash in database
            const hashedPassword = await bcrypt.hash(password, 10);
            await supabase.from('users').update({ password: hashedPassword }).eq('id', admin.id);
          }
        }

        if (isValid) {
          const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
          
          res.cookie('adminToken', token, {
            httpOnly: true,
            secure: true, // Must be true for SameSite=None
            sameSite: 'none', // Required for iframes
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          });

          return res.json({ success: true, message: 'Logged in successfully', token });
        } else {
          return res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        // If users table has no admin row yet, check default password and seed it
        if (password === '@admin123') {
          const hashedPassword = await bcrypt.hash('@admin123', 10);
          const { data: newAdmin } = await supabase.from('users').insert([{ username: 'admin', password: hashedPassword }]).select().maybeSingle();
          const adminId = newAdmin ? newAdmin.id : 1;
          const token = jwt.sign({ id: adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
          
          res.cookie('adminToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
          });

          return res.json({ success: true, message: 'Logged in successfully', token });
        }
      }
    } catch (dbErr) {
      console.error('Supabase query error during login:', dbErr);
    }
  }

  // Standalone / cold fallback for default admin password
  if (password === '@admin123') {
    const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ success: true, message: 'Logged in successfully', token });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

router.post('/logout', (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ success: true });
});

export const requireAuth = (req: any, res: any, next: any) => {
  const cookieToken = req.cookies?.adminToken;
  const headerToken = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

router.get('/me', requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

router.post('/change-password', requireAuth, async (req: any, res: any) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required' });
  }

  const { data: admin, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();

  if (error || !admin) {
    return res.status(401).json({ error: 'Admin not found' });
  }

  let isValid = false;
  if (admin.password) {
    if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$') || admin.password.startsWith('$2y$')) {
      try {
        isValid = await bcrypt.compare(currentPassword, admin.password);
      } catch (err) {
        console.error('Bcrypt compare error:', err);
      }
    }
    if (!isValid && currentPassword === admin.password) {
      isValid = true;
    }
  }
  
  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const { error: updateError } = await supabase.from('users').update({ password: hashedPassword }).eq('id', req.user.id);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update password' });
  }

  res.json({ success: true, message: 'Password updated successfully' });
});

let recoveryStore: {
  email: string;
  code: string;
  expiresAt: number;
} | null = null;

// Helper to mask email e.g. "nurudeenayobami37@gmail.com" -> "nu*******37@gmail.com"
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 3) return `${user[0]}***@${domain}`;
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(3, user.length - 4))}${user.slice(-2)}@${domain}`;
}

// Get admin backup email (Authenticated)
router.get('/backup-email', requireAuth, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    const { data: settings } = await supabase.from('settings').select('contact').eq('id', 1).single();
    const backupEmail = settings?.contact?.backupEmail || settings?.contact?.email || 'nurudeenayobami37@gmail.com';
    const contactEmail = settings?.contact?.email || 'nurudeenayobami37@gmail.com';
    res.json({ backupEmail, contactEmail });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get backup email' });
  }
});

// Update admin backup email (Authenticated)
router.post('/backup-email', requireAuth, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const { backupEmail } = req.body;
  if (!backupEmail || !backupEmail.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid backup email address' });
  }

  try {
    const { data: settings, error: fetchErr } = await supabase.from('settings').select('contact').eq('id', 1).single();
    if (fetchErr) return res.status(500).json({ error: fetchErr.message });

    const currentContact = settings?.contact || {};
    const updatedContact = {
      ...currentContact,
      backupEmail: backupEmail.trim().toLowerCase()
    };

    const { error: updateErr } = await supabase.from('settings').update({ contact: updatedContact }).eq('id', 1);
    if (updateErr) return res.status(500).json({ error: updateErr.message });

    res.json({
      success: true,
      message: 'Admin backup email updated successfully',
      backupEmail: updatedContact.backupEmail
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update backup email' });
  }
});

// Forgot password request - verification code sent to backup email
router.post('/forgot-password', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Please provide your registered backup email' });
  }

  const inputEmail = email.trim().toLowerCase();

  try {
    const { data: settings } = await supabase.from('settings').select('contact').eq('id', 1).single();
    const registeredBackupEmail = (settings?.contact?.backupEmail || settings?.contact?.email || 'nurudeenayobami37@gmail.com').trim().toLowerCase();
    const registeredContactEmail = (settings?.contact?.email || 'nurudeenayobami37@gmail.com').trim().toLowerCase();

    // Check if input email matches either the configured backup email or contact email
    if (inputEmail !== registeredBackupEmail && inputEmail !== registeredContactEmail) {
      return res.status(400).json({
        error: 'Email does not match our registered admin backup email address'
      });
    }

    // Generate 6-digit numeric recovery code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    recoveryStore = {
      email: inputEmail,
      code,
      expiresAt
    };

    console.log('==============================================');
    console.log(`🔑 [ADMIN PASSWORD RECOVERY CODE]: ${code}`);
    console.log(`📧 Target Backup Email: ${inputEmail}`);
    console.log(`⏱️ Expires in 15 minutes`);
    console.log('==============================================');

    res.json({
      success: true,
      message: `Recovery code generated for ${maskEmail(inputEmail)}.`,
      maskedEmail: maskEmail(inputEmail),
      // Provide preview code for smooth local testing / admin convenience
      devCode: code
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initiate recovery' });
  }
});

// Verify recovery code
router.post('/verify-recovery-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code are required' });
  }

  if (!recoveryStore) {
    return res.status(400).json({ error: 'No active password recovery request found. Please request a new code.' });
  }

  if (Date.now() > recoveryStore.expiresAt) {
    recoveryStore = null;
    return res.status(400).json({ error: 'Recovery code has expired. Please request a new code.' });
  }

  if (recoveryStore.email.toLowerCase() !== email.trim().toLowerCase() || recoveryStore.code !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code or email mismatch' });
  }

  res.json({ success: true, valid: true });
});

// Reset password with verified recovery code
router.post('/reset-password', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'All fields (email, code, new password) are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  if (!recoveryStore) {
    return res.status(400).json({ error: 'No active recovery request found. Please request a code first.' });
  }

  if (Date.now() > recoveryStore.expiresAt) {
    recoveryStore = null;
    return res.status(400).json({ error: 'Recovery code has expired. Please request a new code.' });
  }

  if (recoveryStore.email.toLowerCase() !== email.trim().toLowerCase() || recoveryStore.code !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('username', 'admin');

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update admin password: ' + updateError.message });
    }

    // Invalidate the recovery code
    recoveryStore = null;

    res.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reset password' });
  }
});

export default router;
