import { useMemo, useState } from 'react';
import { formatPrice } from '../data/menu';

function ProductCard({ product, onAdd }) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const [variantId, setVariantId] = useState(
    hasVariants ? product.variants[0].id : null
  );

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return product.variants.find((variant) => variant.id === variantId) || product.variants[0];
  }, [hasVariants, product.variants, variantId]);

  const displayPrice = selectedVariant?.price ?? product.price;
  const cartProduct = useMemo(() => {
    if (!selectedVariant) return product;
    return {
      ...product,
      id: selectedVariant.id,
      name: `${product.name} - ${selectedVariant.label}`,
      price: selectedVariant.price,
      variantLabel: selectedVariant.label,
    };
  }, [product, selectedVariant]);

  return (
    <article className="product-card">
      <div className="product-card-media">
        {product.tag && <span className="product-card-tag">{product.tag}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card-body">
        <div className="product-card-top">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-price">{formatPrice(displayPrice)}</p>
        </div>
        {product.description ? (
          <p className="product-card-desc">{product.description}</p>
        ) : null}

        {hasVariants ? (
          <label className="product-card-variant">
            <span>{product.variantLabel || 'Option'}</span>
            <select
              value={selectedVariant.id}
              onChange={(event) => setVariantId(event.target.value)}
              aria-label={`${product.name} ${product.variantLabel || 'option'}`}
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.label} · {formatPrice(variant.price)}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <button
          type="button"
          className="product-card-btn"
          onClick={() => onAdd(cartProduct)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
