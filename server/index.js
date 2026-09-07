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
// Secure CORS configuration - allow only trusted origins
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Security middleware
// Security middleware
app.use(securityHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting globally (or you can apply to specific routes)
app.use(rateLimiter);

// Mount API routes (after security middlewares)
app.use('/api', apiRoutes);

// Serve static frontend build in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          // Hide file system errors from client
          res.status(500).send('Server error');
        }
      });
  } else {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Initialize DB and start server
getDb().then(() => {
  app.listen(PORT, () => {
      console.log(`[SERVER] EV CYBER ACADEMY Backend listening on port ${PORT}`);
    });
}).catch(err => {
  console.error('[SERVER] Failed to initialize database:', err);
});
