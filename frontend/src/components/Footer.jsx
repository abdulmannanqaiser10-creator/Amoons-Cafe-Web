import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer page-pad-x">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <p className="font-serif site-footer-logo">AMOONS</p>
          <p className="site-footer-tag">EST. 2024 · DHA PHASE 8, KARACHI</p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          <Link to="/menu">Menu</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/catering">Catering</Link>
          <Link to="/visit">Visit</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/pickup">Pick-Up</Link>
        </nav>

        <p className="site-footer-note">
          Specialty coffee & signature desserts — for slow moments.
        </p>

        <a
          href="https://lexcoresolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-credit"
        >
          Powered By Lexcore Solutions
        </a>
      </div>
    </footer>
  );
}

export default Footer;
