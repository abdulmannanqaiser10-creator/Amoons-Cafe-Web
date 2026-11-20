/** Published café phone shown across contact pages */
export const PHONE_DISPLAY = '0348-8089004';
export const PHONE_TEL = 'tel:03488089004';

export const ADDRESS_LINES = [
  'Shop 3, Building 54C',
  'DHA Phase 8 Zone A',
  'Zulfiqar & Al Murtaza Commercial Area',
  'Karachi 75500, Pakistan',
];

export const ADDRESS_SINGLE =
  'Shop 3, Building 54C, DHA Phase 8 Zone A, Karachi';

export const HOURS_DISPLAY = 'Daily · 9:00 AM–2:00 AM';

/** AMOONS WhatsApp business number (Pakistan, with country code) */
export const WHATSAPP_NUMBER = '923488089004';

export function buildWhatsAppUrl(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const RESERVATION_WHATSAPP_URL = buildWhatsAppUrl(
  `Hello AMOONS,

I would like to request a table reservation.

Name:
Contact number:
Preferred date:
Approximate arrival time:
Number of guests:
Seating / occasion notes:

Thank you.`
);

export const CATERING_WHATSAPP_URL =
  'https://wa.me/923488089004?text=Hello%20AMOONS%2C%20I%20would%20like%20to%20discuss%20a%20catering%20enquiry.';

export const VISIT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Shop 3, Building 54C, DHA Phase 8 Zone A, Zulfiqar & Al Murtaza Commercial Area, Karachi 75500, Pakistan'
)}`;
