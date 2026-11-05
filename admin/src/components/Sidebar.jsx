import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, LogOut } from 'lucide-react';
import { LogoIcon } from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#16171f',
            border: '1px solid #232530',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <LogoIcon size={18} />
        </div>
        <div className="admin-sidebar-brand-title">
          <span>SunDrip</span>
          <span className="admin-sidebar-brand-sub">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')} end>
          <LayoutDashboard size={16} /> Overview
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
          <ShoppingBag size={16} /> Products
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
          <ShoppingCart size={16} /> Orders
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
          <Users size={16} /> Customers & Roles
        </NavLink>
      </nav>

      {/* Admin User info footer */}
      <div className="admin-sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#181920',
              border: '1px solid #262833',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#f4f4f5',
              flexShrink: 0,
            }}
          >
            {(adminInfo.name || 'A')[0].toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#f4f4f5',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {adminInfo.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '11px', color: '#71717a' }}>Admin</span>
          </div>
        </div>
      </div>

      <button onClick={handleLogout} className="admin-logout-btn">
        <LogOut size={14} /> Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
