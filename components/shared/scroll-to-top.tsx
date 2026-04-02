'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="fixed bottom-8 right-6 z-40 sm:bottom-12 sm:right-10 md:bottom-16 md:right-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: 'easeOut',
          }}
          whileHover={{ scale: 1.25 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-foreground/20" />

            {/* Inner circle */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-colors dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] sm:h-12 sm:w-12">
              <svg
                className="h-4 w-4 text-background sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7L12 2M12 2L17 7M12 2V16"
                />
              </svg>
            </div>

            {/* Rotating text */}
            <motion.svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transform: 'scale(1.6)' }}
            >
              <defs>
                <path
                  id="scroll-top-circle"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text className="fill-foreground/60 text-[8px] font-medium">
                <textPath href="#scroll-top-circle" startOffset="0%">
                  &bull; Back to Top &bull; Back to Top &bull; Back to Top &bull; Back to Top &bull;
                </textPath>
              </text>
            </motion.svg>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
