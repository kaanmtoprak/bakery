/**
 * Recipe Types
 */

// Recipe Categories
const RECIPE_CATEGORIES = {
  BREAD: 'ekmek',
  CAKE: 'pasta',
  COOKIE: 'kurabiye',
  BOREK: 'börek',
  COREK: 'çörek',
  OTHER: 'diğer'
};

// Difficulty Levels
const DIFFICULTY_LEVELS = {
  EASY: 'kolay',
  MEDIUM: 'orta',
  HARD: 'zor'
};

// Measurement Units
const MEASUREMENT_UNITS = {
  GRAM: 'gram',
  KILOGRAM: 'kilogram',
  LITRE: 'litre',
  MILLILITRE: 'mililitre',
  PIECE: 'adet',
  PACKAGE: 'paket',
  TEASPOON: 'çay kaşığı',
  TABLESPOON: 'yemek kaşığı',
  CUP: 'su bardağı',
  GLASS: 'fincan',
  SLICE: 'dilim',
  BUNCH: 'demet'
};

// Recipe Status
const RECIPE_STATUS = {
  ACTIVE: true,
  INACTIVE: false
};

// Sort Options
const SORT_OPTIONS = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
  CATEGORY: 'category',
  DIFFICULTY: 'difficulty'
};

module.exports = {
  RECIPE_CATEGORIES,
  DIFFICULTY_LEVELS,
  MEASUREMENT_UNITS,
  RECIPE_STATUS,
  SORT_OPTIONS
}; 