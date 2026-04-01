'use client';

import { useCallback } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import type { Application } from '@splinetool/runtime';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { TextRotate } from '@/components/ui/text-rotate';
import { fadeIn } from '@/utils/animations';
import { InterviewOrb } from '@/components/shared/interview-orb';

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const heroVariants = shouldReduceMotion ? { initial: {}, animate: {} } : fadeIn;

  const handleSplineLoad = useCallback((app: Application) => {
    const bot = app.findObjectByName('Bot');
    if (bot) {
      const s = 0.75;
      bot.scale.x = s;
      bot.scale.y = s;
      bot.scale.z = s;
    }
  }, []);

  return (
    <section
      data-testid="hero-section"
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      {/* Spotlight - light mode only */}
      <Spotlight className="-top-40 left-0 dark:hidden md:-top-20 md:left-60" fill="black" />

      {/* Spline 3D — container spans full viewport for mouse tracking */}
      <div className="spline-watermark-hidden absolute inset-x-0 -bottom-[15%] top-0 z-10 hidden lg:block">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="h-full w-full"
          onLoad={handleSplineLoad}
        />
      </div>

      {/* Layer 3: Tagline — above the robot */}
      <motion.div
        className="pointer-events-none relative z-20 flex flex-col items-center pt-24 text-center"
        variants={heroVariants}
        initial="initial"
        animate="animate"
      >
        {/* Tagline */}
        <div className="flex items-center justify-center font-body text-lg font-light text-muted-foreground md:text-xl lg:text-2xl">
          <LayoutGroup>
            <motion.div className="flex whitespace-pre" layout>
              <motion.span
                className="pt-0.5 md:pt-1"
                layout
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              >
                Your AI coach to{' '}
              </motion.span>
              <TextRotate
                texts={[
                  'ace interviews',
                  'build confidence',
                  'get hired',
                  'speak clearly',
                  'land your role',
                ]}
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
        </div>
      </motion.div>

      {/* Interview orb with CTA label - bottom right */}
      <InterviewOrb />
    </section>
  );
}
