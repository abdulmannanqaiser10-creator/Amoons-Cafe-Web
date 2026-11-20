import PageShell from '../components/PageShell';
import WhatsAppCta from '../components/WhatsAppCta';
import {
  HOURS_DISPLAY,
  PHONE_DISPLAY,
  PHONE_TEL,
  RESERVATION_WHATSAPP_URL,
} from '../config/contact';

function Reservations() {
  return (
    <PageShell>
      <section className="info-page">
        <div className="info-panel info-panel--reservations">
          <p className="info-label">MAKE TIME FOR AMOONS</p>
          <h1 className="info-heading">We’d love to welcome you.</h1>
          <p className="info-lead">
            Planning a café visit? Send us your preferred date, time and group
            size on WhatsApp. Our team will reply to confirm availability.
          </p>

          <div className="info-card">
            <h2 className="info-card-title">
              To help us check availability, include:
            </h2>
            <ul className="info-list">
              <li>Your name and preferred contact number</li>
              <li>Date and approximate arrival time</li>
              <li>Number of guests</li>
              <li>Any seating or occasion notes</li>
            </ul>
          </div>

          <p className="info-disclaimer">
            A reservation is not confirmed until AMOONS replies. Please contact
            us directly about accessibility needs or special arrangements.
          </p>

          <WhatsAppCta href={RESERVATION_WHATSAPP_URL} className="info-wa-btn">
            Request a table on WhatsApp →
          </WhatsAppCta>

          <div className="info-contact-block">
            <a href={PHONE_TEL} className="info-phone">
              Call {PHONE_DISPLAY}
            </a>
            <p>{HOURS_DISPLAY}</p>
            <p>Shop 3, Building 54C, DHA Phase 8 Zone A, Karachi</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default Reservations;
