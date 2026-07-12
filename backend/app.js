import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://fission-infotech-pied.vercel.app'
      ];
      // Allow requests with no origin (like mobile apps), or local/explicit origins, or any Vercel deployment of this app
      if (
        !origin || 
        allowedOrigins.includes(origin) ||
        origin.match(/^https:\/\/fission-infotech-[a-z0-9]+-vyshus-projects-[0-9]+\.vercel\.app$/)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tables', tableRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Centralized error handler
app.use(errorHandler);

export default app;
