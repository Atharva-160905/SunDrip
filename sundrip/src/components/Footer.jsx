import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-[#050507] text-zinc-400 pt-16 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <Logo size={28} subtext={true} />
            <p className="text-xs text-zinc-400 font-normal leading-relaxed max-w-sm mt-3">
              Heavyweight athletic wear and tailored joggers engineered for performance, comfort, and longevity under the bar.
            </p>
          </div>

          {/* Navigation Column: Equipment */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-display font-bold tracking-wider text-white uppercase">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link to="/products?category=t-shirts" className="hover:text-white transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=joggers" className="hover:text-white transition-colors">
                  Joggers
                </Link>
              </li>
              <li>
                <Link to="/products?category=gym-wear" className="hover:text-white transition-colors">
                  Gym Wear
                </Link>
              </li>
              <li>
                <Link to="/products?category=merch" className="hover:text-white transition-colors">
                  Merch
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column: Customer Support */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-display font-bold tracking-wider text-white uppercase">
              Help
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Size Guide
                </span>
              </li>
              <li>
                <span className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Shipping & Returns
                </span>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-display font-bold tracking-wider text-white uppercase">
              Our Ethos
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Designed in India with custom combed cotton and reinforced stitching. Built to hold its shape through repeated training sessions and washes.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} SunDrip. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-zinc-400">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
