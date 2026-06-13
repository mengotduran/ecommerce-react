'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../store/uiStore';

// /login is only reachable via direct navigation or the middleware's
// redirect for protected routes — sign-in itself happens in the
// AuthDrawer (opened from the navbar). Bounce to "/" and open it there.
export default function LoginPage() {
  const router = useRouter();
  const openAuth = useUIStore((s) => s.openAuth);

  useEffect(() => {
    openAuth('login');
    router.replace('/');
  }, [openAuth, router]);

  return null;
}
