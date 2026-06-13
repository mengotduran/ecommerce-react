'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../store/uiStore';

// /register is only reachable via direct navigation — registration itself
// happens in the AuthDrawer (opened from the navbar). Bounce to "/" and
// open it there.
export default function RegisterPage() {
  const router = useRouter();
  const openAuth = useUIStore((s) => s.openAuth);

  useEffect(() => {
    openAuth('register');
    router.replace('/');
  }, [openAuth, router]);

  return null;
}
