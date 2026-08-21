import express from 'express';
import { supabase } from '../db.js';

const router = express.Router();

function sanitizeLocation(rawLocation: string = ''): string {
  if (!rawLocation) return '';
  return rawLocation.split('||')[0].split('[email:')[0].trim();
}

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

    // Sanitize customer email from public testimonials for privacy
    const sanitizedTestimonials = (testimonialsRes.data || []).map((t: any) => ({
      ...t,
      location: sanitizeLocation(t.location)
    }));

    res.json({
      settings: settingsRes.data,
      products: productsRes.data,
      testimonials: sanitizedTestimonials
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch public data' });
  }
});

// For users submitting a review from the frontend
router.post('/review', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  const { name, email, location, text, rating } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Please enter your name' });
  if (!email || !email.trim() || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address so we can reply to you' });
  }
  if (!location || !location.trim()) return res.status(400).json({ error: 'Please enter your city/location' });
  if (!text || !text.trim()) return res.status(400).json({ error: 'Please enter your review' });

  const cleanLocation = location.trim();
  const cleanEmail = email.trim().toLowerCase();
  // Store customer email alongside location for admin response access
  const encodedLocation = `${cleanLocation} || email:${cleanEmail}`;

  try {
    // New reviews are unpublished by default so admin can review and approve them
    const { error } = await supabase.from('testimonials').insert([{
      name: name.trim(),
      location: encodedLocation,
      text: text.trim(),
      rating: Number(rating) || 5,
      is_published: 0,
      order_index: 99
    }]);

    if (error) throw error;
    res.json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;

