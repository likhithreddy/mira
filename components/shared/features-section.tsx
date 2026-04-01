'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Mic, FileText, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'Questions Built for Your Role',
    description:
      'Upload your resume and the job description. MIRA generates 8–12 questions tailored specifically to your experience and the role - not generic filler.',
  },
  {
    icon: Mic,
    title: 'Practice Out Loud',
    description:
      'Answer every question by speaking, exactly like a real interview. No typing, no shortcuts - your voice is what gets evaluated.',
  },
  {
    icon: MessageSquare,
    title: 'Real Follow-Up Questions',
    description:
      "MIRA listens to your answers and pushes back. Vague answers get probed. Strong answers get acknowledged. It doesn't just follow a script.",
  },
] as const;

const signatureFeature = {
  icon: FileText,
  title: 'A Report That Actually Helps',
  description:
    'After each session you get a structured breakdown - what you said well, where you were vague, which answers missed the mark, and what to work on before the real interview. Not a score. A direction.',
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariant = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion();

  const container = shouldReduceMotion ? { initial: {}, animate: {} } : staggerContainer;
  const item = shouldReduceMotion ? { initial: {}, animate: {} } : cardVariant;

  return (
    <section id="features" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header - left aligned */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-16"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-widest text-muted-foreground">
            What MIRA does
          </p>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Built for the
            <br />
            interview room.
          </h2>
        </motion.div>

        {/* 3-column card grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group h-full border-border/50 bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-lg">
                <CardHeader className="p-6">
                  <feature.icon className="mb-4 h-8 w-8 text-foreground/60 transition-colors duration-300 group-hover:text-foreground" />
                  <CardTitle className="mb-2 font-heading text-xl text-foreground">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="font-body text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Signature full-width card */}
        <motion.div
          className="mt-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
        >
          <Card className="group border-border/50 bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-lg">
            <CardHeader className="p-6 sm:p-8 md:flex-row md:items-start md:gap-8">
              <signatureFeature.icon className="mb-4 h-10 w-10 shrink-0 text-foreground/60 transition-colors duration-300 group-hover:text-foreground md:mb-0 md:mt-1" />
              <div>
                <CardTitle className="mb-3 font-heading text-2xl text-foreground md:text-3xl">
                  {signatureFeature.title}
                </CardTitle>
                <CardDescription className="max-w-3xl font-body text-base leading-relaxed text-muted-foreground">
                  {signatureFeature.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
