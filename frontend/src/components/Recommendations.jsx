import { useMemo } from 'react';
import ProductCard from './ProductCard';
import { formatPrice } from '../data/menu';
import {
  getRecommendations,
  getCartRecommendations,
} from '../data/recommendations';

/**
 * Frequently Bought Together / You May Also Like.
 * Additive panel — does not alter product cards or checkout.
 */
function Recommendations({
  sourceProduct = null,
  cartItems = null,
  excludeIds = [],
  onAdd,
  title = 'You may also like',
  subtitle = 'Frequently bought together with your selection.',
}) {
  const suggestions = useMemo(() => {
    if (sourceProduct) {
      return getRecommendations(sourceProduct, { excludeIds, limit: 4 });
    }
    if (cartItems?.length) {
      return getCartRecommendations(cartItems, 4);
    }
    return [];
  }, [sourceProduct, cartItems, excludeIds]);

  if (!suggestions.length) return null;

  return (
    <section className="recs-section" aria-label={title}>
      <div className="recs-head">
        <p className="recs-eyebrow">Frequently bought together</p>
        <h3 className="recs-title">{title}</h3>
        {subtitle ? <p className="recs-lead">{subtitle}</p> : null}
        {sourceProduct?.name ? (
          <p className="recs-context">
            Because you chose <strong>{sourceProduct.name}</strong>
            {sourceProduct.price != null
              ? ` · ${formatPrice(sourceProduct.price)}`
              : ''}
          </p>
        ) : null}
      </div>

      <div className="recs-grid">
        {suggestions.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

export default Recommendations;
