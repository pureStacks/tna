import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

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
  } catch (err) {
    console.error('Error during Supabase initialization:', err);
  }
}
