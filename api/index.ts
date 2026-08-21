import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from '../server/db.js';
import authRoutes from '../server/routes/auth.js';
import cmsRoutes from '../server/routes/cms.js';
import publicRoutes from '../server/routes/public.js';

const app = express();

// Guard against unhandled promise rejections crashing the serverless instance
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize DB safely without blocking startup
try {
  initializeDatabase().catch((err) => console.warn('Database init notice:', err?.message || err));
} catch (err) {
  console.warn('Database init call failed:', err);
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'TNA Catfish API' }));
app.get('/api', (req, res) => res.json({ status: 'ok', service: 'TNA Catfish API' }));
app.get('/', (req, res) => res.json({ status: 'ok', service: 'TNA Catfish API' }));

// API Routes mounted on both /api/* and root /* to handle all Vercel rewrite routing patterns
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/cms', cmsRoutes);
app.use('/cms', cmsRoutes);

app.use('/api/public', publicRoutes);
app.use('/public', publicRoutes);

// Global express error handler so serverless function never fails with unhandled crash
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled API Error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    success: false
  });
});

export default app;

