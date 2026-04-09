// PATCH: frontend/src/pages/WritePage.tsx
// Changes:
//   1. Added mandatory category-selection step (modal overlay) before the form
//   2. Dynamic structured fields appear below the main body based on selected category
//   3. Category is now locked from the step — removed from the inline select grid
//   4. All existing logic (edit mode, preview, mutations) unchanged

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Edit3, Send, ArrowLeft, ChevronRight, X } from 'lucide-react';
import { skillsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'kitchen',  label: 'Cooking',       emoji: '🍛', desc: 'Recipes, shortcuts, family secrets' },
  { id: 'beauty',   label: 'Beauty',        emoji: '🌸', desc: 'Skincare, haircare, natural remedies' },
  { id: 'remedies', label: 'Home Remedies', emoji: '🌿', desc: 'Ayurvedic tips, quick fixes' },
  { id: 'crafts',   label: 'Crafts',        emoji: '🧵', desc: 'Sewing, embroidery, handmade art' },
  { id: 'home',     label: 'Wellness',      emoji: '🧘', desc: 'Mental wellbeing, daily habits' },
  { id: 'earning',  label: 'Skills',        emoji: '💡', desc: 'Life skills, earning, productivity' },
];

// Structured fields per category
// Each field: { key, label, placeholder, type: 'input' | 'textarea' }
const CATEGORY_FIELDS: Record<string, Array<{ key: string; label: string; placeholder: string; type: 'input' | 'textarea' }>> = {
  kitchen: [
    { key: 'ingredients', label: 'Ingredients', placeholder: 'e.g. 1 cup dal, 2 tomatoes, salt to taste...', type: 'textarea' },
    { key: 'steps',       label: 'Steps',       placeholder: 'Step 1: Wash and soak...\nStep 2: Heat oil in pan...', type: 'textarea' },
    { key: 'tips',        label: 'Tips & Tricks', placeholder: 'e.g. Add hing at the end for aroma...', type: 'textarea' },
  ],
  beauty: [
    { key: 'skin_type',   label: 'Skin / Hair Type', placeholder: 'e.g. Oily skin, dry scalp...', type: 'input' },
    { key: 'ingredients', label: 'Ingredients / Products', placeholder: 'e.g. Multani mitti, rose water, neem...', type: 'textarea' },
    { key: 'steps',       label: 'Steps', placeholder: 'Step 1: Mix ingredients...\nStep 2: Apply evenly...', type: 'textarea' },
    { key: 'result',      label: 'Expected Result', placeholder: 'e.g. Skin feels brighter after 2 weeks...', type: 'input' },
  ],
  remedies: [
    { key: 'ailment',     label: 'Ailment / Condition', placeholder: 'e.g. Cold & cough, acidity, joint pain...', type: 'input' },
    { key: 'ingredients', label: 'Ingredients', placeholder: 'e.g. Ginger, tulsi, honey...', type: 'textarea' },
    { key: 'steps',       label: 'Preparation & Use', placeholder: 'How to prepare and take...', type: 'textarea' },
    { key: 'caution',     label: 'Caution (if any)', placeholder: 'e.g. Avoid during pregnancy...', type: 'input' },
  ],
  crafts: [
    { key: 'materials',   label: 'Materials Needed', placeholder: 'e.g. Cotton thread, embroidery hoop, needle...', type: 'textarea' },
    { key: 'steps',       label: 'Steps', placeholder: 'Step 1: Trace the pattern...\nStep 2: Thread the needle...', type: 'textarea' },
    { key: 'tips',        label: 'Tips', placeholder: 'e.g. Use natural light for best stitch visibility...', type: 'input' },
  ],
  home: [
    { key: 'practice',    label: 'The Practice', placeholder: 'What is the wellness practice?', type: 'input' },
    { key: 'steps',       label: 'How to do it', placeholder: 'Step-by-step guide...', type: 'textarea' },
    { key: 'frequency',   label: 'Frequency / Duration', placeholder: 'e.g. 10 minutes every morning...', type: 'input' },
    { key: 'benefit',     label: 'Benefit you noticed', placeholder: 'e.g. Better sleep after 2 weeks...', type: 'input' },
  ],
  earning: [
    { key: 'skill_name',  label: 'Skill Name', placeholder: 'e.g. Candle making, Excel shortcuts...', type: 'input' },
    { key: 'steps',       label: 'How to learn / apply it', placeholder: 'Step-by-step guide to get started...', type: 'textarea' },
    { key: 'resources',   label: 'Resources / Tools', placeholder: 'e.g. Free YouTube channels, materials needed...', type: 'textarea' },
    { key: 'outcome',     label: 'Potential Outcome', placeholder: 'e.g. Can earn ₹5000/month selling online...', type: 'input' },
  ],
};

