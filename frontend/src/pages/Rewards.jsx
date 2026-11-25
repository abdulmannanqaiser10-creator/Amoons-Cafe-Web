import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { fetchCustomerRewards } from '../api/websiteCustomer';
import { REWARD_TIERS } from '../config/delivery';
import { formatPrice } from '../data/menu';
import { useCustomer } from '../context/CustomerContext';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function reasonLabel(reason) {
  if (reason === 'Earn') return 'Points earned';
  if (reason === 'Redeem') return 'Points redeemed';
  if (reason === 'Adjustment') return 'Adjustment';
  return reason || 'Activity';
}

function Rewards() {
  const { isLoggedIn, token, customer, points, openAuth, refresh, logout } =
    useCustomer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [tiers, setTiers] = useState(REWARD_TIERS);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setHistory([]);
      setOrders([]);
      setSummary(null);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        await refresh();
        const result = await fetchCustomerRewards(token);
        if (cancelled) return;
        setHistory(Array.isArray(result.history) ? result.history : []);
        setOrders(Array.isArray(result.orders) ? result.orders : []);
        setTiers(result.rewardTiers || REWARD_TIERS);

        if (result.summary) {
          setSummary(result.summary);
        } else {
          const earned = (result.history || [])
            .filter((row) => Number(row.points) > 0)
            .reduce((sum, row) => sum + Number(row.points || 0), 0);
          const redeemed = (result.history || [])
            .filter((row) => Number(row.points) < 0)
            .reduce((sum, row) => sum + Math.abs(Number(row.points || 0)), 0);
          setSummary({
            pointsEarned: earned,
            pointsRedeemed: redeemed,
            availableBalance: result.customer?.points ?? points,
            totalOrders: (result.orders || []).length,
          });
        }
      } catch (problem) {
        if (!cancelled) {
          setError(problem.message || 'Could not load rewards details.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, token, refresh, points]);

  const displaySummary = useMemo(
    () =>
      summary || {
        pointsEarned: 0,
        pointsRedeemed: 0,
        availableBalance: points || 0,
        totalOrders: 0,
      },
    [summary, points]
  );

  return (
    <PageShell>
      <section className="info-page rewards-page">
        <div className="rewards-panel">
          <header className="rewards-head">
            <p className="info-label">AMOONS REWARDS</p>
            <h1 className="info-heading">Your rewards dashboard</h1>
            <p className="info-lead rewards-lead">
              Track earned points, redemptions, and every order linked to your
              rewards account.
            </p>
          </header>

          {!isLoggedIn ? (
            <div className="rewards-guest">
              <p>
                Sign in with your name and mobile number to view your complete
                rewards history and order activity.
              </p>
              <button
                type="button"
                className="hero-btn hero-btn-primary"
                onClick={() => openAuth('rewards')}
              >
                Join / Sign in to Rewards
              </button>
              <Link to="/menu" className="rewards-secondary-link">
                Continue browsing the menu
              </Link>
            </div>
          ) : (
            <>
              <div className="rewards-profile">
                <div>
                  <p className="rewards-profile-label">Member</p>
                  <p className="rewards-profile-name">
                    {customer?.name || 'AMOONS guest'}
                  </p>
                  <p className="rewards-profile-phone">{customer?.phone}</p>
                </div>
                <button
                  type="button"
                  className="rewards-logout"
                  onClick={() => logout()}
                >
                  Sign out
                </button>
              </div>

              <div className="rewards-stats">
                <article className="rewards-stat">
                  <p className="rewards-stat-label">Total earned</p>
                  <p className="rewards-stat-value">
                    {displaySummary.pointsEarned}
                  </p>
                  <p className="rewards-stat-note">Points collected</p>
                </article>
                <article className="rewards-stat">
                  <p className="rewards-stat-label">Points redeemed</p>
                  <p className="rewards-stat-value">
                    {displaySummary.pointsRedeemed}
                  </p>
                  <p className="rewards-stat-note">Used for discounts</p>
                </article>
                <article className="rewards-stat rewards-stat--accent">
                  <p className="rewards-stat-label">Available balance</p>
                  <p className="rewards-stat-value">
                    {displaySummary.availableBalance}
                  </p>
                  <p className="rewards-stat-note">Ready to redeem</p>
                </article>
                <article className="rewards-stat">
                  <p className="rewards-stat-label">Total orders</p>
                  <p className="rewards-stat-value">
                    {displaySummary.totalOrders}
                  </p>
                  <p className="rewards-stat-note">Linked to this account</p>
                </article>
              </div>

              <div className="rewards-tiers">
                <h2 className="rewards-section-title">Redemption tiers</h2>
                <div className="rewards-tier-grid">
                  {tiers.map((tier) => {
                    const available =
                      displaySummary.availableBalance >= tier.points;
                    return (
                      <div
                        key={tier.points}
                        className={`rewards-tier${
                          available ? ' is-available' : ''
                        }`}
                      >
                        <strong>{tier.points} pts</strong>
                        <span>{tier.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rewards-history">
                <div className="rewards-history-head">
                  <h2 className="rewards-section-title">Points activity</h2>
                  {loading ? (
                    <span className="rewards-history-status">Refreshing…</span>
                  ) : null}
                </div>

                {error ? (
                  <p className="ot-error" role="alert">
                    {error}
                  </p>
                ) : null}

                {!loading && history.length === 0 ? (
                  <div className="rewards-empty">
                    <p>No points activity yet.</p>
                    <p>Complete an order to start earning rewards.</p>
                  </div>
                ) : (
                  <ul className="rewards-history-list">
                    {history.map((entry) => {
                      const pts = Number(entry.points) || 0;
                      const earned = pts > 0;
                      return (
                        <li key={entry.id} className="rewards-history-item">
                          <div className="rewards-history-main">
                            <p className="rewards-history-reason">
                              {reasonLabel(entry.reason)}
                            </p>
                            <p className="rewards-history-meta">
                              {formatDate(entry.createdAt)}
                              {entry.orderNumber
                                ? ` · Order ${entry.orderNumber}`
                                : ''}
                            </p>
                            {entry.note ? (
                              <p className="rewards-history-note">{entry.note}</p>
                            ) : null}
                          </div>
                          <p
                            className={`rewards-history-points${
                              earned ? ' is-earn' : ' is-redeem'
                            }`}
                          >
                            {earned ? `+${pts}` : pts} pts
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="rewards-orders">
                <h2 className="rewards-section-title">Order history</h2>
                {!loading && orders.length === 0 ? (
                  <div className="rewards-empty">
                    <p>No orders found for this rewards account yet.</p>
                    <Link to="/menu" className="hero-btn hero-btn-primary">
                      Browse the menu
                    </Link>
                  </div>
                ) : (
                  <ul className="rewards-order-list">
                    {orders.map((order) => (
                      <li key={order.id} className="rewards-order-item">
                        <div className="rewards-order-top">
                          <div>
                            <p className="rewards-order-number">
                              {order.orderNumber}
                            </p>
                            <p className="rewards-history-meta">
                              {formatDate(order.createdAt)} · {order.channel} ·{' '}
                              {order.status}
                            </p>
                          </div>
                          <p className="rewards-order-total">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                        {order.items?.length ? (
                          <ul className="rewards-order-items">
                            {order.items.map((item, index) => (
                              <li key={`${order.id}-${index}`}>
                                {item.quantity}× {item.name}
                                <span>{formatPrice(item.lineTotal)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <p className="rewards-history-meta">
                          Payment: {order.paymentMethod || '—'} ·{' '}
                          {order.paymentStatus || '—'}
                          {order.discountAmount
                            ? ` · Discount ${formatPrice(order.discountAmount)}`
                            : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default Rewards;
