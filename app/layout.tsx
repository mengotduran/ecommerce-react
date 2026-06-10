import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar/NavbarLazy';
import SearchOverlay from '../components/SearchOverlay';
import Footer from '../components/Footer';
import StoreHydrator from '../components/StoreHydrator';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

// maximumScale stops the auto-zoom when small-font inputs get focus;
// iOS ignores it for pinch gestures, so users can still zoom manually
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Velocaris',
  description: 'Premium cars & motorcycles for those who live to drive.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <StoreHydrator />
        <Navbar />
        <SearchOverlay />
        {children}
        <Footer />
      </body>
    </html>
  );
}
