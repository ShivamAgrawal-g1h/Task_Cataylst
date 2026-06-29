import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Zap, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name } } });
        if (error) throw error;
        toast.success('Account created! Welcome to Task Catalyst.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', marginBottom: 16, animation: 'pulse-glow 2s infinite' }}>
            <Zap size={28} color="#0A0E1A" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--amber-400)' }}>Task Catalyst</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 15 }}>Your AI-powered productivity companion</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            {mode === 'login' ? 'Sign in to continue your productivity journey' : 'Start building better habits today'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={L}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input" style={{ paddingLeft: 36 }} placeholder="Shivam Agrawal" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
              </div>
            )}
            <div>
              <label style={L}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 36 }} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <div>
              <label style={L}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" style={{ paddingLeft: 36 }} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px', fontSize: 15, marginTop: 4 }} disabled={loading}>
              {loading ? <Spinner dark /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--text-secondary)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--amber-400)', fontWeight: 600 }}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>Powered by Google Gemini AI</p>
      </div>
    </div>
  );
}

const L = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' };
const Spinner = ({ dark }) => <span className="spin" style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'}`, borderTopColor: dark ? '#0A0E1A' : '#fff', display: 'inline-block' }} />;
