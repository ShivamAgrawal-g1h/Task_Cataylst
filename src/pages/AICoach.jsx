import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { chatWithCoach, analyzeProductivityPersonality } from '../lib/gemini.js';
import { Bot, Send, Sparkles, Brain, RefreshCw, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK = [
  "What should I work on right now?",
  "How do I stop procrastinating?",
  "Help me plan my study session",
  "Give me a 2-minute motivation boost",
  "I'm feeling overwhelmed, help me",
];

export default function AICoach({ session }) {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [sending, setSending]           = useState(false);
  const [tasks, setTasks]               = useState([]);
  const [profile, setProfile]           = useState(null);
  const [personality, setPersonality]   = useState(null);
  const [analyzing, setAnalyzing]       = useState(false);
  const endRef = useRef(null);
  const navigate = useNavigate();
  const userId = session.user.id;

  useEffect(() => { load(); }, [userId]); // eslint-disable-line
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function load() {
    const [{ data: td }, { data: pd }] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', userId),
      supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle(),
    ]);
    const t = td || [];
    setTasks(t);
    setProfile(pd);
    if (pd?.productivity_type && pd.productivity_type !== 'unknown') setPersonality({ type: pd.productivity_type });

    const name    = pd?.name?.split(' ')[0] || 'there';
    const pending = t.filter(x => x.status === 'pending' || x.status === 'in_progress').length;
    const overdue = t.filter(x => x.deadline && new Date(x.deadline) < new Date() && x.status !== 'completed').length;
    let greeting  = `Hey ${name}! I'm your AI productivity coach, powered by Google Gemini.\n\nYou have **${pending} pending tasks**${overdue > 0 ? ` and **${overdue} overdue**` : ''}. How can I help you today?`;
    if (!pd?.gemini_api_key) greeting += `\n\n⚠️ Add your Gemini API key in Settings to unlock full AI coaching.`;
    setMessages([{ role: 'ai', content: greeting }]);
  }

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || sending) return;
    setInput('');
    setSending(true);
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    const reply = await chatWithCoach(next, msg, tasks, profile?.gemini_api_key || '');
    setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    setSending(false);
  }

  async function analyze() {
    setAnalyzing(true);
    const completed = tasks.filter(t => t.status === 'completed').length;
    const postponed = tasks.reduce((s, t) => s + (t.postpone_count || 0), 0);
    const onTime    = tasks.filter(t => t.status==='completed' && t.deadline && t.completed_at && new Date(t.completed_at) <= new Date(t.deadline)).length;
    const late      = tasks.filter(t => t.status==='completed' && t.deadline && t.completed_at && new Date(t.completed_at) > new Date(t.deadline)).length;
    const weeks     = Math.max(1, Math.round((Date.now() - new Date(session.user.created_at)) / (7*24*60*60*1000)));
    const result    = await analyzeProductivityPersonality({ completed, postponed, onTime, late, avgPerWeek: completed/weeks }, profile?.gemini_api_key || '');
    setPersonality(result);
    await supabase.from('user_profiles').update({ productivity_type: result.type }).eq('user_id', userId);
    setAnalyzing(false);
    toast.success('Personality analyzed!');
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, height:'calc(100vh - 100px)' }} className="fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,rgba(6,182,212,0.25),rgba(245,158,11,0.15))',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Bot size={20} color="var(--cyan-400)" />
          </div>
          <div>
            <h1 style={{ fontSize:22,fontWeight:800 }}>AI Coach</h1>
            <p style={{ color:'var(--text-secondary)',fontSize:13 }}>Powered by Google Gemini</p>
          </div>
        </div>
        {!profile?.gemini_api_key && (
          <button className="btn btn-secondary" onClick={() => navigate('/settings')}><Key size={13}/> Add API Key</button>
        )}
      </div>

      <div style={{ display:'flex', gap:18, flex:1, minHeight:0 }}>
        {/* Chat */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10, minHeight:0 }}>
          <div style={{ flex:1,overflowY:'auto',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:18,display:'flex',flexDirection:'column',gap:14 }}>
            {messages.map((m,i) => (
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-start', gap:8 }}>
                {m.role==='ai' && (
                  <div style={{ width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,rgba(6,182,212,0.25),rgba(245,158,11,0.15))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2 }}>
                    <Sparkles size={13} color="var(--cyan-400)"/>
                  </div>
                )}
                <div className={`chat-bubble ${m.role}`}>{fmt(m.content)}</div>
              </div>
            ))}
            {sending && (
              <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                <div style={{ width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,rgba(6,182,212,0.25),rgba(245,158,11,0.15))',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Sparkles size={13} color="var(--cyan-400)" className="spin"/>
                </div>
                <div className="chat-bubble ai" style={{ display:'flex',gap:5,alignItems:'center',padding:'14px 16px' }}>
                  {[0,150,300].map(d=><span key={d} style={{ width:6,height:6,borderRadius:'50%',background:'var(--surface-3)',display:'inline-block',animation:`shimmer 1s ${d}ms infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
            {QUICK.map((p,i) => (
              <button key={i} className="btn btn-secondary" style={{ fontSize:12,padding:'5px 10px' }} onClick={() => send(p)} disabled={sending}>{p}</button>
            ))}
          </div>

          <div style={{ display:'flex',gap:10 }}>
            <textarea className="input" rows={2} style={{ flex:1,resize:'none' }} placeholder="Ask your AI coach... (Enter to send, Shift+Enter for new line)" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} disabled={sending}/>
            <button className="btn btn-primary" style={{ alignSelf:'flex-end',padding:'10px 16px' }} onClick={() => send()} disabled={sending||!input.trim()}><Send size={16}/></button>
          </div>
        </div>

        {/* Side panel */}
        <div className="coach-side-panel" style={{ width:250,display:'flex',flexDirection:'column',gap:14 }}>
          <div className="card">
            <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:14 }}>
              <Brain size={15} color="var(--amber-400)"/>
              <span style={{ fontWeight:700,fontSize:14 }}>Productivity Profile</span>
            </div>
            {personality ? <PersonCard p={personality}/> : (
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:12,color:'var(--text-secondary)',marginBottom:12,lineHeight:1.6 }}>Analyze your task history to determine your productivity personality type.</p>
                {tasks.filter(t=>t.status==='completed').length < 3
                  ? <p style={{ fontSize:12,color:'var(--text-muted)' }}>Complete 3+ tasks to unlock analysis.</p>
                  : <button className="btn btn-primary" style={{ width:'100%',fontSize:13,padding:'8px' }} onClick={analyze} disabled={analyzing}>{analyzing?<span className="spin" style={{width:16,height:16,borderRadius:'50%',border:'2px solid rgba(0,0,0,0.2)',borderTopColor:'#0A0E1A',display:'inline-block'}}/>:<><Sparkles size={13}/>Analyze</>}</button>
                }
              </div>
            )}
            {personality && <button className="btn btn-secondary" style={{ width:'100%',fontSize:12,padding:6,marginTop:10 }} onClick={analyze} disabled={analyzing}><RefreshCw size={12} className={analyzing?'spin':''}/> Re-analyze</button>}
          </div>

          <div className="card">
            <div style={{ fontWeight:700,fontSize:14,marginBottom:12 }}>Task Stats</div>
            {[
              ['Total',     tasks.length,                                          'var(--text-primary)'],
              ['Completed', tasks.filter(t=>t.status==='completed').length,        'var(--emerald-400)'],
              ['Pending',   tasks.filter(t=>t.status==='pending'||t.status==='in_progress').length, 'var(--cyan-400)'],
              ['Overdue',   tasks.filter(t=>t.deadline&&new Date(t.deadline)<new Date()&&t.status!=='completed').length, 'var(--rose-400)'],
              ['Postponed', tasks.reduce((s,t)=>s+(t.postpone_count||0),0),        'var(--orange-400)'],
            ].map(([l,v,c])=>(
              <div key={l} style={{ display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:12,color:'var(--text-muted)' }}>{l}</span>
                <span style={{ fontSize:13,fontWeight:700,color:c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonCard({ p }) {
  const COLORS = { 'Sprinter':{'color':'var(--orange-400)','bg':'rgba(251,146,60,0.12)'}, 'Consistent Worker':{'color':'var(--emerald-400)','bg':'rgba(52,211,153,0.12)'}, 'Perfectionist':{'color':'var(--cyan-400)','bg':'rgba(34,211,238,0.12)'}, 'Procrastinator':{'color':'var(--rose-400)','bg':'rgba(251,113,133,0.12)'} };
  const { color, bg } = COLORS[p.type] || { color:'var(--text-muted)',bg:'var(--surface-2)' };
  return (
    <div>
      <div style={{ display:'inline-flex',padding:'5px 12px',borderRadius:100,background:bg,marginBottom:8 }}>
        <span style={{ fontSize:13,fontWeight:700,color }}>{p.type}</span>
      </div>
      {p.description && <p style={{ fontSize:12,color:'var(--text-secondary)',marginBottom:10,lineHeight:1.6 }}>{p.description}</p>}
      {p.strengths && <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:10,fontWeight:700,color:'var(--emerald-400)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em' }}>Strengths</div>
        {p.strengths.map((s,i)=><div key={i} style={{ fontSize:12,color:'var(--text-secondary)',display:'flex',gap:5 }}><span style={{color:'var(--emerald-400)'}}>+</span>{s}</div>)}
      </div>}
      {p.tips && <div>
        <div style={{ fontSize:10,fontWeight:700,color:'var(--amber-400)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em' }}>Tips For You</div>
        {p.tips.map((t,i)=><div key={i} style={{ fontSize:12,color:'var(--text-secondary)',display:'flex',gap:5,lineHeight:1.5,marginBottom:3 }}><span style={{color:'var(--amber-400)',flexShrink:0}}>→</span>{t}</div>)}
      </div>}
    </div>
  );
}

function fmt(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((p,i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2,-2)}</strong> : p
  );
}
