import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DELIVERY_CITIES,
  FULFILLMENT,
  PICKUP_LOCATION,
  findArea,
} from '../config/delivery';

const OrderTypeContext = createContext(null);
const STORAGE_KEY = 'amoons-order-type-v1';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function OrderTypeProvider({ children }) {
  const saved = loadSaved();
  const [open, setOpen] = useState(!saved?.fulfillment);
  const [fulfillment, setFulfillment] = useState(
    saved?.fulfillment || null
  );
  const [cityId, setCityId] = useState(saved?.cityId || DELIVERY_CITIES[0]?.id || '');
  const [areaId, setAreaId] = useState(saved?.areaId || '');
  const [streetAddress, setStreetAddress] = useState(saved?.streetAddress || '');

  useEffect(() => {
    if (!fulfillment) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        fulfillment,
        cityId,
        areaId,
        streetAddress,
      })
    );
  }, [fulfillment, cityId, areaId, streetAddress]);

  const selected = useMemo(
    () => (fulfillment === FULFILLMENT.DELIVERY ? findArea(cityId, areaId) : null),
    [fulfillment, cityId, areaId]
  );

  const deliveryFee =
    fulfillment === FULFILLMENT.DELIVERY ? selected?.fee || 0 : 0;

  const deliveryLabel = useMemo(() => {
    if (fulfillment === FULFILLMENT.PICKUP) {
      return `${PICKUP_LOCATION.title} · ${PICKUP_LOCATION.line}`;
    }
    if (!selected) return '';
    const street = streetAddress.trim();
    return street
      ? `${street}, ${selected.area.label}, ${selected.city.label}`
      : `${selected.area.label}, ${selected.city.label}`;
  }, [fulfillment, selected, streetAddress]);

  const confirmDelivery = useCallback(
    ({ city, area, address }) => {
      const match = findArea(city, area);
      if (!match) throw new Error('Select a valid delivery area.');
      if (!String(address || '').trim() || String(address).trim().length < 8) {
        throw new Error('Enter a complete street address.');
      }
      setFulfillment(FULFILLMENT.DELIVERY);
      setCityId(city);
      setAreaId(area);
      setStreetAddress(String(address).trim());
      setOpen(false);
    },
    []
  );

  const confirmPickup = useCallback(() => {
    setFulfillment(FULFILLMENT.PICKUP);
    setOpen(false);
  }, []);

  const reopen = useCallback(() => setOpen(true), []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      reopen,
      fulfillment,
      isDelivery: fulfillment === FULFILLMENT.DELIVERY,
      isPickup: fulfillment === FULFILLMENT.PICKUP,
      cityId,
      setCityId,
      areaId,
      setAreaId,
      streetAddress,
      setStreetAddress,
      selected,
      deliveryFee,
      deliveryLabel,
      pickupLocation: PICKUP_LOCATION,
      cities: DELIVERY_CITIES,
      confirmDelivery,
      confirmPickup,
    }),
    [
      open,
      reopen,
      fulfillment,
      cityId,
      areaId,
      streetAddress,
      selected,
      deliveryFee,
      deliveryLabel,
      confirmDelivery,
      confirmPickup,
    ]
  );

  return (
    <OrderTypeContext.Provider value={value}>
      {children}
    </OrderTypeContext.Provider>
  );
}

export function useOrderType() {
  const ctx = useContext(OrderTypeContext);
  if (!ctx) throw new Error('useOrderType must be used within OrderTypeProvider');
  return ctx;
}
