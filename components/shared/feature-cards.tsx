'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Mic, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { staggerContainer, fadeIn } from '@/utils/animations';

const features = [
  {
    icon: Brain,
    title: 'Contextual Questions',
    description:
      'Upload your resume and job description to receive tailored interview questions that match the role.',
  },
  {
    icon: Mic,
    title: 'Spoken Practice',
    description:
      'Answer questions out loud using your microphone, just like a real interview. Build confidence through practice.',
  },
  {
    icon: BarChart3,
    title: 'Performance Report',
    description:
      'Get detailed feedback on your answers with scores, strengths, and actionable areas for improvement.',
  },
] as const;

export function FeatureCards() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion ? { initial: {}, animate: {} } : staggerContainer;
  const itemVariants = shouldReduceMotion ? { initial: {}, animate: {} } : fadeIn;

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardHeader>
                <feature.icon className="mb-2 h-10 w-10 text-primary" />
                <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                <CardDescription className="font-body text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
