import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { computePriorityScore } from '../lib/priority.js';

const CATEGORIES = [
  { value: 'study',    label: 'Study / Academics' },
  { value: 'coding',   label: 'Coding / Projects' },
  { value: 'health',   label: 'Health & Fitness' },
  { value: 'personal', label: 'Personal' },
  { value: 'work',     label: 'Work / Internship' },
  { value: 'general',  label: 'General' },
];

const defaultForm = { title: '', description: '', deadline: '', importance: 3, time_estimate: 1, category: 'general' };

export default function AddTaskModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || defaultForm);
  const [saving, setSaving] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      deadline: form.deadline || null,
      time_estimate: parseFloat(form.time_estimate) || 1,
      importance: parseInt(form.importance),
      priority_score: computePriorityScore({ ...form, time_estimate: parseFloat(form.time_estimate) || 1 }),
    });
    setSaving(false);
  }

  const liveScore = computePriorityScore({ ...form, time_estimate: parseFloat(form.time_estimate) || 1 });
  const scoreColor = liveScore >= 75 ? 'var(--rose-400)' : liveScore >= 55 ? 'var(--orange-400)' : liveScore >= 35 ? 'var(--amber-400)' : 'var(--emerald-400)';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{initial ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 6 }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={L}>Task Title *</label>
            <input className="input" placeholder="e.g. Complete DSA assignment on Trees" value={form.title} onChange={e => set('title', e.target.value)} required autoFocus />
          </div>

          <div>
            <label style={L}>Description (optional)</label>
            <textarea className="input" rows={2} style={{ resize: 'vertical', minHeight: 56 }} placeholder="Notes or context..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={L}>Deadline</label>
              <input className="input" type="datetime-local" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
            </div>
            <div>
              <label style={L}>Time Estimate (hours)</label>
              <input className="input" type="number" min={0.25} max={40} step={0.25} value={form.time_estimate} onChange={e => set('time_estimate', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={L}>Category</label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label style={L}>Importance Rating</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" className="star-btn" onClick={() => set('importance', n)}>
                  <Star size={24} fill={n <= form.importance ? 'var(--amber-500)' : 'none'} color={n <= form.importance ? 'var(--amber-500)' : 'var(--surface-3)'} />
                </button>
              ))}
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4 }}>
                {['','Low','Below avg','Average','High','Critical'][form.importance]}
              </span>
            </div>
          </div>

          {/* Live priority preview */}
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Priority Score Preview</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--surface-3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${liveScore}%`, background: scoreColor, borderRadius: 3, transition: 'all 0.3s' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>{liveScore}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner /> : (initial ? 'Save Changes' : 'Add Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const L = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-secondary)' };
const Spinner = () => <span className="spin" style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0A0E1A', display: 'inline-block' }} />;
