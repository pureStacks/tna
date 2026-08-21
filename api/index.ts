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

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/public', publicRoutes);

export default app;
