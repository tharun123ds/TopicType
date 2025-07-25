const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRouter');
const googleAuthRoute = require('./routes/googleAuthRoute');
const topicRoutes = require('./routes/topicRoutes');
const typingResultsRoutes = require('./routes/typingResultsRoutes');
const errorHandler = require('./middleware/errorHandler');

require('./config/googleStrategy');

dotenv.config();

const app = express();
app.use(cookieParser());

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoute);
app.use('/api/topics', topicRoutes);
app.use('/api/results', typingResultsRoutes);

// Error handler must be last
app.use(errorHandler);

module.exports = app;
