import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import VisitSection from '../components/VisitSection';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Home() {
  const { itemCount, addItem } = useCart();
  const location = useLocation();

  useEffect(() => {
    const target =
      location.hash || (location.pathname === '/menu' ? '#menu' : '');

    if (!target) return;

    const id = target.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  return (
    <div className="amoons-page min-h-screen bg-[var(--color-bg)]">
      <Header bagCount={itemCount} />
      <Hero />
      <MenuSection onAddToCart={addItem} />
      <VisitSection />
      <Footer />
    </div>
  );
}

export default Home;
