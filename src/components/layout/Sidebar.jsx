import React from 'react';
import { Logo } from '../common/Logo';
import { NAV_ITEMS } from '../../constants/navigation';
import { T } from '../../constants/theme';

function NavItem({ item, active, onNav }) {
  const isActive = active === item.id;
  return (
    <button
      onClick={() => onNav(item.id)}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "10px 14px", borderRadius: 12, border: "none",
        background: isActive ? T.primaryLight : "transparent",
        color: isActive ? T.primary : T.textLight,
        fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 4,
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { 
        if (!isActive) { 
          e.currentTarget.style.background = "#F0F4FA"; 
          e.currentTarget.style.color = T.text; 
        } 
      }}
      onMouseLeave={e => { 
        if (!isActive) { 
          e.currentTarget.style.background = "transparent"; 
          e.currentTarget.style.color = T.textLight; 
        } 
      }}
    >
      <span style={{ fontSize: 18 }}>{item.icon}</span>
      {item.label}
    </button>
  );
}

export function Sidebar({ active, onNav, user, onLogout }) {
  return (
    <aside style={{
      width: 280, flexShrink: 0, background: T.bgWhite, borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", padding: "28px 20px",
    }}>
      <div style={{ paddingLeft: 12, marginBottom: 40 }}><Logo size="md" /></div>

      <nav style={{ flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: T.textMuted, paddingLeft: 12, marginBottom: 12 }}>MAIN</div>
          {NAV_ITEMS.filter(i => i.group === "main").map(item => (
            <NavItem key={item.id} item={item} active={active} onNav={onNav} />
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: T.textMuted, paddingLeft: 12, marginBottom: 12 }}>CAREER TOOLS</div>
          {NAV_ITEMS.filter(i => i.group === "tools").map(item => (
            <NavItem key={item.id} item={item} active={active} onNav={onNav} />
          ))}
        </div>
      </nav>

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: T.primaryLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 600, fontSize: 16, color: T.primary,
          }}>{(user?.name?.charAt(0) || '?').toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{user?.name || 'Guest'}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{user?.organization || 'Member since 2024'}</div>
          </div>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 18, cursor: "pointer" }}>↪</button>
        </div>
      </div>
    </aside>
  );
}