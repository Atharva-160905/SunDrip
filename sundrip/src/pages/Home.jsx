import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { categories } from '../utils/data';

/**
 * HERO SECTION WITH SCROLL-EXPANSION EFFECT
 * Minimalist, high-impact luxury athletic statement.
 */
const Hero = () => {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop"
      bgImageSrc="/hero-bg.jpg"
      title="SUNDRIP ATHLETICS"
      tagline="STAY AHEAD OF YOUR GENERATION."
    >
      <div className="py-14 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 px-6">
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight">
          Stay Ahead of Your Generation.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/products">
            <Button size="lg" className="rounded-xl px-8 py-4 font-bold text-xs uppercase tracking-wider">
              Shop Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <a 
            href="#categories"
            className="group relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-display font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 rounded-xl border border-white/10 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.98] select-none"
          >
            Explore Categories
          </a>
        </div>
      </div>
    </ScrollExpandMedia>
  );
};

/**
 * CATEGORIES SECTION (Part of Homepage)
 * Directly replicates the reference layout:
 * - Bold uppercase category title centered on top.
 * - Isolated floating 3D apparel piece below with background removed.
 * - NOT in form of cards: NO borders, NO card boxes.
 */
const CategoriesSection = () => {
  return (
    <section id="categories" className="py-24 bg-[#060608] border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Categories
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
            Shop By Silhouette
          </p>
        </div>

        {/* Floating Category Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <Link 
              to={`/products?category=${cat.slug.toLowerCase().replace(/\s+/g, '-')}`} 
              key={cat.id}
              className="group flex flex-col items-center text-center cursor-pointer select-none"
            >
              {/* Category Name centered directly above */}
              <h3 className="font-display text-sm sm:text-base md:text-lg font-black tracking-widest uppercase text-white group-hover:text-zinc-300 transition-colors mb-6">
                {cat.name}
              </h3>

              {/* Floating garment with transparent background (NO card, NO box) */}
              <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] group-hover:-translate-y-3 group-hover:scale-108 transition-all duration-300 ease-out"
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

/**
 * HOMEPAGE
 * Strictly contains:
 * 1. Hero Section
 * 2. Categories Section
 * (Products are now on their own dedicated /products page)
 */
const Home = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Hero />
      <CategoriesSection />
    </div>
  );
};

export default Home;
