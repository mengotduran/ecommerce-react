import dynamic from 'next/dynamic';

const LikedItems = dynamic(() => import('../../components/LikedItems'), {
  loading: () => (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 60 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden' }}>
              <div className="skeleton" style={{ width: '100%', paddingBottom: '80%' }} />
              <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ height: 10, width: '45%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 32, width: '100%', borderRadius: 10, marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

export default function LikedPage() {
  return <LikedItems />;
}
