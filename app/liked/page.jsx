'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../store/uiStore';

// /liked is only reachable via direct navigation — the wishlist itself
// lives in the LikedDrawer (opened from the navbar). Bounce to "/" and
// open it there.
export default function LikedPage() {
  const router = useRouter();
  const openLiked = useUIStore((s) => s.openLiked);

  useEffect(() => {
    openLiked();
    router.replace('/');
  }, [openLiked, router]);

  return null;
}
