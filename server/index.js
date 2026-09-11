const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./routes/api');
const rateLimiter = require('./middleware/rateLimiter');
const securityHeaders = require('./middleware/securityHeaders');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
// Allow configured origins, default local development ports, or all in dev mode
const customOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : [];
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If custom origins specified, check those first
    if (customOrigins.length > 0 && customOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow default dev origins if custom list is not set or if in dev mode
    if (customOrigins.length === 0 || defaultDevOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

// Security middleware
app.use(securityHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use(rateLimiter);

// Mount API routes
app.use('/api', apiRoutes);

// Serve static frontend build in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(500).send('Server error loading application frontend');
      }
    });
  } else {
    res.status(404).json({ success: false, error: 'API Endpoint not found' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Initialize DB and start server
getDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[SERVER] EV CYBER ACADEMY Backend listening on port ${PORT}`);
      console.log(`[SERVER] Database initialized (Lead database storage disabled)`);
    });
  })
  .catch((err) => {
    console.error('[SERVER] Critical: Failed to initialize database:', err.message);
    app.listen(PORT, () => {
      console.log(`[SERVER] Backend listening on port ${PORT}`);
    });
  });
