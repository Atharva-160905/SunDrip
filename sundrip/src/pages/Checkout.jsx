import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { cartActions } from '../store/cartSlice';
import axios from 'axios';

const Checkout = () => {
  const { totalAmount, items, totalQuantity } = useSelector(state => state.cart);
  const { userInfo: user } = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const shipping = totalAmount > 100 ? 0 : 15;
  const grandTotal = totalAmount > 0 ? totalAmount + shipping + (totalAmount * 0.08) : 0;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    // Extract DOM values synchronously before opening the modal
    const address = {
      address: e.target.street.value + (e.target.apt.value ? ' ' + e.target.apt.value : ''),
      city: e.target.city.value,
      postalCode: e.target.zip.value,
      country: e.target.state.value 
    };

    const orderItems = items.map(item => ({
      productId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      qty: item.quantity,
      size: item.size
    }));
    
    try {
      // 1. Create order on our backend to get Razorpay Order ID
      const { data: razorpayOrder } = await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/payment/create`, {
        amount: grandTotal
      }, { headers: { Authorization: `Bearer ${user.token}` } });

      // 2. Initialize Razorpay Modal Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: 'INR',
        name: 'Sundrip',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify signature on backend
            await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${user.token}` } });

            // 4. Save completed order into Database
            const { data: orderData } = await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/orders`, {
              products: orderItems,
              address,
              totalPrice: grandTotal,
              paymentStatus: 'completed'
            }, {
              headers: { Authorization: `Bearer ${user.token}` }
            });

            setOrderDetails(orderData);
            setIsSuccess(true);
            dispatch(cartActions.clearCart());
          } catch (verificationError) {
            console.error('Verification failed', verificationError);
            alert('Payment verification failed!');
          } finally {
            setIsSubmitting(false); // Enable the button again
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#f97316', // Primary Orange Theme
        },
      };

      // 3. Open Razorpay Modal
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        alert(response.error.description);
        setIsSubmitting(false);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Checkout initialization failed: ' + (err.response?.data?.message || err.message));
      setIsSubmitting(false);
    }
  };

  if (isSuccess && orderDetails) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-16 min-h-[80vh] flex flex-col items-center justify-center text-center"
      >
        <div className="relative w-full max-w-3xl h-64 md:h-80 mb-10 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Order Success Aesthetic"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-4 border border-white/30 text-white"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white drop-shadow-md">Order Confirmed</h2>
          </div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mb-8 text-lg font-medium">
          Thank you for choosing Sundrip. Your order <span className="text-primary-600 font-bold">#{orderDetails._id.slice(-6).toUpperCase()}</span> is currently being processed. We will send you an email confirmation shortly.
        </p>
        <Link to="/shop">
          <Button size="lg" className="rounded-full px-10 text-lg shadow-xl shadow-primary-500/20">
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Your bag is empty</h2>
        <p className="text-slate-500 mb-8">You need items in your cart to checkout.</p>
        <Link to="/shop">
          <Button size="lg" className="rounded-full px-10">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 max-w-7xl"
    >
      <button 
        onClick={() => navigate('/cart')} 
        className="flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </button>

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Form Section */}
        <div className="flex-1">
          <form onSubmit={handleCheckout} className="space-y-10">
            {/* Contact Info */}
            <section>
              <h2 className="text-2xl font-bold font-display mb-6 border-b border-border pb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">First Name</label>
                  <Input type="text" required placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Last Name</label>
                  <Input type="text" required placeholder="Doe" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground">Email Address</label>
                  <Input type="email" required placeholder="john@example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground">Phone Number</label>
                  <Input type="tel" required placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-2xl font-bold font-display mb-6 border-b border-border pb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Street Address</label>
                  <Input name="street" type="text" required placeholder="123 Summer Avenue" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Apt, Suite, etc. (Optional)</label>
                  <Input name="apt" type="text" placeholder="Apt 4B" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-foreground">City</label>
                    <Input name="city" type="text" required placeholder="Los Angeles" />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-foreground">State / Province</label>
                    <Input name="state" type="text" required placeholder="CA" />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-foreground">ZIP / Postal Code</label>
                    <Input name="zip" type="text" required placeholder="90001" />
                  </div>
                </div>
              </div>
            </section>

            {/* Form Section End */}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg shadow-xl shadow-primary-500/20 py-8"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
            </Button>

            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mt-6">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span>Payments are secure and encrypted.</span>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-[450px]">
          <div className="sticky top-28 border border-border rounded-3xl p-8 bg-slate-50 dark:bg-slate-900/40 shadow-sm">
            <h2 className="text-xl font-display font-bold mb-6 text-foreground">In Your Bag</h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-border pb-4 last:border-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{item.color} | {item.size}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                      <span className="font-bold text-sm">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-border text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({totalQuantity} items)</span>
                <span className="font-medium text-foreground">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-foreground">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span className="font-medium text-foreground">${(totalAmount * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-center text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="font-display text-primary-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
