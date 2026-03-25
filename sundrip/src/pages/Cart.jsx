import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';
import { cartActions } from '../store/cartSlice';

const Cart = () => {
  const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIncrement = (item) => {
    dispatch(cartActions.addItemToCart({ ...item, quantity: 1 }));
  };

  const handleDecrement = (item) => {
    dispatch(cartActions.removeItemFromCart({ id: item.id, size: item.size }));
  };

  const shipping = totalAmount > 100 ? 0 : 15;
  const tax = totalAmount * 0.08;
  const grandTotal = totalAmount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[75vh] flex flex-col items-center justify-center text-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 rounded-full overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop" 
            alt="Empty Cart Aesthetic" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center backdrop-blur-[2px]">
            <ShoppingBag className="w-16 h-16 text-white drop-shadow-md" />
          </div>
        </div>
        <h2 className="text-4xl font-display font-black tracking-tight mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md text-lg">Looks like you haven't added anything to your cart yet. Discover our summer collection and find your vibe.</p>
        <Link to="/shop">
          <Button size="lg" className="rounded-full px-10 shadow-lg shadow-primary-500/20">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 max-w-7xl min-h-screen"
    >
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Your Cart</h1>
        <p className="text-slate-500">{totalQuantity} items in your bag</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="border border-border rounded-3xl p-6 bg-card shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-1 text-right"></div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    key={`${item.id}-${item.size}`} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-border md:border-0 pb-6 md:pb-0 last:border-0 last:pb-0"
                  >
                    {/* Produce Info */}
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-semibold text-lg text-foreground line-clamp-2">{item.name}</h3>
                        <p className="text-slate-500 mt-1 capitalize">{item.color} | Size: {item.size}</p>
                        <p className="md:hidden font-display font-bold text-primary-600 mt-2">${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 md:col-span-3 flex md:justify-center items-center">
                      <div className="flex items-center border-2 border-border rounded-full px-3 py-1">
                        <button 
                          onClick={() => handleDecrement(item)}
                          className="text-slate-500 hover:text-primary-600 p-1 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold px-4 min-w-[3ch] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrement(item)}
                          className="text-slate-500 hover:text-primary-600 p-1 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price Desktop */}
                    <div className="hidden md:block col-span-2 text-right">
                      <p className="font-display font-bold text-lg text-foreground">${item.totalPrice.toFixed(2)}</p>
                    </div>

                    {/* Remove Action */}
                    <div className="absolute top-4 right-4 md:static md:col-span-1 flex justify-end">
                      <button 
                        onClick={() => {
                          const iter = item.quantity;
                          for(let i=0; i<iter; i++) handleDecrement(item);
                        }}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[400px]">
          <div className="sticky top-28 border border-border rounded-3xl p-8 bg-card shadow-sm">
            <h2 className="text-2xl font-display font-bold tracking-tight mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-medium text-foreground">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-4 border-b border-border">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="font-display text-primary-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="mt-8 text-center text-sm text-slate-500">
              <p className="flex items-center justify-center gap-2 mb-2">
                🔒 Secure Encrypted Checkout
              </p>
              <p>We accept all major credit cards and Apple Pay.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
