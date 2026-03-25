import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '../store/authSlice';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Package, Clock, CheckCircle, ChevronRight, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from 'axios';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      
      const fetchOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoadingOrders(false);
        }
      };
      
      fetchOrders();
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    
    setIsUpdating(true);
    setMessage('');
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put('http://localhost:5000/api/users/profile', { name, email, password }, config);
      dispatch(setCredentials(data));
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error?.response?.data?.message || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!userInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 max-w-7xl"
    >
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground capitalize">Hello, {userInfo.name.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your personal information, security, and recent orders.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Profile Settings Column */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center border-2 border-primary-200 dark:border-primary-800">
                <span className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-foreground">{userInfo.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> Verified Member
                </p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20'}`}>
                {message}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <Input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="pl-10 h-14" 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-10 h-14" 
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="New password (optional)"
                      className="pl-10 bg-slate-50 dark:bg-slate-800/50" 
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Confirm new password"
                      className="pl-10 bg-slate-50 dark:bg-slate-800/50" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col space-y-3">
                <Button type="submit" size="lg" className="w-full shadow-lg shadow-primary-500/20" isLoading={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                <button 
                  type="button"
                  onClick={logoutHandler}
                  className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order History Column */}
        <div className="lg:w-2/3">
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-border rounded-3xl p-8 min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-display text-foreground flex items-center">
                <Package className="w-6 h-6 mr-3 text-primary-500" /> Order History
              </h2>
            </div>

            {loadingOrders ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <p>Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-2xl bg-white dark:bg-slate-900/50">
                <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">Looks like you haven't made your first purchase. Discover our exclusive drops.</p>
                <Link to="/shop">
                  <Button variant="outline" className="rounded-full px-8">Browse Shop</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isDelivered = order.orderStatus === 'delivered';
                  const isCompleted = order.paymentStatus === 'completed';
                  
                  return (
                    <div 
                      key={order._id} 
                      className="group bg-white dark:bg-slate-900 border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                    >
                      {/* Left Side: Order Info */}
                      <div className="flex items-start md:items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
                          <Package className={`w-6 h-6 ${isDelivered ? 'text-green-500' : 'text-primary-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-foreground text-lg cursor-pointer hover:underline">
                              Order <span className="text-primary-600 font-mono tracking-tight">#{order._id.substring(18, 24).toUpperCase()}</span>
                            </h3>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 gap-2 sm:gap-4 font-medium mt-2">
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{order.products?.length || 0} items</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Status and Price */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-border md:border-0 pt-4 md:pt-0 gap-2 md:gap-1">
                        <p className="text-2xl font-display font-bold text-foreground order-2 md:order-1">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                        
                        <div className="flex space-x-2 order-1 md:order-2 md:mt-2">
                          <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${isCompleted ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50'}`}>
                            {isCompleted ? 'Paid' : 'Unpaid'}
                          </span>
                          <span className={`flex items-center px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${isDelivered ? 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'}`}>
                             {isDelivered && <CheckCircle className="w-3 h-3 mr-1" />}
                            {order.orderStatus ? order.orderStatus : 'Processing'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Hover Arrow (Desktop only) */}
                      <div className="hidden md:flex absolute -right-12 group-hover:right-4 h-full top-0 items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-6 h-6 text-slate-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
