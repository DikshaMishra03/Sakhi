// PATCH: frontend/src/pages/ExplorePage.tsx
// Changes:
//   1. When no search/filter is active AND no results: show CategoryGrid instead of "Nothing found"
//   2. CategoryGrid cards show emoji + name + skill count (from API)
//   3. Clicking a card navigates to /category/:id
//   4. All existing filter/search/sort/pagination logic is untouched

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { skillsApi } from '@/lib/api';
import SkillCard from '@/components/skills/SkillCard';

const SORT_OPTIONS = [
  { value: 'recent',  label: 'Most Recent' },
  { value: 'popular', label: 'Most Saved' },
  { value: 'views',   label: 'Most Viewed' },
];

// ─── Category Grid (shown when no active filters) ─────────────────────────────

function CategoryGrid({ categories }: { categories: any[] }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const displayCats = categories.filter((c: any) => c.id !== 'all');

  return (
    <div>
      <h2 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.25rem',
        color: 'var(--ink)', marginBottom: '1.25rem',
      }}>
        Browse by Category
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {displayCats.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '1.4rem 1.25rem',
              border: `2px solid ${hovered === cat.id ? 'var(--saffron)' : 'var(--cream)'}`,
              borderRadius: 16,
              background: hovered === cat.id ? 'var(--saffron-pale, #fff4ec)' : 'white',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
              boxShadow: hovered === cat.id ? '0 6px 20px rgba(232,98,26,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '2.2rem', lineHeight: 1, marginBottom: '0.75rem' }}>
              {cat.emoji}
            </span>
            <span style={{
              fontWeight: 700, fontSize: '0.97rem',
              color: hovered === cat.id ? 'var(--saffron)' : 'var(--ink)',
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.15s',
            }}>
              {cat.name_en || cat.name || cat.id}
            </span>
            <span style={{
              fontSize: '0.78rem', color: 'var(--ink-soft)',
              marginTop: '0.3rem',
            }}>
              {cat.count != null ? `${cat.count} skill${cat.count !== 1 ? 's' : ''}` : 'Skills'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]           = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const category = searchParams.get('category') || 'all';
  const sort     = searchParams.get('sort') || 'recent';
  const page     = Number(searchParams.get('page') || 1);

  // true when user has applied an active filter/search
  const hasActiveFilter = category !== 'all' || debouncedSearch.trim().length > 0;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => skillsApi.getCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['skills', category, debouncedSearch, sort, page],
    queryFn: () => skillsApi.getAll({
      category_id: category === 'all' ? undefined : category,
      search: debouncedSearch || undefined,
      sort, page, limit: 9,
    }),
  });

  const skills     = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  const categories = [
    { id: 'all', name: 'All', name_en: 'All', emoji: '✨', count: null },
    ...(categoriesData?.data?.data || []),
  ];

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, value);
    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  // Decide what to render in the content area
  const showCategoryGrid  = !hasActiveFilter && !isLoading && skills.length === 0;
  const showEmptySearch   = hasActiveFilter  && !isLoading && skills.length === 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '0.4rem' }}>
          Explore
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--ink)', marginBottom: '0.5rem' }}>
          All skills, all <em style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>communities</em>
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem' }}>
          {pagination.total
            ? `${pagination.total} skills shared by women across India`
            : 'Browse skills shared by women across India'}
        </p>
      </div>

      {/* ── Search + sort bar ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'white', border: '1.5px solid var(--cream)', borderRadius: '2rem', padding: '0.55rem 1.1rem' }}>
          <Search size={16} color="var(--ink-soft)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills, remedies, regions..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem', fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: 'transparent' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1.5px solid var(--cream)', borderRadius: '2rem', padding: '0.55rem 1.1rem' }}>
          <SlidersHorizontal size={14} color="var(--ink-soft)" />
          <select
            value={sort}
            onChange={e => setParam('sort', e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '0.87rem', fontFamily: 'var(--font-sans)', color: 'var(--ink-mid)', background: 'transparent', cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Category pills ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setParam('category', cat.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.4rem 1rem', borderRadius: '2rem', cursor: 'pointer',
              fontSize: '0.83rem', fontWeight: 500, fontFamily: 'var(--font-sans)',
              background: category === cat.id ? 'var(--saffron)' : 'white',
              color: category === cat.id ? 'white' : 'var(--ink-mid)',
              border: `1.5px solid ${category === cat.id ? 'var(--saffron)' : 'var(--cream)'}`,
              transition: 'all 0.15s',
            }}
          >
            <span>{cat.emoji}</span>
            {cat.name_en || cat.name}
            {cat.count != null && (
              <span style={{ opacity: 0.65, fontSize: '0.75rem' }}>({cat.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content area ────────────────────────────────────────── */}

      {/* Loading skeleton */}
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

      ) : showCategoryGrid ? (
        /* No filters active + no results → show category cards */
        <CategoryGrid categories={categories} />

      ) : showEmptySearch ? (
        /* Active filter but no results → targeted empty state */
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
            No skills found
          </h3>
          <p>Try different keywords or{' '}
            <button
              onClick={() => { setSearch(''); setParam('category', 'all'); }}
              style={{ background: 'none', border: 'none', color: 'var(--saffron)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'inherit', textDecoration: 'underline', padding: 0 }}
            >
              browse all categories
            </button>.
          </p>
        </div>

      ) : (
        /* Normal grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {skills.map((skill: any) => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────────── */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
          <button
            onClick={() => setParam('page', String(page - 1))}
            disabled={page === 1}
            style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', border: '1.5px solid var(--cream)', borderRadius: '2rem', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontFamily: 'var(--font-sans)', fontSize: '0.87rem', gap: '0.3rem' }}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - page) <= 2)
            .map(p => (
              <button
                key={p}
                onClick={() => setParam('page', String(p))}
                style={{ width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.87rem', fontWeight: p === page ? 600 : 400, background: p === page ? 'var(--saffron)' : 'white', color: p === page ? 'white' : 'var(--ink-mid)', border: `1.5px solid ${p === page ? 'var(--saffron)' : 'var(--cream)'}` }}
              >
                {p}
              </button>
            ))}
          <button
            onClick={() => setParam('page', String(page + 1))}
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
