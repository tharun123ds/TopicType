const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error Caught:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || undefined;

    // Environment-specific logging
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack Trace:', err.stack);
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        errors = Object.values(err.errors).map(val => val.message);
    }

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found with id ${err.value}`;
    }

    // Handle duplicate key error
    if (err.code && err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for field: ${field}`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
