import express from 'express';
import { supabase } from '../db.js';
import { DEFAULT_SETTINGS, DEFAULT_PRODUCTS, DEFAULT_TESTIMONIALS } from '../defaultData.js';

const router = express.Router();

function sanitizeLocation(rawLocation: string = ''): string {
  if (!rawLocation) return '';
  return rawLocation.split('||')[0].split('[email:')[0].trim();
}

router.get('/data', async (req, res) => {
  try {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured. Serving default CMS content.');
      return res.json({
        settings: DEFAULT_SETTINGS,
        products: DEFAULT_PRODUCTS,
        testimonials: DEFAULT_TESTIMONIALS
      });
    }

    const [settingsRes, productsRes, testimonialsRes] = await Promise.allSettled([
      supabase.from('settings').select('*').limit(1).maybeSingle(),
      supabase.from('products').select('*').eq('is_published', 1).order('order_index', { ascending: true }),
      supabase.from('testimonials').select('*').eq('is_published', 1).order('order_index', { ascending: true })
    ]);

    let settings = DEFAULT_SETTINGS;
    if (settingsRes.status === 'fulfilled' && settingsRes.value && settingsRes.value.data) {
      const dbSettings = settingsRes.value.data;
      settings = {
        ...DEFAULT_SETTINGS,
        ...dbSettings,
        home: { ...DEFAULT_SETTINGS.home, ...(dbSettings.home || {}) },
        about: { ...DEFAULT_SETTINGS.about, ...(dbSettings.about || {}) },
        features: { ...DEFAULT_SETTINGS.features, ...(dbSettings.features || {}) },
        contact: { ...DEFAULT_SETTINGS.contact, ...(dbSettings.contact || {}) },
        footer: { ...DEFAULT_SETTINGS.footer, ...(dbSettings.footer || {}) },
        header: { ...DEFAULT_SETTINGS.header, ...(dbSettings.header || {}) }
      };
    }

    let products = DEFAULT_PRODUCTS;
    if (productsRes.status === 'fulfilled' && productsRes.value && productsRes.value.data && productsRes.value.data.length > 0) {
      products = productsRes.value.data;
    }

    let testimonials = DEFAULT_TESTIMONIALS;
    if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value && testimonialsRes.value.data && testimonialsRes.value.data.length > 0) {
      testimonials = testimonialsRes.value.data.map((t: any) => ({
        ...t,
        location: sanitizeLocation(t.location)
      }));
    }

    res.json({
      settings,
      products,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching public CMS data, serving default fallback:', error);
    res.json({
      settings: DEFAULT_SETTINGS,
      products: DEFAULT_PRODUCTS,
      testimonials: DEFAULT_TESTIMONIALS
    });
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

