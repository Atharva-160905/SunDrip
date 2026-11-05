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
    setOrders(prevOrders => 
      prevOrders.map(o => o._id === id ? { ...o, orderStatus: status } : o)
    );

    try {
      await api.put(`/orders/${id}/status`, { status });
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
      fetchOrders();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#71717a', fontSize: '14px' }}>
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p>Customer orders, payment verifications, and delivery states.</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Delivery Address</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600, color: '#f4f4f5', fontFamily: 'monospace', fontSize: '12.5px' }}>
                    #{o._id.slice(-6).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginTop: '3px' }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ fontWeight: 500, color: '#f4f4f5', verticalAlign: 'top' }}>
                  {o.userId?.name || 'Guest'}
                </td>
                <td style={{ fontSize: '12px', color: '#a1a1aa', maxWidth: '200px', whiteSpace: 'normal', verticalAlign: 'top', lineHeight: '1.4' }}>
                  {o.address?.address}, {o.address?.city}, {o.address?.postalCode} <br />
                  <span style={{ color: '#71717a' }}>{o.address?.country}</span>
                </td>
                <td style={{ fontSize: '12.5px', color: '#d4d4d8', maxWidth: '200px', whiteSpace: 'normal', verticalAlign: 'top', lineHeight: '1.4' }}>
                  {o.products?.map((p, i) => (
                    <div key={i} style={{ marginBottom: '3px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{p.qty}x</span> {p.name} {p.size ? `(${p.size})` : ''}
                    </div>
                  ))}
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '13.5px' }}>₹{o.totalPrice}</div>
                  <div style={{ marginTop: '6px' }}>
                    <span className={`admin-badge ${o.paymentStatus === 'completed' ? 'active' : 'inactive'}`}>
                      {o.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor:
                          o.orderStatus === 'delivered'
                            ? 'rgba(16, 185, 129, 0.12)'
                            : o.orderStatus === 'shipped'
                            ? 'rgba(59, 130, 246, 0.12)'
                            : o.orderStatus === 'cancelled'
                            ? 'rgba(239, 68, 68, 0.12)'
                            : 'rgba(255, 255, 255, 0.06)',
                        color:
                          o.orderStatus === 'delivered'
                            ? '#34d399'
                            : o.orderStatus === 'shipped'
                            ? '#60a5fa'
                            : o.orderStatus === 'cancelled'
                            ? '#f87171'
                            : '#d4d4d8',
                        border:
                          o.orderStatus === 'delivered'
                            ? '1px solid rgba(16, 185, 129, 0.25)'
                            : o.orderStatus === 'shipped'
                            ? '1px solid rgba(59, 130, 246, 0.25)'
                            : o.orderStatus === 'cancelled'
                            ? '1px solid rgba(239, 68, 68, 0.25)'
                            : '1px solid #282a35',
                      }}
                    >
                      {o.orderStatus.toUpperCase()}
                    </span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#a1a1aa' }}>
                    <input 
                      type="checkbox" 
                      checked={o.orderStatus === 'delivered'} 
                      onChange={(e) => updateStatus(o._id, e.target.checked ? 'delivered' : 'processing')} 
                      style={{ width: '14px', height: '14px', accentColor: '#ffffff', cursor: 'pointer' }}
                    />
                    Mark Delivered
                  </label>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#71717a' }}>
                  No customer orders logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
