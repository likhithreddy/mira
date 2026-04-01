'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Upload, Sparkles, Mic, MessageSquare, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Context',
    description:
      'Paste your resume and the job description. MIRA reads both to understand who you are and what the role demands.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Questions Are Generated',
    description:
      'In seconds, MIRA produces 8–12 interview questions calibrated to your experience level and the specific role.',
  },
  {
    number: '03',
    icon: Mic,
    title: 'Speak Your Answers',
    description:
      'Answer each question out loud. MIRA transcribes your speech in real time — no typing, no shortcuts. Just you and the mic.',
  },
  {
    number: '04',
    icon: MessageSquare,
    title: 'Get Pushed Back',
    description:
      'MIRA evaluates each answer and decides whether to probe deeper. If your answer is thin, it follows up — just like a real interviewer would.',
  },
  {
    number: '05',
    icon: BarChart3,
    title: 'Read Your Report',
    description:
      'When the session ends, you get a structured feedback report — strengths, gaps, and a clear direction for what to improve.',
  },
] as const;

export function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header — centered */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-20 text-center"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-widest text-muted-foreground">
            The process
          </p>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            From resume to ready.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-lg font-light text-muted-foreground">
            Five minutes of setup. Real interview practice.
          </p>
        </motion.div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <motion.div
            className="absolute left-0 right-0 top-10 hidden h-px bg-border lg:block"
            initial={shouldReduceMotion ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{ transformOrigin: 'left' }}
          />

          <div className="relative grid gap-12 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
                className="relative flex flex-col lg:items-start"
              >
                {/* Vertical line — mobile only */}
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-12 h-full w-px bg-border lg:hidden" />
                )}

                {/* Step dot on the line */}
                <div className="relative z-10 mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                  <step.icon className="h-4 w-4 text-foreground/60" />
                </div>

                {/* Decorative number */}
                <span className="mb-2 font-heading text-7xl font-bold leading-none text-foreground/5 lg:text-8xl">
                  {step.number}
                </span>

                <h3 className="mb-2 font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
