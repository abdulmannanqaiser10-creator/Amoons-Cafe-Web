import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import {
  CATERING_WHATSAPP_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from '../config/contact';

function Catering() {
  return (
    <PageShell>
      <section className="info-page">
        <div className="info-panel info-panel--catering">
          <p className="info-label">GATHER WITH AMOONS</p>
          <h1 className="info-heading">Something sweet for your gathering.</h1>
          <p className="info-lead">
            Planning a gathering or a larger order? Speak with the AMOONS team
            about your catering requirements.
          </p>

          <h2 className="info-subhead">Tell us what you have in mind</h2>
          <ul className="info-list info-list--plain">
            <li>Your event date and preferred time</li>
            <li>Number of guests and the items you are interested in</li>
            <li>Pickup or delivery location</li>
            <li>Any dietary requirements or allergy questions</li>
          </ul>

          <p className="info-disclaimer">
            The team will confirm availability, pricing, lead time and
            fulfilment details directly. Sending an enquiry does not confirm a
            booking or order. Please discuss allergies with us before ordering.
          </p>

          <div className="info-inline-links">
            <a
              href={CATERING_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="info-text-link"
            >
              Enquire on WhatsApp ↗
            </a>
            <a href={PHONE_TEL} className="info-text-link">
              Call {PHONE_DISPLAY}
            </a>
          </div>

          <nav className="info-bottom-nav" aria-label="Related pages">
            <Link to="/menu">Browse the menu</Link>
            <Link to="/">About AMOONS</Link>
            <Link to="/visit">Location &amp; contact</Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}

export default Catering;
