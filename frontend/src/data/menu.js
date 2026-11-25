export const CATEGORIES = [
  { id: 'featured', label: 'Featured' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'appetizers-fries', label: 'Appetizers & Fries' },
  { id: 'sandwiches-croissants', label: 'Sandwiches & Croissants' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'iced-tea', label: 'Iced Tea' },
  { id: 'matcha', label: 'Matcha' },
  { id: 'classic-mocktails', label: 'Classic Mocktails' },
  { id: 'signature-mocktails', label: 'Signature Mocktails' },
  { id: 'frappes', label: 'Frappes' },
  { id: 'bottled-drinks', label: 'Bottled Drinks' },
];

export const FEATURED_PRODUCT_IDS = [
  'flat-white',
  'smashed-beef-croissant',
  'tiramisu-160g',
];

const MILK_LABELS = [
  'Regular milk',
  'Skim milk',
  'Lactose free milk',
  'Almond milk',
  'Coconut milk',
];

function milkVariants(slug, prices) {
  return MILK_LABELS.map((label, index) => ({
    id: `${slug}-${label.toLowerCase().replace(/\s+/g, '-')}`,
    label,
    price: prices[index],
  }));
}

export const PRODUCTS = [
  // Coffee
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'coffee',
    price: 750,
    description:
      'Velvety microfoam over a double shot of espresso — smooth, balanced and made to linger.',
    image:
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',
    featured: true,
  },

  // Breakfast
  {
    id: 'steak-cheese-omelet',
    name: 'Steak Cheese Omelet',
    category: 'breakfast',
    price: 1620,
    description:
      'Beef, cheese and bell peppers stuffed into a fluffy omelet, served with fresh salad, curly fries, butter, jam and bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-253.png',
  },
  {
    id: 'scrambled-egg-croissant',
    name: 'Scrambled Egg Croissant',
    category: 'breakfast',
    price: 1399,
    description:
      'Fluffy scrambled eggs in a croissant, served with Greek tomato, fresh salad, turkey bacon, butter, jam and bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-254.png',
  },
  {
    id: 'mexican-egg-croissant',
    name: 'Mexican Egg Croissant',
    category: 'breakfast',
    price: 1420,
    description:
      'Cheesy Mexican-style scrambled eggs with colourful bell peppers in a croissant, served with fresh salad, bologna, Greek tomato, butter, jam and bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-262.png',
  },
  {
    id: 'pakistani-omelet',
    name: 'Pakistani Omelet',
    category: 'breakfast',
    price: 1050,
    description:
      'Fluffy omelet with onion, tomato, coriander and green chilli, served with fresh salad, curly fries, butter, jam and bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-263.png',
  },
  {
    id: 'pancakes',
    name: 'Pancakes',
    category: 'breakfast',
    categories: ['breakfast', 'desserts'],
    price: 950,
    description: 'Fluffy pancakes with your pick of Oreo, chocolate or Lotus.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-264.png',
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    category: 'breakfast',
    price: 1250,
    description: 'Poached eggs in a rich, spiced tomato sauce with herbs & peppers.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-271.png',
  },
  {
    id: 'lahsa-egg',
    name: 'Lahsa Egg',
    category: 'breakfast',
    price: 1150,
    description: 'Spicy Lahsa-style eggs, served with butter, jam and bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-272.png',
  },
  {
    id: 'mushroom-cheese-omelet',
    name: 'Mushroom Cheese Omelet',
    category: 'breakfast',
    price: 1299,
    description:
      'Fluffy omelet with sauteed mushrooms and melted cheese, served with fresh salad, curly fries, butter, jam and bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-273.png',
  },

  // Appetizers & Fries
  {
    id: 'beef-loaded-fries',
    name: 'Beef Loaded Fries',
    category: 'appetizers-fries',
    price: 1199,
    description: 'Crispy fries loaded with beef, cheese, and signature sauces.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-100.png',
  },
  {
    id: 'chicken-loaded-fries',
    name: 'Chicken Loaded Fries',
    category: 'appetizers-fries',
    price: 1099,
    description: 'Crispy fries loaded with chicken, cheese, and signature sauces.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-105.png',
  },
  {
    id: 'chilli-honey-glazed-chicken-strips',
    name: 'Chilli Honey Glazed Chicken Strips',
    category: 'appetizers-fries',
    price: 1250,
    description: 'Sweet heat with a crispy edge. Dangerously easy to finish.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-106.png',
  },
  {
    id: 'chipotle-fries',
    name: 'Chipotle Fries',
    category: 'appetizers-fries',
    price: 900,
    description: 'Smoky, creamy, and mildly addictive.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/chipotle.png',
  },
  {
    id: 'crispy-fried-chicken-strips',
    name: 'Crispy Fried Chicken Strips',
    category: 'appetizers-fries',
    price: 1150,
    description: 'Golden, crunchy, and impossible to share.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-109.png',
  },
  {
    id: 'dynamite-chicken',
    name: 'Dynamite Chicken',
    category: 'appetizers-fries',
    price: 899,
    description: 'Crunchy on the outside, spicy on the inside.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-111.png',
  },
  {
    id: 'mozzarella-cheese-sticks',
    name: 'Mozzarella Cheese Sticks',
    category: 'appetizers-fries',
    price: 1050,
    description: 'Cheese pulls worthy of Instagram.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/mozrella-cheese-strips.png',
  },
  {
    id: 'plain-fries',
    name: 'Plain Fries',
    category: 'appetizers-fries',
    price: 690,
    description: 'No drama. Just perfectly crispy fries.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-115.png',
  },
  {
    id: 'cajun-fries',
    name: 'Cajun Fries',
    category: 'appetizers-fries',
    price: 700,
    description:
      'Crispy golden fries tossed in bold Cajun seasoning for the perfect spicy, smoky kick.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-303.png',
  },

  // Sandwiches & Croissants
  {
    id: 'blt-croissant',
    name: 'BLT Croissant',
    category: 'sandwiches-croissants',
    price: 1450,
    description:
      'Layers of buttery, crispy perfection with bologna, fresh lettuce, and ripe tomato.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-99.png',
  },
  {
    id: 'chicken-fajita-croissant',
    name: 'Chicken Fajita Croissant',
    category: 'sandwiches-croissants',
    price: 1450,
    description: "A croissant that decided being delicious wasn't enough.",
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-104.png',
  },
  {
    id: 'club-sandwich',
    name: 'Club Sandwich',
    category: 'sandwiches-croissants',
    price: 1200,
    description: 'Triple layered sandwich with creamy sauces.',
    image:
      'https://amoonscafe.com/wp-content/uploads/2026/10/ChatGPT-Image-Sep-19-2026-at-01_10_50-AM.png',
  },
  {
    id: 'butter-croissant',
    name: 'Butter Croissant',
    category: 'sandwiches-croissants',
    price: 600,
    description: 'All butter, all flake, no distractions.',
    image:
      'https://amoonscafe.com/wp-content/uploads/2026/10/ChatGPT-Image-Sep-19-2026-at-01_04_12-AM.png',
  },
  {
    id: 'pesto-chicken-sandwich',
    name: 'Pesto Chicken Sandwich',
    category: 'sandwiches-croissants',
    price: 1299,
    description: 'Fresh, herby, and main-character energy.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-114.png',
  },
  {
    id: 'roasted-beef-sandwich',
    name: 'Roasted Beef Sandwich',
    category: 'sandwiches-croissants',
    price: 1550,
    description:
      'Roasted beef topped with sautéed mushrooms & cheese, served on toasted bran bread.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-116.png',
  },
  {
    id: 'steak-sandwich',
    name: 'Steak Sandwich',
    category: 'sandwiches-croissants',
    price: 1550,
    description: 'Big flavor, no small talk.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-117.png',
  },
  {
    id: 'zaatar-cheese-sandwich',
    name: "Za'atar Cheese Sandwich",
    category: 'sandwiches-croissants',
    price: 1099,
    description: 'Middle Eastern comfort food with elite taste.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-117.png',
  },
  {
    id: 'smashed-beef-croissant',
    name: 'Smashed Beef Croissant',
    category: 'sandwiches-croissants',
    price: 1599,
    description: 'A little messy, very extra, and worth every crumb.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-301.png',
    featured: true,
  },

  // Pasta
  {
    id: 'amoons-signature-pasta',
    name: 'AMOONS Signature Pasta',
    category: 'pasta',
    price: 1650,
    description: 'Chicken in our creamy signature pesto sauce. The one people come back for.',
    image:
      'https://amoonscafe.com/wp-content/uploads/2026/10/ChatGPT-Image-Sep-22-2026-at-12_09_37-AM.png',
  },
  {
    id: 'alfredo-pasta',
    name: 'Alfredo Pasta',
    category: 'pasta',
    price: 1100,
    description: 'Creamy, cheesy, and comfort in every bite.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-98.png',
  },
  {
    id: 'fettuccine-honey-chili-pasta',
    name: 'Fettuccine Honey Chili Pasta',
    category: 'pasta',
    price: 1350,
    description:
      'Creamy fettuccine with grilled chicken, coated in a bold honey chili sauce for the perfect sweet-heat balance.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-112.png',
  },

  // Desserts
  {
    id: 'tiramisu-160g',
    name: 'Tiramisu',
    category: 'desserts',
    price: 1150,
    description:
      'A single-serving slice of our signature tiramisu — espresso-soaked ladyfingers, velvety mascarpone cream, finished with a dusting of cocoa. 160g · single serving',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-12.png',
    featured: true,
    variantLabel: 'Layers',
    variants: [
      { id: 'tiramisu-2-layers', label: '2 Layers', price: 1150 },
      { id: 'tiramisu-3-layers', label: '3 Layers', price: 1590 },
    ],
  },
  {
    id: 'tiramisu-grande',
    name: 'Tiramisu Grande (1 lb, serves 4-5)',
    category: 'desserts',
    price: 3250,
    description:
      'The full cake. Layers of espresso-soaked ladyfingers and mascarpone cream, generously dusted with cocoa. Made to share. 1 pound · serves 4',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-15.png',
  },
  {
    id: 'french-toast',
    name: 'French Toast',
    category: 'desserts',
    price: 1150,
    description: 'Brioche French toast, filled with Kinder, Lotus or Nutella.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-212.png',
  },
  {
    id: 'waffles',
    name: 'Waffles',
    category: 'desserts',
    price: 1150,
    description:
      'Chocolate or Lotus waffles, served with fresh fruit, ice cream and maple syrup.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-243.png',
  },
  {
    id: 'london-cake',
    name: 'London Cake',
    category: 'desserts',
    price: 980,
    description:
      'Chocolate sponge layered with dark chocolate ganache, salted caramel and chocolate crunch, under a glossy chocolate coat.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-252.png',
  },
  {
    id: 'gooey-cup',
    name: 'Gooey Cup',
    category: 'desserts',
    price: 850,
    description: '',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-282.png',
  },
  {
    id: 'umm-ali',
    name: 'Umm Ali',
    category: 'desserts',
    price: 880,
    description: 'Warm, creamy, flaky and loaded with nuts',
    image:
      'https://amoonscafe.com/wp-content/uploads/2026/10/ChatGPT-Image-Sep-19-2026-at-09_11_21-PM.png',
  },

  // Iced Tea
  {
    id: 'lemon-iced-tea',
    name: 'Lemon Iced Tea',
    category: 'iced-tea',
    price: 580,
    description: 'Crisp, citrusy, and forever refreshing.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-94.png',
  },
  {
    id: 'passion-fruit-iced-tea',
    name: 'Passion Fruit Iced Tea',
    category: 'iced-tea',
    price: 580,
    description: 'Bright, tropical, and impossible to ignore.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/pasion-iced-tea.png',
  },
  {
    id: 'peach-iced-tea',
    name: 'Peach Iced Tea',
    category: 'iced-tea',
    price: 580,
    description: 'Summer in a glass.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-96.png',
  },

  // Matcha
  {
    id: 'classic-matcha',
    name: 'Classic Matcha',
    category: 'matcha',
    price: 830,
    description: 'Clean energy without the chaos.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-119.png',
    variantLabel: 'Milk',
    variants: milkVariants('classic-matcha', [830, 880, 880, 980, 980]),
  },
  {
    id: 'mango-matcha',
    name: 'Mango Matcha',
    category: 'matcha',
    price: 960,
    description: 'Tropical vacation meets matcha energy.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-125.png',
    variantLabel: 'Milk',
    variants: milkVariants('mango-matcha', [960, 1010, 1010, 1110, 1110]),
  },
  {
    id: 'oreo-matcha',
    name: 'Oreo Matcha',
    category: 'matcha',
    price: 860,
    description: 'Matcha took a snack break.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-137.png',
    variantLabel: 'Milk',
    variants: milkVariants('oreo-matcha', [860, 910, 910, 1010, 1010]),
  },
  {
    id: 'strawberry-matcha',
    name: 'Strawberry Matcha',
    category: 'matcha',
    price: 1030,
    description: 'Pretty, pink, and impossible to ignore.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-153.png',
    variantLabel: 'Milk',
    variants: milkVariants('strawberry-matcha', [1030, 1080, 1080, 1180, 1180]),
  },

  // Classic Mocktails
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    category: 'classic-mocktails',
    price: 550,
    description: 'It looks dramatic because it is.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-171.png',
  },
  {
    id: 'passion-punch',
    name: 'Passion Punch',
    category: 'classic-mocktails',
    price: 650,
    description: 'Tropical energy with main-character vibes.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-189.png',
  },
  {
    id: 'poms-pomegranate',
    name: 'Poms (Pomegranate)',
    category: 'classic-mocktails',
    price: 550,
    description: 'Pomegranate doing the absolute most.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-196.png',
  },

  // Signature Mocktails
  {
    id: 'mango-tabasco',
    name: 'Mango Tabasco',
    category: 'signature-mocktails',
    price: 860,
    description: 'Sweet mango with a chilli kick. Bold and slightly unhinged.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-179.png',
  },
  {
    id: 'marmalade-blueberry',
    name: 'Marmalade Blueberry',
    category: 'signature-mocktails',
    price: 860,
    description: 'Citrusy, juicy, and a little fancy.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-181.png',
  },
  {
    id: 'peach-vanilla-basil',
    name: 'Peach Vanilla Basil',
    category: 'signature-mocktails',
    price: 830,
    description: 'Fresh, aromatic, and effortlessly cool.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-194.png',
  },
  {
    id: 'strawberry-pepper',
    name: 'Strawberry Pepper',
    category: 'signature-mocktails',
    price: 830,
    description: 'Sweet with a little spice.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-197.png',
  },

  // Frappes
  {
    id: 'lotus-frappe',
    name: 'Lotus Frappé',
    category: 'frappes',
    price: 1030,
    description: "Biscoff lovers, this one's for you.",
    image:
      'https://amoonscafe.com/wp-content/uploads/2026/10/ChatGPT-Image-Sep-21-2026-at-09_24_35-PM.png',
  },
  {
    id: 'caramel-frappe',
    name: 'Caramel Frappé',
    category: 'frappes',
    price: 780,
    description: 'Dessert disguised as a drink.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-209.png',
  },
  {
    id: 'vanilla-frappe',
    name: 'Vanilla Frappé',
    category: 'frappes',
    price: 780,
    description: 'Creamy, icy, and impossible to dislike.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-210.png',
  },
  {
    id: 'mocha-frappe',
    name: 'Mocha Frappé',
    category: 'frappes',
    price: 800,
    description: 'Coffee and chocolate, name a better duo.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-211.png',
  },
  {
    id: 'kinder-bueno-frappe',
    name: 'Kinder Bueno Frappé',
    category: 'frappes',
    price: 1100,
    description: 'Childhood memories blended to perfection.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-218.png',
  },
  {
    id: 'pistachio-frappe',
    name: 'Pistachio Frappé',
    category: 'frappes',
    price: 1050,
    description: 'Rich, creamy, and extra in the best way.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-219.png',
  },
  {
    id: 'hazelnut-frappe',
    name: 'Hazelnut Frappé',
    category: 'frappes',
    price: 780,
    description: 'Nutty comfort in frozen form.',
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/amoons-product-227.png',
  },

  // Bottled Drinks
  {
    id: 'water',
    name: 'Water',
    category: 'bottled-drinks',
    price: 80,
    description: "Still water. Sometimes that's the whole order.",
    image: 'https://amoonscafe.com/wp-content/uploads/2026/10/water-review.jpg',
  },
];

export function formatPrice(pkr) {
  return `Rs ${Number(pkr).toLocaleString('en-PK')}`;
}

export function productMatchesCategory(product, categoryId) {
  if (categoryId === 'all') return true;
  if (categoryId === 'featured') {
    return Boolean(product.featured) || FEATURED_PRODUCT_IDS.includes(product.id);
  }
  if (product.category === categoryId) return true;
  return Array.isArray(product.categories) && product.categories.includes(categoryId);
}

export function getFeaturedProducts() {
  return FEATURED_PRODUCT_IDS.map((id) => PRODUCTS.find((item) => item.id === id)).filter(
    Boolean
  );
}

/** Homepage preview: about half the menu, featured items first. */
export function getHomeShowcaseProducts() {
  const featured = getFeaturedProducts();
  const featuredIds = new Set(featured.map((item) => item.id));
  const rest = PRODUCTS.filter((item) => !featuredIds.has(item.id));
  const target = Math.max(featured.length, Math.ceil(PRODUCTS.length / 2));
  return [...featured, ...rest].slice(0, target);
}
