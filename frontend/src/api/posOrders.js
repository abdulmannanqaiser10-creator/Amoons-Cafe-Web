const POS_API_URL = (
  import.meta.env.VITE_POS_API_URL || 'https://amoonssoft.vercel.app/api'
).replace(/\/$/, '');

const WEBSITE_ORDER_KEY = String(
  import.meta.env.VITE_WEBSITE_ORDER_KEY || ''
).trim();

/**
 * Submits a checkout basket to Soft-POS Order Management.
 */
export async function submitWebsiteOrder(payload, customerToken) {
  if (!WEBSITE_ORDER_KEY) {
    throw new Error(
      'Website order key is not configured. Set VITE_WEBSITE_ORDER_KEY.'
    );
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-website-key': WEBSITE_ORDER_KEY,
  };
  if (customerToken) headers['x-customer-token'] = customerToken;

  const response = await fetch(`${POS_API_URL}/website/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Could not send order to POS (${response.status}).`
    );
  }

  return data;
}
