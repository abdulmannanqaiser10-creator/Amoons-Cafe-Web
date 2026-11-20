import { PRODUCTS } from './menu';

/**
 * Complementary category pairs for “Frequently Bought Together”.
 * Keys are product categories; values are preferred companion categories.
 */
const COMPLEMENTS = {
  breakfast: ['frappes', 'iced-tea', 'matcha', 'bottled-drinks', 'desserts'],
  desserts: ['frappes', 'matcha', 'iced-tea', 'bottled-drinks', 'classic-mocktails'],
  pasta: ['appetizers-fries', 'bottled-drinks', 'classic-mocktails', 'iced-tea'],
  'sandwiches-croissants': [
    'appetizers-fries',
    'frappes',
    'iced-tea',
    'bottled-drinks',
  ],
  'appetizers-fries': [
    'pasta',
    'sandwiches-croissants',
    'signature-mocktails',
    'classic-mocktails',
  ],
  'iced-tea': ['desserts', 'breakfast', 'appetizers-fries', 'sandwiches-croissants'],
  matcha: ['desserts', 'breakfast', 'sandwiches-croissants'],
  frappes: ['desserts', 'breakfast', 'appetizers-fries'],
  'classic-mocktails': ['appetizers-fries', 'desserts', 'pasta'],
  'signature-mocktails': ['appetizers-fries', 'desserts', 'sandwiches-croissants'],
  'bottled-drinks': ['pasta', 'sandwiches-croissants', 'breakfast', 'desserts'],
};

function productCategories(product) {
  const cats = new Set();
  if (product?.category) cats.add(product.category);
  if (Array.isArray(product?.categories)) {
    product.categories.forEach((cat) => cats.add(cat));
  }
  return [...cats];
}

function baseProductId(id) {
  const value = String(id || '');
  // Variant cart ids look like "latte-regular-milk" — match by prefix of catalog id.
  const match = PRODUCTS.find(
    (item) => value === item.id || value.startsWith(`${item.id}-`)
  );
  return match?.id || value;
}

/**
 * Returns up to `limit` complementary products for a selected/added item.
 */
export function getRecommendations(sourceProduct, { excludeIds = [], limit = 4 } = {}) {
  if (!sourceProduct) return [];

  const sourceId = baseProductId(sourceProduct.id);
  const source = PRODUCTS.find((item) => item.id === sourceId) || sourceProduct;
  const cats = productCategories(source);

  const preferred = [];
  cats.forEach((cat) => {
    (COMPLEMENTS[cat] || []).forEach((c) => {
      if (!preferred.includes(c)) preferred.push(c);
    });
  });

  const excluded = new Set(
    [sourceId, ...excludeIds].map((id) => baseProductId(id)).filter(Boolean)
  );

  const scored = PRODUCTS.filter((item) => !excluded.has(item.id)).map((item) => {
    const itemCats = productCategories(item);
    let score = 0;

    itemCats.forEach((cat) => {
      const rank = preferred.indexOf(cat);
      if (rank !== -1) score += 100 - rank * 8;
      // Soft boost for same broad meal pairing (dessert with coffee, etc.)
      if (cats.includes('desserts') && ['frappes', 'matcha', 'iced-tea'].includes(cat)) {
        score += 12;
      }
      if (
        ['frappes', 'matcha', 'iced-tea'].some((c) => cats.includes(c)) &&
        cat === 'desserts'
      ) {
        score += 12;
      }
    });

    // Light variety so suggestions aren’t always the same first products
    score += (item.id.length + item.price) % 7;

    return { item, score };
  });

  return scored
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.item);
}

export function getCartRecommendations(cartItems, limit = 4) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return [];

  const excludeIds = cartItems.map((item) => item.id);
  const pooled = new Map();

  cartItems.forEach((item) => {
    getRecommendations(item, { excludeIds, limit: 6 }).forEach((rec, index) => {
      const current = pooled.get(rec.id) || { item: rec, score: 0 };
      current.score += 20 - index;
      pooled.set(rec.id, current);
    });
  });

  return [...pooled.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.item);
}
