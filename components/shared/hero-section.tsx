'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { fadeIn } from '@/utils/animations';
import { LandingNav } from '@/components/shared/landing-nav';
import { InterviewOrb } from '@/components/shared/interview-orb';

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const heroVariants = shouldReduceMotion ? { initial: {}, animate: {} } : fadeIn;

  return (
    <section
      data-testid="hero-section"
      className="hero-gradient relative h-screen w-full overflow-hidden"
    >
      {/* SVG Filters */}
      <svg className="absolute inset-0 h-0 w-0">
        <defs>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
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

      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      {/* Navbar — relative, inside the hero */}
      <LandingNav />

      {/* Spline 3D — right half, behind content */}
      <div className="spline-watermark-hidden absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="h-full w-full"
        />
      </div>

      {/* Hero content — bottom left */}
      <motion.main
        className="absolute bottom-8 left-8 z-20 max-w-2xl"
        variants={heroVariants}
        initial="initial"
        animate="animate"
      >
        <h1 className="font-heading text-6xl font-bold text-foreground md:text-7xl lg:text-8xl">
          MIRA
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg font-light leading-relaxed text-muted-foreground">
          Your AI-powered mock interview coach. Practice with contextual questions, speak your
          answers aloud, and get structured feedback to land your next role.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-12">
          {/* Gooey Get Started Free button */}
          <div
            className="group relative flex items-center"
            style={{ filter: 'url(#gooey-filter)' }}
          >
            <Link
              href="/signup"
              className="relative z-10 flex h-12 cursor-pointer items-center rounded-full bg-foreground px-8 py-2 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/signup"
              className="absolute right-0 z-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-x-[40px] group-hover:opacity-100"
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

          {/* Gooey Sign In button */}
          <div
            className="group relative flex items-center"
            style={{ filter: 'url(#gooey-filter)' }}
          >
            <Link
              href="/login"
              className="relative z-10 flex h-12 cursor-pointer items-center rounded-full bg-foreground px-8 py-2 text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="absolute right-0 z-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-all duration-300 group-hover:translate-x-[40px] group-hover:opacity-100"
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
      </motion.main>

      {/* Interview orb — bottom right */}
      <InterviewOrb />
    </section>
  );
}
