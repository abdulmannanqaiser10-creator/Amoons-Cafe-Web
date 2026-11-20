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

function area(id, label, fee = 200) {
  return { id, label, fee };
}

/** City → areas with delivery fee (PKR) */
export const DELIVERY_CITIES = [
  {
    id: 'karachi',
    label: 'Karachi',
    areas: [
      area('dha-all-phases', 'DHA All Phases', 150),
      area('clifton-all-blocks', 'Clifton All Blocks', 200),
      area('civil-lines', 'Civil Lines'),
      area('emaar', 'Emaar'),
      area('jinnah-hospital', 'Jinnah Hospital'),
      area('lalazar', 'Lalazar'),
      area('kashif-centre', 'Kashif Centre'),
      area('hotel-mehran', 'Hotel Mehran'),
      area('shireen-jinnah-colony', 'Shireen Jinnah Colony'),
      area('ii-chundrigar-road', 'I.I. Chundrigar Road'),
      area('lucky-star', 'Lucky Star'),
      area('faisal-house', 'Faisal House'),
      area('mehmoodabad', 'Mehmoodabad'),
      area('sindhi-muslim', 'Sindhi Muslim'),
      area('pechs', 'PECHS'),
      area('kashmir-road', 'Kashmir Road'),
      area('jamshed-road', 'Jamshed Road'),
      area('garden-east', 'Garden East'),
      area('bahadurabad', 'Bahadurabad'),
      area('sharfabad', 'Sharfabad'),
      area('muhammad-ali-society', 'Muhammad Ali Society'),
      area('kda-scheme-1', 'KDA Scheme 1'),
      area('shahrah-e-faisal-karsaz', 'Shahrah-e-Faisal up to Karsaz'),
      area('kharadar', 'Kharadar'),
      area('west-wharf', 'West Wharf'),
      area('korangi', 'Korangi', 250),
      area('nhs-karsaz', 'NHS Karsaz'),
      area('aga-khan-hospital', 'Aga Khan Hospital'),
      area('liaquat-national-hospital', 'Liaquat National Hospital'),
      area('gulshan-e-jamal', 'Gulshan-e-Jamal', 250),
      area('garden-west', 'Garden West'),
      area('askari-4', 'Askari 4'),
      area('pib-colony', 'PIB Colony'),
      area('gulshan-e-iqbal', 'Gulshan-e-Iqbal', 250),
      area('gulistan-e-johar', 'Gulistan-e-Johar', 250),
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
