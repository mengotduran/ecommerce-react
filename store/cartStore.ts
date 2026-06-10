import { create } from 'zustand';

type CartProduct = { name: string; price: number; image: string };

type Cart = {
  total_items: number;
  line_items: any[];
  subtotal: { formatted_with_symbol: string };
};

type CartState = {
  cart: Cart;
  hydrated: boolean;
  _userId: string | null;
  init: (userId: string | null) => void;
  hydrate: () => void;
  addToCart: (productId: string, quantity: number, product: CartProduct) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  emptyCart: () => void;
};

const emptyCart: Cart = { total_items: 0, line_items: [], subtotal: { formatted_with_symbol: '$0.00' } };

// Each account gets its own cart (like likedItems) so carts never leak
// between users sharing the same browser
const storageKey = (userId: string | null) => (userId ? `cart_${userId}` : 'cart_guest');

const loadCart = (userId: string | null): Cart => {
  if (typeof window === 'undefined') return emptyCart;
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || '') || emptyCart;
  } catch {
    return emptyCart;
  }
};

const computeCart = (line_items: any[], userId: string | null): Cart => {
  const total_items = line_items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalRaw = line_items.reduce((sum, i) => sum + i.price.raw * i.quantity, 0);
  const updated = {
    line_items,
    total_items,
    subtotal: { formatted_with_symbol: `$${subtotalRaw.toFixed(2)}` },
  };
  localStorage.setItem(storageKey(userId), JSON.stringify(updated));
  return updated;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart,
  hydrated: false,
  _userId: null,

  init: (userId) => {
    set({ cart: loadCart(userId), _userId: userId, hydrated: true });
  },

  hydrate: () => {
    if (get().hydrated) return;
    set({ cart: loadCart(get()._userId), hydrated: true });
  },

  addToCart: (productId, quantity, product) => {
    const { line_items } = get().cart;
    const existing = line_items.find((i) => i.product_id === productId);
    const price = Number(product.price);
    const updatedItems = existing
      ? line_items.map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [
          ...line_items,
          {
            id: productId,
            product_id: productId,
            name: product.name,
            quantity,
            price: { raw: price, formatted_with_symbol: `$${price.toFixed(2)}` },
            image: { url: product.image },
          },
        ];
    set({ cart: computeCart(updatedItems, get()._userId) });
  },

  updateCartQty: (productId, quantity) => {
    if (quantity < 1) return get().removeFromCart(productId);
    const { line_items } = get().cart;
    set({
      cart: computeCart(
        line_items.map((i) => (i.product_id === productId ? { ...i, quantity } : i)),
        get()._userId
      ),
    });
  },

  removeFromCart: (productId) => {
    const { line_items } = get().cart;
    set({ cart: computeCart(line_items.filter((i) => i.product_id !== productId), get()._userId) });
  },

  emptyCart: () => {
    localStorage.removeItem(storageKey(get()._userId));
    set({ cart: emptyCart });
  },
}));
