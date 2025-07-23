const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Dashboard özet bilgileri
// @route   GET /api/dashboard
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Kullanıcının tarif sayısı
    const recipeCount = await Recipe.countDocuments({ 
      createdBy: req.user._id, 
      isActive: true 
    });
    
    // Kullanıcının malzeme sayısı
    const ingredientCount = await Ingredient.countDocuments({ 
      createdBy: req.user._id, 
      isActive: true 
    });
    
    // Son eklenen 5 tarif
    const recentRecipes = await Recipe.find({ 
      createdBy: req.user._id, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ingredients.ingredient', 'name price unit');
    
    // Son eklenen 5 malzeme
    const recentIngredients = await Ingredient.find({ 
      createdBy: req.user._id, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Stok durumu kritik olan malzemeler
    const lowStockIngredients = await Ingredient.find({
      createdBy: req.user._id,
      isActive: true,
      $expr: { $lte: ['$stock', '$minStock'] }
    }).limit(10);
    
    // En pahalı 5 tarif
    const expensiveRecipes = await Recipe.find({ 
      createdBy: req.user._id, 
      isActive: true 
    })
      .populate('ingredients.ingredient', 'name price unit')
      .limit(5);
    
    // Maliyet hesaplamaları
    const recipesWithCost = await Promise.all(
      expensiveRecipes.map(async (recipe) => {
        const totalCost = await recipe.calculateTotalCost();
        return {
          ...recipe.toObject(),
          totalCost: totalCost.toFixed(2)
        };
      })
    );
    
    // Maliyete göre sırala
    recipesWithCost.sort((a, b) => parseFloat(b.totalCost) - parseFloat(a.totalCost));
    
    // Toplam değer hesaplama (tüm malzemelerin stok değeri)
    const allIngredients = await Ingredient.find({ 
      createdBy: req.user._id, 
      isActive: true 
    });
    
    const totalInventoryValue = allIngredients.reduce((total, ingredient) => {
      return total + (ingredient.price * ingredient.stock);
    }, 0);
    
    res.json({
      summary: {
        recipeCount,
        ingredientCount,
        totalInventoryValue: totalInventoryValue.toFixed(2)
      },
      recentRecipes,
      recentIngredients,
      lowStockIngredients,
      expensiveRecipes: recipesWithCost.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard veri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Kategori bazında tarif sayıları
// @route   GET /api/dashboard/recipe-stats
// @access  Private
router.get('/recipe-stats', protect, async (req, res) => {
  try {
    const stats = await Recipe.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Tarif istatistikleri hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Malzeme kategorisi bazında stok durumu
// @route   GET /api/dashboard/ingredient-stats
// @access  Private
router.get('/ingredient-stats', protect, async (req, res) => {
  try {
    const stats = await Ingredient.aggregate([
      {
        $match: {
          createdBy: req.user._id,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalValue: -1 }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Malzeme istatistikleri hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Maliyet analizi özeti
// @route   GET /api/dashboard/cost-analysis
// @access  Private
router.get('/cost-analysis', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find({ 
      createdBy: req.user._id, 
      isActive: true 
    }).populate('ingredients.ingredient', 'name price unit');
    
    const costAnalysis = await Promise.all(
      recipes.map(async (recipe) => {
        const totalCost = await recipe.calculateTotalCost();
        const costPerServing = await recipe.calculateCostPerServing();
        
        return {
          recipeId: recipe._id,
          recipeName: recipe.name,
          category: recipe.category,
          totalCost: totalCost.toFixed(2),
          costPerServing: costPerServing.toFixed(2),
          servings: recipe.servings
        };
      })
    );
    
    // Ortalama maliyet hesapla
    const totalCosts = costAnalysis.map(item => parseFloat(item.totalCost));
    const averageCost = totalCosts.reduce((sum, cost) => sum + cost, 0) / totalCosts.length;
    
    // En pahalı ve en ucuz tarifler
    const sortedByCost = costAnalysis.sort((a, b) => parseFloat(b.totalCost) - parseFloat(a.totalCost));
    const mostExpensive = sortedByCost[0];
    const cheapest = sortedByCost[sortedByCost.length - 1];
    
    res.json({
      totalRecipes: costAnalysis.length,
      averageCost: averageCost.toFixed(2),
      mostExpensive,
      cheapest,
      allRecipes: costAnalysis
    });
  } catch (error) {
    console.error('Maliyet analizi hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 