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

  const shipping = totalAmount >= 999 || totalAmount === 0 ? 0 : 99;
  const tax = totalAmount > 0 ? Math.round(totalAmount * 0.05) : 0;
  const grandTotal = totalAmount > 0 ? totalAmount + shipping + tax : 0;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center text-foreground">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-border flex items-center justify-center mb-5">
          <ShoppingBag className="w-7 h-7 text-zinc-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Your bag is empty</h2>
        <p className="text-zinc-400 mb-6 text-sm max-w-sm">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8 pb-4 border-b border-border flex justify-between items-end">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Shopping Bag</h1>
          <span className="text-xs text-zinc-400">{totalQuantity} items</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`} 
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border items-center justify-between"
                >
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-zinc-900 border border-border flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-white truncate">{item.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Size: {item.size}</p>
                    <p className="font-semibold text-sm text-zinc-200 mt-2">₹{item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg px-2 py-1 bg-zinc-950">
                      <button 
                        onClick={() => handleDecrement(item)}
                        className="text-zinc-400 hover:text-white p-1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold px-2">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrement(item)}
                        className="text-zinc-400 hover:text-white p-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        const iter = item.quantity;
                        for(let i=0; i<iter; i++) handleDecrement(item);
                      }}
                      className="text-zinc-500 hover:text-red-400 p-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 text-sm sticky top-28">
              <h2 className="font-bold text-white text-base pb-3 border-b border-border">Order Summary</h2>
              
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-medium text-white">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="font-medium text-white">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tax (5%)</span>
                <span className="font-medium text-white">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-3 border-t border-border flex justify-between font-bold text-base text-white">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>

              <Button 
                size="lg" 
                className="w-full mt-4"
                onClick={() => navigate('/checkout')}
              >
                Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
