import Header from './Header';
import Footer from './Footer';
import { useCart } from '../context/CartContext';

function PageShell({ children }) {
  const { itemCount } = useCart();

  return (
    <div className="amoons-page page-shell min-h-screen bg-white">
      <Header bagCount={itemCount} />
      <main className="page-shell-main">{children}</main>
      <Footer />
    </div>
  );
}

export default PageShell;
