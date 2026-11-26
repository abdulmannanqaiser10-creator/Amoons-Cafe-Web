const POS_API_URL = (
  import.meta.env.VITE_POS_API_URL || 'https://amoonssoft.vercel.app/api'
).replace(/\/$/, '');

const WEBSITE_ORDER_KEY = String(
  import.meta.env.VITE_WEBSITE_ORDER_KEY || ''
).trim();

export async function fetchWebsiteMenu() {
  const response = await fetch(`${POS_API_URL}/website/menu`, {
    headers: {
      'Content-Type': 'application/json',
      'x-website-key': WEBSITE_ORDER_KEY,
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Could not load menu (${response.status}).`);
  }

  return data;
}
