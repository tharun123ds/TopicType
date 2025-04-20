const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRouter');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
require('./config/googleStrategy');
const topicRoutes = require('./routes/topicRoutes');
const typingResultsRoutes = require('./routes/typingResultsRoutes');
// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(cookieParser());



// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(helmet()); // For securing headers
app.use(morgan('dev')); // For logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', require('./routes/googleAuthRoute'));
app.use('/api/topics', topicRoutes);
app.use('/api/results', typingResultsRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
