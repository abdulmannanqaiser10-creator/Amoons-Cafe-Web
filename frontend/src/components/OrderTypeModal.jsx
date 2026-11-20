import { useEffect, useMemo, useState } from 'react';
import { useOrderType } from '../context/OrderTypeContext';
import { FULFILLMENT } from '../config/delivery';

function OrderTypeModal() {
  const {
    open,
    fulfillment,
    cities,
    cityId,
    setCityId,
    areaId,
    setAreaId,
    streetAddress,
    setStreetAddress,
    pickupLocation,
    confirmDelivery,
    confirmPickup,
  } = useOrderType();

  const [mode, setMode] = useState(
    fulfillment === FULFILLMENT.PICKUP ? 'pickup' : 'delivery'
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setMode(fulfillment === FULFILLMENT.PICKUP ? 'pickup' : 'delivery');
    setError('');
  }, [open, fulfillment]);

  const city = useMemo(
    () => cities.find((item) => item.id === cityId) || cities[0],
    [cities, cityId]
  );
  const areas = city?.areas || [];

  if (!open) return null;

  const onConfirm = () => {
    setError('');
    try {
      if (mode === 'pickup') {
        confirmPickup();
        return;
      }
      confirmDelivery({
        city: cityId || city?.id,
        area: areaId,
        address: streetAddress,
      });
    } catch (problem) {
      setError(problem.message || 'Please complete your selection.');
    }
  };

  return (
    <div className="ot-overlay" role="dialog" aria-modal="true" aria-label="Order type">
      <div className="ot-modal">
        <header className="ot-head">
          <p className="ot-eyebrow">Welcome to AMOONS</p>
          <h2>How would you like your order?</h2>
          <p className="ot-lead">
            Choose delivery or pick-up before browsing the menu.
          </p>
        </header>

        <div className="ot-choices">
          <button
            type="button"
            className={`ot-choice${mode === 'delivery' ? ' is-active' : ''}`}
            onClick={() => setMode('delivery')}
          >
            <span className="ot-choice-label">Delivery</span>
            <span className="ot-choice-copy">
              We bring AMOONS to your door in selected areas.
            </span>
          </button>
          <button
            type="button"
            className={`ot-choice${mode === 'pickup' ? ' is-active' : ''}`}
            onClick={() => setMode('pickup')}
          >
            <span className="ot-choice-label">Pick-Up</span>
            <span className="ot-choice-copy">
              Collect from DHA Phase 8, Karachi, Pakistan.
            </span>
          </button>
        </div>

        {mode === 'delivery' ? (
          <div className="ot-form">
            <label className="ot-field">
              <span>City</span>
              <select
                value={cityId || city?.id || ''}
                onChange={(event) => {
                  setCityId(event.target.value);
                  setAreaId('');
                }}
              >
                {cities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="ot-field">
              <span>Area</span>
              <select
                value={areaId}
                onChange={(event) => setAreaId(event.target.value)}
              >
                <option value="">Select area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="ot-field">
              <span>Street address</span>
              <textarea
                rows={2}
                value={streetAddress}
                onChange={(event) => setStreetAddress(event.target.value)}
                placeholder="House / flat, street, landmark"
              />
            </label>
          </div>
        ) : (
          <div className="ot-pickup-card">
            <p className="ot-pickup-title">{pickupLocation.title}</p>
            <p>{pickupLocation.line}</p>
            <p className="ot-pickup-detail">{pickupLocation.detail}</p>
          </div>
        )}

        {error ? (
          <p className="ot-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="button" className="hero-btn hero-btn-primary ot-confirm" onClick={onConfirm}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default OrderTypeModal;
