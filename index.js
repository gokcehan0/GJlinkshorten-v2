const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const urlRoutes = require('./routes');
const authRoutes = require('./authRoutes');
const path = require('path');
require('dotenv').config();


const app = express();
app.set('trust proxy', 1); // Güvenli proxy ayarı, Render için önerilir
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
  windowMs: 5 * 1000, // 5 saniye
  max: 5, // 5 saniyede en fazla 5 istek
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});
app.use(['/register', '/login'], authLimiter);

// Rate limiting for shorten endpoint
const shortenLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 saniye
  max: 10,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
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
