import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Heart, Clock, Eye, ArrowLeft, Trash2, Send, BookOpen } from 'lucide-react';
import { skillsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import VoiceNoteSection from '@/components/voice/VoiceNoteSection';


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

function renderBody(text: string) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return `<h3 style="font-family:var(--font-serif);font-size:1.15rem;color:var(--ink);margin:1.5rem 0 0.4rem">${line.slice(2, -2)}</h3>`;
      }
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
      if (line.match(/^\d+\./)) return `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
      if (line.trim() === '') return '<br>';
      return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>`;
    })
    .join('');
}

export default function SkillPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [comment, setComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['skill', id],
    queryFn: () => skillsApi.getById(id!),
  });

  const skill = data?.data?.data?.skill;
  const comments = data?.data?.data?.comments || [];
  const saved = data?.data?.data?.saved;
  const cat = CATEGORY_COLORS[skill?.category] || { bg: '#FDF0E8', text: '#E8621A', emoji: '✨' };

  const saveMutation = useMutation({
    mutationFn: () => skillsApi.toggleSave(id!),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['skill', id] });
      qc.invalidateQueries({ queryKey: ['skills'] });
      toast.success(res.data.data.saved ? 'Saved!' : 'Removed from saved');
    },
    onError: () => toast.error('Please login to save skills'),
  });

  const commentMutation = useMutation({
    mutationFn: () => skillsApi.addComment(id!, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skill', id] });
      setComment('');
      toast.success('Comment added!');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => skillsApi.deleteComment(id!, commentId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['skill', id] }); toast.success('Comment deleted'); },
  });

  const deleteMutation = useMutation({
    mutationFn: () => skillsApi.delete(id!),
    onSuccess: () => { toast.success('Skill deleted'); navigate('/explore'); },
  });

  if (isLoading) return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>
      {[60, 30, 90, 80, 70, 60, 90].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 40 : 18, width: `${w}%`, marginBottom: '0.75rem', borderRadius: 6 }} />
      ))}
    </div>
  );

  if (!skill) return (
    <div style={{ maxWidth: 600, margin: '5rem auto', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Skill not found</h2>
      <Link to="/explore" style={{ color: 'var(--saffron)' }}>Back to Explore</Link>
    </div>
  );

  const isOwner = user?.id === skill.author?.id;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2rem 5rem' }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '0.87rem', marginBottom: '2rem', fontFamily: 'var(--font-sans)' }}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Category badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: cat.bg, color: cat.text, padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
        {cat.emoji} {skill.category}
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', lineHeight: 1.15, color: 'var(--ink)', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
        {skill.title}
      </h1>
      <p style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
        {skill.subtitle}
      </p>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1.5px solid var(--cream)', marginBottom: '2rem' }}>
        <Link to={`/profile/${skill.author?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: skill.author?.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
            {skill.author?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{skill.author?.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>{skill.author?.city}, {skill.author?.state}</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
            <Clock size={14} /> {skill.read_time} min read
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
            <Eye size={14} /> {skill.views?.toLocaleString()} views
          </div>
          <button onClick={() => { if (!user) { toast.error('Login to save'); return; } saveMutation.mutate(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1rem', borderRadius: '2rem', border: `1.5px solid ${saved ? 'var(--rose)' : 'var(--cream)'}`, background: saved ? 'var(--rose-light)' : 'white', color: saved ? 'var(--rose)' : 'var(--ink-soft)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}>
            <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
            {skill.saves_count?.toLocaleString()}
          </button>
          {isOwner && (
            <button onClick={() => { if (confirm('Delete this skill?')) deleteMutation.mutate(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.8rem', borderRadius: '2rem', border: '1.5px solid #fdd', background: '#fff5f5', color: '#c9506a', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {skill.tags?.map((tag: string) => (
          <span key={tag} style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: '2rem', background: 'var(--paper-warm)', color: 'var(--ink-mid)', border: '1px solid var(--cream)' }}>
            {tag}
          </span>
        ))}
        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: '2rem', background: 'var(--turmeric-light)', color: 'var(--turmeric)', border: '1px solid transparent' }}>
          {skill.language}
        </span>
        {skill.region && (
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: '2rem', background: 'var(--green-light)', color: 'var(--green)', border: '1px solid transparent' }}>
            {skill.region}
          </span>
        )}
      </div>

      {/* Body content */}
      <article className="prose-sakhi" dangerouslySetInnerHTML={{ __html: renderBody(skill.body) }}
        style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--ink-mid)' }} />

      <VoiceNoteSection skillId={id!} />

      {/* Comments section */}
      <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1.5px solid var(--cream)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--ink)' }}>
          {comments.length} {comments.length === 1 ? 'response' : 'responses'}
        </h3>

        {/* Add comment */}
        {user ? (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: user.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: 'white', flexShrink: 0, marginTop: 4 }}>
              {user.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this skill..."
                style={{ width: '100%', padding: '0.85rem 1rem', border: '1.5px solid var(--cream)', borderRadius: 12, fontSize: '0.9rem', fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: 'white', resize: 'vertical', minHeight: 90, outline: 'none', lineHeight: 1.6 }}
                onFocus={e => (e.target.style.borderColor = 'var(--saffron)')}
                onBlur={e => (e.target.style.borderColor = 'var(--cream)')} />
              <button onClick={() => { if (!comment.trim()) return; commentMutation.mutate(); }}
                disabled={!comment.trim() || commentMutation.isPending}
                style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', background: 'var(--saffron)', color: 'white', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.87rem', fontWeight: 500, fontFamily: 'var(--font-sans)', opacity: !comment.trim() ? 0.5 : 1 }}>
                <Send size={13} /> Post response
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'var(--paper-warm)', borderRadius: 10, marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            <Link to="/login" style={{ color: 'var(--saffron)', fontWeight: 500 }}>Login</Link> to share your experience or ask questions.
          </div>
        )}

        {/* Comment list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((c: any) => (
            <div key={c.id} style={{ display: 'flex', gap: '0.75rem', padding: '1rem', background: 'white', borderRadius: 12, border: '1px solid var(--cream)' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: c.author?.avatar_color || '#E8621A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {c.author?.name?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.87rem', fontWeight: 600, color: 'var(--ink)' }}>{c.author?.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                  {user?.id === c.author?.id && (
                    <button onClick={() => deleteCommentMutation.mutate(c.id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Trash2 size={11} /> delete
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-mid)', lineHeight: 1.6 }}>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
