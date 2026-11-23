import Header from '../components/Header';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import VisitSection from '../components/VisitSection';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Home() {
  const { itemCount } = useCart();

  return (
    <div className="amoons-page min-h-screen bg-[var(--color-bg)]">
      <Header bagCount={itemCount} />
      <Hero />
      <MenuSection />
      <VisitSection />
      <Footer />
    </div>
  );
}

export default Home;
