import express from 'express';
import multer from 'multer';
import { supabase } from '../db.js';
import { requireAuth } from './auth.js';

const router = express.Router();
router.use(requireAuth);

// Set up in-memory storage for serverless and container compatibility
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
});

router.post('/upload', upload.single('image'), (req, res) => {
  const reqWithFile = req as any;
  if (!reqWithFile.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const file = reqWithFile.file;
  const mimeType = file.mimetype || 'image/jpeg';
  const base64 = file.buffer.toString('base64');
  const imageUrl = `data:${mimeType};base64,${base64}`;
  res.json({ url: imageUrl });
});

// ================= SETTINGS =================
router.get('/settings', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { data, error } = await supabase.from('settings').select('*').limit(1).single();
  if (error) return res.status(500).json({ error: error.message });
  
  res.json(data);
});

router.put('/settings/:key', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { key } = req.params;
  const value = req.body;
  
  // We assume there's exactly one row in settings with id = 1
  const { error } = await supabase.from('settings').update({ [key]: value }).eq('id', 1);
  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ success: true });
});

// ================= PRODUCTS =================
router.get('/products', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { data, error } = await supabase.from('products').select('*').order('order_index', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  
  res.json(data);
});

router.post('/products', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { name, description, price, image, badge, is_published, order_index } = req.body;
  
  const { data, error } = await supabase.from('products').insert([{
    name, description, price, image, badge: badge || '', is_published: is_published ? 1 : 0, order_index: order_index || 0
  }]).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/products/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { id } = req.params;
  const { name, description, price, image, badge, is_published, order_index } = req.body;
  
  const { error } = await supabase.from('products').update({
    name, description, price, image, badge: badge || '', is_published: is_published ? 1 : 0, order_index: order_index || 0
  }).eq('id', id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/products/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ success: true });
});

// Helper to parse location and customer email
function parseLocationData(rawLocation: string = '') {
  if (!rawLocation) return { location: '', email: '' };
  const emailMatch = rawLocation.match(/\|\|\s*email:([^\s]+)/i) || 
                     rawLocation.match(/\[email:([^\]]+)\]/i) ||
                     rawLocation.match(/\(email:([^\)]+)\)/i);
  let email = '';
  let location = rawLocation;
  if (emailMatch) {
    email = emailMatch[1].trim();
    location = rawLocation.replace(emailMatch[0], '').trim();
  }
  return { location, email };
}

function formatLocationData(location: string = '', email: string = '') {
  const cleanLoc = (location || '').trim();
  const cleanEmail = (email || '').trim();
  if (!cleanEmail) return cleanLoc;
  return `${cleanLoc} || email:${cleanEmail}`;
}

// ================= TESTIMONIALS =================
router.get('/testimonials', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { data, error } = await supabase.from('testimonials').select('*').order('order_index', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  
  const formattedTestimonials = (data || []).map((t: any) => {
    const { location, email } = parseLocationData(t.location);
    return {
      ...t,
      rawLocation: t.location,
      location,
      email
    };
  });
  
  res.json(formattedTestimonials);
});

router.post('/testimonials', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { name, location, email, text, rating, is_published, order_index } = req.body;
  const encodedLocation = formatLocationData(location, email);
  
  const { data, error } = await supabase.from('testimonials').insert([{
    name, location: encodedLocation, text, rating: rating || 5, is_published: is_published ? 1 : 0, order_index: order_index || 0
  }]).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

router.put('/testimonials/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { id } = req.params;
  const { name, location, email, text, rating, is_published, order_index } = req.body;
  const encodedLocation = formatLocationData(location, email);
  
  const { error } = await supabase.from('testimonials').update({
    name, location: encodedLocation, text, rating, is_published: is_published ? 1 : 0, order_index: order_index || 0
  }).eq('id', id);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.delete('/testimonials/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  
  const { error } = await supabase.from('testimonials').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ success: true });
});

export default router;
