const { body, param, query } = require('express-validator');

const createRecipeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tarif adı gerekli')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tarif adı 2-100 karakter arasında olmalı'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Açıklama en fazla 500 karakter olabilir'),
  
  body('category')
    .optional()
    .isIn(['ekmek', 'pasta', 'kurabiye', 'börek', 'çörek', 'diğer'])
    .withMessage('Geçersiz kategori'),
  
  body('difficulty')
    .optional()
    .isIn(['kolay', 'orta', 'zor'])
    .withMessage('Geçersiz zorluk seviyesi'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Hazırlık süresi pozitif sayı olmalı'),
  
  body('cookingTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Pişirme süresi pozitif sayı olmalı'),
  
  body('servings')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Porsiyon sayısı en az 1 olmalı'),
  
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('En az bir malzeme gerekli'),
  
  body('ingredients.*.ingredient')
    .isMongoId()
    .withMessage('Geçersiz malzeme ID'),
  
  body('ingredients.*.quantity')
    .isFloat({ min: 0 })
    .withMessage('Miktar pozitif sayı olmalı'),
  
  body('ingredients.*.unit')
    .isIn(['gram', 'kilogram', 'litre', 'mililitre', 'adet', 'paket', 'çay kaşığı', 'yemek kaşığı', 'su bardağı', 'fincan', 'dilim', 'demet'])
    .withMessage('Geçersiz birim'),
  
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('En az bir adım gerekli'),
  
  body('instructions.*')
    .trim()
    .notEmpty()
    .withMessage('Adım açıklaması boş olamaz')
    .isLength({ max: 200 })
    .withMessage('Adım açıklaması en fazla 200 karakter olabilir'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Notlar en fazla 300 karakter olabilir')
];

const updateRecipeValidation = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz tarif ID'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tarif adı boş olamaz')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tarif adı 2-100 karakter arasında olmalı'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Açıklama en fazla 500 karakter olabilir'),
  
  body('category')
    .optional()
    .isIn(['ekmek', 'pasta', 'kurabiye', 'börek', 'çörek', 'diğer'])
    .withMessage('Geçersiz kategori'),
  
  body('difficulty')
    .optional()
    .isIn(['kolay', 'orta', 'zor'])
    .withMessage('Geçersiz zorluk seviyesi'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Hazırlık süresi pozitif sayı olmalı'),
  
  body('cookingTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Pişirme süresi pozitif sayı olmalı'),
  
  body('servings')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Porsiyon sayısı en az 1 olmalı'),
  
  body('ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('En az bir malzeme gerekli'),
  
  body('instructions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('En az bir adım gerekli')
];

const getRecipeValidation = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz tarif ID')
];

const getRecipesValidation = [
  query('category')
    .optional()
    .isIn(['ekmek', 'pasta', 'kurabiye', 'börek', 'çörek', 'diğer'])
    .withMessage('Geçersiz kategori'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Arama terimi en az 2 karakter olmalı'),
  
  query('sort')
    .optional()
    .isIn(['name', 'createdAt', 'category', 'difficulty'])
    .withMessage('Geçersiz sıralama kriteri')
];

module.exports = {
  createRecipeValidation,
  updateRecipeValidation,
  getRecipeValidation,
  getRecipesValidation
}; 