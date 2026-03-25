import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, LogOut, Sunset } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Sunset size={28} color="#fcd34d" />
        Sundrip Admin
      </div>
      
      <nav className="admin-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')} end>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
          <ShoppingBag size={20} /> Products
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
          <ShoppingCart size={20} /> Orders
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}>
          <Users size={20} /> Users
        </NavLink>
      </nav>
      
      <button onClick={handleLogout} className="admin-logout-btn">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
