import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', gap: '1rem' }}>
      <div style={{ fontSize: '4rem' }}>🌸</div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)' }}>Page not found</h1>
      <p style={{ color: 'var(--ink-soft)', maxWidth: 380, lineHeight: 1.6 }}>
        The page you're looking for doesn't exist. Let's get you back to something good.
      </p>
      <Link to="/" style={{ display: 'inline-block', padding: '0.7rem 1.75rem', background: 'var(--saffron)', color: 'white', borderRadius: '2rem', fontWeight: 500, marginTop: '0.5rem' }}>
        Go home
      </Link>
    </div>
  );
}