const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu'];
const REGIONS   = ['North India', 'South India', 'East India', 'West India', 'Northeast India', 'Central India', 'Pan-India'];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid var(--cream)', borderRadius: 10,
  fontSize: '0.95rem', fontFamily: 'var(--font-sans)', color: 'var(--ink)',
  background: 'white', outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: 'var(--ink-mid)', marginBottom: '0.4rem', letterSpacing: '0.04em',
};

// ─── Category Picker Modal ────────────────────────────────────────────────────

function CategoryPickerModal({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    // Overlay
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(20,12,5,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--paper-warm, #fdf8f3)', borderRadius: 20,
        padding: '2.5rem 2rem', maxWidth: 600, width: '100%',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        animation: 'fadeSlideUp 0.22s ease',
      }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌸</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.55rem', color: 'var(--ink)', margin: 0 }}>
            What are you sharing today?
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginTop: '0.4rem' }}>
            Choose a category to get started. This helps structure your post.
          </p>
        </div>

        {/* Grid of categories */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '1rem 1.1rem',
                border: `2px solid ${hovered === cat.id ? 'var(--saffron)' : 'var(--cream)'}`,
                borderRadius: 14,
                background: hovered === cat.id ? 'var(--saffron-pale, #fff4ec)' : 'white',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow: hovered === cat.id ? '0 4px 14px rgba(232,98,26,0.12)' : 'none',
              }}
            >
              <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{cat.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.15rem' }}>
                  {cat.desc}
                </div>
              </div>
              <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--ink-soft)', opacity: hovered === cat.id ? 1 : 0, transition: 'opacity 0.15s' }} />
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '1.5rem', marginBottom: 0 }}>
          You must select a category to continue
        </p>
      </div>

      {/* Keyframes injected inline */}
      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ─── Dynamic Structured Fields ────────────────────────────────────────────────

