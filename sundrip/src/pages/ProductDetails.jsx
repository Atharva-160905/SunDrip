import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import { cartActions } from '../store/cartSlice';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        // Map backend format to frontend expectation
        const formatted = {
          ...data,
          id: data._id,
          image: data.images[0] || '',
          sizes: data.sizes.map(s => s.size),
          colors: data.colors || ['Black'],
        };
        setProduct(formatted);
        setSelectedSize(formatted.sizes[0]);
        setSelectedColor(formatted.colors[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Loading Product...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(cartActions.addItemToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      price: product.price, // ensure price passes nicely
    }));
    // We can add a toast here later
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/5] md:aspect-auto md:h-[600px]"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
          {/* Thumbnails removed intentionally */}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-primary-500 mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.isTrending && (
                <span className="text-sm font-semibold uppercase tracking-wider bg-orange-100 text-orange-600 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                  Trending
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-display font-semibold">${product.price.toFixed(2)}</span>
              <div className="flex items-center text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">(128 Reviews)</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">{product.description}</p>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Color Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Color</h3>
                <span className="text-sm font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-primary-600 bg-primary-600 text-white shadow-md' 
                        : 'border-border hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Size</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-medium border-2 transition-all ${
                      selectedSize === size 
                        ? 'border-primary-600 bg-primary-600 text-white shadow-md' 
                        : 'border-border hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="pt-6 border-t border-border mt-8">
              <div className="flex gap-4">
                <div className="flex items-center border-2 border-border rounded-xl px-4 w-32 justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-500 hover:text-primary-600 p-1 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-500 hover:text-primary-600 p-1 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  className="flex-1 text-lg shadow-xl shadow-primary-500/20"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                <Truck className="w-5 h-5 text-primary-500" />
                <span>Free shipping over $100</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-5 h-5 text-primary-500" />
                <span>30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20 pt-10 border-t border-border">
        <div className="flex space-x-8 mb-8 overflow-x-auto pb-2 border-b border-border">
          <button 
            className={`pb-4 font-display font-semibold text-lg transition-colors whitespace-nowrap ${activeTab === 'description' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            onClick={() => setActiveTab('description')}
          >
            Product Details
          </button>
          <button 
            className={`pb-4 font-display font-semibold text-lg transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (128)
          </button>
          <button 
            className={`pb-4 font-display font-semibold text-lg transition-colors whitespace-nowrap ${activeTab === 'shipping' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>
        
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>Experience the ultimate comfort with our premium summer wear designed specifically for the Gen-Z aesthetic. Crafted with meticulous attention to detail, this piece offers a perfect balance of style and breathability.</p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>100% Premium Heavyweight Cotton / Material</li>
                <li>Custom embroidered subtle detailing</li>
                <li>Pre-shrunk for a reliable fit</li>
                <li>Machine wash cold, tumble dry low</li>
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              <h4 className="font-bold text-xl mb-6 text-foreground">Customer Reviews</h4>
              <div className="space-y-6">
                {[1, 2].map(r => (
                  <div key={r} className="border-b border-border pb-6">
                    <div className="flex items-center space-x-2 mb-2 text-yellow-500">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="font-semibold text-foreground mb-1">Absolutely absolute fire.</p>
                    <p className="text-sm mb-2">The fit is perfect and the material feels super premium. I'm literally buying this in every color.</p>
                    <p className="text-xs text-slate-400">Verified Buyer • 2 days ago</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h4 className="font-bold text-xl mb-4 text-foreground">Shipping</h4>
              <p>We process all orders within 1-2 business days. Standard shipping generally takes 3-5 business days.</p>
              <h4 className="font-bold text-xl mb-4 mt-6 text-foreground">Returns</h4>
              <p>Not vibing with it? No problem. We offer a 30-day return policy on all unworn items with original tags attached.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
