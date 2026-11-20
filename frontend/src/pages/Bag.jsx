import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import Recommendations from '../components/Recommendations';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { useOrderType } from '../context/OrderTypeContext';
import { formatPrice } from '../data/menu';
import { REWARD_TIERS } from '../config/delivery';

function Bag() {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    discountPercent,
    taxAmount,
    deliveryFee,
    total,
    selectRedeem,
    redeemedPoints,
    increment,
    decrement,
    removeItem,
    addItem,
  } = useCart();
  const { isLoggedIn, points, openAuth, customer } = useCustomer();
  const { fulfillment, deliveryLabel, reopen, isDelivery } = useOrderType();
  const navigate = useNavigate();

  return (
    <PageShell>
      <section className="bag-page page-pad-x">
        <div className="bag-page-inner">
          <header className="bag-head">
            <p className="section-eyebrow">Your Bag</p>
            <h1 className="section-title">Shopping bag</h1>
            <p className="section-lead">
              {itemCount === 0
                ? 'Your bag is empty — explore the menu and add something lovely.'
                : `${itemCount} item${itemCount === 1 ? '' : 's'} ready for checkout.`}
            </p>
            {fulfillment ? (
              <button type="button" className="bag-fulfillment" onClick={reopen}>
                {fulfillment}
                {deliveryLabel ? ` · ${deliveryLabel}` : ''}
                <span>Change</span>
              </button>
            ) : null}
          </header>

          {items.length === 0 ? (
            <div className="bag-empty">
              <Link to="/menu" className="hero-btn hero-btn-primary">
                Browse the menu
              </Link>
            </div>
          ) : (
            <div className="bag-layout">
              <ul className="bag-list">
                {items.map((item) => (
                  <li key={item.id} className="bag-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="bag-item-image"
                    />
                    <div className="bag-item-info">
                      <div className="bag-item-top">
                        <h2>{item.name}</h2>
                        <p>{formatPrice(item.price)}</p>
                      </div>
                      <p className="bag-item-line">
                        Line total {formatPrice(item.price * item.quantity)}
                      </p>
                      <div className="bag-item-controls">
                        <div
                          className="bag-qty"
                          aria-label={`Quantity for ${item.name}`}
                        >
                          <button
                            type="button"
                            onClick={() => decrement(item.id)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => increment(item.id)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="bag-remove"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="bag-summary">
                <h2>Order summary</h2>

                <div className="bag-rewards-card">
                  {isLoggedIn ? (
                    <>
                      <p className="bag-rewards-balance">
                        Hello {customer?.name?.split(' ')[0] || 'guest'} ·{' '}
                        <strong>{points} pts</strong>
                      </p>
                      <p className="bag-summary-note">
                        Earn 10 points when an order is completed. Redeem
                        eligible points for a discount on this order.
                      </p>
                      <div className="bag-reward-tiers">
                        {REWARD_TIERS.map((tier) => {
                          const available = points >= tier.points;
                          const active = redeemedPoints === tier.points;
                          return (
                            <button
                              key={tier.points}
                              type="button"
                              className={`bag-reward-tier${active ? ' is-active' : ''}`}
                              disabled={!available}
                              onClick={() => selectRedeem(tier.points)}
                            >
                              <strong>{tier.points} pts</strong>
                              <span>{tier.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="bag-rewards-balance">
                        Earn rewards on this order
                      </p>
                      <p className="bag-summary-note">
                        Register with your mobile number to collect and redeem
                        points.
                      </p>
                      <button
                        type="button"
                        className="hero-btn hero-btn-secondary bag-rewards-cta"
                        onClick={() => openAuth('rewards')}
                      >
                        Register for rewards
                      </button>
                    </>
                  )}
                </div>

                <div className="bag-summary-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                {discountAmount > 0 ? (
                  <div className="bag-summary-row">
                    <span>
                      Discount ({discountPercent}% · {redeemedPoints} pts)
                    </span>
                    <strong>−{formatPrice(discountAmount)}</strong>
                  </div>
                ) : null}
                <div className="bag-summary-row">
                  <span>Tax (16%)</span>
                  <strong>{formatPrice(taxAmount)}</strong>
                </div>
                {isDelivery ? (
                  <div className="bag-summary-row">
                    <span>Delivery</span>
                    <strong>{formatPrice(deliveryFee)}</strong>
                  </div>
                ) : (
                  <div className="bag-summary-row">
                    <span>Pick-Up</span>
                    <strong>{formatPrice(0)}</strong>
                  </div>
                )}
                <div className="bag-summary-row bag-summary-row--total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <button
                  type="button"
                  className="hero-btn hero-btn-primary bag-confirm-btn"
                  onClick={() => {
                    if (!isLoggedIn) {
                      openAuth('checkout');
                      return;
                    }
                    navigate('/checkout');
                  }}
                >
                  Confirm Order
                </button>
                <Link to="/menu" className="bag-continue">
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}

          {items.length > 0 ? (
            <div className="bag-recs">
              <Recommendations
                cartItems={items}
                excludeIds={items.map((item) => item.id)}
                onAdd={addItem}
                title="You may also like"
                subtitle="Complete your order with these favourites."
              />
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}

export default Bag;
