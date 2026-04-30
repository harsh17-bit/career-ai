import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { sendWeeklyCheckIns } from './utils/reminders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
// Configure helmet with a custom CSP that:
//  - Allows blob: scripts (Vite code-splitting / web workers)
//  - Allows Google Sign-In (accounts.google.com/gsi/client + gsi/style)
//  - Allows Google Analytics (www.google-analytics.com)
//  - Allows popups for third-party identity windows (GSI)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",              // Vite injects inline scripts in the HTML shell
          "blob:",                         // Vite code-splitting chunks & web workers
          "https://accounts.google.com",
          "https://www.googletagmanager.com",
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "blob:",
          "https://accounts.google.com",
          "https://www.googletagmanager.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://accounts.google.com",  // Google GSI loads its own stylesheet
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://accounts.google.com",  // accounts.google.com/gsi/style
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://www.google-analytics.com",   // Google Analytics
          "https://analytics.google.com",
          "https://www.googletagmanager.com",
        ],
        frameSrc: ["https://accounts.google.com"],
        workerSrc: ["'self'", "blob:"],
      },
    },
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Health check (Must be before rate limiter so Render health checks don't get 429'd)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/chat', chatRoutes);

// Serve email template images statically
app.use('/images', express.static(path.join(__dirname, 'templates', 'images')));

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  sendWeeklyCheckIns().catch((error) => {
    console.error('Weekly reminder sweep failed:', error.message);
  });

  setInterval(
    () => {
      sendWeeklyCheckIns().catch((error) => {
        console.error('Weekly reminder sweep failed:', error.message);
      });
    },
    24 * 60 * 60 * 1000
  );
});
