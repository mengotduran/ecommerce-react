import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

export const useCart = () => {
  const cart = useCartStore((s) => s.cart);
  const hydrate = useCartStore((s) => s.hydrate);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateCartQty = useCartStore((s) => s.updateCartQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const emptyCart = useCartStore((s) => s.emptyCart);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { cart, addToCart, updateCartQty, removeFromCart, emptyCart };
};
