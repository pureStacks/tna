import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initializeDatabase } from './server/db.js';
import authRoutes from './server/routes/auth.js';
import cmsRoutes from './server/routes/cms.js';
import publicRoutes from './server/routes/public.js';

const currentFilename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const currentDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(currentFilename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB asynchronously
  initializeDatabase().catch(err => console.error('Database init error:', err));

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cms', cmsRoutes);
  app.use('/api/public', publicRoutes);
  
  // Serve uploaded images statically
  const uploadsPath = path.join(process.cwd(), 'data', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));

  // Determine production mode vs development mode
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    currentFilename.endsWith('server.cjs') ||
    currentFilename.includes('dist');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Resolve the dist directory where index.html and assets are located
    const possibleDistDirs = [
      currentDirname,
      path.join(process.cwd(), 'dist'),
      path.resolve(currentDirname, '..', 'dist'),
      process.cwd()
    ];

    let distDir = path.join(process.cwd(), 'dist');
    for (const dir of possibleDistDirs) {
      if (fs.existsSync(path.join(dir, 'index.html'))) {
        distDir = dir;
        break;
      }
    }

    console.log(`[Production] Serving static files from: ${distDir}`);
    app.use(express.static(distDir));

    // Handle all other GET routes by serving index.html for client-side routing (React Router)
    app.get('*', (req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application index.html not found. Please verify the build output.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
