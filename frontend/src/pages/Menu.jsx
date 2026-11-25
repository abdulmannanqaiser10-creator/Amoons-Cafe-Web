import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Menu() {
  const { itemCount } = useCart();

  return (
    <div className="amoons-page min-h-screen bg-[var(--color-bg)]">
      <Header bagCount={itemCount} />
      <MenuSection mode="full" />
      <Footer />
    </div>
  );
}

export default Menu;
