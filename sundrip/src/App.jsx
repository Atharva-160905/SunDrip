import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { cartActions } from './store/cartSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo: user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [isCartInitialized, setIsCartInitialized] = useState(false);

  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/cart`, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      })
      .then(res => {
         dispatch(cartActions.setCart(res.data.items));
         setIsCartInitialized(true);
      })
      .catch(err => {
         console.error(err);
         setIsCartInitialized(true);
      });
    } else {
      setIsCartInitialized(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    const syncCart = async () => {
      if (user && isCartInitialized) {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/cart/sync`, 
            { items }, 
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }
    };
    
    const timeoutId = setTimeout(syncCart, 500); // debounce API calls
    return () => clearTimeout(timeoutId);
  }, [items, user, isCartInitialized]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
