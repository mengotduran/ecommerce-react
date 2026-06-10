import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLikedStore } from './likedStore';
import { useCartStore } from './cartStore';

type User = { id: string; email: string; name: string; role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN' };

type AuthState = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function setCookies(token: string, role: string) {
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `auth-role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearCookies() {
  document.cookie = 'auth-token=; path=/; max-age=0';
  document.cookie = 'auth-role=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:  null,
      token: null,

      login: async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Invalid credentials');
        }
        const { user, token } = await res.json();
        setCookies(token, user.role);
        set({ user, token });
        useLikedStore.getState().init(user.id);
        useCartStore.getState().init(user.id);
      },

      register: async (name, email, password) => {
        const res = await fetch(`${API}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Registration failed');
        }
        const { user, token } = await res.json();
        setCookies(token, user.role);
        set({ user, token });
        useLikedStore.getState().init(user.id);
        useCartStore.getState().init(user.id);
      },

      logout: () => {
        clearCookies();
        set({ user: null, token: null });
        useLikedStore.getState().init(null);
        useCartStore.getState().init(null);
      },
    }),
    { name: 'auth' }
  )
);
