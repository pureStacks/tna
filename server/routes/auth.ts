import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, saveDb } from '../db.js';

const router = express.Router();
export const JWT_SECRET = process.env.JWT_SECRET || 'tna-catfish-super-secret-key-2026';

router.post('/login', async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const admin = db.users.find((u: any) => u.username === 'admin');
  if (!admin) {
    return res.status(500).json({ error: 'Admin account not found' });
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  
  res.cookie('adminToken', token, {
    httpOnly: true,
    secure: true, // Must be true for SameSite=None
    sameSite: 'none', // Required for iframes
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ success: true, message: 'Logged in successfully' });
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
  const token = req.cookies.adminToken;
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
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required' });
  }

  const admin = db.users.find((u: any) => u.id === req.user.id);
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  saveDb();

  res.json({ success: true, message: 'Password updated successfully' });
});

export default router;
