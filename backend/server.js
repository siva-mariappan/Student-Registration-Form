const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const authGoogleRoutes = require('./routes/authGoogleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Passport config
require('./config/passport')(passport);

// Middleware
// Allow requests from frontend (Vercel) and any trusted origins
const allowedOrigins = [
  'https://student-registration-form-psi-one.vercel.app', // Your Vercel frontend
  'http://localhost:3000', // Local development
  process.env.FRONTEND_URL // Environment variable
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For now, allow all origins (you can restrict later)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware (must be before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native'
  }),
  proxy: true, // Trust proxy for secure cookies behind Render
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-site cookies
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Let browser handle domain
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authGoogleRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Student Registration API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
