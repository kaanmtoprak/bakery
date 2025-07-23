const express = require('express');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Tüm tarifleri getir
// @route   GET /api/recipes
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
    
    const recipes = await Recipe.find(query)
      .populate('createdBy', 'username')
      .populate('ingredients.ingredient', 'name price unit')
      .sort(sort);
    
    // Her tarif için maliyet hesapla
    const recipesWithCost = await Promise.all(
      recipes.map(async (recipe) => {
        const totalCost = await recipe.calculateTotalCost();
        const costPerServing = await recipe.calculateCostPerServing();
        
        return {
          ...recipe.toObject(),
          totalCost: totalCost.toFixed(2),
          costPerServing: costPerServing.toFixed(2)
        };
      })
    );
    
    res.json(recipesWithCost);
  } catch (error) {
    console.error('Tarifleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Tek tarif getir
// @route   GET /api/recipes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('ingredients.ingredient', 'name price unit stock');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    // Maliyet hesapla
    const totalCost = await recipe.calculateTotalCost();
    const costPerServing = await recipe.calculateCostPerServing();
    
    const recipeWithCost = {
      ...recipe.toObject(),
      totalCost: totalCost.toFixed(2),
      costPerServing: costPerServing.toFixed(2)
    };
    
    res.json(recipeWithCost);
  } catch (error) {
    console.error('Tarif getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Yeni tarif oluştur
// @route   POST /api/recipes
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      preparationTime,
      cookingTime,
      servings,
      ingredients,
      instructions,
      notes
    } = req.body;
    
    // Aynı isimde tarif var mı kontrol et
    const existingRecipe = await Recipe.findOne({ name, createdBy: req.user._id });
    if (existingRecipe) {
      return res.status(400).json({ message: 'Bu isimde bir tarif zaten mevcut' });
    }
    
    const recipe = await Recipe.create({
      name,
      description,
      category,
      difficulty,
      preparationTime,
      cookingTime,
      servings,
      ingredients,
      instructions,
      notes,
      createdBy: req.user._id
    });
    
    await recipe.populate('createdBy', 'username');
    await recipe.populate('ingredients.ingredient', 'name price unit');
    
    // Maliyet hesapla
    const totalCost = await recipe.calculateTotalCost();
    const costPerServing = await recipe.calculateCostPerServing();
    
    const recipeWithCost = {
      ...recipe.toObject(),
      totalCost: totalCost.toFixed(2),
      costPerServing: costPerServing.toFixed(2)
    };
    
    res.status(201).json(recipeWithCost);
  } catch (error) {
    console.error('Tarif oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Tarif güncelle
// @route   PUT /api/recipes/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      preparationTime,
      cookingTime,
      servings,
      ingredients,
      instructions,
      notes
    } = req.body;
    
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    // Sadece kendi tarifini güncelleyebilir
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        difficulty,
        preparationTime,
        cookingTime,
        servings,
        ingredients,
        instructions,
        notes
      },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'username')
      .populate('ingredients.ingredient', 'name price unit');
    
    // Maliyet hesapla
    const totalCost = await updatedRecipe.calculateTotalCost();
    const costPerServing = await updatedRecipe.calculateCostPerServing();
    
    const recipeWithCost = {
      ...updatedRecipe.toObject(),
      totalCost: totalCost.toFixed(2),
      costPerServing: costPerServing.toFixed(2)
    };
    
    res.json(recipeWithCost);
  } catch (error) {
    console.error('Tarif güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Tarif sil (soft delete)
// @route   DELETE /api/recipes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    // Sadece kendi tarifini silebilir
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    
    await Recipe.findByIdAndUpdate(req.params.id, { isActive: false });
    
    res.json({ message: 'Tarif başarıyla silindi' });
  } catch (error) {
    console.error('Tarif silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Tarif maliyet analizi
// @route   GET /api/recipes/:id/cost-analysis
// @access  Private
router.get('/:id/cost-analysis', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('ingredients.ingredient', 'name price unit stock');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    const totalCost = await recipe.calculateTotalCost();
    const costPerServing = await recipe.calculateCostPerServing();
    
    // Malzeme bazında maliyet analizi
    const ingredientCosts = await Promise.all(
      recipe.ingredients.map(async (item) => {
        const ingredient = item.ingredient;
        let cost = 0;
        
        if (ingredient && ingredient.price) {
          let convertedQuantity = item.quantity;
          
          // Birim dönüşümleri
          if (ingredient.unit === 'kilogram' && item.unit === 'gram') {
            convertedQuantity = item.quantity / 1000;
          } else if (ingredient.unit === 'gram' && item.unit === 'kilogram') {
            convertedQuantity = item.quantity * 1000;
          } else if (ingredient.unit === 'litre' && item.unit === 'mililitre') {
            convertedQuantity = item.quantity / 1000;
          } else if (ingredient.unit === 'mililitre' && item.unit === 'litre') {
            convertedQuantity = item.quantity * 1000;
          }
          
          cost = ingredient.price * convertedQuantity;
        }
        
        return {
          ingredient: ingredient.name,
          quantity: item.quantity,
          unit: item.unit,
          price: ingredient.price,
          cost: cost.toFixed(2)
        };
      })
    );
    
    res.json({
      recipeName: recipe.name,
      totalCost: totalCost.toFixed(2),
      costPerServing: costPerServing.toFixed(2),
      servings: recipe.servings,
      ingredientCosts
    });
  } catch (error) {
    console.error('Maliyet analizi hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 