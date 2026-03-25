import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter text-white mb-4 block">
              SUN<span className="text-primary-500">DRIP</span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Wear the Heat. The ultimate modern, Gen-Z summer collection. Keep it aesthetic, keep it minimal, keep it drip.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                X
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                FB
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="hover:text-primary-400 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=tshirts" className="hover:text-primary-400 transition-colors">Oversized T-shirts</Link></li>
              <li><Link to="/shop?category=sleeveless" className="hover:text-primary-400 transition-colors">Sleeveless</Link></li>
              <li><Link to="/shop?category=shorts" className="hover:text-primary-400 transition-colors">Summer Shorts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Support</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-primary-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-primary-400 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Sundrip. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
