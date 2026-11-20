import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/menu';

function readStoredOrder() {
  try {
    const raw = sessionStorage.getItem('amoons-last-order');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function OrderConfirmation() {
  const { lastOrder } = useCart();
  const location = useLocation();

  const order = useMemo(() => {
    if (lastOrder) return lastOrder;
    return readStoredOrder();
  }, [lastOrder]);

  if (!order) {
    return (
      <PageShell>
        <section className="confirm-page page-pad-x">
          <div className="confirm-card">
            <p className="section-eyebrow">Order</p>
            <h1 className="section-title">No recent order found</h1>
            <p className="section-lead">
              When you place an order, your confirmation will appear here.
            </p>
            <Link to="/menu" className="hero-btn hero-btn-primary">
              Browse the menu
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const placedAt = new Date(order.createdAt).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const orderTotal = order.total ?? order.subtotal;

  return (
    <PageShell>
      <section className="confirm-page page-pad-x">
        <div className="confirm-card">
          <p className="section-eyebrow">Thank you</p>
          <h1 className="confirm-title">Your order is confirmed.</h1>
          <p className="confirm-lead">
            We&apos;ve received your AMOONS order
            {location.state?.orderId ? ` · ${location.state.orderId}` : ''}.
          </p>

          <div className="confirm-meta">
            <p>
              <span>Order ID</span>
              <strong>{order.id}</strong>
            </p>
            <p>
              <span>Type</span>
              <strong>{order.fulfillment || 'Delivery'}</strong>
            </p>
            <p>
              <span>Payment</span>
              <strong>
                {order.paymentMethod || order.customer?.paymentMethod || '—'}
              </strong>
            </p>
            <p>
              <span>Placed</span>
              <strong>{placedAt}</strong>
            </p>
          </div>

          {order.redeemedPoints ||
          order.loyaltyPointsAwarded ||
          order.loyaltyPointsPending ? (
            <p className="confirm-rewards">
              {order.redeemedPoints
                ? `Redeemed ${order.redeemedPoints} pts (−${
                    order.discountPercent || 0
                  }%). `
                : ''}
              {order.loyaltyPointsAwarded
                ? `Earned ${order.loyaltyPointsAwarded} pts. `
                : order.loyaltyPointsPending
                  ? `You'll earn ${order.loyaltyPointsPending} pts when this order is completed. `
                  : ''}
              {order.loyaltyPointsBalance != null
                ? `Current balance: ${order.loyaltyPointsBalance} pts.`
                : ''}
            </p>
          ) : null}

          <div className="confirm-grid">
            <div>
              <h2>
                {order.fulfillment === 'Pick-Up'
                  ? 'Pick-Up details'
                  : 'Delivery details'}
              </h2>
              <p>{order.customer.fullName}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.address}</p>
              {order.customer.email ? <p>{order.customer.email}</p> : null}
              {order.customer.notes ? (
                <p className="confirm-notes">Notes: {order.customer.notes}</p>
              ) : null}
            </div>

            <div>
              <h2>Items</h2>
              <ul className="confirm-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </li>
                ))}
              </ul>
              <div className="bag-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(order.subtotal)}</strong>
              </div>
              {order.discountAmount ? (
                <div className="bag-summary-row">
                  <span>Discount</span>
                  <strong>−{formatPrice(order.discountAmount)}</strong>
                </div>
              ) : null}
              {order.taxAmount != null ? (
                <div className="bag-summary-row">
                  <span>Tax</span>
                  <strong>{formatPrice(order.taxAmount)}</strong>
                </div>
              ) : null}
              {order.deliveryFee != null ? (
                <div className="bag-summary-row">
                  <span>Delivery</span>
                  <strong>{formatPrice(order.deliveryFee)}</strong>
                </div>
              ) : null}
              <div className="bag-summary-row bag-summary-row--total">
                <span>Payable</span>
                <strong>{formatPrice(orderTotal)}</strong>
              </div>
            </div>
          </div>

          <div className="confirm-actions">
            <Link to="/menu" className="hero-btn hero-btn-primary">
              Order again
            </Link>
            <Link to="/" className="hero-btn hero-btn-secondary">
              Back home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default OrderConfirmation;
