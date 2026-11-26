import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

function CartToast() {
  const { toastMessage, toastToken, clearToast } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toastMessage || !toastToken) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 2200);
    const clear = window.setTimeout(() => clearToast(), 2600);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(clear);
    };
  }, [toastMessage, toastToken, clearToast]);

  if (!toastMessage) return null;

  return (
    <div
      className={`cart-toast${visible ? ' is-visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="cart-toast-icon" aria-hidden="true">
        ✓
      </span>
      <p>{toastMessage}</p>
    </div>
  );
}

export default CartToast;
