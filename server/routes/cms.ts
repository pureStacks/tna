import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, saveDb } from '../db.js';
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

router.get('/settings', (req, res) => {
  res.json(db.settings);
});

router.put('/settings/:key', (req, res) => {
  const { key } = req.params;
  const value = req.body;
  db.settings[key] = value;
  saveDb();
  res.json({ success: true });
});

// ================= PRODUCTS =================

router.get('/products', (req, res) => {
  res.json(db.products.sort((a: any, b: any) => a.order_index - b.order_index));
});

router.post('/products', (req, res) => {
  const { name, description, price, image, badge, is_published, order_index } = req.body;
  const newProduct = {
    id: Date.now(),
    name, description, price, image, badge: badge || '', is_published: is_published ? 1 : 0, order_index: order_index || 0
  };
  db.products.push(newProduct);
  saveDb();
  res.json({ id: newProduct.id });
});

router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, badge, is_published, order_index } = req.body;
  const idx = db.products.findIndex((p: any) => p.id == id);
  if (idx > -1) {
    db.products[idx] = {
      ...db.products[idx],
      name, description, price, image, badge: badge || '', is_published: is_published ? 1 : 0, order_index: order_index || 0
    };
    saveDb();
  }
  res.json({ success: true });
});

router.delete('/products/:id', (req, res) => {
  db.products = db.products.filter((p: any) => p.id != req.params.id);
  saveDb();
  res.json({ success: true });
});

// ================= TESTIMONIALS =================

router.get('/testimonials', (req, res) => {
  res.json(db.testimonials.sort((a: any, b: any) => a.order_index - b.order_index));
});

router.post('/testimonials', (req, res) => {
  const { name, location, text, rating, is_published, order_index } = req.body;
  const newTestimonial = {
    id: Date.now(),
    name, location, text, rating: rating || 5, is_published: is_published ? 1 : 0, order_index: order_index || 0
  };
  db.testimonials.push(newTestimonial);
  saveDb();
  res.json({ id: newTestimonial.id });
});

router.put('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { name, location, text, rating, is_published, order_index } = req.body;
  const idx = db.testimonials.findIndex((t: any) => t.id == id);
  if (idx > -1) {
    db.testimonials[idx] = {
      ...db.testimonials[idx],
      name, location, text, rating, is_published: is_published ? 1 : 0, order_index: order_index || 0
    };
    saveDb();
  }
  res.json({ success: true });
});

router.delete('/testimonials/:id', (req, res) => {
  db.testimonials = db.testimonials.filter((t: any) => t.id != req.params.id);
  saveDb();
  res.json({ success: true });
});

export default router;
