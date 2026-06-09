'use client';

import dynamic from 'next/dynamic';

const HeroShowcase = dynamic(() => import('../components/HeroShowcase'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0d0d0d' }} />,
});
const ProductCatalogue = dynamic(() => import('../components/ProductCatalogue'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      <HeroShowcase />
      <div style={{ height: '0.5px', background: 'var(--border-color)' }} />
      <div id="catalogue">
        <ProductCatalogue />
      </div>
    </main>
  );
}
