import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NavIcon = ({ d }) => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CUSTOMER_LINKS = [
  { label:'Dashboard',  path:'/dashboard',    d:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { label:'Reserve',    path:'/reserve',      d:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
  { label:'Bookings',   path:'/reservations', d:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
  { label:'Profile',    path:'/profile',      d:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
];

const ADMIN_LINKS = [
  { label:'Dashboard',     path:'/admin/dashboard',    d:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { label:'Reservations',  path:'/admin/reservations', d:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
  { label:'Tables',        path:'/admin/tables',       d:'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  { label:'Profile',       path:'/profile',            d:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  if (!user) return null;

  const links = user.role === 'admin' ? ADMIN_LINKS : CUSTOMER_LINKS;
  const initial = user.name?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className="hidden md:flex flex-col fixed left-4 top-4 bottom-4 z-40 transition-all duration-300"
        style={{
          width: collapsed ? 68 : 220,
          background:'linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(9,9,11,0.95) 100%)',
          backdropFilter:'blur(32px)',
          borderRadius:20,
          border:'1px solid rgba(255,255,255,0.07)',
          boxShadow:'0 0 40px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.05)',
          padding:'16px 12px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)', boxShadow:'0 0 16px rgba(59,130,246,0.5)' }}>
            <span className="text-sm font-bold text-white">✦</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-sm tracking-wide" style={{ fontFamily:'Syne,sans-serif' }}>
              FineDine
              <span className="block text-[9px] text-white/30 font-normal tracking-widest uppercase">
                {user.role === 'admin' ? 'Admin' : 'Platform'}
              </span>
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ label, path, d }) => (
            <NavLink
              key={path} to={path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-3' : ''}`}
              title={collapsed ? label : ''}
            >
              <NavIcon d={d} />
              {!collapsed && <span className="text-xs font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + collapse */}
        <div className="space-y-2">
          <div className="fx-divider mb-3" />

          {/* User chip */}
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}
            style={{ background:'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)', boxShadow:'0 0 10px rgba(59,130,246,0.4)' }}>
              {initial}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{user.role}</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className={`nav-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/8 ${collapsed ? 'justify-center px-3' : ''}`}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {!collapsed && <span className="text-xs">Logout</span>}
          </button>

          {/* Collapse toggle */}
          <button onClick={() => setCollapsed(!collapsed)}
            className="nav-item w-full justify-center text-white/20 hover:text-white/50">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d={collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          background: scrolled ? 'rgba(9,9,11,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition:'all .3s',
        }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
            <span className="text-sm text-white font-bold">✦</span>
          </div>
          <span className="font-bold text-white text-sm" style={{ fontFamily:'Syne,sans-serif' }}>FineDine</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60"
          style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d={mobileOpen ? 'M18 6L6 18M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="relative w-64 h-full flex flex-col p-5 gap-1"
            style={{ background:'rgba(9,9,11,0.97)', backdropFilter:'blur(40px)', borderRight:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-8 mt-10">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#3B82F6,#8B5CF6)' }}>
                <span className="text-white font-bold">✦</span>
              </div>
              <span className="font-bold text-white" style={{ fontFamily:'Syne,sans-serif' }}>FineDine</span>
            </div>
            {links.map(({ label, path, d }) => (
              <NavLink key={path} to={path} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <NavIcon d={d} />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
            <div className="flex-1" />
            <div className="fx-divider mb-3" />
            <button onClick={handleLogout} className="nav-item w-full text-red-400/70 hover:text-red-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
