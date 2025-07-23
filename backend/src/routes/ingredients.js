const express = require('express');
const Ingredient = require('../models/Ingredient');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Tüm malzemeleri getir
// @route   GET /api/ingredients
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, search, sort = 'name' } = req.query;
    
    let query = { isActive: true };
    
    // Kategori filtresi
    if (category) {
      query.category = category;
    }
    
    // Arama filtresi
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const ingredients = await Ingredient.find(query)
      .populate('createdBy', 'username')
      .sort(sort);
    
    res.json(ingredients);
  } catch (error) {
    console.error('Malzemeleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Tek malzeme getir
// @route   GET /api/ingredients/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Malzeme bulunamadı' });
    }
    
    res.json(ingredient);
  } catch (error) {
    console.error('Malzeme getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Yeni malzeme oluştur
// @route   POST /api/ingredients
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, category, unit, price, stock, minStock } = req.body;
    
    // Aynı isimde malzeme var mı kontrol et
    const existingIngredient = await Ingredient.findOne({ name });
    if (existingIngredient) {
      return res.status(400).json({ message: 'Bu isimde bir malzeme zaten mevcut' });
    }
    
    const ingredient = await Ingredient.create({
      name,
      description,
      category,
      unit,
      price,
      stock,
      minStock,
      createdBy: req.user._id
    });
    
    await ingredient.populate('createdBy', 'username');
    
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Malzeme oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Malzeme güncelle
// @route   PUT /api/ingredients/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, category, unit, price, stock, minStock } = req.body;
    
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { name, description, category, unit, price, stock, minStock },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Malzeme bulunamadı' });
    }
    
    res.json(ingredient);
  } catch (error) {
    console.error('Malzeme güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Malzeme sil (soft delete)
// @route   DELETE /api/ingredients/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Malzeme bulunamadı' });
    }
    
    res.json({ message: 'Malzeme başarıyla silindi' });
  } catch (error) {
    console.error('Malzeme silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 