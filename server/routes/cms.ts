import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { supabase } from '../db.js';
import { requireAuth } from './auth.js';

const router = express.Router();
router.use(requireAuth);

// Ensure upload dir exists
const uploadDir = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
  const reqWithFile = req as any;
  if (!reqWithFile.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const imageUrl = `/uploads/${reqWithFile.file.filename}`;
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
