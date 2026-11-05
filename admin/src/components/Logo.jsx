import React from 'react';

export const LogoIcon = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Hex-Chamfered Solar Shield */}
      <polygon 
        points="24,3 41,12 41,36 24,45 7,36 7,12" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinejoin="miter"
        opacity="0.5"
      />
      {/* Inner Geometric Solar Drip Blade */}
      <path 
        d="M24 9L34 14.5V20L28 23L34 26.5V33.5L24 39L14 33.5V28L20 25L14 21.5V14.5L24 9Z" 
        fill="currentColor" 
        fillOpacity="0.16" 
        stroke="currentColor" 
        strokeWidth="1.6"
      />
      {/* Core Vertical Iron Spine Line */}
      <path 
        d="M24 13V35" 
        stroke="currentColor" 
        strokeWidth="2.6" 
        strokeLinecap="square"
      />
      {/* Dynamic Chevron Slits */}
      <path 
        d="M19 17L24 20L29 17" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="square"
      />
      <path 
        d="M19 28L24 31L29 28" 
        stroke="currentColor" 
        strokeWidth="2.2" 
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

export default LogoIcon;

