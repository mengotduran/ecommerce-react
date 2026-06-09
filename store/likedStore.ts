import { create } from 'zustand';

type LikedState = {
  likedItems: string[];
  _userId: string | null;
  init: (userId: string | null) => void;
  toggleLike: (id: string) => void;
};

const storageKey = (userId: string | null) =>
  userId ? `likedItems_${userId}` : 'likedItems_guest';

const load = (userId: string | null): string[] => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(storageKey(userId)) || '[]'); }
  catch { return []; }
};

export const useLikedStore = create<LikedState>((set, get) => ({
  likedItems: [],
  _userId: null,

  init: (userId) => {
    set({ likedItems: load(userId), _userId: userId });
  },

  toggleLike: (id) => {
    const { likedItems, _userId } = get();
    const updated = likedItems.includes(id)
      ? likedItems.filter((i) => i !== id)
      : [...likedItems, id];
    localStorage.setItem(storageKey(_userId), JSON.stringify(updated));
    set({ likedItems: updated });
  },
}));
