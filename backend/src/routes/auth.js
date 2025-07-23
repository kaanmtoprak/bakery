const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Kullanıcı bilgilerini getir
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

module.exports = router; 