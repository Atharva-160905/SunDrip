import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, ShoppingBag, User, Menu, X } from 'lucide-react';
import { themeActions } from '../store/themeSlice';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const location = useLocation();
  const dispatch = useDispatch();

  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { theme } = useSelector((state) => state.theme);

  const toggleTheme = () => {
    dispatch(themeActions.toggleTheme());
  };

  // Background blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic scroll spy between Home and Categories on the homepage
  useEffect(() => {
    if (location.pathname === '/products' || location.pathname === '/shop') {
      setActiveSection('Products');
      return;
    }

    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    // Scroll spy for #categories on homepage
    const checkActiveSection = () => {
      const categoriesEl = document.getElementById('categories');
      if (categoriesEl) {
        const rect = categoriesEl.getBoundingClientRect();
        // If categories section has entered the top half of viewport
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          setActiveSection('Categories');
          return;
        }
      }
      setActiveSection('Home');
    };

    checkActiveSection();
    window.addEventListener('scroll', checkActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', checkActiveSection);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Categories', to: '/#categories' },
    { name: 'Products', to: '/products' },
  ];

  const handleNavClick = (e, name, to) => {
    setMobileMenuOpen(false);

    if (name === 'Categories') {
      e.preventDefault();
      if (location.pathname === '/') {
        const catEl = document.getElementById('categories');
        if (catEl) {
          catEl.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = '/#categories';
      }
      setActiveSection('Categories');
    } else if (name === 'Home') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('Home');
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        
        {/* Brand Logo */}
        <Logo size={26} />

        {/* Center Navigation Links: Home, Categories, Products */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-display font-bold uppercase tracking-[0.2em]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.name;
            return (
              <Link
                key={link.name}
                to={link.to}
                onClick={(e) => handleNavClick(e, link.name, link.to)}
                className={`group relative py-2 px-3 transition-colors duration-300 select-none ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {/* Text with subtle glow on hover/active */}
                <span className={`relative z-10 transition-transform duration-300 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                }`}>
                  {link.name}
                </span>

                {/* Ambient glow capsule behind link */}
                <span className="absolute inset-0 rounded-lg bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Razor magnetic underline */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-white transition-all duration-300 ease-out pointer-events-none ${
                  isActive ? 'w-full shadow-[0_0_10px_rgba(255,255,255,0.85)]' : 'w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Action Icons: Bigger, Pure White, Luminous Luxury Glow */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full text-white hover:bg-white/15 border border-transparent hover:border-white/25 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" strokeWidth={2.2} />
            ) : (
              <Moon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" strokeWidth={2.2} />
            )}
          </button>
          
          {/* User Account */}
          <Link 
            to={userInfo ? '/profile' : '/login'} 
            className="p-2 sm:p-2.5 rounded-full text-white hover:bg-white/15 border border-transparent hover:border-white/25 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_rgba(255,255,255,0.4)] active:scale-95 flex items-center justify-center"
            title={userInfo ? userInfo.name : 'Account'}
            aria-label="Account"
          >
            <User className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" strokeWidth={2.2} />
          </Link>
          
          {/* Shopping Bag / Cart */}
          <Link 
            to="/cart" 
            className="relative p-2 sm:p-2.5 rounded-full text-white hover:bg-white/15 border border-transparent hover:border-white/25 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_16px_rgba(255,255,255,0.4)] active:scale-95 group flex items-center justify-center"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] transition-colors" strokeWidth={2.2} />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-white text-[10px] font-black text-black font-display shadow-md shadow-white/30">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-zinc-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 animate-fadeIn">
          <nav className="flex flex-col space-y-4 text-sm font-display font-bold uppercase tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={(e) => handleNavClick(e, link.name, link.to)}
                className={`py-2 transition-colors ${
                  activeSection === link.name ? 'text-white pl-2 border-l-2 border-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
