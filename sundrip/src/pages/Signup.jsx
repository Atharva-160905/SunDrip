import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users`, {
        name,
        email,
        password,
      });
      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (err) {
      setError(err?.response?.data?.message || err.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md p-8 bg-card rounded-3xl shadow-2xl border border-border"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join Sundrip for an exclusive shopping experience.</p>
        </div>

      {error && (
        <div className="p-3.5 mb-6 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="mb-4 space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Full Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-4 space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="mb-4 space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div className="mb-6 space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Confirm Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full text-base font-semibold shadow-xl shadow-primary-500/20 py-6"
          isLoading={loading}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      <div className="mt-6 text-sm text-center text-slate-500">
        Already have an account?{' '}
        <Link to={`/login?redirect=${redirect}`} className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
          Sign In
        </Link>
      </div>
    </motion.div>
  </div>
  );
};

export default Signup;
