// src/pages/AnalyticsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Eye, Heart, BookOpen, MessageCircle, Award } from 'lucide-react';

const COLORS = ['#E8621A','#4A7C59','#C9506A','#D4A017','#5B4FCF','#2D5FA6','#8B4A6B','#B84A30'];

function StatCard({ label, value, icon, color = 'var(--saffron)', sub }: any) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--cream)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value?.toLocaleString?.() ?? value}</div>
          {sub && <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.35rem' }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { t } = useLang();

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboard(),
  });

  const { data: myData } = useQuery({
    queryKey: ['analytics', 'my'],
    queryFn: () => analyticsApi.getMyAnalytics(),
    enabled: !!user,
  });

  const dash = dashData?.data?.data;
  const my = myData?.data?.data;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: '0.4rem' }}>Platform Insights</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--ink)' }}>
          Sakhi <em style={{ fontStyle: 'italic', color: 'var(--saffron)' }}>Analytics</em>
        </h1>
      </div>

      {/* Platform Overview Stats */}
      {dash && (
        <>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ink-mid)' }}>Platform Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            <StatCard label="Total Skills" value={dash.overview.totalSkills} icon={<BookOpen size={18} color={COLORS[0]} />} color={COLORS[0]} />
            <StatCard label="Total Views" value={dash.overview.totalViews} icon={<Eye size={18} color={COLORS[1]} />} color={COLORS[1]} />
            <StatCard label="Total Saves" value={dash.overview.totalSaves} icon={<Heart size={18} color={COLORS[2]} />} color={COLORS[2]} />
            <StatCard label="Comments" value={dash.overview.totalComments} icon={<MessageCircle size={18} color={COLORS[3]} />} color={COLORS[3]} />
            <StatCard label="Women in Community" value={dash.overview.totalUsers} icon={<Award size={18} color={COLORS[4]} />} color={COLORS[4]} />
          </div>

          {/* Daily Views Chart */}
          <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid var(--cream)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Daily Activity (last 30 days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dash.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cream)" />
                <XAxis dataKey="date" tickFormatter={d => d?.slice(5)} tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} />
                <Tooltip contentStyle={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', borderRadius: 8, border: '1px solid var(--cream)' }} />
                <Legend />
                <Line type="monotone" dataKey="total_views" name="Views" stroke={COLORS[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="total_saves" name="Saves" stroke={COLORS[1]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="new_users" name="New Users" stroke={COLORS[4]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Two columns: Category + Top Skills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Category breakdown pie */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid var(--cream)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Skills by Category</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dash.categoryBreakdown.filter((c: any) => c.count > 0)} dataKey="count" nameKey="name_en" cx="50%" cy="50%" outerRadius={80} label={({ name_en, count }: any) => `${name_en} (${count})`} labelLine={{ strokeWidth: 0.5 }}>
                    {dash.categoryBreakdown.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} skills`]} contentStyle={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top skills */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid var(--cream)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Top Skills by Saves</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {dash.topSkills.map((s: any, i: number) => (
                  <Link key={s.id} to={`/skills/${s.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', padding: '0.5rem', borderRadius: 8, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-warm)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{s.author?.name} · {s.category?.emoji}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--rose)', fontWeight: 600, flexShrink: 0 }}>♥ {s.saves_count}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Personal Analytics (logged in users) ── */}
      {user && my && (
        <>
          <div style={{ height: 1, background: 'var(--cream)', margin: '2.5rem 0' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--ink-mid)' }}>Your Stats, {user.name.split(' ')[0]}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard label={t('analytics_total_skills')} value={my.totals.skills} icon={<BookOpen size={18} color={COLORS[0]} />} color={COLORS[0]} />
            <StatCard label={t('analytics_total_views')} value={my.totals.views} icon={<Eye size={18} color={COLORS[1]} />} color={COLORS[1]} />
            <StatCard label={t('analytics_total_saves')} value={my.totals.saves} icon={<Heart size={18} color={COLORS[2]} />} color={COLORS[2]} />
            <StatCard label={t('analytics_total_comments')} value={my.totals.comments} icon={<MessageCircle size={18} color={COLORS[3]} />} color={COLORS[3]} />
          </div>

          {/* Your skills performance bar chart */}
          {my.skills.length > 0 && (
            <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', border: '1px solid var(--cream)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Your skills performance</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={my.skills.slice(0, 8)} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--cream)" />
                  <XAxis dataKey="title" tick={{ fontSize: 10, fill: 'var(--ink-soft)' }} tickFormatter={v => v.slice(0, 20) + (v.length > 20 ? '…' : '')} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} />
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="views_count" name="Views" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saves_count" name="Saves" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {!user && (
        <div style={{ background: 'var(--paper-warm)', borderRadius: 14, padding: '2rem', textAlign: 'center', marginTop: '2rem', border: '1px solid var(--cream)' }}>
          <p style={{ color: 'var(--ink-mid)', marginBottom: '1rem' }}>Login to see your personal analytics</p>
          <Link to="/login" style={{ display: 'inline-block', padding: '0.65rem 1.5rem', background: 'var(--saffron)', color: 'white', borderRadius: '2rem', fontWeight: 500, fontSize: '0.9rem' }}>Login</Link>
        </div>
      )}
    </div>
  );
}
