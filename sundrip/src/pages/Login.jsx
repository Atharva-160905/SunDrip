import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/users/login`, {
        email,
        password,
      });
      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (err) {
      setError(err?.response?.data?.message || err.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto mt-10 p-6 bg-card rounded-lg shadow-lg border border-border"
    >
      <h1 className="text-2xl font-bold mb-5 font-heading">Sign In</h1>
      {error && <div className="text-destructive mb-4">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4 text-sm text-center">
        New Customer?{' '}
        <Link to={redirect ? `/signup?redirect=${redirect}` : '/signup'} className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </motion.div>
  );
};

export default Login;
