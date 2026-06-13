'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const CYBERTRUCK = '/products/tesla-cybertruck/1.jpg';
const BIKES = [
  '/products/kawasaki-ninja-h2r/1.avif',
  '/products/harley-davidson-nightster/4.jpg',
  '/products/yamaha-mt09/2.jpg',
  '/products/bmw-s1000r/4.jpg',
];

const FADE_MS = 5000;

// Full-screen crossfading backdrop for the auth pages — one cybertruck shot
// plus two randomly-picked bikes, shuffled and cycled the same way the
// homepage HeroSlider fades between featured vehicles.
export default function AuthBackdrop() {
  const [images, setImages] = useState<string[] | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const bikes = [...BIKES].sort(() => Math.random() - 0.5).slice(0, 2);
    setImages([CYBERTRUCK, ...bikes].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % images.length), FADE_MS);
    return () => clearInterval(timer);
  }, [images]);

  if (!images) return null;

  return (
    <div className="auth-backdrop">
      {images.map((src, i) => (
        <div key={src} className="auth-backdrop__slide" style={{ opacity: i === active ? 1 : 0 }}>
          <Image src={src} alt="" fill priority={i === 0} style={{ objectFit: 'cover' }} sizes="100vw" />
        </div>
      ))}
      <div className="auth-backdrop__overlay" />
    </div>
  );
}
