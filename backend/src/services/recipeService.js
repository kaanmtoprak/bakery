const Recipe = require('../models/Recipe');

class RecipeService {
  // Tüm tarifleri getir
  static async getAllRecipes(userId, filters = {}) {
    const { category, search, sort = 'name' } = filters;
    
    let query = { isActive: true, createdBy: userId };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const recipes = await Recipe.find(query)
      .populate('createdBy', 'username')
      .populate('ingredients.ingredient', 'name price unit')
      .sort(sort);
    
    return recipes;
  }

  // Tek tarif getir
  static async getRecipeById(recipeId, userId) {
    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      createdBy: userId,
      isActive: true 
    })
      .populate('createdBy', 'username')
      .populate('ingredients.ingredient', 'name price unit stock');
    
    return recipe;
  }

  // Yeni tarif oluştur
  static async createRecipe(recipeData, userId) {
    const existingRecipe = await Recipe.findOne({ 
      name: recipeData.name, 
      createdBy: userId 
    });
    
    if (existingRecipe) {
      throw new Error('Bu isimde bir tarif zaten mevcut');
    }
    
    const recipe = await Recipe.create({
      ...recipeData,
      createdBy: userId
    });
    
    await recipe.populate('createdBy', 'username');
    await recipe.populate('ingredients.ingredient', 'name price unit');
    
    return recipe;
  }

  // Tarif güncelle
  static async updateRecipe(recipeId, updateData, userId) {
    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      createdBy: userId 
    });
    
    if (!recipe) {
      throw new Error('Tarif bulunamadı');
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'username')
      .populate('ingredients.ingredient', 'name price unit');
    
    return updatedRecipe;
  }

  // Tarif sil
  static async deleteRecipe(recipeId, userId) {
    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      createdBy: userId 
    });
    
    if (!recipe) {
      throw new Error('Tarif bulunamadı');
    }
    
    await Recipe.findByIdAndUpdate(recipeId, { isActive: false });
    return { message: 'Tarif başarıyla silindi' };
  }

  // Maliyet analizi
  static async getCostAnalysis(recipeId, userId) {
    const recipe = await this.getRecipeById(recipeId, userId);
    
    if (!recipe) {
      throw new Error('Tarif bulunamadı');
    }
    
    const totalCost = await recipe.calculateTotalCost();
    const costPerServing = await recipe.calculateCostPerServing();
    
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
    
    return {
      recipeName: recipe.name,
      totalCost: totalCost.toFixed(2),
      costPerServing: costPerServing.toFixed(2),
      servings: recipe.servings,
      ingredientCosts
    };
  }
}

module.exports = RecipeService; 