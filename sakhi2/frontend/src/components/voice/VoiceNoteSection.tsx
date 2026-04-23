// src/components/voice/VoiceNoteSection.tsx
import { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Upload, Loader2, Volume2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { skillsApi, voiceApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Props { skillId: string; }

// ── Visualizer ─────────────────────────────────────────────────
function WaveformBar({ active }: { active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 32, padding: '0 4px' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: active ? 'var(--saffron)' : 'var(--cream)',
          height: active ? `${20 + Math.sin((i + Date.now() / 200) * 0.8) * 12}px` : `${8 + Math.sin(i * 0.7) * 6}px`,
          transition: active ? 'height 0.15s ease' : 'none',
        }} />
      ))}
    </div>
  );
}

// ── Individual voice note card ──────────────────────────────────
function VoiceNoteCard({ note, skillId }: { note: any; skillId: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const streamUrl = voiceApi.getStreamUrl(note.id);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const deleteMutation = useMutation({
    mutationFn: () => voiceApi.delete(note.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['voice', skillId] });
      toast.success('Voice note deleted');
    },
  });

  // FIX: guard against 0 / NaN / undefined duration
  const formatDuration = (s: number | undefined) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ background: 'var(--paper-warm)', borderRadius: 12, padding: '1rem', border: '1px solid var(--cream)' }}>
      <audio ref={audioRef} src={streamUrl} preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a && a.duration && !isNaN(a.duration)) setProgress((a.currentTime / a.duration) * 100);
        }}
        onEnded={() => setPlaying(false)} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* FIX: avatar_color with ?? fallback */}
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: note.author?.avatar_color ?? '#E8621A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
          {note.author?.name?.charAt(0)}
        </div>

        <button onClick={togglePlay} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--saffron)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(232,98,26,0.3)' }}>
          {playing ? <Pause size={14} color="white" fill="white" /> : <Play size={14} color="white" fill="white" style={{ marginLeft: 2 }} />}
        </button>

        {/* Waveform + progress */}
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={(e) => {
          const audio = audioRef.current;
          if (!audio || !audio.duration || isNaN(audio.duration)) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          audio.currentTime = pct * audio.duration;
        }}>
          <div style={{ height: 32, background: 'var(--cream)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: 'rgba(232,98,26,0.15)', transition: 'width 0.1s' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '100%', padding: '0 4px' }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} style={{ width: 2, borderRadius: 2, background: progress > (i / 24 * 100) ? 'var(--saffron)' : 'var(--ink-soft)', height: `${12 + Math.sin(i * 0.9) * 8}px`, opacity: 0.7 }} />
              ))}
            </div>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
          {formatDuration(note.duration_s)}
        </span>

        {user?.id === note.author?.id && (
          <button onClick={() => deleteMutation.mutate()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', padding: '0.25rem', display: 'flex' }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', paddingLeft: '0.25rem' }}>
        {/* FIX: each field individually optional-chained */}
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-mid)' }}>{note.author?.name}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>·</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{note.language}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>·</span>
        <Volume2 size={11} color="var(--ink-soft)" />
        {/* FIX: plays_count may be undefined */}
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{note.plays_count ?? 0} plays</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginLeft: 'auto' }}>
          {/* FIX: guard against missing/invalid created_at */}
          {note.created_at ? formatDistanceToNow(new Date(note.created_at), { addSuffix: true }) : ''}
        </span>
      </div>
    </div>
  );
}

// ── Recorder ───────────────────────────────────────────────────
export default function VoiceNoteSection({ skillId }: Props) {
  const { user } = useAuth();
  const { t } = useLang();
  const qc = useQueryClient();

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [language, setLanguage] = useState('Hindi');
  const [timer, setTimer] = useState(0);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const { data: voiceData } = useQuery({
    queryKey: ['voice', skillId],
    queryFn: () => skillsApi.getVoiceNotes(skillId),
  });
  const voiceNotes = voiceData?.data?.data || [];

  const uploadMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('audio', audioBlob!, 'voice-note.webm');
      fd.append('language', language);
      fd.append('duration_s', String(duration));
      return skillsApi.uploadVoiceNote(skillId, fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['voice', skillId] });
      setAudioBlob(null); setAudioUrl(null); setDuration(0); setTimer(0);
      toast.success('Voice note added!');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Upload failed'),
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setDuration(timer);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(100);
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch {
      toast.error('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Punjabi', 'Malayalam'];

  return (
    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1.5px solid var(--cream)' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🎙️ {t('voice_notes')} <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--ink-soft)', fontWeight: 400 }}>({voiceNotes.length})</span>
      </h3>

      {voiceNotes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {voiceNotes.map((note: any) => <VoiceNoteCard key={note.id} note={note} skillId={skillId} />)}
        </div>
      )}

      {user ? (
        <div style={{ background: 'white', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--cream)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-mid)', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            {t('voice_add').toUpperCase()}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {!audioBlob && (
              <button onClick={recording ? stopRecording : startRecording}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.87rem', fontWeight: 500, background: recording ? '#FEE2E2' : 'var(--saffron)', color: recording ? '#C9506A' : 'white', transition: 'all 0.2s' }}>
                {recording ? <><Square size={14} fill="currentColor" /> {t('voice_stop')} ({formatTimer(timer)})</> : <><Mic size={14} /> {t('voice_record')}</>}
              </button>
            )}

            <select value={language} onChange={e => setLanguage(e.target.value)}
              style={{ padding: '0.55rem 0.85rem', borderRadius: '2rem', border: '1.5px solid var(--cream)', fontSize: '0.83rem', fontFamily: 'var(--font-sans)', color: 'var(--ink-mid)', background: 'white', cursor: 'pointer' }}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            {audioUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
                <audio controls src={audioUrl} style={{ height: 32, maxWidth: 240 }} />
                <button onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', background: 'var(--green)', color: 'white', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                  {uploadMutation.isPending ? <Loader2 size={13} className="spin" /> : <Upload size={13} />}
                  {uploadMutation.isPending ? 'Uploading...' : t('voice_upload')}
                </button>
                <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)' }}>
                  Discard
                </button>
              </div>
            )}
          </div>

          {recording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9506A', animation: 'pulse 1s infinite' }} />
              <WaveformBar active={true} />
              <span style={{ fontSize: '0.78rem', color: 'var(--rose)', fontWeight: 500 }}>Recording {formatTimer(timer)} / 3:00 max</span>
            </div>
          )}
        </div>
      ) : (
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', padding: '0.75rem', background: 'var(--paper-warm)', borderRadius: 10 }}>
          Login to add a voice note to this skill.
        </p>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes spin { to{transform:rotate(360deg)} } .spin{animation:spin 1s linear infinite}`}</style>
    </div>
  );
}
