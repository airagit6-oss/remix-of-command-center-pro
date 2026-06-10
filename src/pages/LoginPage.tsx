import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/brand/Logo';

type Role = 'user' | 'reseller' | 'admin';
type Mode = 'login' | 'forgot' | 'otp' | '2fa' | 'biometric';

const NEON = {
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  pink: '#f472b6',
  navy: '#070b1a',
  panel: 'rgba(15, 22, 41, 0.55)',
  border: 'rgba(120, 160, 255, 0.18)',
  text: '#e6edff',
  mute: '#8a96b8',
};

const LEFT_SLIDES = [
  { t: 'Sell Software & Earn', d: 'Launch products to a global SaaS audience.' },
  { t: 'Build Recurring Income', d: 'Subscriptions, renewals, payouts on autopilot.' },
  { t: 'Launch Your SaaS', d: 'Zero infra. Ship in minutes, scale globally.' },
];
const RIGHT_SLIDES = [
  { t: 'Join as Reseller', d: 'Resell premium software with one link.' },
  { t: 'Earn Commissions', d: 'Up to 40% recurring on every renewal.' },
  { t: 'Manage Subscriptions', d: 'Realtime control over every customer.' },
  { t: 'Track Payouts', d: 'Daily settlements, transparent dashboards.' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, padding: '0 14px', fontSize: 14,
  background: 'rgba(8,12,28,0.7)', color: NEON.text,
  border: '1px solid transparent', borderRadius: 10, outline: 'none', boxSizing: 'border-box',
  transition: 'all .2s ease',
};
const linkBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', color: NEON.cyan, fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0,
};

const Field: React.FC<{ label: string; focused: boolean; accent: string; right?: React.ReactNode; children: React.ReactNode }> = ({ label, focused, accent, right, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: NEON.mute, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</label>
      {right}
    </div>
    <div style={{
      borderRadius: 11, padding: 1,
      background: focused ? `linear-gradient(135deg, ${accent}, ${NEON.violet})` : 'rgba(120,160,255,0.12)',
      boxShadow: focused ? `0 0 0 4px ${accent}1f` : 'none',
      transition: 'all .2s ease',
    }}>
      {children}
    </div>
  </div>
);

const PrimaryButton: React.FC<{ accent: string; label: string; type?: 'submit' | 'button'; onClick?: () => void }> = ({ accent, label, type = 'submit', onClick }) => (
  <button type={type} onClick={onClick} style={{
    width: '100%', height: 46, borderRadius: 12, border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 700, letterSpacing: 0.3, color: '#06091a',
    background: `linear-gradient(135deg, ${accent}, ${NEON.violet})`,
    boxShadow: `0 12px 30px -10px ${accent}aa, 0 0 0 1px ${accent}55 inset`,
    transition: 'transform .15s ease',
  }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
    {label} →
  </button>
);

const QuickBtn: React.FC<{ color: string; label: string; onClick: () => void }> = ({ color, label, onClick }) => (
  <button type="button" onClick={onClick} style={{
    padding: '10px 6px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: 'rgba(255,255,255,0.03)', color: NEON.text,
    border: `1px solid ${color}55`, boxShadow: `inset 0 0 12px ${color}1a`,
  }}>
    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 99, background: color, marginRight: 6, boxShadow: `0 0 8px ${color}` }} />
    {label}
  </button>
);

