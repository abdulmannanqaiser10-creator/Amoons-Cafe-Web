import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchCustomerMe, registerCustomer } from '../api/websiteCustomer';
import { eligibleRewardTiers, REWARD_TIERS } from '../config/delivery';

const CustomerContext = createContext(null);
const TOKEN_KEY = 'amoons-customer-token-v1';
const PROFILE_KEY = 'amoons-customer-profile-v1';

function loadToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CustomerProvider({ children }) {
  const [token, setToken] = useState(() => loadToken());
  const [customer, setCustomer] = useState(() => loadProfile());
  const [authOpen, setAuthOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState('rewards');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persist = useCallback((nextToken, nextCustomer) => {
    setToken(nextToken || '');
    setCustomer(nextCustomer || null);
    try {
      if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
      else localStorage.removeItem(TOKEN_KEY);
      if (nextCustomer)
        localStorage.setItem(PROFILE_KEY, JSON.stringify(nextCustomer));
      else localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    setError('');
    try {
      const result = await fetchCustomerMe(token);
      persist(token, result.customer);
      return result.customer;
    } catch (problem) {
      persist('', null);
      setError(problem.message || 'Session expired.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, persist]);

  useEffect(() => {
    if (token) refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openAuth = useCallback((intent = 'rewards') => {
    setAuthIntent(intent);
    setError('');
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setError('');
  }, []);

  const register = useCallback(
    async ({ phone, name }) => {
      setLoading(true);
      setError('');
      try {
        const result = await registerCustomer({ phone, name });
        persist(result.token, result.customer);
        setAuthOpen(false);
        return result;
      } catch (problem) {
        setError(problem.message || 'Could not register for rewards.');
        throw problem;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist('', null);
  }, [persist]);

  const applyServerCustomer = useCallback(
    (next) => {
      if (!next) return;
      persist(token, { ...customer, ...next });
    },
    [persist, token, customer]
  );

  const points = customer?.points || 0;
  const eligible = useMemo(() => eligibleRewardTiers(points), [points]);

  const value = useMemo(
    () => ({
      token,
      customer,
      isLoggedIn: Boolean(token && customer),
      points,
      eligibleRewards: eligible,
      rewardTiers: customer?.rewardTiers || REWARD_TIERS,
      authOpen,
      authIntent,
      openAuth,
      closeAuth,
      register,
      refresh,
      logout,
      loading,
      error,
      setError,
      applyServerCustomer,
    }),
    [
      token,
      customer,
      points,
      eligible,
      authOpen,
      authIntent,
      openAuth,
      closeAuth,
      register,
      refresh,
      logout,
      loading,
      error,
      applyServerCustomer,
    ]
  );

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider');
  return ctx;
}
