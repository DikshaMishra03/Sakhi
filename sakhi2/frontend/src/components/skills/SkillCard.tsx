import { Link } from 'react-router-dom';
import { Heart, Eye, Clock } from 'lucide-react';
import { Skill } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  kitchen:   { bg: '#FDF0E8', text: '#E8621A', emoji: '🍛' },
  remedies:  { bg: '#D4E8DC', text: '#4A7C59', emoji: '🌿' },
  crafts:    { bg: '#F7D0D8', text: '#C9506A', emoji: '🧵' },
  home:      { bg: '#F5E6B0', text: '#D4A017', emoji: '🏡' },
  beauty:    { bg: '#F0E0F0', text: '#8B4A6B', emoji: '🌸' },
  parenting: { bg: '#E0EAF8', text: '#2D5FA6', emoji: '📚' },
  earning:   { bg: '#D4E8DC', text: '#4A7C59', emoji: '💰' },
  garden:    { bg: '#D4E8DC', text: '#4A7C59', emoji: '🌱' },
};

interface Props {
  skill: Skill;
  featured?: boolean;
}

export default function SkillCard({ skill, featured = false }: Props) {
  const cat = CATEGORY_COLORS[skill.category] || { bg: '#F5EFE5', text: '#7A6C60', emoji: '✨' };
  const timeAgo = formatDistanceToNow(new Date(skill.created_at), { addSuffix: true });

  if (featured) {
    return (
      <Link to={`/skills/${skill.id}`} style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
        background: 'white', borderRadius: 20, overflow: 'hidden',
        border: '1px solid var(--cream)', textDecoration: 'none',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(30,26,22,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: cat.bg, color: cat.text, padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
              {cat.emoji} {skill.category}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--ink)', lineHeight: 1.35, marginBottom: '0.6rem' }}>{skill.title}</div>
            <div style={{ fontSize: '0.87rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{skill.subtitle}</div>
          </div>
          <AuthorRow author={skill.author} timeAgo={timeAgo} saves_count={skill.saves_count} />
        </div>
        <div style={{ background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', minHeight: 200 }}>
          {cat.emoji}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/skills/${skill.id}`} style={{
      display: 'flex', flexDirection: 'column',
      background: 'white', borderRadius: 14, overflow: 'hidden',
      border: '1px solid var(--cream)', textDecoration: 'none',
      transition: 'transform 0.25s, box-shadow 0.25s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(30,26,22,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Card image area */}
      <div style={{ height: 130, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative' }}>
        {cat.emoji}
        {skill.is_featured && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--turmeric)', color: 'white', fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '2rem', letterSpacing: '0.08em' }}>
            ★ FEATURED
          </div>
        )}
      </div>

      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: cat.text, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          {cat.emoji} {skill.category}
          <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>· {skill.read_time} min</span>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.35, marginBottom: '0.4rem', flex: 1 }}>
          {skill.title}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '0.75rem' }}>
          {skill.subtitle.length > 85 ? skill.subtitle.slice(0, 85) + '...' : skill.subtitle}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--paper-warm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: skill.author?.avatar_color || '#E8621A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {skill.author?.name?.charAt(0)}
            </div>
            <span style={{ fontWeight: 500, color: 'var(--ink-mid)' }}>{skill.author?.name?.split(' ')[0]}</span>
            <span>· {skill.author?.city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--rose)' }}>
            <Heart size={12} fill="currentColor" />
            {skill.saves_count.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}

function AuthorRow({ author, timeAgo, saves_count }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--paper-warm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: author?.avatar_color || '#E8621A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
          {author?.name?.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>{author?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>{author?.city} · {timeAgo}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--rose)' }}>
        <Heart size={14} fill="currentColor" />
        {saves_count?.toLocaleString()}
      </div>
    </div>
  );
}
