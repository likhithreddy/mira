'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function InterviewOrb() {
  return (
    <Link
      href="/signup"
      className="absolute bottom-16 right-16 z-30"
      aria-label="Get started with MIRA"
    >
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center"
        whileHover={{ scale: 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-foreground/20" />

        {/* Inner orb with theme-aware shadow */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-colors dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <svg
            className="h-5 w-5 text-foreground"
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
              &bull; MIRA &bull; Practice Now &bull; AI Feedback &bull; Ace Interviews &bull; Get
              Hired
            </textPath>
          </text>
        </motion.svg>
      </motion.div>
    </Link>
  );
}
