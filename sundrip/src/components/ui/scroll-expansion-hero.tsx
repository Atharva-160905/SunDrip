"use client";

import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

export interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  tagline?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = "image",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title = "SUNDRIP ATHLETICS",
  tagline = "STAY AHEAD OF YOUR GENERATION.",
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const touchStartYRef = useRef<number>(0);

  // Responsive mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Butter-smooth, non-hijacking wheel handler
  useEffect(() => {
    const handleWheel = (e: globalThis.WheelEvent) => {
      // Only capture wheel when user is at the very top of the page
      if (window.scrollY <= 5) {
        if (e.deltaY > 0 && scrollProgress < 1) {
          // Scrolling down while unexpanded: expand smoothly
          e.preventDefault();
          const delta = e.deltaY * 0.0022;
          setScrollProgress((prev) => Math.min(1, prev + delta));
        } else if (e.deltaY < 0 && scrollProgress > 0) {
          // Scrolling up while at the top: collapse back smoothly
          e.preventDefault();
          const delta = Math.abs(e.deltaY) * 0.0022;
          setScrollProgress((prev) => Math.max(0, prev - delta));
        }
      }
    };

    // Mobile touch handling
    const handleTouchStart = (e: globalThis.TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (window.scrollY <= 5 && touchStartYRef.current) {
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartYRef.current - currentY;

        if (deltaY > 0 && scrollProgress < 1) {
          if (e.cancelable) e.preventDefault();
          setScrollProgress((prev) => Math.min(1, prev + deltaY * 0.006));
        } else if (deltaY < 0 && scrollProgress > 0) {
          if (e.cancelable) e.preventDefault();
          setScrollProgress((prev) => Math.max(0, prev - Math.abs(deltaY) * 0.006));
        }
        touchStartYRef.current = currentY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollProgress]);

  // Dimensions & smooth interpolation
  const mediaWidth = 320 + scrollProgress * (isMobile ? 550 : 1200);
  const mediaHeight = 420 + scrollProgress * (isMobile ? 220 : 380);
  const textTranslateX = scrollProgress * (isMobile ? 120 : 180);

  const words = title ? title.split(" ") : ["SUNDRIP", "ATHLETICS"];
  const firstWord = words[0];
  const restOfTitle = words.slice(1).join(" ");

  return (
    <div className="relative w-full overflow-x-hidden bg-[#060608]">
      {/* SCREEN FIXED HERO CONTAINER */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Full-Bleed 100% Edge-to-Edge Aesthetic Background */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          <img
            src={bgImageSrc}
            alt="Hero Sanctuary Background"
            className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
            style={{
              opacity: Math.max(0.25, 1 - scrollProgress * 0.65),
              transform: `scale(${1 + scrollProgress * 0.06})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-black/40 to-black/30" />
        </div>

        {/* Center Content / Expanding Media Stage */}
        <div className="relative z-10 w-full h-full min-h-screen flex flex-col items-center justify-center px-4">
          
          {/* Centered Expanding Card */}
          <div
            onClick={() => {
              if (scrollProgress < 1) setScrollProgress(1);
            }}
            className="absolute z-0 top-1/2 left-1/2 rounded-2xl overflow-hidden shadow-2xl shadow-black/95 border border-white/10 cursor-pointer"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: "96vw",
              maxHeight: "86vh",
              transform: "translate(-50%, -50%)",
              transition: "width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease-out",
            }}
          >
            {mediaType === "video" ? (
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaSrc}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
            )}

            {/* Contrast Scrim */}
            <div
              className="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none"
              style={{ opacity: Math.max(0.15, 0.5 - scrollProgress * 0.35) }}
            />
          </div>

          {/* Outward-Translating Typography & Tagline */}
          <div
            className={`flex flex-col items-center justify-center text-center gap-1 sm:gap-2 w-full relative z-10 select-none ${
              textBlend ? "mix-blend-difference" : "mix-blend-normal"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-4 leading-none">
              <h2
                className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-white uppercase leading-none drop-shadow-2xl"
                style={{
                  transform: `translateX(-${textTranslateX}px)`,
                  transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {firstWord}
              </h2>
              <h2
                className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.03em] text-zinc-300 font-light uppercase leading-none drop-shadow-2xl"
                style={{
                  transform: `translateX(${textTranslateX}px)`,
                  transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {restOfTitle}
              </h2>
            </div>

            {/* Tagline */}
            {tagline && (
              <p
                className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-zinc-300 mt-4 drop-shadow-lg"
                style={{
                  opacity: Math.max(0, 1 - scrollProgress * 1.5),
                  transform: `translateY(${scrollProgress * 20}px)`,
                  transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                }}
              >
                {tagline}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* REVEALED CONTENT CONTAINER */}
      <div 
        className="relative z-20 w-full transition-opacity duration-500"
        style={{
          opacity: scrollProgress >= 0.75 ? 1 : 0,
          pointerEvents: scrollProgress >= 0.75 ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
