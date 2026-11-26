import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { OrderTypeProvider } from './context/OrderTypeContext';
import { CustomerProvider } from './context/CustomerContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OrderTypeProvider>
      <CustomerProvider>
        <CartProvider>
          <MenuProvider>
            <App />
          </MenuProvider>
        </CartProvider>
      </CustomerProvider>
    </OrderTypeProvider>
  </React.StrictMode>
);
