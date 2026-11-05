import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { LogoIcon } from '../components/Logo';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', { email, password });
      if (data.role !== 'admin') {
        setError('Access denied: You do not have administrator permissions.');
        return;
      }
      localStorage.setItem('adminInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#09090b',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              margin: '0 auto 14px',
              borderRadius: '10px',
              backgroundColor: '#14151b',
              border: '1px solid #232530',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <LogoIcon size={24} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#ffffff',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              SunDrip
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#a1a1aa',
                backgroundColor: '#181920',
                border: '1px solid #282a35',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Admin
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#71717a',
              marginTop: '6px',
              marginBottom: 0,
            }}
          >
            Sign in to access store controls
          </p>
        </div>

        {/* Auth Card */}
        <div
          style={{
            backgroundColor: '#111216',
            border: '1px solid #22242c',
            borderRadius: '10px',
            padding: '28px 24px',
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '12.5px',
                marginBottom: '18px',
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#a1a1aa',
                  marginBottom: '6px',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#71717a',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@sundrip.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-form-control"
                  style={{
                    paddingLeft: '36px',
                    height: '40px',
                    fontSize: '13.5px',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#a1a1aa',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#71717a',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-form-control"
                  style={{
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    height: '40px',
                    fontSize: '13.5px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary"
              style={{
                width: '100%',
                height: '40px',
                justifyContent: 'center',
                marginTop: '6px',
                fontSize: '13.5px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#52525b',
            marginTop: '22px',
          }}
        >
          SunDrip E-Commerce Administration
        </p>
      </div>
    </div>
  );
};

export default Login;
