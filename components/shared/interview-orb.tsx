'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function InterviewOrb() {
  return (
    <motion.div
      className="absolute bottom-8 right-6 z-30 flex flex-col items-center gap-2 sm:bottom-12 sm:right-10 md:bottom-16 md:right-16"
      whileHover={{ scale: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href="/signup"
        className="flex flex-col items-center gap-2"
        aria-label="Get started with MIRA"
      >
        {/* Muted CTA label — above the orb */}
        <motion.span
          className="text-xs font-medium text-muted-foreground/60"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Get Started
        </motion.span>

        <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-foreground/20" />

          {/* Inner orb with theme-aware shadow */}
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
                d="M7 17L17 7M17 7H7M17 7V17"
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
              <path id="orb-circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-foreground/60 text-[8px] font-medium">
              <textPath href="#orb-circle" startOffset="0%">
                &bull; Practice Now &bull; AI Feedback &bull; Ace Interviews &bull; Get Hired &bull;
              </textPath>
            </text>
          </motion.svg>
        </div>
      </Link>
    </motion.div>
  );
}
