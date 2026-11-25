import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import Catering from './pages/Catering';
import Visit from './pages/Visit';
import Bag from './pages/Bag';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Rewards from './pages/Rewards';
import OrderTypeModal from './components/OrderTypeModal';
import RewardsAuthModal from './components/RewardsAuthModal';
import ScrollToTop from './components/ScrollToTop';
import { useOrderType } from './context/OrderTypeContext';

function PickupRoute() {
  const navigate = useNavigate();
  const { confirmPickup } = useOrderType();

  useEffect(() => {
    confirmPickup();
    navigate('/menu', { replace: true });
  }, [confirmPickup, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/catering" element={<Catering />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/pickup" element={<PickupRoute />} />
        <Route path="/tiramisu" element={<Home />} />
      </Routes>
      <OrderTypeModal />
      <RewardsAuthModal />
    </BrowserRouter>
  );
}

export default App;
