const POS_API_URL = (
  import.meta.env.VITE_POS_API_URL || 'https://amoonssoft.vercel.app/api'
).replace(/\/$/, '');

const WEBSITE_ORDER_KEY = String(
  import.meta.env.VITE_WEBSITE_ORDER_KEY || ''
).trim();

function headers(customerToken) {
  const result = {
    'Content-Type': 'application/json',
    'x-website-key': WEBSITE_ORDER_KEY,
  };
  if (customerToken) result['x-customer-token'] = customerToken;
  return result;
}

async function parse(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  return data;
}

/** Register new customer or look up existing by mobile (no OTP). */
export async function registerCustomer({ phone, name }) {
  const response = await fetch(`${POS_API_URL}/website/customer/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ phone, name }),
  });
  return parse(response);
}

export async function fetchCustomerMe(token) {
  const response = await fetch(`${POS_API_URL}/website/customer/me`, {
    headers: headers(token),
  });
  return parse(response);
}

export async function fetchCustomerRewards(token) {
  const response = await fetch(`${POS_API_URL}/website/customer/rewards`, {
    headers: headers(token),
  });
  return parse(response);
}
