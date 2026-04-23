import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Edit3, Send, ArrowLeft } from 'lucide-react';
import { skillsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'kitchen', label: '🍛 Kitchen' }, { id: 'remedies', label: '🌿 Remedies' },
  { id: 'crafts', label: '🧵 Crafts' }, { id: 'home', label: '🏡 Home' },
  { id: 'beauty', label: '🌸 Beauty' }, { id: 'parenting', label: '📚 Parenting' },
  { id: 'earning', label: '💰 Earning' }, { id: 'garden', label: '🌱 Garden' },
];

const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu'];
const REGIONS = ['North India', 'South India', 'East India', 'West India', 'Northeast India', 'Central India', 'Pan-India'];

export default function WritePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const qc = useQueryClient();
  const isEditing = !!id;
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const [form, setForm] = useState({
    title: '', subtitle: '', body: '',
    category: '', tags: '', language: 'Hindi', region: '',
  });

  const { data: existing } = useQuery({
    queryKey: ['skill', id],
    queryFn: () => skillsApi.getById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existing?.data?.data?.skill) {
      const s = existing.data.data.skill;
      setForm({
        title: s.title ?? '',
        subtitle: s.subtitle ?? '',
        // FIX: body could be null/undefined — default to empty string
        body: s.body ?? '',
        category: s.category ?? '',
        // FIX: tags may be undefined or not an array
        tags: Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags ?? ''),
        language: s.language ?? 'Hindi',
        region: s.region ?? '',
      });
    }
  }, [existing]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const createMutation = useMutation({
    mutationFn: () => skillsApi.create(form as any),
    onSuccess: (res) => {
      toast.success('Skill published! 🎉');
      qc.invalidateQueries({ queryKey: ['skills'] });
      navigate(`/skills/${res.data.data.id}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to publish'),
  });

  const updateMutation = useMutation({
    mutationFn: () => skillsApi.update(id!, form as any),
    onSuccess: () => {
      toast.success('Skill updated!');
      qc.invalidateQueries({ queryKey: ['skill', id] });
      navigate(`/skills/${id}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to update'),
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  // FIX: guard body before splitting/filtering
  const wordCount = (form.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const isValid = form.title.length >= 10 && form.subtitle.length >= 10 && (form.body ?? '').length >= 100 && form.category;

  const inputStyle = () => ({
    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--cream)',
    borderRadius: 10, fontSize: '0.95rem', fontFamily: 'var(--font-sans)', color: 'var(--ink)',
    background: 'white', outline: 'none', transition: 'border-color 0.2s',
  });

  // FIX: preview body renderer guards against undefined/null
  const previewHtml = (form.body ?? '').split('\n').map(line => {
    if (line.startsWith('**') && line.endsWith('**')) return `<h3>${line.slice(2, -2)}</h3>`;
    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
    if (line.trim() === '') return '<br>';
    return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
  }).join('');

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '0.87rem', fontFamily: 'var(--font-sans)' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--ink)', flex: 1 }}>
          {isEditing ? 'Edit your skill' : 'Share a skill'}
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--paper-warm)', padding: '0.3rem', borderRadius: '2rem' }}>
          {(['write', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', background: tab === t ? 'white' : 'transparent', color: tab === t ? 'var(--saffron)' : 'var(--ink-soft)', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 500, boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
              {t === 'write' ? <Edit3 size={13} /> : <Eye size={13} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'write' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
              TITLE <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. How I make dal without soaking overnight"
              style={inputStyle()} onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
            <div style={{ fontSize: '0.75rem', color: form.title.length < 10 ? 'var(--rose)' : 'var(--ink-soft)', marginTop: '0.25rem' }}>
              {form.title.length}/200 characters (min 10)
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
              SUBTITLE <span style={{ color: 'var(--rose)' }}>*</span>
            </label>
            <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="A short description that makes people want to read..."
              style={inputStyle()} onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
          </div>

          {/* Category + Language + Region */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                CATEGORY <span style={{ color: 'var(--rose)' }}>*</span>
              </label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                style={{ ...inputStyle(), cursor: 'pointer' }}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>LANGUAGE</label>
              <select value={form.language} onChange={e => set('language', e.target.value)} style={{ ...inputStyle(), cursor: 'pointer' }}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>REGION</label>
              <select value={form.region} onChange={e => set('region', e.target.value)} style={{ ...inputStyle(), cursor: 'pointer' }}>
                <option value="">Select region</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Body */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.04em' }}>
                YOUR SKILL <span style={{ color: 'var(--rose)' }}>*</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                {wordCount} words · ~{readTime} min read
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
              Write naturally. Use **bold** for headings, - for lists. Min 100 characters.
            </div>
            <textarea value={form.body} onChange={e => set('body', e.target.value)}
              placeholder="Write your skill here. Tell the story of how you learned it, list the ingredients or materials, explain the steps in your own words..."
              style={{ ...inputStyle(), minHeight: 380, resize: 'vertical', lineHeight: 1.7, fontSize: '0.95rem' }}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
              onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>TAGS</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. rajma, shortcut, north-indian (comma separated)"
              style={inputStyle()} onFocus={e => (e.target.style.borderColor = 'var(--saffron)')} onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
          </div>
        </div>
      ) : (
        /* Preview tab */
        <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', border: '1px solid var(--cream)' }}>
          {form.title ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '0.75rem', lineHeight: 1.2 }}>{form.title}</h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', marginBottom: '1.5rem', lineHeight: 1.65 }}>{form.subtitle}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {form.category && <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '2rem', background: 'var(--saffron-pale)', color: 'var(--saffron)', fontWeight: 600 }}>{form.category}</span>}
                {/* FIX: index-based key so duplicate tag names don't collide */}
                {(form.tags ?? '').split(',').filter(Boolean).map((t, i) => (
                  <span key={`${t.trim()}-${i}`} style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '2rem', background: 'var(--paper-warm)', color: 'var(--ink-mid)', border: '1px solid var(--cream)' }}>
                    {t.trim()}
                  </span>
                ))}
              </div>
              {/* FIX: previewHtml computed at top from guarded body */}
              <div className="prose-sakhi" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✍️</div>
              <p>Start writing to see the preview</p>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1.5px solid var(--cream)' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '0.7rem 1.5rem', border: '1.5px solid var(--cream)', borderRadius: '2rem', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)', color: 'var(--ink-mid)' }}>
          Cancel
        </button>
        <button
          onClick={() => isEditing ? updateMutation.mutate() : createMutation.mutate()}
          disabled={!isValid || createMutation.isPending || updateMutation.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.75rem', background: isValid ? 'var(--saffron)' : 'var(--cream)', color: isValid ? 'white' : 'var(--ink-soft)', border: 'none', borderRadius: '2rem', cursor: isValid ? 'pointer' : 'not-allowed', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-sans)', boxShadow: isValid ? '0 4px 14px rgba(232,98,26,0.3)' : 'none', transition: 'all 0.2s' }}>
          <Send size={15} />
          {createMutation.isPending || updateMutation.isPending ? 'Publishing...' : isEditing ? 'Update skill' : 'Publish skill'}
        </button>
      </div>
    </div>
  );
}
