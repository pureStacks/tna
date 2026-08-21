import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { initializeDatabase } from './server/db.js';
import authRoutes from './server/routes/auth.js';
import cmsRoutes from './server/routes/cms.js';
import publicRoutes from './server/routes/public.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  await initializeDatabase();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cms', cmsRoutes);
  app.use('/api/public', publicRoutes);
  
  // Serve uploaded images statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'data', 'uploads')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
