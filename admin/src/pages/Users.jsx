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

  if (loading) return <h2>Loading users...</h2>;

  return (
    <div>
      <div className="admin-header">
        <h1>Users Management</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontWeight: 600, color: '#64748b' }}>#{u._id.slice(-6).toUpperCase()}</td>
                <td style={{ fontWeight: 500, color: '#0f172a' }}>{u.name}</td>
                <td style={{ color: '#475569' }}>{u.email}</td>
                <td>
                  <span style={{ 
                    background: u.role === 'admin' ? '#fef08a' : '#f1f5f9', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: u.role === 'admin' ? '#854d0e' : '#475569',
                    border: `1px solid ${u.role === 'admin' ? '#fde047' : '#e2e8f0'}`
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ color: '#475569' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
