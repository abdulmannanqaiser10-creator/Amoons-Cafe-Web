import { ADDRESS_SINGLE } from './contact';

export const FULFILLMENT = {
  DELIVERY: 'Delivery',
  PICKUP: 'Pick-Up',
};

export const PICKUP_LOCATION = {
  title: 'AMOONS',
  line: 'DHA Phase 8, Karachi, Pakistan',
  detail: ADDRESS_SINGLE,
};

function area(id, label, fee = 200, coords = null) {
  return { id, label, fee, coords };
}

/** City → areas with delivery fee (PKR) */
export const DELIVERY_CITIES = [
  {
    id: 'karachi',
    label: 'Karachi',
    areas: [
      area('dha-all-phases', 'DHA All Phases', 150, { lat: 24.8125, lng: 67.065 }),
      area('clifton-all-blocks', 'Clifton All Blocks', 200, { lat: 24.813, lng: 67.028 }),
      area('civil-lines', 'Civil Lines', 200, { lat: 24.848, lng: 67.018 }),
      area('emaar', 'Emaar', 200, { lat: 24.802, lng: 67.078 }),
    ],
  },
];

export function findArea(cityId, areaId) {
  const city = DELIVERY_CITIES.find((item) => item.id === cityId);
  if (!city) return null;
  const areaMatch = city.areas.find((item) => item.id === areaId);
  if (!areaMatch) return null;
  return { city, area: areaMatch, fee: areaMatch.fee };
}

function haversineKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Nearest delivery area for browser geolocation coords */
export function nearestArea(lat, lng) {
  const city = DELIVERY_CITIES[0];
  if (!city) return null;
  let best = null;
  let bestDist = Infinity;
  for (const item of city.areas) {
    if (!item.coords) continue;
    const dist = haversineKm({ lat, lng }, item.coords);
    if (dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  if (!best) return null;
  return { city, area: best, fee: best.fee, distanceKm: bestDist };
}

export const REWARD_TIERS = [
  { points: 10, discountPercent: 5, label: '5% off' },
  { points: 20, discountPercent: 10, label: '10% off' },
  { points: 50, discountPercent: 20, label: '20% off' },
];

export const POINTS_PER_COMPLETED_ORDER = 10;

export function eligibleRewardTiers(balance) {
  const points = Math.max(0, Math.trunc(Number(balance) || 0));
  return REWARD_TIERS.filter((tier) => points >= tier.points);
}
