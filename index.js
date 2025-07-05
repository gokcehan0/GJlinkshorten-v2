const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const urlRoutes = require('./routes');
const authRoutes = require('./authRoutes');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);
app.use(express.json());

// CORS only allow your own domain (adjust origin as needed)
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting for all auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Max 5 requests per minute
  message: { error: "Too many requests, please try again later." }
});
app.use(['/register', '/login'], authLimiter);

// Rate limiting for shorten endpoint
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later." }
});
app.use('/shorten', shortenLimiter);

// Use routes
app.use('/', urlRoutes);
app.use('/', authRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// deleteExpiredUrls();
