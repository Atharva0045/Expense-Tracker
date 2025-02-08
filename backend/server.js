const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;  // Define PORT here

// Environment variables validation
const requiredEnvVars = ['MONGODB_URI', 'PORT', 'ALLOWED_ORIGINS'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'));
    }
    return callback(null, true);
  },
  credentials: true
}));

// Add body parsing middleware before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware with more details
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Error handling middleware (should be after routes)
app.use(errorHandler);

// Add this after your middleware setup but before routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    env: process.env.NODE_ENV,
    cors: {
      allowedOrigins,
      requestOrigin: req.headers.origin
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    }
  });
});

// Move routes setup to a separate function
const setupRoutes = () => {
  // Routes
  app.use('/api/expenses', require('./routes/expenses'));
  
  // Error handling middleware (should be after routes)
  app.use(errorHandler);
};

// Update MongoDB connection with better error handling
const connectDB = async () => {
  try {
    mongoose.set('debug', true);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Call setupRoutes here after successful connection
    setupRoutes();
  } catch (err) {
    console.error('MongoDB connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    setTimeout(connectDB, 5000);
  }
};

// Start server only after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
}); 