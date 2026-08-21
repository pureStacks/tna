import express from 'express';
import { supabase } from '../db.js';

const router = express.Router();

router.get('/data', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    const [settingsRes, productsRes, testimonialsRes] = await Promise.all([
      supabase.from('settings').select('*').limit(1).single(),
      supabase.from('products').select('*').eq('is_published', 1).order('order_index', { ascending: true }),
      supabase.from('testimonials').select('*').eq('is_published', 1).order('order_index', { ascending: true })
    ]);

    if (settingsRes.error) throw settingsRes.error;
    if (productsRes.error) throw productsRes.error;
    if (testimonialsRes.error) throw testimonialsRes.error;

    res.json({
      settings: settingsRes.data,
      products: productsRes.data,
      testimonials: testimonialsRes.data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch public data' });
  }
});

// For users submitting a review from the frontend
router.post('/review', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const { name, location, text, rating } = req.body;
  if (!name || !location || !text) return res.status(400).json({ error: 'Missing fields' });

  try {
    // New reviews are unpublished by default so admin can approve them
    const { error } = await supabase.from('testimonials').insert([{
      name,
      location,
      text,
      rating,
      is_published: 0,
      order_index: 99
    }]);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
