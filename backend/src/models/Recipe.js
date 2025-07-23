const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Miktar negatif olamaz']
  },
  unit: {
    type: String,
    required: true
  }
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tarif adı gerekli'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['ekmek', 'pasta', 'kurabiye', 'börek', 'çörek', 'diğer'],
    default: 'diğer'
  },
  difficulty: {
    type: String,
    enum: ['kolay', 'orta', 'zor'],
    default: 'orta'
  },
  preparationTime: {
    type: Number, // dakika cinsinden
    min: [0, 'Hazırlık süresi negatif olamaz']
  },
  cookingTime: {
    type: Number, // dakika cinsinden
    min: [0, 'Pişirme süresi negatif olamaz']
  },
  servings: {
    type: Number, // kaç kişilik
    min: [1, 'Porsiyon en az 1 olmalı']
  },
  ingredients: [recipeIngredientSchema],
  instructions: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Toplam maliyet hesaplama
recipeSchema.methods.calculateTotalCost = async function() {
  let totalCost = 0;
  
  for (let item of this.ingredients) {
    const ingredient = await mongoose.model('Ingredient').findById(item.ingredient);
    if (ingredient && ingredient.price) {
      // Birim dönüşümü yapılacak (gram, kg, litre vs.)
      let convertedQuantity = item.quantity;
      
      // Basit birim dönüşümleri
      if (ingredient.unit === 'kilogram' && item.unit === 'gram') {
        convertedQuantity = item.quantity / 1000;
      } else if (ingredient.unit === 'gram' && item.unit === 'kilogram') {
        convertedQuantity = item.quantity * 1000;
      } else if (ingredient.unit === 'litre' && item.unit === 'mililitre') {
        convertedQuantity = item.quantity / 1000;
      } else if (ingredient.unit === 'mililitre' && item.unit === 'litre') {
        convertedQuantity = item.quantity * 1000;
      }
      
      totalCost += (ingredient.price * convertedQuantity);
    }
  }
  
  return totalCost;
};

// Porsiyon başına maliyet
recipeSchema.methods.calculateCostPerServing = async function() {
  const totalCost = await this.calculateTotalCost();
  return totalCost / this.servings;
};

module.exports = mongoose.model('Recipe', recipeSchema); 