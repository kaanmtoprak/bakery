const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Tüm ölçü birimlerini getir
// @route   GET /api/measurements
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const measurements = [
      { id: 1, name: 'gram', symbol: 'g', type: 'weight' },
      { id: 2, name: 'kilogram', symbol: 'kg', type: 'weight' },
      { id: 3, name: 'litre', symbol: 'L', type: 'volume' },
      { id: 4, name: 'mililitre', symbol: 'ml', type: 'volume' },
      { id: 5, name: 'adet', symbol: 'adet', type: 'count' },
      { id: 6, name: 'paket', symbol: 'paket', type: 'count' },
      { id: 7, name: 'çay kaşığı', symbol: 'çk', type: 'volume' },
      { id: 8, name: 'yemek kaşığı', symbol: 'yk', type: 'volume' },
      { id: 9, name: 'su bardağı', symbol: 'sb', type: 'volume' },
      { id: 10, name: 'fincan', symbol: 'fincan', type: 'volume' },
      { id: 11, name: 'dilim', symbol: 'dilim', type: 'count' },
      { id: 12, name: 'demet', symbol: 'demet', type: 'count' }
    ];
    
    res.json(measurements);
  } catch (error) {
    console.error('Ölçü birimlerini getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Ölçü birimi kategorilerini getir
// @route   GET /api/measurements/categories
// @access  Private
router.get('/categories', protect, async (req, res) => {
  try {
    const categories = [
      { type: 'weight', name: 'Ağırlık', units: ['gram', 'kilogram'] },
      { type: 'volume', name: 'Hacim', units: ['litre', 'mililitre', 'çay kaşığı', 'yemek kaşığı', 'su bardağı', 'fincan'] },
      { type: 'count', name: 'Adet', units: ['adet', 'paket', 'dilim', 'demet'] }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Ölçü kategorilerini getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @desc    Birim dönüşümü yap
// @route   POST /api/measurements/convert
// @access  Private
router.post('/convert', protect, async (req, res) => {
  try {
    const { fromUnit, toUnit, value } = req.body;
    
    if (!fromUnit || !toUnit || value === undefined) {
      return res.status(400).json({ message: 'Birim ve değer gerekli' });
    }
    
    let convertedValue = value;
    
    // Ağırlık dönüşümleri
    if (fromUnit === 'gram' && toUnit === 'kilogram') {
      convertedValue = value / 1000;
    } else if (fromUnit === 'kilogram' && toUnit === 'gram') {
      convertedValue = value * 1000;
    }
    // Hacim dönüşümleri
    else if (fromUnit === 'mililitre' && toUnit === 'litre') {
      convertedValue = value / 1000;
    } else if (fromUnit === 'litre' && toUnit === 'mililitre') {
      convertedValue = value * 1000;
    }
    // Çay kaşığı dönüşümleri (yaklaşık 5ml)
    else if (fromUnit === 'çay kaşığı' && toUnit === 'mililitre') {
      convertedValue = value * 5;
    } else if (fromUnit === 'mililitre' && toUnit === 'çay kaşığı') {
      convertedValue = value / 5;
    }
    // Yemek kaşığı dönüşümleri (yaklaşık 15ml)
    else if (fromUnit === 'yemek kaşığı' && toUnit === 'mililitre') {
      convertedValue = value * 15;
    } else if (fromUnit === 'mililitre' && toUnit === 'yemek kaşığı') {
      convertedValue = value / 15;
    }
    // Su bardağı dönüşümleri (yaklaşık 200ml)
    else if (fromUnit === 'su bardağı' && toUnit === 'mililitre') {
      convertedValue = value * 200;
    } else if (fromUnit === 'mililitre' && toUnit === 'su bardağı') {
      convertedValue = value / 200;
    }
    // Fincan dönüşümleri (yaklaşık 100ml)
    else if (fromUnit === 'fincan' && toUnit === 'mililitre') {
      convertedValue = value * 100;
    } else if (fromUnit === 'mililitre' && toUnit === 'fincan') {
      convertedValue = value / 100;
    }
    // Aynı birim ise değer değişmez
    else if (fromUnit === toUnit) {
      convertedValue = value;
    }
    // Dönüşüm yapılamıyorsa
    else {
      return res.status(400).json({ 
        message: 'Bu birimler arasında dönüşüm yapılamıyor',
        fromUnit,
        toUnit
      });
    }
    
    res.json({
      fromUnit,
      toUnit,
      originalValue: value,
      convertedValue: convertedValue.toFixed(2)
    });
  } catch (error) {
    console.error('Birim dönüşüm hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router; 