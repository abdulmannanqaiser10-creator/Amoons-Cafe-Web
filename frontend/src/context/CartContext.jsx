import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { submitWebsiteOrder } from '../api/posOrders';
import { REWARD_TIERS } from '../config/delivery';
import { useCustomer } from './CustomerContext';
import { useOrderType } from './OrderTypeContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'amoons-cart-v1';
export const TAX_RATE = 0.16;

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

export function CartProvider({ children }) {
  const { token, customer, openAuth, applyServerCustomer } = useCustomer();
  const {
    fulfillment,
    isDelivery,
    deliveryFee,
    deliveryLabel,
    selected,
    streetAddress,
    cityId,
    areaId,
  } = useOrderType();

  const [items, setItems] = useState(() => loadCart());
  const [lastOrder, setLastOrder] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastToken, setToastToken] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const balance = customer?.points || 0;
    if (redeemPoints > balance) setRedeemPoints(0);
    const tier = REWARD_TIERS.find((item) => item.points === redeemPoints);
    if (redeemPoints && !tier) setRedeemPoints(0);
  }, [customer?.points, redeemPoints]);

  const clearToast = useCallback(() => setToastMessage(''), []);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.productId || undefined,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setToastMessage('Item successfully added to cart!');
    setToastToken((value) => value + 1);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.id !== id);
      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const increment = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrement = useCallback((id) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      roundMoney(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      ),
    [items]
  );

  const selectedTier = useMemo(
    () => REWARD_TIERS.find((tier) => tier.points === redeemPoints) || null,
    [redeemPoints]
  );

  const discountPercent = selectedTier?.discountPercent || 0;
  const discountAmount = useMemo(
    () =>
      selectedTier
        ? roundMoney((subtotal * selectedTier.discountPercent) / 100)
        : 0,
    [selectedTier, subtotal]
  );

  const afterDiscount = useMemo(
    () => roundMoney(Math.max(0, subtotal - discountAmount)),
    [subtotal, discountAmount]
  );

  const taxAmount = useMemo(
    () => roundMoney(afterDiscount * TAX_RATE),
    [afterDiscount]
  );

  const fee = isDelivery ? deliveryFee : 0;

  const total = useMemo(
    () => roundMoney(afterDiscount + taxAmount + fee),
    [afterDiscount, taxAmount, fee]
  );

  const selectRedeem = useCallback(
    (points) => {
      if (!token || !customer) {
        openAuth('rewards');
        return;
      }
      const value = Math.trunc(Number(points) || 0);
      if (!value) {
        setRedeemPoints(0);
        return;
      }
      const tier = REWARD_TIERS.find((item) => item.points === value);
      if (!tier) return;
      if ((customer.points || 0) < tier.points) return;
      setRedeemPoints((current) => (current === tier.points ? 0 : tier.points));
    },
    [token, customer, openAuth]
  );

  const placeOrder = useCallback(
    async (form) => {
      if (!fulfillment) {
        throw new Error('Please choose Delivery or Pick-Up first.');
      }
      if (!token || !customer) {
        openAuth('checkout');
        throw new Error('Verify your mobile number to place an order.');
      }

      const externalOrderId = `AMN-${Date.now().toString().slice(-8)}`;
      const cartSnapshot = items.map((item) => ({ ...item }));
      const paymentMethod =
        form.paymentMethod === 'Bank Transfer'
          ? 'Bank Transfer'
          : form.paymentMethod === 'Card'
            ? 'Card'
            : 'Cash';
      const bankTransfer = paymentMethod === 'Bank Transfer';
      const address =
        fulfillment === 'Pick-Up'
          ? deliveryLabel
          : form.address?.trim() || deliveryLabel;

      const posResult = await submitWebsiteOrder(
        {
          customerName: form.fullName || customer.name,
          customerPhone: form.phone || customer.phone,
          deliveryAddress: address,
          city: isDelivery ? selected?.city?.label || cityId : undefined,
          area: isDelivery ? selected?.area?.label || areaId : undefined,
          deliveryFee: fee,
          fulfillment,
          orderType: fulfillment,
          email: form.email || customer.email || undefined,
          notes: form.notes || undefined,
          paymentMethod,
          amountPaid: bankTransfer ? 0 : total,
          paymentReceipt: form.paymentReceipt || undefined,
          redeemPoints: selectedTier?.points || 0,
          externalOrderId,
          items: cartSnapshot.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            productId: item.productId,
          })),
        },
        token
      );

      const order = {
        id: posResult?.order?.orderNumber || externalOrderId,
        externalOrderId,
        createdAt: new Date().toISOString(),
        fulfillment,
        customer: {
          fullName: form.fullName || customer.name,
          phone: form.phone || customer.phone,
          address,
          email: form.email || customer.email || '',
          notes: form.notes || '',
          paymentMethod,
        },
        items: cartSnapshot,
        subtotal: posResult?.order?.subtotal ?? subtotal,
        discountAmount: posResult?.order?.discountAmount ?? discountAmount,
        discountPercent: posResult?.order?.discountPercent ?? discountPercent,
        redeemedPoints: posResult?.order?.redeemedPoints ?? selectedTier?.points ?? 0,
        deliveryFee: posResult?.order?.deliveryFee ?? fee,
        taxRate: posResult?.order?.taxRate ?? TAX_RATE * 100,
        taxAmount: posResult?.order?.taxAmount ?? taxAmount,
        total: posResult?.order?.total ?? total,
        paymentMethod,
        paymentStatus: bankTransfer
          ? 'Payment Pending Verification'
          : posResult?.order?.paymentStatus || undefined,
        loyaltyPointsAwarded: posResult?.order?.loyaltyPointsAwarded ?? 0,
        loyaltyPointsPending: posResult?.order?.loyaltyPointsPending ?? 10,
        loyaltyPointsBalance: posResult?.order?.loyaltyPointsBalance ?? null,
        posOrderId: posResult?.order?.orderId ?? null,
      };

      if (posResult?.order?.loyaltyPointsBalance != null) {
        applyServerCustomer({
          points: posResult.order.loyaltyPointsBalance,
        });
      }

      setLastOrder(order);
      sessionStorage.setItem('amoons-last-order', JSON.stringify(order));
      setItems([]);
      setRedeemPoints(0);
      return order;
    },
    [
      fulfillment,
      token,
      customer,
      openAuth,
      items,
      deliveryLabel,
      isDelivery,
      selected,
      cityId,
      areaId,
      fee,
      total,
      selectedTier,
      subtotal,
      discountAmount,
      discountPercent,
      taxAmount,
      applyServerCustomer,
    ]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      discountAmount,
      discountPercent,
      redeemedPoints: selectedTier?.points || 0,
      selectedTier,
      redeemPoints,
      selectRedeem,
      toastMessage,
      toastToken,
      clearToast,
      afterDiscount,
      taxAmount,
      taxRate: TAX_RATE,
      deliveryFee: fee,
      total,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clearCart,
      placeOrder,
      lastOrder,
      setLastOrder,
      streetAddress,
    }),
    [
      items,
      itemCount,
      subtotal,
      discountAmount,
      discountPercent,
      selectedTier,
      redeemPoints,
      selectRedeem,
      toastMessage,
      toastToken,
      clearToast,
      afterDiscount,
      taxAmount,
      fee,
      total,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clearCart,
      placeOrder,
      lastOrder,
      streetAddress,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
