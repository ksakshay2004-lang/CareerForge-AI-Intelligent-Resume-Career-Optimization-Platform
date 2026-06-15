import React from 'react';
import { Sidebar } from './Sidebar';
import { T, css } from '../../constants/theme';

export function Shell({ active, onNav, user, onLogout, title, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
      <Sidebar active={active} onNav={onNav} user={user} onLogout={onLogout} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{
          background: T.bgWhite, borderBottom: `1px solid ${T.border}`,
          padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: T.text }}>{title}</h1>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }} className="animate-in">
          {children}
        </div>
      </div>
    </div>
  );
}