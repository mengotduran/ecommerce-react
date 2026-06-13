import { create } from 'zustand';

type AuthMode = 'login' | 'register';

type UIState = {
  cartOpen: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  openCart: () => void;
  closeCart: () => void;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setAuthMode: (mode: AuthMode) => void;
};

// Drawer UI state shared between the navbar (which opens these drawers)
// and the drawer components (mounted once in the root layout, on top of
// whatever page is currently showing).
export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  authOpen: false,
  authMode: 'login',
  openCart: () => set({ cartOpen: true, authOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openAuth: (mode = 'login') => set({ authOpen: true, authMode: mode, cartOpen: false }),
  closeAuth: () => set({ authOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
}));
