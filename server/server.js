const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Job Application Tracker API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Serve static frontend assets in production if client is built
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Job Application Tracker API</title></head>
          <body style="font-family: system-ui, sans-serif; padding: 40px; background: #0f172a; color: #f8fafc; text-align: center;">
            <h1 style="color: #6366f1;">Job Application Tracker API Server</h1>
            <p>API server is running happily on port ${PORT}.</p>
            <p>To run the frontend dev server, run: <code>npm run client:dev</code> or build it with <code>npm run client:build</code>.</p>
            <p>API Health: <a style="color: #38bdf8;" href="/api/health">/api/health</a></p>
          </body>
        </html>
      `);
    }
  });
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Job Application Tracker API is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`💼 Applications API: http://localhost:${PORT}/api/applications`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/applications/stats`);
  console.log(`🔑 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`===============================================`);
});

module.exports = app;
