// ProfilePage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, BookOpen, Heart, Calendar } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import SkillCard from '@/components/skills/SkillCard';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['profile', id], queryFn: () => authApi.getUserProfile(id!) });
  const profile = data?.data?.data;

  if (isLoading) return (
    <div style={{ maxWidth: 900, margin: '3rem auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>{[50, 30, 70].map((w, i) => <div key={i} className="skeleton" style={{ height: 16, width: `${w}%`, marginBottom: '0.6rem', borderRadius: 6 }} />)}</div>
      </div>
    </div>
  );

  if (!profile) return <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ink-soft)' }}>User not found</div>;

  const { user, stats, skills } = profile;
  const isMe = me?.id === id;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
      {/* Profile header */}
      <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid var(--cream)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: user.avatar_color || '#E8621A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--ink)' }}>{user.name}</h1>
              {isMe && <Link to="/write" style={{ fontSize: '0.82rem', padding: '0.3rem 0.9rem', borderRadius: '2rem', background: 'var(--saffron)', color: 'white', fontWeight: 500 }}>+ Write skill</Link>}
            </div>
            {(user.city || user.state) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
                <MapPin size={13} /> {user.city}{user.state ? `, ${user.state}` : ''}
              </div>
            )}
            {user.bio && <p style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.65, maxWidth: 520, marginBottom: '1rem' }}>{user.bio}</p>}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Skills', value: stats.skills, icon: <BookOpen size={13} /> },
                { label: 'Saves', value: stats.saves, icon: <Heart size={13} /> },
                { label: 'Followers', value: stats.followers, icon: null },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.87rem', color: 'var(--ink-mid)' }}>
                  {icon}<strong style={{ color: 'var(--ink)' }}>{value}</strong> {label}
                </div>
              ))}
              {user.created_at && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                  <Calendar size={12} /> Joined {format(new Date(user.created_at), 'MMMM yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--ink)' }}>
        {isMe ? 'Your skills' : `Skills by ${user.name.split(' ')[0]}`} ({skills.length})
      </h2>
      {skills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)', background: 'white', borderRadius: 14, border: '1px solid var(--cream)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✍️</div>
          <p>{isMe ? 'You haven\'t shared any skills yet.' : 'No skills shared yet.'}</p>
          {isMe && <Link to="/write" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.5rem', background: 'var(--saffron)', color: 'white', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>Share your first skill</Link>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {skills.map((s: any) => <SkillCard key={s.id} skill={s} />)}
        </div>
      )}
    </div>
  );
}
