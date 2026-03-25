import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Star, Filter, X } from 'lucide-react';
import Button from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { categories } from '../utils/data';
import { cartActions } from '../store/cartSlice';
import axios from 'axios';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [priceSort, setPriceSort] = useState('default'); // 'default', 'low', 'high'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const dispatch = useDispatch();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(cartActions.addItemToCart({
      ...product,
      size: product.sizes[0],
      color: product.colors[0]
    }));
  };

  const handleCategoryChange = (catId) => {
    setSearchParams(catId === 'all' ? {} : { category: catId });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/products?pageSize=100`;
        if (activeCategory !== 'all' && activeCategory !== 'trending') {
          url += `&category=${activeCategory}`;
        }
        const { data } = await axios.get(url);
        
        let fetchedProducts = data.products.map(p => ({
          ...p,
          id: p._id,
          image: p.images[0] || '',
          sizes: p.sizes.map(s => s.size)
        }));

        if (activeCategory === 'trending') {
          fetchedProducts = fetchedProducts.filter(p => p.isTrending);
        }

        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  let filteredProducts = [...products];

  if (priceSort === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-16"
    >
      {/* Shop Header Banner */}
      <div className="relative h-64 md:h-80 w-full mb-12 overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
          alt="Shop Banner" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4 max-w-7xl pt-10">
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-white mb-2">The <span className="text-primary-400">Shop</span>.</h1>
          <p className="text-slate-300 max-w-lg text-lg">Discover our latest drops. Exclusively curated for the aesthetic summer.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight mb-1">Collection</h2>
            <p className="text-slate-500">Showing {filteredProducts.length} products</p>
          </div>
        
        <div className="flex items-center space-x-4 mt-6 md:mt-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant="outline" 
            className="md:hidden flex-shrink-0 whitespace-nowrap" 
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          
          <select 
            className="h-11 px-4 rounded-full border border-border bg-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="default">Sort by: Featured</option>
            <option value="low">Sort by: Price (Low to High)</option>
            <option value="high">Sort by: Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleCategoryChange('all')}
                    className={`text-sm hover:text-primary-600 transition-colors ${activeCategory === 'all' ? 'font-bold text-primary-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCategoryChange('trending')}
                    className={`text-sm hover:text-primary-600 transition-colors ${activeCategory === 'trending' ? 'font-bold text-primary-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Trending
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-sm hover:text-primary-600 transition-colors ${activeCategory === cat.id ? 'font-bold text-primary-600' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Add more filters like Size/Color here later */}
          </div>
        </aside>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-card p-6 shadow-xl flex flex-col md:hidden"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold font-display">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <h3 className="font-semibold text-lg mb-4">Categories</h3>
                  <ul className="space-y-4">
                    <li>
                      <button 
                        onClick={() => { handleCategoryChange('all'); setMobileFiltersOpen(false); }}
                        className={`text-base block w-full text-left ${activeCategory === 'all' ? 'font-bold text-primary-600' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <button 
                          onClick={() => { handleCategoryChange(cat.id); setMobileFiltersOpen(false); }}
                          className={`text-base block w-full text-left ${activeCategory === cat.id ? 'font-bold text-primary-600' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <h2>Loading products...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-slate-400 mb-2">No products found</h3>
              <p className="text-slate-500 mb-6">Try selecting a different category or clearing your filters.</p>
              <Button onClick={() => handleCategoryChange('all')}>View All Products</Button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                  >
                    <Link to={`/product/${product.id}`}>
                      <Card className="h-full border-transparent hover:border-border hover:shadow-xl transition-all duration-300 group">
                        <div className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-t-2xl">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                          />
                          {product.isTrending && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                Hot
                              </span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5 flex flex-col justify-between h-[150px]">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-base line-clamp-1 flex-1 pr-2">{product.name}</h3>
                              <div className="flex items-center text-yellow-500 text-xs mt-1">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">4.9</span>
                              </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 capitalize">{product.category}</p>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-display font-bold text-lg">${product.price.toFixed(2)}</span>
                            <Button 
                              size="icon" 
                              variant="primary" 
                              className="rounded-full shadow-md w-9 h-9"
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default Shop;
