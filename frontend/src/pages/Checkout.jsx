import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import BankTransferModal from '../components/BankTransferModal';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { useOrderType } from '../context/OrderTypeContext';
import { formatPrice } from '../data/menu';

function Checkout() {
  const {
    items,
    subtotal,
    discountAmount,
    discountPercent,
    redeemedPoints,
    taxAmount,
    deliveryFee,
    total,
    placeOrder,
    streetAddress,
  } = useCart();
  const { customer, isLoggedIn, openAuth } = useCustomer();
  const {
    fulfillment,
    isDelivery,
    isPickup,
    deliveryLabel,
    reopen,
  } = useOrderType();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: customer?.name || '',
    phone: customer?.phone || '',
    address: streetAddress || '',
    email: customer?.email || '',
    notes: '',
    paymentMethod: 'Bank Transfer',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || customer?.name || '',
      phone: prev.phone || customer?.phone || '',
      email: prev.email || customer?.email || '',
      address: prev.address || streetAddress || '',
    }));
  }, [customer, streetAddress]);

  const lineItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        lineTotal: item.price * item.quantity,
      })),
    [items]
  );

  if (!fulfillment) {
    return <Navigate to="/" replace />;
  }

  if (items.length === 0 && !submitted) {
    return <Navigate to="/bag" replace />;
  }

  if (!isLoggedIn && !submitted) {
    return (
      <PageShell>
        <section className="checkout-page page-pad-x">
          <div className="checkout-gate">
            <p className="section-eyebrow">Checkout</p>
            <h1 className="section-title">Verify your mobile to continue</h1>
            <p className="section-lead">
              Register or sign in with your mobile number to place your order
              and use rewards.
            </p>
            <button
              type="button"
              className="hero-btn hero-btn-primary"
              onClick={() => openAuth('checkout')}
            >
              Verify mobile number
            </button>
            <Link to="/bag" className="bag-continue">
              Back to bag
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim()) {
      next.phone = 'Phone number is required.';
    } else if (!/^[\d\s+-]{8,}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number.';
    }
    if (isDelivery) {
      if (!form.address.trim() || form.address.trim().length < 8) {
        next.address = 'Please enter a complete delivery address.';
      }
    }
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      next.email = 'Enter a valid email or leave it blank.';
    }
    if (!['Cash', 'Card', 'Bank Transfer'].includes(form.paymentMethod)) {
      next.paymentMethod = 'Choose a payment method.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeConfirmedOrder = async (extra = {}) => {
    setSubmitting(true);
    setSubmitError('');

    try {
      const order = await placeOrder({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: isDelivery ? form.address.trim() : deliveryLabel,
        email: form.email.trim(),
        notes: form.notes.trim(),
        paymentMethod: form.paymentMethod,
        paymentReceipt: extra.paymentReceipt,
      });
      setSubmitted(true);
      setPaymentOpen(false);
      navigate('/order-confirmation', { state: { orderId: order.id } });
    } catch (error) {
      setSubmitError(
        error?.message || 'Could not place your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate() || submitting) return;

    if (form.paymentMethod === 'Bank Transfer') {
      setPaymentOpen(true);
      return;
    }

    await placeConfirmedOrder();
  };

  return (
    <PageShell>
      <section className="checkout-page page-pad-x">
        <div className="checkout-page-inner">
          <header className="bag-head">
            <p className="section-eyebrow">Checkout</p>
            <h1 className="section-title">Confirm your order</h1>
            <p className="section-lead">
              Review your {fulfillment.toLowerCase()} details and place your
              AMOONS order.
            </p>
            <button type="button" className="bag-fulfillment" onClick={reopen}>
              {fulfillment}
              {deliveryLabel ? ` · ${deliveryLabel}` : ''}
              <span>Change</span>
            </button>
          </header>

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={onSubmit} noValidate>
              <label className="checkout-field">
                <span>Customer Full Name *</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  autoComplete="name"
                  required
                />
                {errors.fullName && <em>{errors.fullName}</em>}
              </label>

              <label className="checkout-field">
                <span>Phone Number *</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  autoComplete="tel"
                  required
                />
                {errors.phone && <em>{errors.phone}</em>}
              </label>

              {isDelivery ? (
                <label className="checkout-field">
                  <span>Complete Delivery Address *</span>
                  <textarea
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={onChange}
                    autoComplete="street-address"
                    required
                  />
                  {errors.address && <em>{errors.address}</em>}
                </label>
              ) : (
                <div className="checkout-field">
                  <span>Pick-Up location</span>
                  <p className="checkout-pickup">{deliveryLabel}</p>
                </div>
              )}

              <label className="checkout-field">
                <span>Email (optional)</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  autoComplete="email"
                />
                {errors.email && <em>{errors.email}</em>}
              </label>

              <fieldset className="checkout-field checkout-payment">
                <legend>Payment method *</legend>
                <div className="checkout-payment-options">
                  <label className="checkout-payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Bank Transfer"
                      checked={form.paymentMethod === 'Bank Transfer'}
                      onChange={onChange}
                    />
                    <span>Bank Transfer</span>
                  </label>
                  <label className="checkout-payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={form.paymentMethod === 'Cash'}
                      onChange={onChange}
                    />
                    <span>Cash</span>
                  </label>
                  <label className="checkout-payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={form.paymentMethod === 'Card'}
                      onChange={onChange}
                    />
                    <span>Card</span>
                  </label>
                </div>
                {errors.paymentMethod && <em>{errors.paymentMethod}</em>}
              </fieldset>

              <label className="checkout-field">
                <span>Order Notes (optional)</span>
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={onChange}
                  placeholder="Allergies, gate codes, preferred arrival window…"
                />
              </label>

              {submitError ? (
                <p className="checkout-submit-error" role="alert">
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                className="hero-btn hero-btn-primary checkout-submit"
                disabled={submitting}
              >
                {submitting ? 'Placing order…' : 'Confirm Your Order'}
              </button>
              <Link to="/bag" className="bag-continue">
                Back to bag
              </Link>
            </form>

            <aside className="bag-summary checkout-summary">
              <h2>Order summary</h2>
              <ul className="checkout-summary-list">
                {lineItems.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </li>
                ))}
              </ul>
              <div className="bag-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              {discountAmount > 0 ? (
                <div className="bag-summary-row">
                  <span>
                    Redeemed {redeemedPoints} pts ({discountPercent}%)
                  </span>
                  <strong>−{formatPrice(discountAmount)}</strong>
                </div>
              ) : null}
              <div className="bag-summary-row">
                <span>Tax (16%)</span>
                <strong>{formatPrice(taxAmount)}</strong>
              </div>
              <div className="bag-summary-row">
                <span>{isPickup ? 'Pick-Up' : 'Delivery'}</span>
                <strong>{formatPrice(isPickup ? 0 : deliveryFee)}</strong>
              </div>
              <div className="bag-summary-row bag-summary-row--total">
                <span>Payable</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <BankTransferModal
        open={paymentOpen}
        total={total}
        submitting={submitting}
        onClose={() => setPaymentOpen(false)}
        onConfirm={placeConfirmedOrder}
      />
    </PageShell>
  );
}

export default Checkout;
