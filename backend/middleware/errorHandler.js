const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    code: err.code || 'INTERNAL_ERROR'
  };

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    error.status = 503;
    error.code = 'DATABASE_ERROR';
    error.message = 'Database connection error';
  }

  res.status(error.status).json(error);
};

module.exports = errorHandler; 