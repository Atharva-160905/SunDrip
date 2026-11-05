import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, ShoppingCart, Users, ArrowUpRight, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, totalStock: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products?all=true&pageSize=1000'),
          api.get('/users'),
        ]);

        const totalRevenue = ordersRes.data.reduce(
          (acc, order) => acc + (order.paymentStatus === 'completed' ? order.totalPrice : 0),
          0
        );

        const allProducts = productsRes.data.products || [];
        const totalUnitsInStock = allProducts.reduce(
          (acc, p) => acc + (Number(p.stock) || 0),
          0
        );

        setStats({
          revenue: totalRevenue,
          orders: ordersRes.data.length,
          products: productsRes.data.total || allProducts.length || 0,
          totalStock: totalUnitsInStock,
          users: usersRes.data.length,
        });

        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#71717a', fontSize: '14px' }}>
        Loading store overview...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Overview</h1>
          <p>Key metrics and recent commercial activity.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="admin-btn-outline"
          >
            <ExternalLink size={14} /> Live Storefront
          </a>
          <Link to="/products" className="admin-btn-primary">
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Revenue</h3>
            <span style={{ color: '#71717a' }}><IndianRupee size={15} /></span>
          </div>
          <div className="admin-stat-value">
            ₹{stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <ArrowUpRight size={13} /> Completed payments
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Total Orders</h3>
            <span style={{ color: '#71717a' }}><ShoppingCart size={15} /></span>
          </div>
          <div className="admin-stat-value">{stats.orders}</div>
          <Link
            to="/orders"
            style={{ fontSize: '12px', color: '#8e94a0', textDecoration: 'none', marginTop: '2px' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#8e94a0')}
          >
            View all orders →
          </Link>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Catalog Inventory</h3>
            <span style={{ color: '#71717a' }}><ShoppingBag size={15} /></span>
          </div>
          <div className="admin-stat-value">
            {stats.totalStock}{' '}
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#71717a' }}>units</span>
          </div>
          <Link
            to="/products"
            style={{ fontSize: '12px', color: '#8e94a0', textDecoration: 'none', marginTop: '2px' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#8e94a0')}
          >
            Across {stats.products} products →
          </Link>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Customer Accounts</h3>
            <span style={{ color: '#71717a' }}><Users size={15} /></span>
          </div>
          <div className="admin-stat-value">{stats.users}</div>
          <Link
            to="/users"
            style={{ fontSize: '12px', color: '#8e94a0', textDecoration: 'none', marginTop: '2px' }}
            onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.target.style.color = '#8e94a0')}
          >
            Manage users →
          </Link>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Recent Orders</h2>
            <p style={{ fontSize: '12.5px', color: '#71717a', margin: '2px 0 0' }}>Latest customer transactions and fulfillments</p>
          </div>
          <Link to="/orders" className="admin-btn-outline" style={{ fontSize: '12px', padding: '5px 10px' }}>
            View All
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                    No recent transactions recorded.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#a1a1aa' }}>
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ fontWeight: 500, color: '#f4f4f5' }}>
                      {o.userId?.name || 'Guest'}
                    </td>
                    <td style={{ color: '#a1a1aa' }}>
                      {o.products?.length || 0} item{(o.products?.length || 0) !== 1 ? 's' : ''}
                    </td>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>
                      ₹{o.totalPrice}
                    </td>
                    <td>
                      <span className={`admin-badge ${o.paymentStatus === 'completed' ? 'active' : 'inactive'}`}>
                        {o.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', color: '#a1a1aa', fontSize: '12.5px' }}>
                      {o.orderStatus || 'Processing'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
