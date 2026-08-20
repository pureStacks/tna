import express from 'express';
import { db, saveDb } from '../db.js';

const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const settings = db.settings;
    const products = db.products.filter((p: any) => p.is_published === 1).sort((a: any, b: any) => a.order_index - b.order_index);
    const testimonials = db.testimonials.filter((t: any) => t.is_published === 1).sort((a: any, b: any) => a.order_index - b.order_index);

    res.json({
      settings,
      products,
      testimonials
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch public data' });
  }
});

// For users submitting a review from the frontend
router.post('/review', async (req, res) => {
  const { name, location, text, rating } = req.body;
  if (!name || !location || !text) return res.status(400).json({ error: 'Missing fields' });

  try {
    // New reviews are unpublished by default so admin can approve them
    db.testimonials.push({
      id: Date.now(),
      name,
      location,
      text,
      rating,
      is_published: 0,
      order_index: 99
    });
    saveDb();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
