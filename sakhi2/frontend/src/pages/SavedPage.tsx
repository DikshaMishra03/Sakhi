// SavedPage
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { skillsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import SkillCard from '@/components/skills/SkillCard';

export function SavedPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['saved'], queryFn: () => skillsApi.getSaved(), enabled: !!user });
  const skills = data?.data?.data || [];

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Login to see your saved skills</h2>
      <Link to="/login" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.7rem 1.75rem', background: 'var(--saffron)', color: 'white', borderRadius: '2rem', fontWeight: 500 }}>Login</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '0.4rem' }}>Your collection</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--ink)' }}>
          Saved <em style={{ fontStyle: 'italic', color: 'var(--saffron)' }}>skills</em>
        </h1>
      </div>
      {isLoading ? <div style={{ color: 'var(--ink-soft)' }}>Loading...</div> :
        skills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 14, border: '1px solid var(--cream)', color: 'var(--ink-soft)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌸</div>
            <p style={{ marginBottom: '1rem' }}>You haven't saved any skills yet.</p>
            <Link to="/explore" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: 'var(--saffron)', color: 'white', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>Explore skills</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {skills.map((s: any) => <SkillCard key={s.id} skill={s} />)}
          </div>
        )
      }
    </div>
  );
}
export default SavedPage;
