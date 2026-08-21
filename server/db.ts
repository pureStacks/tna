import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { DEFAULT_SETTINGS, DEFAULT_PRODUCTS, DEFAULT_TESTIMONIALS } from './defaultData.js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseClient: SupabaseClient | null = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
}

export const supabase = supabaseClient;

export async function initializeDatabase() {
  if (!supabase) {
    console.warn('⚠️ Supabase URL or Service Role Key missing. Database operations will fail. Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment variables.');
    return;
  }

  try {
    // Check if the users table exists and has an admin
    const { data: users, error: usersError } = await supabase.from('users').select('id').limit(1);
    
    if (usersError) {
      console.error('⚠️ Supabase connection failed or tables do not exist. Please ensure you ran the provided SQL script in the Supabase SQL Editor.', usersError.message);
      return;
    }

    if (!users || users.length === 0) {
      console.log('Seeding initial admin user into Supabase...');
      const hashedPassword = await bcrypt.hash('@admin123', 10);
      await supabase.from('users').insert([{ username: 'admin', password: hashedPassword }]);
    }

    // Seed settings if empty
    const { data: settings } = await supabase.from('settings').select('id').limit(1);
    if (!settings || settings.length === 0) {
      console.log('Seeding default settings into Supabase...');
      const { id, ...initialSettings } = DEFAULT_SETTINGS;
      await supabase.from('settings').insert([{ id: 1, ...initialSettings }]);
    }

    // Seed products if empty
    const { data: products } = await supabase.from('products').select('id').limit(1);
    if (!products || products.length === 0) {
      console.log('Seeding default products into Supabase...');
      await supabase.from('products').insert(DEFAULT_PRODUCTS.map(({ id, ...p }) => p));
    }

    // Seed testimonials if empty
    const { data: testimonials } = await supabase.from('testimonials').select('id').limit(1);
    if (!testimonials || testimonials.length === 0) {
      console.log('Seeding default testimonials into Supabase...');
      await supabase.from('testimonials').insert(DEFAULT_TESTIMONIALS.map(({ id, ...t }) => t));
    }
  } catch (err) {
    console.error('Error during Supabase initialization:', err);
  }
}
