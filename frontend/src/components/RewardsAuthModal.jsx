import { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';

function RewardsAuthModal() {
  const {
    authOpen,
    closeAuth,
    register,
    loading,
    error,
    setError,
  } = useCustomer();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!authOpen) {
      setName('');
      setPhone('');
      setError('');
    }
  }, [authOpen, setError]);

  if (!authOpen) return null;

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile number.');
      return;
    }
    try {
      await register({ phone: phone.trim(), name: name.trim() });
    } catch {
      /* error stored in context */
    }
  };

  return (
    <div
      className="ot-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Rewards registration"
    >
      <div className="ot-modal rw-modal">
        <header className="rw-head">
          <p className="ot-brand-mark font-serif">AMOONS</p>
          <p className="rw-eyebrow">Rewards</p>
          <h2 className="rw-title">Join AMOONS Rewards</h2>
          <p className="rw-lead">
            Enter your name and mobile number to earn points on every completed
            order. Existing members keep their balance.
          </p>
        </header>

        <form className="ot-form rw-form" onSubmit={onSubmit}>
          <label className="ot-field">
            <span>Full Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="Your name"
              required
            />
          </label>
          <label className="ot-field">
            <span>Mobile Number</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              placeholder="03XX XXXXXXX"
              autoComplete="tel"
              required
            />
          </label>
          {error ? (
            <p className="ot-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="rw-actions">
            <button
              type="button"
              className="hero-btn hero-btn-secondary"
              onClick={closeAuth}
              disabled={loading}
            >
              Not now
            </button>
            <button
              type="submit"
              className="hero-btn hero-btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RewardsAuthModal;
