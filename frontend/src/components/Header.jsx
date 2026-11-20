import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useOrderType } from '../context/OrderTypeContext';

const NAV_LINKS = [
  { to: '/menu', label: 'MENU' },
  { to: '/reservations', label: 'RESERVATIONS' },
  { to: '/catering', label: 'CATERING' },
  { to: '/visit', label: 'VISIT' },
];

function Header({ bagCount = 0 }) {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, points, openAuth, logout, customer } = useCustomer();
  const { reopen, fulfillment } = useOrderType();

  return (
    <header className="site-header">
      <div className="page-pad-x mx-auto flex h-[88px] sm:h-[96px] max-w-[1320px] items-center justify-between gap-6">
        <div className="flex shrink-0 flex-col items-center text-[var(--color-primary)]">
          <Link
            to="/"
            className="flex flex-col items-center"
            onClick={() => setOpen(false)}
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
              setOpen(false);
              reopen();
            }}
          >
            {fulfillment || 'Order type'}
          </button>
        </div>

        <nav className="hidden items-center gap-[22px] lg:gap-[28px] md:flex font-sans text-[12px] lg:text-[12.5px] font-bold tracking-[0.16em] text-[var(--color-primary)]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="whitespace-nowrap transition-opacity duration-200 hover:opacity-55"
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <button
              type="button"
              className="whitespace-nowrap transition-opacity duration-200 hover:opacity-55"
              onClick={() => logout()}
              title={customer?.name || 'Rewards'}
            >
              {points} PTS
            </button>
          ) : (
            <button
              type="button"
              className="whitespace-nowrap transition-opacity duration-200 hover:opacity-55"
              onClick={() => openAuth('rewards')}
            >
              REWARDS
            </button>
          )}

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
            <span className="font-sans text-[10px] font-bold tracking-[0.08em] text-[var(--color-primary)]">
              {points} PTS
            </span>
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
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={`block h-[1.5px] w-5 bg-[var(--color-primary)] transition ${
                open ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-[var(--color-primary)] transition ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-[var(--color-primary)] transition ${
                open ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="page-pad-x absolute inset-x-0 top-full z-40 flex flex-col gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)] py-5 shadow-sm md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-1 font-sans text-[13px] font-bold tracking-[0.14em] text-[var(--color-primary)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="py-1 text-left font-sans text-[13px] font-bold tracking-[0.14em] text-[var(--color-primary)]"
            onClick={() => {
              setOpen(false);
              reopen();
            }}
          >
            ORDER TYPE
          </button>
          <button
            type="button"
            className="py-1 text-left font-sans text-[13px] font-bold tracking-[0.14em] text-[var(--color-primary)]"
            onClick={() => {
              setOpen(false);
              if (isLoggedIn) logout();
              else openAuth('rewards');
            }}
          >
            {isLoggedIn ? `REWARDS · ${points} PTS` : 'REWARDS'}
          </button>
        </nav>
      )}
    </header>
  );
}

export default Header;
