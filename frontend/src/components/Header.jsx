import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useOrderType } from '../context/OrderTypeContext';

const HALF_LINKS = [
  { to: '/menu', label: 'MENU' },
  { to: '/reservations', label: 'RESERVATIONS' },
];

const FULL_LINKS = [
  { to: '/menu', label: 'Menu', hint: 'Order favourites' },
  { to: '/reservations', label: 'Reservations', hint: 'Book a table' },
  { to: '/catering', label: 'Catering', hint: 'Events & sharing' },
  { to: '/visit', label: 'Visit', hint: 'Find the café' },
  { to: '/rewards', label: 'Rewards', hint: 'Points & history' },
  { to: '/bag', label: 'Bag', hint: 'Your order' },
  { to: '/pickup', label: 'Pick-Up', hint: 'Collect in store' },
];

function Header({ bagCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, points, openAuth, customer } = useCustomer();
  const { reopen, fulfillment } = useOrderType();

  const isHome = location.pathname === '/' || location.pathname === '/menu';

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const goRewards = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    if (isLoggedIn) {
      navigate('/rewards');
      return;
    }
    openAuth('rewards');
    navigate('/rewards');
  };

  return (
    <header className="site-header">
      <div className="page-pad-x mx-auto flex h-[88px] sm:h-[96px] max-w-[1320px] items-center justify-between gap-6">
        <div className="flex shrink-0 flex-col items-center text-[var(--color-primary)]">
          <Link
            to="/"
            className="flex flex-col items-center"
            onClick={() => {
              setMobileOpen(false);
              setMenuOpen(false);
            }}
          >
            <span className="font-serif text-[34px] sm:text-[38px] lg:text-[40px] font-normal leading-[0.92] tracking-[-0.02em]">
              AMOONS
            </span>
            <span className="mt-[3px] font-sans text-[7px] font-light tracking-[0.26em] text-[var(--color-muted)]">
              EST. 2024
            </span>
          </Link>

          <button
            type="button"
            className="mt-[6px] rounded-full border border-[var(--color-border-soft)] px-[12px] py-[4.5px] font-sans text-[8px] font-normal leading-none tracking-[0.02em] text-[var(--color-primary)] transition-colors hover:bg-white/70"
            onClick={() => {
              setMobileOpen(false);
              setMenuOpen(false);
              reopen();
            }}
          >
            {fulfillment || 'Order type'}
          </button>
        </div>

        <nav
          className="hidden items-center gap-[18px] lg:gap-[24px] md:flex font-sans text-[12px] lg:text-[12.5px] font-bold tracking-[0.16em] text-[var(--color-primary)]"
          aria-label="Primary"
        >
          {(isHome
            ? HALF_LINKS
            : [
                ...HALF_LINKS,
                { to: '/catering', label: 'CATERING' },
                { to: '/visit', label: 'VISIT' },
              ]
          ).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="whitespace-nowrap transition-opacity duration-200 hover:opacity-55"
            >
              {link.label}
            </Link>
          ))}

          <div className="nav-menu-wrap" ref={menuRef}>
            <button
              type="button"
              className={`nav-menu-trigger${menuOpen ? ' is-open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="site-full-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              Menu
              <span aria-hidden="true">{menuOpen ? '▴' : '▾'}</span>
            </button>

            <div
              id="site-full-menu"
              className={`nav-menu-panel${menuOpen ? ' is-open' : ''}`}
              hidden={!menuOpen}
            >
              <div className="nav-menu-panel-inner">
                <p className="nav-menu-eyebrow">Explore AMOONS</p>
                <div className="nav-menu-grid">
                  {FULL_LINKS.map((link) => {
                    if (link.to === '/rewards') {
                      return (
                        <button
                          key={link.to}
                          type="button"
                          className="nav-menu-item"
                          onClick={goRewards}
                        >
                          <span className="nav-menu-item-label">{link.label}</span>
                          <span className="nav-menu-item-hint">
                            {isLoggedIn ? `${points} pts available` : link.hint}
                          </span>
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="nav-menu-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="nav-menu-item-label">{link.label}</span>
                        <span className="nav-menu-item-hint">{link.hint}</span>
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    className="nav-menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      reopen();
                    }}
                  >
                    <span className="nav-menu-item-label">Order type</span>
                    <span className="nav-menu-item-hint">
                      {fulfillment || 'Delivery or pick-up'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="whitespace-nowrap transition-opacity duration-200 hover:opacity-55"
            onClick={goRewards}
            title={customer?.name || 'Rewards'}
          >
            {isLoggedIn ? `${points} PTS` : 'REWARDS'}
          </button>

          <Link
            to="/bag"
            className="flex items-center gap-[9px] font-bold transition-opacity duration-200 hover:opacity-55"
            aria-label={`Shopping bag, ${bagCount} items`}
          >
            <span>BAG</span>
            <span className="flex h-[24px] min-w-[24px] px-1 items-center justify-center rounded-full bg-[var(--color-primary)] font-sans text-[10.5px] font-normal tracking-normal text-white leading-none">
              {bagCount}
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          {isLoggedIn ? (
            <button
              type="button"
              className="font-sans text-[10px] font-bold tracking-[0.08em] text-[var(--color-primary)]"
              onClick={goRewards}
            >
              {points} PTS
            </button>
          ) : null}
          <Link
            to="/bag"
            className="flex items-center gap-2 font-sans text-[11px] font-bold tracking-[0.14em] text-[var(--color-primary)]"
            aria-label={`Shopping bag, ${bagCount} items`}
          >
            BAG
            <span className="flex h-6 min-w-6 px-1 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-normal tracking-normal text-white">
              {bagCount}
            </span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span
              className={`block h-[1.5px] w-5 bg-[var(--color-primary)] transition ${
                mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-[var(--color-primary)] transition ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-[var(--color-primary)] transition ${
                mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="mobile-nav-panel page-pad-x md:hidden"
          aria-label="Mobile menu"
        >
          <div className="mobile-nav-grid">
            {FULL_LINKS.map((link) => {
              if (link.to === '/rewards') {
                return (
                  <button
                    key={link.to}
                    type="button"
                    className="mobile-nav-tile"
                    onClick={goRewards}
                  >
                    <span className="mobile-nav-tile-label">{link.label}</span>
                    <span className="mobile-nav-tile-hint">
                      {isLoggedIn ? `${points} pts` : link.hint}
                    </span>
                  </button>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="mobile-nav-tile"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="mobile-nav-tile-label">{link.label}</span>
                  <span className="mobile-nav-tile-hint">{link.hint}</span>
                </Link>
              );
            })}
            <button
              type="button"
              className="mobile-nav-tile"
              onClick={() => {
                setMobileOpen(false);
                reopen();
              }}
            >
              <span className="mobile-nav-tile-label">Order type</span>
              <span className="mobile-nav-tile-hint">
                {fulfillment || 'Choose now'}
              </span>
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
