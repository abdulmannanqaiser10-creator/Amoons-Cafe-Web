import { useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS, productMatchesCategory } from '../data/menu';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import Recommendations from './Recommendations';

function MenuSection() {
  const [active, setActive] = useState('all');
  const [lastAdded, setLastAdded] = useState(null);
  const { addItem, items: cartItems } = useCart();

  const items = useMemo(() => {
    return PRODUCTS.filter((item) => productMatchesCategory(item, active));
  }, [active]);

  const excludeIds = useMemo(
    () => cartItems.map((item) => item.id),
    [cartItems]
  );

  const handleAdd = (product) => {
    addItem(product);
    setLastAdded(product);
  };

  return (
    <section id="menu" className="menu-section page-pad-x scroll-mt-24">
      <div className="menu-section-inner">
        <div className="menu-section-head">
          <p className="section-eyebrow">The Menu</p>
          <h2 className="section-title">Café favourites, made slowly.</h2>
          <p className="section-lead">
            Specialty coffee, signature tiramisu, and everyday comforts —
            curated for quiet mornings and late nights in DHA Phase 8.
          </p>
        </div>

        <div className="menu-categories" role="tablist" aria-label="Menu categories">
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

        <div className="product-grid">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
            />
          ))}
        </div>

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
