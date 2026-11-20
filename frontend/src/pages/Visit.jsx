import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import {
  ADDRESS_LINES,
  MAPS_DIRECTIONS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  VISIT_WHATSAPP_URL,
} from '../config/contact';

function Visit() {
  return (
    <PageShell>
      <section className="info-page">
        <div className="info-panel info-panel--visit">
          <header className="visit-head">
            <p className="info-label">COME FIND US</p>
            <h1 className="info-heading visit-heading">
              A little pause, a little sweetness.
            </h1>
            <p className="visit-lead">
              Visit AMOONS for thoughtful desserts, café favourites and a
              relaxed moment in DHA Phase 8.
            </p>
          </header>

          <div className="visit-cards">
            <article className="visit-card">
              <h2 className="visit-card-label">FIND THE CAFÉ</h2>
              <div className="visit-card-body">
                {ADDRESS_LINES.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="info-text-link"
              >
                Get directions ↗
              </a>
            </article>

            <article className="visit-card">
              <h2 className="visit-card-label">OPENING HOURS</h2>
              <p className="visit-hours-title">Every day</p>
              <p className="visit-card-body">9:00 AM – 2:00 AM</p>
              <p className="visit-card-meta">Pakistan Standard Time</p>
              <p className="visit-card-meta">
                Pickup and delivery are available.
              </p>
            </article>

            <article className="visit-card">
              <h2 className="visit-card-label">SPEAK WITH US</h2>
              <p className="visit-card-body">
                Need help with an order or your delivery area? We&apos;re happy
                to help.
              </p>
              <a href={PHONE_TEL} className="info-text-link">
                Call {PHONE_DISPLAY.replace('-', ' ')}
              </a>
              <a
                href={VISIT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="info-text-link"
              >
                WhatsApp AMOONS ↗
              </a>
            </article>
          </div>

          <div className="visit-cta-banner">
            <p>
              Ready for something lovely?{' '}
              <Link to="/menu" className="visit-cta-link">
                Explore the menu →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default Visit;
