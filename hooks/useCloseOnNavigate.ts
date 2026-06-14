'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Closes a drawer/overlay once the route actually changes, instead of on
// link click. Closing synchronously on click reveals the page underneath
// (the route the user is leaving) for a moment before the destination
// route finishes loading — a jarring "flash back to this page" effect.
// Waiting for the pathname to change means the new route is already
// mounted (and showing its own loading state) by the time the overlay
// disappears.
export function useCloseOnNavigate(open: boolean, onClose: () => void) {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);
  const wasOpen = useRef(open);

  useEffect(() => {
    // Only capture the pathname at the moment the drawer opens — not on
    // every pathname change while it's open, which would make the
    // comparison below always pass.
    if (open && !wasOpen.current) initialPathname.current = pathname;
    wasOpen.current = open;
  }, [open, pathname]);

  useEffect(() => {
    if (open && pathname !== initialPathname.current) onClose();
  }, [open, pathname, onClose]);
}
