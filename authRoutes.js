const express = require('express');
const { login } = require('./authController');
const { register } = require('./registerController');

const router = express.Router();

// Login endpoint
router.post('/login', login);

// Register endpoint
router.post('/register', register);

module.exports = router;
