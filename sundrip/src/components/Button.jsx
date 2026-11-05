import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none overflow-hidden group";
  
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-100 hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-black/15 before:to-transparent before:transition-transform before:duration-700",
    secondary: "bg-zinc-900/90 text-white hover:text-white hover:bg-zinc-800 border border-white/10 hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-700",
    outline: "border border-white/20 text-zinc-200 hover:text-white hover:border-white hover:bg-white/5 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]",
    ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-9 px-4 text-[11px] rounded-lg",
    md: "h-11 px-6 text-xs rounded-xl",
    lg: "h-13 px-8 text-xs rounded-xl",
    icon: "h-10 w-10 rounded-xl",
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </motion.button>
  );
});

Button.displayName = "Button";
export default Button;
