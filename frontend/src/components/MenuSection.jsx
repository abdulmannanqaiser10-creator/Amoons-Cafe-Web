import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CATEGORIES,
  PRODUCTS,
  getFeaturedProducts,
  productMatchesCategory,
} from '../data/menu';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import Recommendations from './Recommendations';

function MenuSection() {
  const [active, setActive] = useState('featured');
  const [lastAdded, setLastAdded] = useState(null);
  const { addItem, items: cartItems } = useCart();
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const featuredProducts = useMemo(() => getFeaturedProducts(), []);

  const items = useMemo(() => {
    if (active === 'featured') return featuredProducts;
    return PRODUCTS.filter((item) => productMatchesCategory(item, active));
  }, [active, featuredProducts]);

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
  }, []);

  const scrollCategories = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.7);
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const handleAdd = (product) => {
    addItem(product);
    setLastAdded(product);
  };

  return (
    <section id="menu" className="menu-section page-pad-x scroll-mt-24">
      <div className="menu-section-inner">
        <div className="menu-section-head menu-section-head--split">
          <div className="menu-section-head-main">
            <div className="menu-eyebrow">
              <span className="menu-eyebrow-dot" aria-hidden="true" />
              <p>DESERT . COFFEE . MORE</p>
            </div>
            <h2 className="menu-section-title">Find your favourite.</h2>
          </div>
          <p className="menu-section-aside">
            A carefully made coffee, something savoury or a sweet finish - find
            your favourite.
          </p>
        </div>

        <div className="menu-cat-nav">
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
            {CATEGORIES.map((category) => {
              const selected = active === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`menu-category ${selected ? 'is-active' : ''}`}
                  onClick={() => setActive(category.id)}
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

        <div
          className={`product-grid${
            active === 'featured' ? ' product-grid--featured' : ''
          }`}
        >
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              featured={active === 'featured'}
            />
          ))}
        </div>

        {active === 'featured' ? (
          <div className="menu-full-cta">
            <Link
              to="/menu"
              className="hero-btn hero-btn-primary"
              onClick={() => setActive('breakfast')}
            >
              View the Full Menu
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
