import { useState, useEffect } from 'react';
import api from '../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#71717a', fontSize: '14px' }}>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Customers & Roles</h1>
          <p>Registered customer profiles and administrator permissions.</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontFamily: 'monospace', color: '#a1a1aa', fontSize: '12px' }}>
                  #{u._id.slice(-6).toUpperCase()}
                </td>
                <td style={{ fontWeight: 500, color: '#f4f4f5' }}>{u.name}</td>
                <td style={{ color: '#8e94a0' }}>{u.email}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor:
                        u.role === 'admin'
                          ? '#1e2029'
                          : '#14151c',
                      color: u.role === 'admin' ? '#ffffff' : '#8e94a0',
                      border:
                        u.role === 'admin'
                          ? '1px solid #323544'
                          : '1px solid #22242e',
                    }}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: '#71717a', fontSize: '12.5px' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: '#71717a' }}>
                  No customer accounts registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
