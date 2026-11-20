import Header from './Header';
import Footer from './Footer';
import { useCart } from '../context/CartContext';

function PageShell({ children }) {
  const { itemCount } = useCart();

  return (
    <div className="amoons-page min-h-screen bg-white">
      <Header bagCount={itemCount} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default PageShell;
