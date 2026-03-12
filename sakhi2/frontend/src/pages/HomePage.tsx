import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { skillsApi } from '@/lib/api';
import SkillCard from '@/components/skills/SkillCard';

const CATEGORY_COLORS: Record<string, string> = {
  kitchen: '#E8621A', remedies: '#4A7C59', crafts: '#C9506A',
  home: '#D4A017', beauty: '#8B4A6B', parenting: '#2D5FA6',
  earning: '#4A7C59', garden: '#4A7C59',
};

export default function HomePage() {
  const { data: featuredData } = useQuery({ queryKey: ['featured'], queryFn: () => skillsApi.getFeatured() });
  const { data: statsData } = useQuery({ queryKey: ['stats'], queryFn: () => skillsApi.getStats() });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => skillsApi.getCategories() });
  const { data: recentData } = useQuery({ queryKey: ['skills', 'recent'], queryFn: () => skillsApi.getAll({ sort: 'recent', limit: 6 }) });

  const featured = featuredData?.data?.data || [];
  const stats = statsData?.data?.data || {};
  const categories = categoriesData?.data?.data || [];
  const recentSkills = recentData?.data?.data || [];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem 4rem', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
        <div>
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '1.25rem' }}>
            <span style={{ width: 24, height: 1.5, background: 'var(--saffron)', display: 'inline-block' }} />
            By Women · For Women · Across India
          </div>
          <h1 className="animate-fade-up delay-100" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.12, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Knowledge <em style={{ fontStyle: 'italic', color: 'var(--saffron)' }}>woven</em><br />
            from real hands,<br />
            real homes.
          </h1>
          <p className="animate-fade-up delay-200" style={{ fontSize: '1rem', color: 'var(--ink-mid)', maxWidth: 420, marginBottom: '2rem', lineHeight: 1.75 }}>
            Sakhi is where women across India share what they've learned — 
            recipes from grandmothers, remedies that actually work, 
            crafts made from what's around you.
          </p>
          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--saffron)', color: 'white', padding: '0.75rem 1.75rem', borderRadius: '3rem', fontWeight: 500, fontSize: '0.95rem', boxShadow: '0 4px 18px rgba(232,98,26,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
              Explore skills <ArrowRight size={16} />
            </Link>
            <Link to="/register" style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Share yours <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Hero floating cards */}
        <div className="animate-fade-up delay-200" style={{ position: 'relative', height: 440 }}>
          {[
            { style: { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 260, zIndex: 3, background: 'white' }, emoji: '🍛', cat: 'Kitchen', title: "Dal tadka the way my Nani made it", author: 'Sunita, Lucknow', saves: '1,204', color: '#E8621A' },
            { style: { top: '5%', right: '0%', transform: 'rotate(4deg)', width: 220, zIndex: 2, background: 'var(--saffron-pale)' }, emoji: '🌿', cat: 'Remedy', title: 'Methi water for hair fall', author: 'Divya, Kochi', saves: '2,341', color: '#4A7C59' },
            { style: { bottom: '5%', left: '-5%', transform: 'rotate(-3deg)', width: 210, zIndex: 2, background: 'var(--green-light)' }, emoji: '🧵', cat: 'Craft', title: 'Kantha embroidery basics', author: 'Tulsi, Bhilai', saves: '1,120', color: '#C9506A' },
          ].map((card, i) => (
            <div key={i} style={{ position: 'absolute', ...card.style, borderRadius: 14, padding: '1.25rem', boxShadow: '0 8px 30px rgba(30,26,22,0.1)', border: '1px solid rgba(237,224,204,0.5)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: card.color, marginBottom: '0.4rem' }}>{card.emoji} {card.cat}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: 'var(--ink)', lineHeight: 1.3, marginBottom: '0.5rem' }}>{card.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>{card.author}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--rose)', marginTop: '0.5rem' }}>♥ {card.saves} saves</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ background: 'var(--ink)', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 6vw, 5rem)', flexWrap: 'wrap' }}>
          {[
            { n: stats.total_skills ? `${(stats.total_skills).toLocaleString()}+` : '8+', label: 'Skills shared' },
            { n: stats.cities ? `${stats.cities}+` : '7+', label: 'Cities' },
            { n: stats.languages ? `${stats.languages}` : '5+', label: 'Languages' },
            { n: stats.total_users ? `${stats.total_users}+` : '8+', label: 'Women sharing' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--turmeric)', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.3rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '0.4rem' }}>Browse</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--ink)' }}>
              What are you looking <em style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>for?</em>
            </h2>
          </div>
          <Link to="/explore" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
            All categories <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {categories.map((cat: any) => (
            <Link key={cat.id} to={`/explore?category=${cat.id}`} style={{
              background: 'white', border: '1.5px solid var(--cream)', borderRadius: 12,
              padding: '1.1rem 0.9rem', textAlign: 'center', textDecoration: 'none',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CATEGORY_COLORS[cat.id] || 'var(--saffron)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{cat.emoji}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.15rem' }}>{cat.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{cat.count} skills</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '0.4rem' }}>Editor's picks</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--ink)' }}>
              Stories worth <em style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>reading slowly</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {featured.slice(0, 2).map((skill: any) => (
              <SkillCard key={skill.id} skill={skill} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── RECENT SKILLS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 2rem 5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '0.4rem' }}>Latest</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--ink)' }}>
              Fresh from the <em style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>community</em>
            </h2>
          </div>
          <Link to="/explore" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {recentSkills.map((skill: any) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--saffron)', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60%', left: '-20%', width: '60%', height: '200%', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-deva)', fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>आप भी जानती हैं कुछ खास</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
            You know something no one else does
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            A recipe, a remedy, a craft — the knowledge you carry is worth sharing. Someone somewhere needs exactly what you know.
          </p>
          <Link to="/register" style={{ display: 'inline-block', background: 'white', color: 'var(--saffron)', padding: '0.85rem 2.2rem', borderRadius: '3rem', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
            Start sharing today
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
