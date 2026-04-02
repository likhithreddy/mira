'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { TextRotate } from '@/components/ui/text-rotate';
import { LandingNav } from '@/components/shared/landing-nav';

const lightColors = ['#FFFFFF', '#F5F5F5', '#EBEBEB', '#E0E0E0', '#D6D6D6', '#CCCCCC', '#C2C2C2'];
const darkColors = ['#0A0A0A', '#111111', '#1A1A1A', '#222222', '#2A2A2A', '#333333', '#3C3C3C'];
const gradientStops = [35, 50, 60, 70, 80, 90, 100];

export default function NotFound() {
  const [isDark, setIsDark] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
      <LandingNav />

      <AnimatedGradientBackground
        gradientColors={isDark ? darkColors : lightColors}
        gradientStops={gradientStops}
        startingGap={80}
        Breathing
        animationSpeed={0.01}
        breathingRange={3}
      />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Cat Lottie animation */}
        <motion.div
          className="h-48 w-48 shrink-0 sm:h-56 sm:w-56 md:h-64 md:w-64"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <DotLottieReact
            src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
            loop
            autoplay
          />
        </motion.div>

        {/* 404 heading — DM Serif Display, the brand voice */}
        <motion.h1
          className="font-heading text-8xl font-bold text-foreground sm:text-9xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          404
        </motion.h1>

        {/* Rotating pill — reuses hero tagline pattern */}
        <motion.div
          className="mt-4 flex items-center justify-center font-body text-sm text-muted-foreground sm:text-lg md:text-xl"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
        >
          <LayoutGroup>
            <motion.div className="flex items-center whitespace-pre" layout>
              <motion.span
                className="pt-0.5"
                layout
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              >
                Looks like a{' '}
              </motion.span>
              <TextRotate
                texts={['wrong turn', 'dead end', 'lost page', 'missing link', 'detour']}
                mainClassName="text-background px-2 md:px-3 bg-foreground overflow-hidden py-0.5 md:py-1 justify-center rounded-lg"
                staggerFrom="last"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 md:pb-1"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
            </motion.div>
          </LayoutGroup>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-md font-body text-base font-light text-muted-foreground"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
        >
          This page doesn&apos;t exist. It might have been moved, or you may have mistyped the URL.
        </motion.p>

        {/* Gooey "Back to Home" button — matches CTA and Sign In style */}
        <motion.div
          className="mt-8"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
        >
          <svg className="absolute h-0 w-0">
            <defs>
              <filter id="gooey-filter-404" x="-50%" y="-50%" width="200%" height="200%">
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

          <div
            className="group relative inline-flex items-center"
            style={{ filter: 'url(#gooey-filter-404)' }}
          >
            <Link
              href="/"
              className="relative z-10 flex h-12 cursor-pointer items-center rounded-full bg-foreground px-8 font-body text-sm font-medium text-background transition-all duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/"
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
        </motion.div>
      </div>
    </div>
  );
}
