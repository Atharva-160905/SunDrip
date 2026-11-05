import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SunDrip Iconic Vector Monogram & Wordmark
 * Clean, geometric, luxury athletic crest.
 */
export const LogoIcon = ({ size = 28, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
    >
      {/* Outer Hex-Chamfered Solar Shield */}
      <polygon 
        points="24,3 41,12 41,36 24,45 7,36 7,12" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinejoin="miter"
        className="opacity-40"
      />
      {/* Inner Geometric Solar Drip Blade */}
      <path 
        d="M24 9L34 14.5V20L28 23L34 26.5V33.5L24 39L14 33.5V28L20 25L14 21.5V14.5L24 9Z" 
        fill="currentColor" 
        fillOpacity="0.15" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      {/* Core Vertical Iron Spine Line */}
      <path 
        d="M24 13V35" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="square"
      />
      {/* Dynamic Chevron Slits */}
      <path 
        d="M19 17L24 20L29 17" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="square"
      />
      <path 
        d="M19 28L24 31L29 28" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="square"
      />
      {/* Center Diamond Core */}
      <polygon 
        points="24,22 26.5,24 24,26 21.5,24" 
        fill="currentColor" 
      />
    </svg>
  );
};

const Logo = ({ showText = true, size = 28, subtext = false, className = "" }) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className="relative text-white group-hover:text-zinc-200 transition-colors">
        <LogoIcon size={size} className="group-hover:scale-105" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-[0.16em] font-black text-lg sm:text-xl text-white group-hover:text-zinc-100 transition-colors leading-none">
            SUN<span className="text-zinc-400 font-light ml-0.5">DRIP</span>
          </div>
          {subtext && (
            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-semibold mt-1">
              Athletic Apparel
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default Logo;
