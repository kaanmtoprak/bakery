const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Malzeme adı gerekli'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['un', 'şeker', 'yağ', 'süt', 'yumurta', 'meyve', 'sebze', 'baharat', 'diğer'],
    default: 'diğer'
  },
  unit: {
    type: String,
    required: [true, 'Birim gerekli'],
    enum: ['gram', 'kilogram', 'litre', 'mililitre', 'adet', 'paket', 'çay kaşığı', 'yemek kaşığı']
  },
  price: {
    type: Number,
    min: [0, 'Fiyat negatif olamaz']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stok negatif olamaz']
  },
  minStock: {
    type: Number,
    default: 0,
    min: [0, 'Minimum stok negatif olamaz']
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

// Stok durumu kontrolü
ingredientSchema.virtual('stockStatus').get(function() {
  if (this.stock <= 0) return 'tükendi';
  if (this.stock <= this.minStock) return 'kritik';
  return 'yeterli';
});

module.exports = mongoose.model('Ingredient', ingredientSchema); 