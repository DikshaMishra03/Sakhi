import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Search, BookOpen, Heart, PenLine, User, LogOut, Menu, X, Sparkles, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { skillsApi } from '@/lib/api';
import LangSwitcher from '@/components/ui/LangSwitcher';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await skillsApi.search(q);
      setSearchResults(res.data.data);
    } catch {}
    setSearchLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('See you soon!');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(251,247,242,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid var(--cream)',
        padding: '0 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'var(--saffron)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--ink)', letterSpacing: '-0.02em', fontWeight: 600 }}>
            Sakhi
          </span>
          <span style={{ fontFamily: 'var(--font-deva)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>सखी</span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
          {[
            { to: '/explore', label: 'Explore', icon: <BookOpen size={15} /> },
            { to: '/analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
              { to: '/saved', label: 'Saved', icon: <Heart size={15} /> },
              { to: '/write', label: 'Write', icon: <PenLine size={15} /> },
            ] : []),
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.4rem 0.85rem', borderRadius: '2rem',
              fontSize: '0.87rem', fontWeight: 500,
              color: isActive(to) ? 'var(--saffron)' : 'var(--ink-mid)',
              background: isActive(to) ? 'var(--saffron-pale)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {icon} {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LangSwitcher />
          {/* Search button */}
          <button onClick={() => setSearchOpen(true)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '0.4rem', color: 'var(--ink-mid)', display: 'flex', alignItems: 'center',
          }}>
            <Search size={18} />
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to={`/profile/${user.id}`} style={{
                width: 34, height: 34, borderRadius: '50%',
                background: user.avatar_color, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: 'white',
              }}>
                {user.name.charAt(0)}
              </Link>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--ink-soft)', padding: '0.3rem',
              }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" style={{
                padding: '0.4rem 1rem', borderRadius: '2rem',
                fontSize: '0.87rem', fontWeight: 500, color: 'var(--ink-mid)',
                border: '1.5px solid var(--cream)',
              }}>Login</Link>
              <Link to="/register" style={{
                padding: '0.4rem 1.1rem', borderRadius: '2rem',
                fontSize: '0.87rem', fontWeight: 500,
                background: 'var(--saffron)', color: 'white',
                boxShadow: '0 2px 10px rgba(232,98,26,0.25)',
              }}>Join Sakhi</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.3rem',
          }} className="mobile-menu-btn">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(30,26,22,0.6)',
          zIndex: 200, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center', paddingTop: '10vh',
        }} onClick={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}}>
          <div style={{
            background: 'var(--white)', borderRadius: 16, width: '90%', maxWidth: 560,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--cream)' }}>
              <Search size={18} color="var(--ink-soft)" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for skills, remedies, recipes..."
                style={{
                  flex: 1, border: 'none', outline: 'none', marginLeft: '0.75rem',
                  fontSize: '1rem', fontFamily: 'var(--font-sans)', color: 'var(--ink)',
                  background: 'transparent',
                }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {searchLoading && (
                <div style={{ padding: '1rem', color: 'var(--ink-soft)', fontSize: '0.9rem', textAlign: 'center' }}>Searching...</div>
              )}
              {!searchLoading && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div style={{ padding: '1.5rem', color: 'var(--ink-soft)', fontSize: '0.9rem', textAlign: 'center' }}>No results found for "{searchQuery}"</div>
              )}
              {searchResults.map(skill => (
                <Link key={skill.id} to={`/skills/${skill.id}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                  style={{ display: 'block', padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--paper-warm)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.2rem' }}>{skill.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>{skill.category} · {skill.author?.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--ink)', color: 'rgba(255,255,255,0.45)',
        padding: '2.5rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: '1.1rem' }}>
            Sakhi <span style={{ fontFamily: 'var(--font-deva)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>सखी</span>
          </div>
          <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>Knowledge from every kitchen, every home.</div>
        </div>
        <div style={{ fontSize: '0.78rem' }}>Made with care by Diksha Mishra · © 2025 Sakhi</div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
