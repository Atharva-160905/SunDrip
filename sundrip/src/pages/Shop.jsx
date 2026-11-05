import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cartSlice';
import { mockProducts } from '../utils/data';
import axios from 'axios';

const CATEGORIES = ['All', 'T-Shirts', 'Joggers', 'Gym Wear', 'Merch'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [priceSort, setPriceSort] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryParam) {
      // Find matching category case-insensitively
      const match = CATEGORIES.find(c => c.toLowerCase() === categoryParam.toLowerCase().replace('-', ' '));
      if (match) setSelectedCategory(match);
    }
  }, [categoryParam]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(cartActions.addItemToCart({
      ...product,
      size: product.sizes?.[0] || 'L',
    }));
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products?pageSize=100`);
        
        if (data.products && data.products.length > 0) {
          setProducts(data.products.map(p => ({
            ...p,
            id: p._id,
            image: p.images[0] || '',
            sizes: p.sizes?.length ? p.sizes.map(s => s.size) : ['M', 'L', 'XL'],
            colors: p.colors || ['Black']
          })));
        } else {
          setProducts(mockProducts);
        }
        setLoading(false);
      } catch (err) {
        setProducts(mockProducts);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: category.toLowerCase().replace(' ', '-') });
    }
  };

  let filteredProducts = products.filter(product => {
    if (selectedCategory === 'All') return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  if (priceSort === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              {selectedCategory === 'All' ? 'Products' : selectedCategory}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Showing {filteredProducts.length} items
            </p>
          </div>

          <div>
            <select 
              className="h-10 px-3.5 rounded-lg border border-white/10 bg-zinc-950 text-zinc-300 text-xs font-display font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
            >
              <option value="default">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div>
          {loading ? (
            <div className="text-center py-24">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs uppercase tracking-wider text-zinc-500">Loading collection...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 text-zinc-500">
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group block">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-white/30 transition-all duration-300 mb-3 relative">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-xs sm:text-sm text-zinc-200 group-hover:text-white transition-colors line-clamp-1 uppercase">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-0.5">
                      <p className="font-bold text-sm text-white font-mono">
                        ₹{Number(product.price).toFixed(2)}
                      </p>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          addedId === product.id 
                            ? 'bg-white text-black' 
                            : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        {addedId === product.id ? 'Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