const SidePanel: React.FC<{
  align: 'left' | 'right'; accent: string; title: string;
  slides: { t: string; d: string }[]; idx: number;
  stat: { label: string; value: string; sub: string };
  chips: string[];
}> = ({ align, accent, title, slides, idx, stat, chips }) => (
  <aside style={{ display: 'flex', justifyContent: align === 'left' ? 'flex-end' : 'flex-start' }}>
    <div style={{
      width: '100%', maxWidth: 360,
      padding: 22, borderRadius: 18,
      background: `linear-gradient(180deg, rgba(15,22,41,0.6), rgba(8,12,28,0.6))`,
      border: `1px solid ${NEON.border}`, backdropFilter: 'blur(14px)',
      animation: 'lvSlideUp .6s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: accent, boxShadow: `0 0 10px ${accent}`, animation: 'lvPulse 2s ease-in-out infinite' }} />
        <span style={{ fontSize: 11, color: NEON.mute, letterSpacing: 1.4, textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ minHeight: 96, marginBottom: 16 }}>
        {slides.map((s, i) => (
          <div key={i} style={{ display: i === idx ? 'block' : 'none', animation: i === idx ? 'lvSlideUp .5s ease' : 'none' }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, margin: 0, color: NEON.text }}>{s.t}</h3>
            <p style={{ fontSize: 13, color: NEON.mute, marginTop: 8, lineHeight: 1.5 }}>{s.d}</p>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {slides.map((_, i) => (
            <span key={i} style={{
              flex: i === idx ? 2 : 1, height: 3, borderRadius: 99,
              background: i === idx ? accent : 'rgba(255,255,255,0.1)',
              boxShadow: i === idx ? `0 0 8px ${accent}` : 'none', transition: 'all .4s ease',
            }} />
          ))}
        </div>
      </div>
      <div style={{
        padding: 14, borderRadius: 12,
        background: `linear-gradient(135deg, ${accent}1a, transparent)`,
        border: `1px solid ${accent}33`, marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 11, color: NEON.mute, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</span>
          <span style={{ fontSize: 10, color: '#34d399' }}>● live</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: NEON.text }}>{stat.value}</span>
          <span style={{ fontSize: 11, color: NEON.mute }}>{stat.sub}</span>
        </div>
        <svg width="100%" height="36" viewBox="0 0 200 36" style={{ marginTop: 6 }}>
          <defs>
            <linearGradient id={`spk-${align}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 28 L20 22 L40 25 L60 14 L80 18 L100 10 L120 16 L140 8 L160 12 L180 6 L200 10 L200 36 L0 36 Z" fill={`url(#spk-${align})`} />
          <path d="M0 28 L20 22 L40 25 L60 14 L80 18 L100 10 L120 16 L140 8 L160 12 L180 6 L200 10" fill="none" stroke={accent} strokeWidth="1.6" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {chips.map(c => (
          <span key={c} style={{
            fontSize: 11, padding: '5px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${NEON.border}`, color: NEON.mute,
          }}>{c}</span>
        ))}
      </div>
    </div>
  </aside>
);

const ForgotView: React.FC<{ accent: string; onBack: () => void }> = ({ accent, onBack }) => {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <p style={{ fontSize: 13, color: NEON.mute, marginBottom: 14 }}>
        Enter your email and we’ll send a secure recovery link.
      </p>
      <Field label="Email" focused={false} accent={accent}>
        <input className="lv-input" type="email" placeholder="you@company.com" style={inputStyle} />
      </Field>
      <PrimaryButton accent={accent} type="button" label={sent ? 'Recovery link sent' : 'Send recovery link'} onClick={() => setSent(true)} />
      <button type="button" onClick={onBack} style={{ ...linkBtn, marginTop: 14, display: 'block', width: '100%', textAlign: 'center' }}>
        ← Back to sign in
      </button>
    </div>
  );
};

const OtpView: React.FC<{ accent: string; otp: string[]; setOtpAt: (i: number, v: string) => void; otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>; onSubmit: () => void }> = ({ accent, otp, setOtpAt, otpRefs, onSubmit }) => (
  <div>
    <p style={{ fontSize: 13, color: NEON.mute, marginBottom: 14 }}>
      We sent a 6-digit code to your trusted device.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
      {otp.map((v, i) => (
        <input key={i}
          ref={el => (otpRefs.current[i] = el)}
          value={v} onChange={e => setOtpAt(i, e.target.value)}
          inputMode="numeric" maxLength={1}
          style={{
            height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700,
            background: 'rgba(8,12,28,0.7)', color: NEON.text,
            border: `1px solid ${v ? accent : 'rgba(120,160,255,0.18)'}`,
            borderRadius: 10, outline: 'none',
            boxShadow: v ? `0 0 0 3px ${accent}22` : 'none',
          }} />
      ))}
    </div>
    <PrimaryButton accent={accent} type="button" label="Verify code" onClick={onSubmit} />
    <p style={{ marginTop: 12, fontSize: 12, color: NEON.mute, textAlign: 'center' }}>
      Didn’t receive it? <button type="button" style={linkBtn}>Resend in 0:32</button>
    </p>
  </div>
);

const TwoFAView: React.FC<{ accent: string; onSubmit: () => void }> = ({ accent, onSubmit }) => (
  <div>
    <p style={{ fontSize: 13, color: NEON.mute, marginBottom: 14 }}>
      Open your authenticator app and enter the 6-digit token.
    </p>
    <div style={{
      padding: 16, borderRadius: 12, marginBottom: 14,
      background: `linear-gradient(135deg, ${accent}14, ${NEON.violet}14)`,
      border: `1px solid ${NEON.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `linear-gradient(135deg, ${accent}, ${NEON.violet})`,
        display: 'grid', placeItems: 'center', fontSize: 18, color: '#06091a',
      }}>🛡️</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Authenticator required</div>
        <div style={{ fontSize: 11, color: NEON.mute }}>Time-based code · refreshes every 30s</div>
      </div>
      <div style={{
        width: 30, height: 30, borderRadius: 99, border: `2px solid ${accent}`, borderTopColor: 'transparent',
        animation: 'lvSpin 1.4s linear infinite',
      }} />
    </div>
    <Field label="Token" focused={false} accent={accent}>
      <input className="lv-input" inputMode="numeric" maxLength={6} placeholder="123 456" style={{ ...inputStyle, letterSpacing: 8, textAlign: 'center', fontSize: 18 }} />
    </Field>
    <PrimaryButton accent={accent} type="button" label="Authenticate" onClick={onSubmit} />
  </div>
);

const BiometricView: React.FC<{
  accent: string;
  kind: 'fingerprint' | 'faceid';
  setKind: (k: 'fingerprint' | 'faceid') => void;
  state: 'idle' | 'scanning' | 'done';
  setState: (s: 'idle' | 'scanning' | 'done') => void;
  onDone: () => void;
}> = ({ accent, kind, setKind, state, setState, onDone }) => {
  const start = () => {
    setState('scanning');
    setTimeout(() => { setState('done'); setTimeout(onDone, 500); }, 1600);
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['fingerprint', 'faceid'] as const).map(k => (
          <button key={k} type="button" onClick={() => setKind(k)} style={{
            flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600,
            background: kind === k ? `linear-gradient(135deg, ${accent}33, ${NEON.violet}33)` : 'rgba(255,255,255,0.03)',
            color: kind === k ? NEON.text : NEON.mute,
            border: `1px solid ${kind === k ? accent + '66' : NEON.border}`,
          }}>
            {k === 'fingerprint' ? '👆 Fingerprint' : '😊 Face ID'}
          </button>
        ))}
      </div>
      <div onClick={state === 'idle' ? start : undefined} style={{
        position: 'relative', height: 180, borderRadius: 16, cursor: state === 'idle' ? 'pointer' : 'default',
        background: `radial-gradient(circle at 50% 50%, ${accent}1a, transparent 70%)`,
        border: `1px solid ${NEON.border}`, overflow: 'hidden',
        display: 'grid', placeItems: 'center', marginBottom: 14,
      }}>
        {state === 'scanning' && (
          <span style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            boxShadow: `0 0 14px ${accent}`,
            animation: 'lvScan 1.6s linear infinite',
          }} />
        )}
        {kind === 'fingerprint' ? (
          <svg width="92" height="92" viewBox="0 0 92 92" fill="none" stroke={state === 'done' ? '#34d399' : accent} strokeWidth="2" strokeLinecap="round">
            <path d="M46 12 C28 12 18 26 18 44 C18 56 22 66 26 74" />
            <path d="M46 20 C32 20 26 32 26 44 C26 56 30 64 34 72" />
            <path d="M46 28 C36 28 32 36 32 46 C32 56 36 64 40 72" />
            <path d="M46 36 C40 36 38 42 38 48 C38 58 42 66 46 72" />
            <path d="M46 44 C44 44 44 50 46 56 C48 62 50 68 52 72" />
            <path d="M54 24 C62 28 66 36 66 46" />
            <path d="M62 18 C72 24 74 36 72 50" />
          </svg>
        ) : (
          <svg width="92" height="92" viewBox="0 0 92 92" fill="none" stroke={state === 'done' ? '#34d399' : accent} strokeWidth="2" strokeLinecap="round">
            <path d="M14 22 L14 14 L22 14 M70 14 L78 14 L78 22 M78 70 L78 78 L70 78 M22 78 L14 78 L14 70" />
            <circle cx="36" cy="40" r="3" fill={state === 'done' ? '#34d399' : accent} />
            <circle cx="56" cy="40" r="3" fill={state === 'done' ? '#34d399' : accent} />
            <path d="M36 56 Q46 64 56 56" />
            <path d="M30 30 L30 38 M62 30 L62 38" />
          </svg>
        )}
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: NEON.mute, marginBottom: 14 }}>
        {state === 'idle' && (kind === 'fingerprint' ? 'Tap the sensor to scan your fingerprint' : 'Look at the camera to authenticate')}
        {state === 'scanning' && 'Verifying neural pattern…'}
        {state === 'done' && '✅ Identity confirmed'}
      </p>
      {state === 'idle' && <PrimaryButton accent={accent} type="button" label={kind === 'fingerprint' ? 'Scan fingerprint' : 'Scan face'} onClick={start} />}
    </div>
  );
};

const SuccessAnim: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ padding: '30px 0', display: 'grid', placeItems: 'center', animation: 'lvSlideUp .4s ease' }}>
    <div style={{
      position: 'relative', width: 92, height: 92, borderRadius: '50%',
      background: `radial-gradient(circle, ${accent}33, transparent 70%)`,
      display: 'grid', placeItems: 'center',
    }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${accent}`, animation: 'lvRing 1.6s ease-out infinite' }} />
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="24" stroke={accent} strokeWidth="2.5" />
        <path d="M16 29 L25 38 L40 20" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <animate attributeName="stroke-dasharray" from="0,60" to="60,0" dur=".5s" fill="freeze" />
        </path>
      </svg>
    </div>
    <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600 }}>Authenticated · entering Command Center</p>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithCredentials } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [bioState, setBioState] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [bioKind, setBioKind] = useState<'fingerprint' | 'faceid'>('fingerprint');
  const [success, setSuccess] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(0);
  useEffect(() => {
    const a = setInterval(() => setLeftIdx(i => (i + 1) % LEFT_SLIDES.length), 4200);
    const b = setInterval(() => setRightIdx(i => (i + 1) % RIGHT_SLIDES.length), 4800);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const robotRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = robotRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      setPupil({ x: (dx / d) * Math.min(3.2, d / 60), y: (dy / d) * Math.min(3.2, d / 60) });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    }, 3200 + (Date.now() % 1800));
    return () => clearInterval(id);
  }, []);

  const doLogin = useCallback((r: Role, em = 'demo@platform.io') => {
    setSuccess(true);
    window.setTimeout(async () => {
      const res = await login(em, 'x', r);
      navigate(res.ok ? res.redirect : r === 'admin' ? '/admin' : r === 'reseller' ? '/reseller/dashboard' : '/dashboard', { replace: true });
    }, 850);
  }, [login, navigate]);

  const quickLogin = useCallback(async (r: Role, em: string) => {
    setAuthError('');
    setSuccess(true);
    const res = await login(em, 'test', r);
    navigate(res.ok ? res.redirect : r === 'admin' ? '/admin' : r === 'reseller' ? '/reseller/dashboard' : '/dashboard', { replace: true });
  }, [login, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    if (password.length < 1) return;
    setSubmitting(true);
    // Always validate against the seeded credential table first.
    const res = await loginWithCredentials(email, password);
    setSubmitting(false);
    if (res.ok === true) {
      setSuccess(true);
      setTimeout(() => navigate(res.redirect), 850);
    } else {
      setAuthError(res.error);
    }
  };

  const accent = role === 'admin' ? '#f5b042' : role === 'reseller' ? NEON.violet : NEON.cyan;
  const accentGlow = `0 0 24px ${accent}55, 0 0 60px ${accent}22`;

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setOtpAt = (i: number, v: string) => {
    const ch = v.replace(/\D/g, '').slice(-1);
    setOtp(prev => { const n = [...prev]; n[i] = ch; return n; });
    if (ch && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      l: (i * 3.5) % 100,
      t: (i * 2.8) % 100,
      s: 1 + (i % 3) * 0.8,
      d: 8 + (i % 7) * 2,
      delay: (i % 6),
      c: i % 3 === 0 ? NEON.violet : NEON.cyan,
    })), []);

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(1200px 600px at 12% 10%, rgba(34,211,238,0.10), transparent 60%),
                   radial-gradient(900px 500px at 88% 90%, rgba(139,92,246,0.12), transparent 60%),
                   linear-gradient(180deg, #050816 0%, #070b1a 50%, #050816 100%)`,
      color: NEON.text, position: 'relative', overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, sans-serif',
    }}>
      <style>{`
        @keyframes lvFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes lvDrift { 0%{transform:translate(0,0); opacity:0} 10%{opacity:.7} 100%{transform:translate(40px,-120px); opacity:0} }
        @keyframes lvPulse { 0%,100%{opacity:.55; transform:scale(1)} 50%{opacity:1; transform:scale(1.04)} }
        @keyframes lvRing  { 0%{transform:scale(.6); opacity:.9} 100%{transform:scale(1.6); opacity:0} }
        @keyframes lvSlideUp { from{opacity:0; transform:translateY(14px)} to{opacity:1; transform:translateY(0)} }
        @keyframes lvScan { 0%{top:0} 100%{top:100%} }
        @keyframes lvGridShift { 0%{background-position:0 0} 100%{background-position:80px 80px} }
        @keyframes lvSpin { to{transform:rotate(360deg)} }
        .lv-input::placeholder { color: #5d6a8a; }
        .lv-pill { transition: all .25s ease; }
        .lv-pill:hover { transform: translateY(-1px); }
        .lv-grid {
          background-image:
            linear-gradient(rgba(120,160,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,160,255,0.06) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: lvGridShift 18s linear infinite;
        }
        @media (max-width: 1024px) {
          .lv-main { grid-template-columns: 1fr !important; }
          .lv-aside { display: none !important; }
        }
      `}</style>

      <div className="lv-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.map(p => (
          <span key={p.id} style={{
            position: 'absolute', left: `${p.l}%`, top: `${p.t}%`,
            width: p.s, height: p.s, borderRadius: 99, background: p.c,
            boxShadow: `0 0 8px ${p.c}`, opacity: 0.6,
            animation: `lvDrift ${p.d}s ${p.delay}s linear infinite`,
          }} />
        ))}
      </div>

      <header style={{
        position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo variant="horizontal" height={34} withGlow />
          <span style={{ fontSize: 11, color: NEON.mute, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase', borderLeft: `1px solid ${NEON.border}`, paddingLeft: 12 }}>
            Command Center
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: NEON.mute }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
            All systems online
          </span>
        </div>
      </header>

      <main className="lv-main" style={{
        position: 'relative', zIndex: 4,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(420px, 520px) minmax(0,1fr)',
        gap: 28, padding: '12px 28px 40px', alignItems: 'center',
      }}>
        <div className="lv-aside">
          <SidePanel align="left" accent={NEON.cyan} title="For Founders" slides={LEFT_SLIDES} idx={leftIdx}
            stat={{ label: 'MRR uplift', value: '+38.2%', sub: 'last 30d' }}
            chips={['Stripe-grade billing', 'AI growth loops', 'Global CDN']} />
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'lvSlideUp .5s ease' }}>
          <div ref={robotRef} style={{ position: 'relative', marginBottom: -28, animation: 'lvFloat 5s ease-in-out infinite', display: 'grid', placeItems: 'center' }}>
            <span style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `1px solid #2D8CFF55`, animation: 'lvRing 2.4s ease-out infinite' }} />
            <span style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `1px solid #2D8CFF33`, animation: 'lvRing 2.4s 1.2s ease-out infinite' }} />
            <Logo variant="round" height={116} withGlow />
          </div>
          <div style={{ textAlign: 'center', marginTop: 18, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: '#2D8CFF', textTransform: 'uppercase' }}>The Name of Trust</div>
            <div style={{ fontSize: 13, color: NEON.mute, marginTop: 4 }}>Global Enterprise Operating System</div>
          </div>

          <div style={{
            width: '100%', padding: '54px 30px 28px', borderRadius: 20,
            background: `linear-gradient(180deg, rgba(20,28,52,0.78), rgba(10,15,30,0.78))`,
            border: `1px solid ${NEON.border}`,
            backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
            boxShadow: `0 30px 80px -25px rgba(0,0,0,0.7), 0 0 0 1px rgba(120,160,255,0.08) inset`,
            position: 'relative', overflow: 'hidden',
          }}>
            <span style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, background: `radial-gradient(circle at 0 0, ${accent}33, transparent 70%)` }} />
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at 100% 100%, ${NEON.violet}33, transparent 70%)` }} />

            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
              {(['user', 'reseller', 'admin'] as Role[]).map(r => {
                const c = r === 'admin' ? '#f5b042' : r === 'reseller' ? NEON.violet : NEON.cyan;
                const active = role === r;
                return (
                  <button key={r} type="button" onClick={() => setRole(r)} className="lv-pill" style={{
                    padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
                    background: active ? `linear-gradient(135deg, ${c}, ${c}aa)` : 'rgba(255,255,255,0.04)',
                    color: active ? '#0a0f1f' : NEON.mute,
                    border: `1px solid ${active ? c : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: active ? `0 0 18px ${c}66` : 'none', cursor: 'pointer',
                  }}>
                    {r === 'user' ? 'Member' : r === 'reseller' ? 'Reseller' : 'Boss'}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: `1px solid ${NEON.border}`, marginBottom: 22 }}>
              {([['login', 'Sign in'], ['otp', 'OTP'], ['2fa', '2FA'], ['biometric', 'Biometric']] as [Mode, string][]).map(([k, label]) => (
                <button key={k} type="button" onClick={() => setMode(k)} style={{
                  flex: 1, padding: '8px 6px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  background: mode === k ? `linear-gradient(135deg, ${accent}33, ${NEON.violet}33)` : 'transparent',
                  color: mode === k ? NEON.text : NEON.mute,
                  boxShadow: mode === k ? `inset 0 0 0 1px ${accent}55` : 'none',
                }}>{label}</button>
              ))}
            </div>

            {success ? (
              <SuccessAnim accent={accent} />
            ) : mode === 'login' ? (
              <form onSubmit={handleLogin}>
                <Field label="Email" focused={focused === 'email'} accent={accent}>
                  <input className="lv-input" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    placeholder="you@company.com" style={inputStyle} />
                </Field>
                <Field label="Password" focused={focused === 'password'} accent={accent}
                  right={<button type="button" onClick={() => setShowPassword(v => !v)} style={linkBtn}>{showPassword ? 'Hide' : 'Show'}</button>}>
                  <input className="lv-input" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                    placeholder="••••••••••" style={inputStyle} />
                </Field>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 18px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: NEON.mute, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: accent }} /> Remember device
                  </label>
                  <button type="button" onClick={() => setMode('forgot')} style={linkBtn}>Forgot password?</button>
                </div>
                <PrimaryButton accent={accent} label={role === 'admin' ? 'Enter Command Center' : role === 'reseller' ? 'Continue as Reseller' : 'Sign in securely'} />
                {authError && (
                  <p style={{ marginTop: 12, fontSize: 12, color: '#fca5a5', textAlign: 'center' }}>
                    {authError}
                  </p>
                )}
                {submitting && !authError && (
                  <p style={{ marginTop: 12, fontSize: 11, color: NEON.mute, textAlign: 'center', letterSpacing: 0.4 }}>
                    Verifying credentials…
                  </p>
                )}
              </form>
            ) : mode === 'forgot' ? (
              <ForgotView accent={accent} onBack={() => setMode('login')} />
            ) : mode === 'otp' ? (
              <OtpView accent={accent} otp={otp} setOtpAt={setOtpAt} otpRefs={otpRefs} onSubmit={() => doLogin(role)} />
            ) : mode === '2fa' ? (
              <TwoFAView accent={accent} onSubmit={() => doLogin(role)} />
            ) : (
              <BiometricView accent={accent} kind={bioKind} setKind={setBioKind} state={bioState} setState={setBioState} onDone={() => doLogin(role)} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 14px', color: NEON.mute, fontSize: 11, letterSpacing: 1 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              QUICK ACCESS
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <QuickBtn color={NEON.cyan} label="Member" onClick={() => quickLogin('user', 'user@test.com')} />
              <QuickBtn color={NEON.violet} label="Reseller" onClick={() => quickLogin('reseller', 'reseller@test.com')} />
              <QuickBtn color="#f5b042" label="Boss" onClick={() => quickLogin('admin', 'boss@test.com')} />
            </div>

            <p style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: NEON.mute }}>
              New here?{' '}
              <Link to="/signup" style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          </div>

          <p style={{ marginTop: 14, fontSize: 11, color: NEON.mute, letterSpacing: 0.4 }}>
            🔒 End-to-end encrypted · SOC2 · ISO 27001
          </p>
        </section>

        <div className="lv-aside">
          <SidePanel align="right" accent={NEON.violet} title="For Resellers" slides={RIGHT_SLIDES} idx={rightIdx}
            stat={{ label: 'Avg payout', value: '$4,820', sub: 'this month' }}
            chips={['Daily payouts', 'White-label', 'Realtime CRM']} />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;