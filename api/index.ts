import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from '../server/db.js';
import authRoutes from '../server/routes/auth.js';
import cmsRoutes from '../server/routes/cms.js';
import publicRoutes from '../server/routes/public.js';

const app = express();

// Initialize DB asynchronously
initializeDatabase().catch((err) => console.error('Database init error:', err));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Routes mounted on both /api/* and root /* to handle all Vercel rewrite routing patterns
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/cms', cmsRoutes);
app.use('/cms', cmsRoutes);

app.use('/api/public', publicRoutes);
app.use('/public', publicRoutes);

// Health check endpoints
app.get('/api', (req, res) => res.json({ status: 'ok', service: 'TNA Catfish API' }));
app.get('/', (req, res) => res.json({ status: 'ok', service: 'TNA Catfish API' }));

export default app;

