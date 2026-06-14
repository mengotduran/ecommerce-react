import { create } from 'zustand';

type AuthMode = 'login' | 'register';

type UIState = {
  cartOpen: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  likedOpen: boolean;
  ordersOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
  openLiked: () => void;
  closeLiked: () => void;
  openOrders: () => void;
  closeOrders: () => void;
};

// Drawer UI state shared between the navbar (which opens these drawers)
// and the drawer components (mounted once in the root layout, on top of
// whatever page is currently showing).
export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  authOpen: false,
  authMode: 'login',
  likedOpen: false,
  ordersOpen: false,
  openCart: () => set({ cartOpen: true, authOpen: false, likedOpen: false, ordersOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openAuth: (mode = 'login') => set({ authOpen: true, authMode: mode, cartOpen: false, likedOpen: false, ordersOpen: false }),
  closeAuth: () => set({ authOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
  openLiked: () => set({ likedOpen: true, cartOpen: false, authOpen: false, ordersOpen: false }),
  closeLiked: () => set({ likedOpen: false }),
  openOrders: () => set({ ordersOpen: true, cartOpen: false, authOpen: false, likedOpen: false }),
  closeOrders: () => set({ ordersOpen: false }),
}));
