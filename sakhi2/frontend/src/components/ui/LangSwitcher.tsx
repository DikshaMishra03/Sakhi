// src/components/ui/LangSwitcher.tsx
import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { LANG_LABELS, LangCode } from '@/i18n/translations';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const langs = Object.entries(LANG_LABELS) as [LangCode, string][];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', border: '1.5px solid var(--cream)', borderRadius: '2rem', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--ink-mid)', transition: 'border-color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--saffron)')}
        onMouseLeave={e => !open && (e.currentTarget.style.borderColor = 'var(--cream)')}>
        <Globe size={14} />
        {LANG_LABELS[lang]}
        <ChevronDown size={12} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 99,
            background: 'white', borderRadius: 12, padding: '0.5rem',
            boxShadow: '0 8px 30px rgba(30,26,22,0.15)', border: '1px solid var(--cream)',
            minWidth: 160,
          }}>
            {langs.map(([code, label]) => (
              <button key={code} onClick={() => { setLang(code); setOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.87rem', background: lang === code ? 'var(--saffron-pale)' : 'transparent', color: lang === code ? 'var(--saffron)' : 'var(--ink-mid)', fontWeight: lang === code ? 600 : 400, transition: 'background 0.15s' }}
                onMouseEnter={e => lang !== code && (e.currentTarget.style.background = 'var(--paper-warm)')}
                onMouseLeave={e => lang !== code && (e.currentTarget.style.background = 'transparent')}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
