import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, Check, Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import { cartActions } from '../store/cartSlice';
import { mockProducts } from '../utils/data';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${id}`);
        const formatted = {
          ...data,
          id: data._id,
          image: data.images[0] || '',
          sizes: data.sizes?.length ? data.sizes.map(s => typeof s === 'string' ? s : s.size) : ['S', 'M', 'L', 'XL'],
        };
        setProduct(formatted);
        setSelectedSize(formatted.sizes[0] || 'L');
        setLoading(false);
      } catch (err) {
        const fallback = mockProducts.find(p => p.id === id) || mockProducts[0];
        setProduct(fallback);
        setSelectedSize(fallback.sizes[0] || 'L');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-center text-zinc-500 bg-background">
        <div>
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-wider font-display text-zinc-400">Loading apparel piece...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-center text-zinc-400 bg-background">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white font-display uppercase tracking-wider">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(cartActions.addItemToCart({
      ...product,
      size: selectedSize,
      price: product.price,
      quantity: quantity
    }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="pt-20 lg:pt-24 pb-12 lg:pb-0 min-h-screen lg:h-[calc(100vh-60px)] lg:max-h-screen lg:overflow-hidden bg-background text-foreground flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-6xl w-full flex-1 flex flex-col justify-center">
        {/* Back Link */}
        <div className="mb-3 lg:mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-xs font-display font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>

        {/* Screen-Fixed Master Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Screen-Fixed Aspect-Ratio Image */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px] aspect-[3/4] max-h-[calc(100vh-190px)] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl relative">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center max-w-lg">
            {product.category && (
              <span className="text-[11px] font-bold font-display uppercase tracking-widest text-zinc-400 mb-2">
                {product.category}
              </span>
            )}

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <p className="font-display text-xl sm:text-2xl font-bold text-white mt-2 mb-4 font-mono">
              ₹{Number(product.price).toFixed(2)}
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            <div className="space-y-6 pt-5 border-t border-white/10">
              {/* Sizing Selection */}
              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold block mb-2.5">
                  Size
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold font-display uppercase border transition-all cursor-pointer ${
                        selectedSize === size 
                          ? 'border-white bg-white text-black shadow-lg shadow-white/20 scale-105' 
                          : 'border-white/10 bg-zinc-900/60 text-zinc-300 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter and Add to Bag */}
              <div className="pt-2 flex gap-3.5 items-center">
                <div className="flex items-center border border-white/15 bg-zinc-900/80 rounded-xl px-3.5 h-12 w-28 justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-white font-mono">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button 
                  size="lg" 
                  className="flex-1 h-12 text-xs font-display font-bold uppercase tracking-wider rounded-xl cursor-pointer bg-white text-black hover:bg-zinc-200"
                  onClick={handleAddToCart}
                >
                  {isAdded ? (
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Added to Bag</span>
                  ) : (
                    `Add to Bag • ₹${(Number(product.price) * quantity).toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
