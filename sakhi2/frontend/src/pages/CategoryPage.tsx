import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { skillsApi } from '@/lib/api';
import SkillCard from '@/components/skills/SkillCard';

const SORT_OPTIONS = [
  { value: 'recent',  label: 'Most Recent' },
  { value: 'popular', label: 'Most Saved' },
  { value: 'views',   label: 'Most Viewed' },
];

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => skillsApi.getCategories(),
  });

  const category = categoriesData?.data?.data?.find((c: any) => c.id === categoryId);

  const { data, isLoading } = useQuery({
    queryKey: ['skills', categoryId, sort, page],
    queryFn: () => skillsApi.getAll({ category_id: categoryId, sort, page, limit: 12 }),
    enabled: !!categoryId,
  });

  const skills     = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  // FIX: use category.name only (not name_en which doesn't exist)
  const catName  = category?.name || categoryId;
  const catEmoji = category?.emoji || '📚';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
      <button
        onClick={() => navigate('/explore')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '0.87rem', fontFamily: 'var(--font-sans)', marginBottom: '1.75rem' }}
      >
        <ArrowLeft size={15} /> Back to Explore
      </button>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{catEmoji}</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--ink)', margin: 0 }}>
            {catName}
          </h1>
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          {pagination.total != null
            ? `${pagination.total} skill${pagination.total !== 1 ? 's' : ''} shared by women across India`
            : 'Loading skills…'}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1.5px solid var(--cream)', borderRadius: '2rem', padding: '0.5rem 1rem' }}>
          <SlidersHorizontal size={14} color="var(--ink-soft)" />
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            style={{ border: 'none', outline: 'none', fontSize: '0.87rem', fontFamily: 'var(--font-sans)', color: 'var(--ink-mid)', background: 'transparent', cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--cream)' }}>
              <div className="skeleton" style={{ height: 130 }} />
              <div style={{ padding: '1.1rem' }}>
                <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: '0.6rem' }} />
                <div className="skeleton" style={{ height: 20, marginBottom: '0.4rem' }} />
                <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{catEmoji}</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
            No skills yet in {catName}
          </h3>
          <p style={{ marginBottom: '1.5rem' }}>Be the first to share one!</p>
          <Link
            to="/write"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', background: 'var(--saffron)', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-sans)' }}
          >
            Share a skill
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {skills.map((skill: any) => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      )}

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1.5px solid var(--cream)', borderRadius: '2rem', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontFamily: 'var(--font-sans)', fontSize: '0.87rem', gap: '0.3rem' }}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - page) <= 2)
            .map(p => (
              <button
                key={p} onClick={() => setPage(p)}
                style={{ width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.87rem', fontWeight: p === page ? 600 : 400, background: p === page ? 'var(--saffron)' : 'white', color: p === page ? 'white' : 'var(--ink-mid)', border: `1.5px solid ${p === page ? 'var(--saffron)' : 'var(--cream)'}` }}
              >
                {p}
              </button>
            ))}
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === pagination.pages}
            style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1.5px solid var(--cream)', borderRadius: '2rem', background: 'white', cursor: page === pagination.pages ? 'not-allowed' : 'pointer', opacity: page === pagination.pages ? 0.4 : 1, fontFamily: 'var(--font-sans)', fontSize: '0.87rem', gap: '0.3rem' }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
