import { Link } from 'react-router-dom';
import {
  ADDRESS_LINES,
  HOURS_DISPLAY,
  MAPS_DIRECTIONS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '../config/contact';

function VisitSection() {
  return (
    <section id="home-visit" className="home-invite page-pad-x scroll-mt-24">
      <div className="home-invite-inner">
        <div className="home-invite-intro">
          <h2 className="home-invite-title">Good coffee. Great company.</h2>
          <p className="home-invite-kicker">
            A little sweet. A little savoury. Always AMOONS.
          </p>
          <p className="home-invite-copy">
            Specialty coffee, signature tiramisu and comforting café favourites —
            made for slow mornings, late nights and everything in between at DHA
            Phase 8.
          </p>
          <Link to="/menu" className="hero-btn hero-btn-primary home-invite-cta">
            Order from the menu
          </Link>
        </div>

        <div className="home-invite-cards">
          <article className="home-invite-card">
            <p className="home-invite-card-label">Visit AMOONS</p>
            <div className="home-invite-card-body">
              {ADDRESS_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="home-invite-link"
            >
              Get directions ↗
            </a>
            <a href={PHONE_TEL} className="home-invite-link">
              Call {PHONE_DISPLAY}
            </a>
          </article>

          <article className="home-invite-card">
            <p className="home-invite-card-label">Stay a little longer</p>
            <p className="home-invite-hours-title">Opening hours</p>
            <p className="home-invite-card-body">{HOURS_DISPLAY}</p>
            <p className="home-invite-card-note">
              Pickup and dine-in available every day.
            </p>
            <div className="home-invite-card-actions">
              <Link to="/reservations" className="home-invite-btn" id="reservations">
                Reserve a table
              </Link>
              <Link to="/visit" className="home-invite-btn home-invite-btn--ghost">
                Plan your visit
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default VisitSection;