function StructuredFields({
  categoryId,
  values,
  onChange,
}: {
  categoryId: string;
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const fields = CATEGORY_FIELDS[categoryId];
  if (!fields) return null;

  const cat = CATEGORIES.find(c => c.id === categoryId);

  return (
    <div style={{
      marginTop: '0.5rem',
      border: '1.5px solid var(--cream)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Header strip */}
      <div style={{
        background: 'var(--saffron-pale, #fff4ec)',
        borderBottom: '1.5px solid var(--cream)',
        padding: '0.7rem 1.2rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <span style={{ fontSize: '1.1rem' }}>{cat?.emoji}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--saffron)', letterSpacing: '0.05em' }}>
          {cat?.label.toUpperCase()} FIELDS
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginLeft: '0.25rem' }}>
          — optional but help readers a lot
        </span>
      </div>

      {/* Fields */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white' }}>
        {fields.map(field => (
          <div key={field.key}>
            <label style={labelStyle}>{field.label.toUpperCase()}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={values[field.key] || ''}
                onChange={e => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
                onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
              />
            ) : (
              <input
                value={values[field.key] || ''}
                onChange={e => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
                onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WritePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const qc = useQueryClient();
  const isEditing = !!id;

  const [tab, setTab] = useState<'write' | 'preview'>('write');
  // Whether the category picker modal is shown
  const [showCategoryPicker, setShowCategoryPicker] = useState(!isEditing);

  const [form, setForm] = useState({
    title: '', subtitle: '', body: '',
    category: '', tags: '', language: 'Hindi', region: '',
  });

  // Structured extra fields per category — stored as JSON in tags or sent separately
  // We'll embed them into the body on submit (backward compatible)
  const [structuredFields, setStructuredFields] = useState<Record<string, string>>({});

  // Load existing skill for editing
  const { data: existing } = useQuery({
    queryKey: ['skill', id],
    queryFn: () => skillsApi.getById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existing?.data?.data?.skill) {
      const s = existing.data.data.skill;
      setForm({
        title: s.title, subtitle: s.subtitle, body: s.body,
        category: s.category_id || s.category?.id || '',
        tags: Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || ''),
        language: s.language, region: s.region || '',
      });
      // In edit mode, skip the picker since category is already set
      setShowCategoryPicker(false);
    }
  }, [existing]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  // Build final body: append structured fields as formatted sections
  const buildBody = () => {
    const fields = CATEGORY_FIELDS[form.category] || [];
    const extras = fields
      .filter(f => structuredFields[f.key]?.trim())
      .map(f => `**${f.label}**\n${structuredFields[f.key].trim()}`)
      .join('\n\n');
    return extras ? `${form.body.trim()}\n\n${extras}` : form.body.trim();
  };

  const createMutation = useMutation({
    mutationFn: () => skillsApi.create({ ...form, body: buildBody(), category_id: form.category } as any),
    onSuccess: (res) => {
      toast.success('Skill published! 🎉');
      qc.invalidateQueries({ queryKey: ['skills'] });
      navigate(`/skills/${res.data.data.id}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to publish'),
  });

  const updateMutation = useMutation({
    mutationFn: () => skillsApi.update(id!, { ...form, body: buildBody(), category_id: form.category } as any),
    onSuccess: () => {
      toast.success('Skill updated!');
      qc.invalidateQueries({ queryKey: ['skill', id] });
      navigate(`/skills/${id}`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to update'),
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const setStructured = (k: string, v: string) => setStructuredFields(f => ({ ...f, [k]: v }));

  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length;
  const readTime  = Math.max(1, Math.ceil(wordCount / 200));
  const isValid   = form.title.length >= 10 && form.subtitle.length >= 10 && form.body.length >= 100 && form.category;

  const selectedCat = CATEGORIES.find(c => c.id === form.category);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
      {/* ── Category picker modal (mandatory on create) ─────────── */}
      {showCategoryPicker && (
        <CategoryPickerModal
          onSelect={(catId) => {
            set('category', catId);
            setStructuredFields({});
            setShowCategoryPicker(false);
          }}
        />
      )}

      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '0.87rem', fontFamily: 'var(--font-sans)' }}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--ink)', flex: 1 }}>
          {isEditing ? 'Edit your skill' : 'Share a skill'}
        </h1>

        {/* Selected category badge (clickable to re-pick) */}
        {selectedCat && !isEditing && (
          <button
            onClick={() => setShowCategoryPicker(true)}
            title="Change category"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.9rem', borderRadius: '2rem',
              border: '1.5px solid var(--saffron)', background: 'var(--saffron-pale, #fff4ec)',
              color: 'var(--saffron)', fontSize: '0.82rem', fontWeight: 600,
              fontFamily: 'var(--font-sans)', cursor: 'pointer',
            }}
          >
            {selectedCat.emoji} {selectedCat.label}
            <X size={12} />
          </button>
        )}

        {/* Write / Preview tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--paper-warm)', padding: '0.3rem', borderRadius: '2rem' }}>
          {(['write', 'preview'] as const).map(t => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? 'var(--saffron)' : 'var(--ink-soft)',
                fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 500,
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s',
              }}
            >
              {t === 'write' ? <Edit3 size={13} /> : <Eye size={13} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Write tab ───────────────────────────────────────────── */}
      {tab === 'write' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>TITLE <span style={{ color: 'var(--rose)' }}>*</span></label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. How I make dal without soaking overnight"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
              onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
            />
            <div style={{ fontSize: '0.75rem', color: form.title.length < 10 ? 'var(--rose)' : 'var(--ink-soft)', marginTop: '0.25rem' }}>
              {form.title.length}/200 characters (min 10)
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label style={labelStyle}>SUBTITLE <span style={{ color: 'var(--rose)' }}>*</span></label>
            <input
              value={form.subtitle}
              onChange={e => set('subtitle', e.target.value)}
              placeholder="A short description that makes people want to read..."
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
              onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
            />
          </div>

          {/* Language + Region (category removed — locked via modal) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>LANGUAGE</label>
              <select
                value={form.language}
                onChange={e => set('language', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>REGION</label>
              <select
                value={form.region}
                onChange={e => set('region', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select region</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Body */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={labelStyle}>YOUR SKILL <span style={{ color: 'var(--rose)' }}>*</span></label>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                {wordCount} words · ~{readTime} min read
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
              Write naturally. Use **bold** for headings, - for lists. Min 100 characters.
            </div>
            <textarea
              value={form.body}
              onChange={e => set('body', e.target.value)}
              placeholder="Write your skill here. Tell the story of how you learned it, list the ingredients or materials, explain the steps in your own words..."
              style={{ ...inputStyle, minHeight: 320, resize: 'vertical', lineHeight: 1.7 }}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
              onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
            />
          </div>

          {/* ── Dynamic structured fields based on category ──────── */}
          {form.category && (
            <StructuredFields
              categoryId={form.category}
              values={structuredFields}
              onChange={setStructured}
            />
          )}

          {/* Tags */}
          <div>
            <label style={labelStyle}>TAGS</label>
            <input
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="e.g. rajma, shortcut, north-indian (comma separated)"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
              onBlur={e => (e.target.style.borderColor = 'var(--cream)')}
            />
          </div>
        </div>
      ) : (
        /* ── Preview tab ──────────────────────────────────────────── */
        <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', border: '1px solid var(--cream)' }}>
          {form.title ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                {form.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                {form.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {selectedCat && (
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '2rem', background: 'var(--saffron-pale)', color: 'var(--saffron)', fontWeight: 600 }}>
                    {selectedCat.emoji} {selectedCat.label}
                  </span>
                )}
                {form.tags.split(',').filter(Boolean).map(t => (
                  <span key={t} style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '2rem', background: 'var(--paper-warm)', color: 'var(--ink-mid)', border: '1px solid var(--cream)' }}>
                    {t.trim()}
                  </span>
                ))}
              </div>
              <div className="prose-sakhi" dangerouslySetInnerHTML={{ __html: buildBody().split('\n').map(line => {
                if (line.startsWith('**') && line.endsWith('**')) return `<h3>${line.slice(2, -2)}</h3>`;
                if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
                if (line.trim() === '') return '<br>';
                return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
              }).join('') }} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✍️</div>
              <p>Start writing to see the preview</p>
            </div>
          )}
        </div>
      )}

      {/* ── Submit bar ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1.5px solid var(--cream)' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '0.7rem 1.5rem', border: '1.5px solid var(--cream)', borderRadius: '2rem', background: 'white', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)', color: 'var(--ink-mid)' }}
        >
          Cancel
        </button>
        <button
          onClick={() => isEditing ? updateMutation.mutate() : createMutation.mutate()}
          disabled={!isValid || createMutation.isPending || updateMutation.isPending}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.75rem',
            background: isValid ? 'var(--saffron)' : 'var(--cream)',
            color: isValid ? 'white' : 'var(--ink-soft)',
            border: 'none', borderRadius: '2rem',
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-sans)',
            boxShadow: isValid ? '0 4px 14px rgba(232,98,26,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <Send size={15} />
          {createMutation.isPending || updateMutation.isPending
            ? 'Publishing...'
            : isEditing ? 'Update skill' : 'Publish skill'}
        </button>
      </div>
    </div>
  );
}
