import { useEffect, useMemo, useState } from 'react';
import { useOrderType } from '../context/OrderTypeContext';
import { FULFILLMENT, nearestArea } from '../config/delivery';

function OrderTypeModal() {
  const {
    open,
    fulfillment,
    cities,
    cityId,
    setCityId,
    areaId,
    setAreaId,
    confirmDelivery,
    confirmPickup,
  } = useOrderType();

  const [mode, setMode] = useState(
    fulfillment === FULFILLMENT.PICKUP ? 'pickup' : 'delivery'
  );
  const [error, setError] = useState('');
  const [geoStatus, setGeoStatus] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(fulfillment === FULFILLMENT.PICKUP ? 'pickup' : 'delivery');
    setError('');
    setGeoStatus('');
    setGeoLoading(false);
  }, [open, fulfillment]);

  const city = useMemo(
    () => cities.find((item) => item.id === cityId) || cities[0],
    [cities, cityId]
  );
  const areas = city?.areas || [];

  if (!open) return null;

  const selectArea = (nextAreaId) => {
    setCityId(city?.id || cities[0]?.id || 'karachi');
    setAreaId(nextAreaId);
    setError('');
    setGeoStatus('');
  };

  const useCurrentLocation = () => {
    setError('');
    setGeoStatus('');

    if (!navigator.geolocation) {
      setGeoStatus('Location is not supported by this browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const match = nearestArea(
          position.coords.latitude,
          position.coords.longitude
        );
        if (!match) {
          setGeoStatus('Could not match your location. Please select manually.');
          return;
        }
        setCityId(match.city.id);
        setAreaId(match.area.id);
        setGeoStatus(`Selected ${match.area.label} based on your location.`);
      },
      (problem) => {
        setGeoLoading(false);
        if (problem?.code === 1) {
          setGeoStatus(
            'Location permission denied. Please allow access or select a location below.'
          );
          return;
        }
        if (problem?.code === 3) {
          setGeoStatus('Location request timed out. Please select a location below.');
          return;
        }
        setGeoStatus('Unable to detect your location. Please select a location below.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

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
        address: '',
      });
    } catch (problem) {
      setError(problem.message || 'Please complete your selection.');
    }
  };

  return (
    <div className="ot-overlay" role="dialog" aria-modal="true" aria-label="Order type">
      <div className="ot-modal ot-modal--premium">
        <header className="ot-brand">
          <p className="ot-brand-mark font-serif">AMOONS</p>
          <p className="ot-brand-sub">EST. 2024</p>
          <h2 className="ot-title">Select your order type</h2>
        </header>

        <div className="ot-choices ot-choices--buttons" role="group" aria-label="Order type">
          <button
            type="button"
            className={`ot-type-btn${mode === 'delivery' ? ' is-active' : ''}`}
            onClick={() => setMode('delivery')}
          >
            Delivery
          </button>
          <button
            type="button"
            className={`ot-type-btn${mode === 'pickup' ? ' is-active' : ''}`}
            onClick={() => setMode('pickup')}
          >
            Pick-up
          </button>
        </div>

        <div className="ot-location">
          <h3 className="ot-location-title">Select Your Location</h3>

          <button
            type="button"
            className="ot-geo-btn"
            onClick={useCurrentLocation}
            disabled={geoLoading}
          >
            {geoLoading ? 'Detecting location…' : 'Use Current Location'}
          </button>

          {geoStatus ? (
            <p
              className={`ot-geo-status${
                geoStatus.startsWith('Selected') ? ' is-success' : ' is-warn'
              }`}
              role="status"
            >
              {geoStatus}
            </p>
          ) : null}

          <div className="ot-area-grid" role="listbox" aria-label="Delivery locations">
            {areas.map((area) => {
              const selected = areaId === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`ot-area-btn${selected ? ' is-active' : ''}`}
                  onClick={() => selectArea(area.id)}
                >
                  {area.label}
                </button>
              );
            })}
          </div>
        </div>

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
