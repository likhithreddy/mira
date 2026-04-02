'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export function CtaSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-background py-24 lg:py-32">
      {/* Scoped gooey filter */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="gooey-filter-cta" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="mb-4 font-heading text-5xl font-bold text-foreground md:text-6xl lg:text-7xl">
            Ready to practise?
          </h2>
          <p className="mx-auto mb-10 max-w-lg font-body text-lg font-light text-muted-foreground">
            Upload your resume, pick a role, and start your first session in under a minute.
          </p>

          <div className="flex justify-center">
            <div
              className="group relative inline-flex items-center"
              style={{ filter: 'url(#gooey-filter-cta)' }}
            >
              <Link
                href="/signup"
                className="relative z-10 flex h-14 cursor-pointer items-center rounded-full bg-foreground px-10 font-body text-sm font-semibold text-background transition-all duration-300"
              >
                Get Started Free
              </Link>
              <Link
                href="/signup"
                className="absolute right-0 z-0 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-x-[44px] group-hover:opacity-100"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
