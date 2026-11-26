import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchWebsiteMenu } from '../api/websiteMenu';
import {
  CATEGORIES as STATIC_CATEGORIES,
  FEATURED_PRODUCT_IDS,
  PRODUCTS as STATIC_PRODUCTS,
  productMatchesCategory as staticMatch,
} from '../data/menu';

const MenuContext = createContext(null);

const FEATURED_NAME_MATCHERS = [
  { id: 'flat-white', test: (name) => /flat\s*white/i.test(name) },
  {
    id: 'smashed-beef-croissant',
    test: (name) => /smashed\s*beef\s*croissant/i.test(name),
  },
  {
    id: 'tiramisu-160g',
    test: (name) => /^tiramisu\b/i.test(name) && !/grande/i.test(name),
  },
];

function withFeaturedFlags(products) {
  const featuredIds = new Set();
  const ordered = [];

  for (const matcher of FEATURED_NAME_MATCHERS) {
    const match = products.find(
      (item) =>
        matcher.test(item.name) ||
        item.id === matcher.id ||
        FEATURED_PRODUCT_IDS.includes(item.id)
    );
    if (match) {
      featuredIds.add(match.id);
      ordered.push({ ...match, featured: true });
    }
  }

  return {
    products: products.map((item) =>
      featuredIds.has(item.id) ? { ...item, featured: true } : item
    ),
    featuredProducts: ordered,
  };
}

export function MenuProvider({ children }) {
  const [categories, setCategories] = useState(STATIC_CATEGORIES);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState(() =>
    FEATURED_PRODUCT_IDS.map((id) =>
      STATIC_PRODUCTS.find((item) => item.id === id)
    ).filter(Boolean)
  );
  const [source, setSource] = useState('static');
  const [loading, setLoading] = useState(true);

  const applyStatic = useCallback(() => {
    const next = withFeaturedFlags(STATIC_PRODUCTS);
    setCategories(STATIC_CATEGORIES);
    setProducts(next.products);
    setFeaturedProducts(next.featuredProducts);
    setSource('static');
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWebsiteMenu();
      const remoteCategories = Array.isArray(data?.categories)
        ? data.categories
        : [];
      const remoteProducts = Array.isArray(data?.products) ? data.products : [];

      if (!remoteProducts.length) {
        applyStatic();
        return;
      }

      const next = withFeaturedFlags(remoteProducts);
      const cats = [
        { id: 'featured', label: 'Featured' },
        ...remoteCategories.filter((item) => item.id !== 'featured'),
      ];

      setCategories(cats);
      setProducts(next.products);
      setFeaturedProducts(
        next.featuredProducts.length
          ? next.featuredProducts
          : next.products.filter((item) => item.featured).slice(0, 3)
      );
      setSource('live');
    } catch {
      applyStatic();
    } finally {
      setLoading(false);
    }
  }, [applyStatic]);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const productMatchesCategory = useCallback(
    (product, categoryId) => {
      if (source === 'static') return staticMatch(product, categoryId);
      if (categoryId === 'all') return true;
      if (categoryId === 'featured') return Boolean(product.featured);
      if (product.category === categoryId) return true;
      return (
        Array.isArray(product.categories) &&
        product.categories.includes(categoryId)
      );
    },
    [source]
  );

  const value = useMemo(
    () => ({
      categories,
      products,
      featuredProducts,
      loading,
      source,
      refresh,
      productMatchesCategory,
    }),
    [
      categories,
      products,
      featuredProducts,
      loading,
      source,
      refresh,
      productMatchesCategory,
    ]
  );

  return (
    <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
