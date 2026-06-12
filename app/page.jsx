'use client';

import dynamic from 'next/dynamic';

const HeroSlider = dynamic(() => import('../components/HeroSlider'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0d0d0d' }} />,
});
const HeroShowcase = dynamic(() => import('../components/HeroShowcase'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0d0d0d' }} />,
});
const CategoryShowcase = dynamic(() => import('../components/CategoryShowcase'), { ssr: false });
const ProductCatalogue = dynamic(() => import('../components/ProductCatalogue'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <HeroShowcase />
      <CategoryShowcase />
      <div id="catalogue">
        <ProductCatalogue />
      </div>
    </main>
  );
}
