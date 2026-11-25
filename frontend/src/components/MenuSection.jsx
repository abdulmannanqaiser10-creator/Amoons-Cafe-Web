import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CATEGORIES,
  PRODUCTS,
  getFeaturedProducts,
  getHomeShowcaseProducts,
  productMatchesCategory,
} from '../data/menu';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import Recommendations from './Recommendations';

function MenuSection({ mode = 'full' }) {
  const isPreview = mode === 'preview';
  const [active, setActive] = useState(isPreview ? 'showcase' : 'featured');
  const [lastAdded, setLastAdded] = useState(null);
  const { addItem, items: cartItems } = useCart();
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const featuredProducts = useMemo(() => getFeaturedProducts(), []);
  const showcaseProducts = useMemo(() => getHomeShowcaseProducts(), []);

  const categories = useMemo(
    () => (isPreview ? [] : CATEGORIES),
    [isPreview]
  );

  const items = useMemo(() => {
    if (isPreview) return showcaseProducts;
    if (active === 'featured') return featuredProducts;
    return PRODUCTS.filter((item) => productMatchesCategory(item, active));
  }, [isPreview, showcaseProducts, active, featuredProducts]);

  const excludeIds = useMemo(
    () => cartItems.map((item) => item.id),
    [cartItems]
  );

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < max - 4);
  };

  useEffect(() => {
    if (isPreview) return undefined;
    updateScrollState();
    const el = trackRef.current;
    if (!el) return undefined;
    const onScroll = () => updateScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [isPreview, categories.length]);

  useEffect(() => {
    if (isPreview || !trackRef.current) return;
    const selected = trackRef.current.querySelector('.menu-category.is-active');
    selected?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [active, isPreview]);

  const scrollCategories = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(240, el.clientWidth * 0.65);
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const handleAdd = (product) => {
    addItem(product);
    setLastAdded(product);
  };

  const selectCategory = (categoryId) => {
    setActive(categoryId);
    const el = trackRef.current?.querySelector(
      `[data-category-id="${categoryId}"]`
    );
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <section
      id="menu"
      className={`menu-section page-pad-x scroll-mt-24${
        isPreview ? ' menu-section--preview' : ' menu-section--full'
      }`}
    >
      <div className="menu-section-inner">
        <div className="menu-section-head menu-section-head--split">
          <div className="menu-section-head-main">
            <div className="menu-eyebrow">
              <span className="menu-eyebrow-dot" aria-hidden="true" />
              <p>DESERT . COFFEE . MORE</p>
            </div>
            <h2 className="menu-section-title">
              {isPreview ? 'Find your favourite.' : 'The full AMOONS menu.'}
            </h2>
          </div>
          <p className="menu-section-aside">
            {isPreview
              ? 'A carefully made coffee, something savoury or a sweet finish - find your favourite.'
              : 'Browse every category — specialty coffee, café favourites, desserts and more.'}
          </p>
        </div>

        {!isPreview ? (
          <div className="menu-cat-nav menu-cat-nav--sticky">
            <button
              type="button"
              className="menu-cat-arrow"
              aria-label="Scroll categories left"
              onClick={() => scrollCategories(-1)}
              disabled={!canScrollLeft}
            >
              ‹
            </button>

            <div
              className="menu-categories"
              role="tablist"
              aria-label="Menu categories"
              ref={trackRef}
            >
              {categories.map((category) => {
                const selected = active === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    data-category-id={category.id}
                    aria-selected={selected}
                    className={`menu-category ${selected ? 'is-active' : ''}`}
                    onClick={() => selectCategory(category.id)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="menu-cat-arrow"
              aria-label="Scroll categories right"
              onClick={() => scrollCategories(1)}
              disabled={!canScrollRight}
            >
              ›
            </button>
          </div>
        ) : null}

        {!isPreview ? (
          <p className="menu-cat-count" aria-live="polite">
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {active !== 'featured'
              ? ` in ${categories.find((item) => item.id === active)?.label || 'menu'}`
              : ' featured'}
          </p>
        ) : null}

        <div
          className={`product-grid${
            !isPreview && active === 'featured' ? ' product-grid--featured' : ''
          }`}
        >
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              featured={!isPreview && active === 'featured'}
            />
          ))}
        </div>

        {isPreview ? (
          <div className="menu-full-cta">
            <Link to="/menu" className="hero-btn hero-btn-primary">
              View Full Menu
            </Link>
          </div>
        ) : null}

        {lastAdded ? (
          <Recommendations
            sourceProduct={lastAdded}
            excludeIds={excludeIds}
            onAdd={handleAdd}
            title="You may also like"
            subtitle="Frequently bought together with your selection."
          />
        ) : null}
      </div>
    </section>
  );
}

export default MenuSection;
