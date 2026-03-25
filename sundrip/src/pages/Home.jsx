import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { categories } from '../utils/data';
import { cartActions } from '../store/cartSlice';
import axios from 'axios';

const Hero = () => (
  <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop" 
        alt="Summer Collection" 
        className="w-full h-full object-cover object-center opacity-40 dark:opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>

    <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-semibold tracking-wider mb-6">
          SUMMER COLLECTION 2026
        </span>
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-6">
          WEAR THE <span className="text-gradient">HEAT</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
          Subtle drip, maximum comfort. Premium summer wear engineered for the Gen-Z lifestyle. Keep it aesthetic.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/shop">
            <Button size="lg" className="w-full md:w-auto">
              Shop Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/shop?category=trending">
            <Button variant="outline" size="lg" className="w-full md:w-auto bg-background/50 backdrop-blur-sm">
              Trending
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const Categories = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">Shop by Category</h2>
          <p className="text-slate-500 dark:text-slate-400">Curated essentials for your summer rotation.</p>
        </div>
        <Link to="/shop" className="text-primary-500 hover:text-primary-600 font-semibold flex items-center mt-4 md:mt-0">
          View All Categories <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/shop?category=${category.id}`}>
              <Card className="group cursor-pointer border-0 shadow-none bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white font-medium flex items-center">
                      Browse {category.name} <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold font-display">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Trending = () => {
  const [trendingProducts, setTrendingProducts] = React.useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products?pageSize=100');
        const formatted = data.products
          .map(p => ({
            ...p,
            id: p._id,
            image: p.images[0] || '',
            sizes: p.sizes.map(s => s.size),
            colors: p.colors || ['Black']
          }))
          .filter(p => p.isTrending)
          .slice(0, 4);
        setTrendingProducts(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    dispatch(cartActions.addItemToCart({
      ...product,
      size: product.sizes[0],
      color: product.colors[0]
    }));
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4 text-gradient">Trending Now</h2>
          <p className="text-slate-500 dark:text-slate-400">Our most hyped pieces this week.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <Card className="h-full border-transparent hover:border-border hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 group">
                  <div className="relative h-80 overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-t-2xl">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Hot
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col justify-between h-[160px]">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1 flex-1 pr-2">{product.name}</h3>
                        <div className="flex items-center text-yellow-500 text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">4.9</span>
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 capitalize">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-display font-bold text-xl">${product.price.toFixed(2)}</span>
                      <Button 
                        size="icon" 
                        variant="primary" 
                        className="rounded-full shadow-md"
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
        </div>
      </div>
    </section>
  );
};

const OfferBanner = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden bg-primary-600 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between z-10">
          <div className="text-center md:text-left mb-8 md:mb-0 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4">Summer Steals.</h2>
            <p className="text-primary-100 text-lg md:text-xl">Get 20% off exclusively on our new minimal combinations. Limited time authentic drip.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl border border-white/30 text-center">
              <span className="block text-sm font-semibold uppercase tracking-wider text-primary-100 mb-1">Use Code</span>
              <span className="block text-3xl font-display font-bold">HEAT20</span>
            </div>
            <Link to="/shop?category=combos">
              <Button variant="secondary" size="lg" className="h-full py-4 bg-white text-primary-600 hover:bg-slate-100">
                Claim Offer
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Hero />
      <Categories />
      <Trending />
      <OfferBanner />
    </motion.div>
  );
};

export default Home;
