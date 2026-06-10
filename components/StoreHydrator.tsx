'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLikedStore } from '../store/likedStore';
import { useCartStore } from '../store/cartStore';

export default function StoreHydrator() {
  useEffect(() => {
    const userId = useAuthStore.getState().user?.id ?? null;
    useLikedStore.getState().init(userId);
    useCartStore.getState().init(userId);
  }, []);

  return null;
}
