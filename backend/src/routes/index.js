const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const ingredientRoutes = require('./ingredients');
const recipeRoutes = require('./recipes');
const measurementRoutes = require('./measurements');
const dashboardRoutes = require('./dashboard');

const router = express.Router();

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/recipes', recipeRoutes);
router.use('/measurements', measurementRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router; 