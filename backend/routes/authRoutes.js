const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController'); // <-- Check this path!

// Route for User Registration
router.post('/register', register);

// Route for User Login
router.post('/login', login);

module.exports = router;
