'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const values = [
  {
    title: 'Voice-first practice',
    description: 'Real interviews happen out loud. MIRA is built around speech — not text boxes.',
  },
  {
    title: 'Role-specific questions',
    description:
      'Your resume + the job description = questions that actually match what you will be asked.',
  },
  {
    title: 'Structured feedback',
    description: 'Not a vague score. A clear breakdown of what worked, what did not, and why.',
  },
] as const;

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <section id="about" className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left — mission copy */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <p className="mb-3 font-body text-xs uppercase tracking-widest text-muted-foreground">
                Why we built this
              </p>
              <h2 className="mb-8 font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                We built the interview coach we wish we had.
              </h2>
              <div className="space-y-5 font-body text-base leading-relaxed text-muted-foreground">
                <p>
                  Most people prepare for interviews by re-reading their notes. That is not how
                  interviews work. Interviews are spoken, pressured, and reactive — the interviewer
                  can ask anything, and you have seconds to respond clearly.
                </p>
                <p>
                  The people who do well are the ones who have practised speaking their answers out
                  loud, been pushed back on, and received honest feedback. That used to require a
                  mentor, a coach, or a friend willing to sit with you for an hour.
                </p>
                <p>
                  MIRA gives everyone that. You upload your resume, tell it what role you are
                  targeting, and it does the rest — questions, follow-ups, and a report that tells
                  you exactly what to fix before the real thing.
                </p>
              </div>
            </motion.div>

            {/* Right — value cards */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
              className="flex flex-col justify-center gap-4"
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 + index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card">
                    <CardHeader className="p-5">
                      <CardTitle className="mb-1 font-heading text-lg text-foreground">
                        {value.title}
                      </CardTitle>
                      <CardDescription className="font-body text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing CTA banner */}
      <section className="border-t border-border bg-background py-24 lg:py-32">
        {/* Gooey SVG filter scoped to this section */}
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

            {/* Gooey CTA button */}
            <div className="flex justify-center">
              <div
                className="group relative inline-flex items-center"
                style={{ filter: 'url(#gooey-filter-cta)' }}
              >
                <Link
                  href="/signup"
                  className="relative z-10 flex h-14 cursor-pointer items-center rounded-full bg-foreground px-10 font-body text-sm font-semibold text-background transition-all duration-300 hover:bg-foreground/90"
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
    </>
  );
}
