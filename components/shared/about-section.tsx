'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const team = [
  { name: 'Likhith Reddy Rechintala', initials: 'LR' },
  { name: 'Jaya Sriharshita Koneti', initials: 'JK' },
] as const;

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left - mission copy */}
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
                interviews work. Interviews are spoken, pressured, and reactive - the interviewer
                can ask anything, and you have seconds to respond clearly.
              </p>
              <p>
                The people who do well are the ones who have practised speaking their answers out
                loud, been pushed back on, and received honest feedback. That used to require a
                mentor, a coach, or a friend willing to sit with you for an hour.
              </p>
              <p>
                MIRA gives everyone that. You upload your resume, tell it what role you are
                targeting, and it does the rest - questions, follow-ups, and a report that tells you
                exactly what to fix before the real thing.
              </p>
            </div>
          </motion.div>

          {/* Right - team */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="mb-8 font-body text-xs uppercase tracking-widest text-muted-foreground">
              The team
            </p>
            <div className="grid grid-cols-2 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-card p-6 text-center"
                >
                  <Avatar className="h-20 w-20 border-2 border-border/50">
                    <AvatarFallback className="bg-foreground font-heading text-xl font-bold text-background">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-body text-sm font-medium text-foreground">{member.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
