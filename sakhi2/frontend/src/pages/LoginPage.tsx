import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Shared auth layout ────────────────────────────────────────
function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--paper)' }} className="auth-grid">
      {/* Left panel */}
      <div style={{ background: 'var(--ink)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '60%', height: '80%', background: 'rgba(232,98,26,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'var(--saffron)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'white' }}>Sakhi</span>
        </Link>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
          Every woman carries <em style={{ color: 'var(--turmeric)', fontStyle: 'italic' }}>irreplaceable</em> knowledge
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          Join thousands of women sharing life skills — from kitchens to crafts, home remedies to home businesses.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {['12,400+ Skills', '28 Languages', '840 Cities'].map(s => (
            <div key={s} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>{s}</div>
          ))}
        </div>
      </div>
      {/* Right form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3rem' }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--ink)', marginBottom: '0.4rem' }}>{title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '2rem' }}>{subtitle}</p>
          {children}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .auth-grid { grid-template-columns: 1fr !important; } .auth-grid > div:first-child { display: none !important; } }`}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--cream)', borderRadius: 10,
  fontSize: '0.95rem', fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: 'white', outline: 'none',
};

// ── LOGIN PAGE ────────────────────────────────────────────────
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Sakhi account">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>EMAIL</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="your@email.com" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Your password" style={{ ...inputStyle, paddingRight: '2.8rem' }}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          style={{ padding: '0.8rem', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(232,98,26,0.3)', marginTop: '0.5rem' }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
          New to Sakhi? <Link to="/register" style={{ color: 'var(--saffron)', fontWeight: 500 }}>Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
export default LoginPage;

// ── REGISTER PAGE ─────────────────────────────────────────────
export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '', state: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to Sakhi! 🌸');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const iStyle = { ...inputStyle };

  return (
    <AuthLayout title="Join Sakhi" subtitle="Share your knowledge with women across India">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {[
          { k: 'name', label: 'YOUR NAME *', placeholder: 'e.g. Priya Sharma', type: 'text' },
          { k: 'email', label: 'EMAIL *', placeholder: 'your@email.com', type: 'email' },
        ].map(({ k, label, placeholder, type }) => (
          <div key={k}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>{label}</label>
            <input type={type} value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={iStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
          </div>
        ))}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>PASSWORD *</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters" style={{ ...iStyle, paddingRight: '2.8rem' }}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>CITY</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Jaipur" style={iStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>STATE</label>
            <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="e.g. Rajasthan" style={iStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>SHORT BIO</label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="What kind of skills do you want to share?" rows={2}
            style={{ ...iStyle, resize: 'none', lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          style={{ padding: '0.8rem', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(232,98,26,0.3)' }}>
          {loading ? 'Creating account...' : 'Join Sakhi'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--saffron)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
