import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, ShoppingCart, Users } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products?all=true'),
          api.get('/users'),
        ]);

        const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.paymentStatus === 'completed' ? order.totalPrice : 0), 0);

        setStats({
          revenue: totalRevenue,
          orders: ordersRes.data.length,
          products: productsRes.data.total,
          users: usersRes.data.length,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <h2>Loading stats...</h2>;

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
      </div>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Revenue</h3>
            <IndianRupee size={20} color="#3b82f6" />
          </div>
          <p className="admin-stat-value">₹{stats.revenue.toFixed(2)}</p>
        </div>
        
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Orders</h3>
            <ShoppingCart size={20} color="#10b981" />
          </div>
          <p className="admin-stat-value">{stats.orders}</p>
        </div>
        
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Products</h3>
            <ShoppingBag size={20} color="#f59e0b" />
          </div>
          <p className="admin-stat-value">{stats.products}</p>
        </div>
        
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Users</h3>
            <Users size={20} color="#8b5cf6" />
          </div>
          <p className="admin-stat-value">{stats.users}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
