import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { LayoutDashboard, CheckSquare, Bot, Settings, LogOut, Menu, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',    icon: CheckSquare,     label: 'Tasks' },
  { to: '/coach',    icon: Bot,             label: 'AI Coach' },
  { to: '/settings', icon: Settings,        label: 'Settings' },
];

export default function Layout({ session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success('Signed out');
    navigate('/auth');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '20px 12px', flexShrink: 0 }}>
        <SidebarContent session={session} onSignOut={handleSignOut} close={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />}
      <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '20px 12px', zIndex: 41, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease' }}>
        <SidebarContent session={session} onSignOut={handleSignOut} close={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <header className="mobile-header" style={{ display: 'none', padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => setMobileOpen(true)} style={{ padding: 6 }}><Menu size={20} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={16} color="var(--amber-500)" />
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, color: 'var(--amber-400)' }}>Task Catalyst</span>
          </div>
        </header>
        <div style={{ flex: 1, padding: '24px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ session, onSignOut, close }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 24px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="#0A0E1A" />
        </div>
        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'var(--amber-400)' }}>Task Catalyst</span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={close}>
            <Icon size={17} />{label}
          </NavLink>
        ))}
      </nav>

      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{ padding: '4px 8px 8px', fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session?.user?.email}
        </div>
        <button className="nav-item" onClick={onSignOut} style={{ color: 'var(--rose-400)' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );
}
