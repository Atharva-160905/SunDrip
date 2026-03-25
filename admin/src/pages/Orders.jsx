import { useState, useEffect } from 'react';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    // Optimistic UI Update
    setOrders(prevOrders => 
      prevOrders.map(o => o._id === id ? { ...o, orderStatus: status } : o)
    );

    try {
      await api.put(`/orders/${id}/status`, { status });
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
      fetchOrders(); // Rollback to real server state on failure
    }
  };

  if (loading) return <h2>Loading orders...</h2>;

  return (
    <div>
      <div className="admin-header">
        <h1>Orders Management</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>USER</th>
              <th>ADDRESS</th>
              <th>ITEMS</th>
              <th>AMOUNT</th>
              <th>FULFILLMENT</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>#{o._id.slice(-6).toUpperCase()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                </td>
                <td style={{ fontWeight: 500, color: '#0f172a', verticalAlign: 'top' }}>{o.userId?.name}</td>
                <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '160px', whiteSpace: 'normal', verticalAlign: 'top', lineHeight: '1.4' }}>
                  {o.address?.address}, {o.address?.city}, {o.address?.postalCode} <br/>
                  {o.address?.country}
                </td>
                <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '180px', whiteSpace: 'normal', verticalAlign: 'top', lineHeight: '1.4' }}>
                  {o.products?.map((p, i) => (
                    <div key={i} style={{ marginBottom: '2px' }}>{p.qty}x {p.name} {p.size ? `(${p.size})` : ''}</div>
                  ))}
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{o.totalPrice}</div>
                  <div style={{ marginTop: '8px' }}>
                    <span className={`admin-badge ${o.paymentStatus === 'completed' ? 'active' : 'inactive'}`}>
                      {o.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ 
                      background: o.orderStatus === 'delivered' ? '#dcfce7' : o.orderStatus === 'shipped' ? '#dbeafe' : o.orderStatus === 'cancelled' ? '#fee2e2' : '#fef9c3', 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                      color: o.orderStatus === 'delivered' ? '#166534' : o.orderStatus === 'shipped' ? '#1e40af' : o.orderStatus === 'cancelled' ? '#991b1b' : '#854d0e',
                      border: `1px solid ${o.orderStatus === 'delivered' ? '#bbf7d0' : o.orderStatus === 'shipped' ? '#bfdbfe' : o.orderStatus === 'cancelled' ? '#fecaca' : '#fef08a'}`
                    }}>
                      {o.orderStatus.toUpperCase()}
                    </span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', color: '#0f172a' }}>
                    <input 
                      type="checkbox" 
                      className="admin-checkbox"
                      checked={o.orderStatus === 'delivered'} 
                      onChange={(e) => updateStatus(o._id, e.target.checked ? 'delivered' : 'processing')} 
                      style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    Delivered
                  </label>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No orders found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
