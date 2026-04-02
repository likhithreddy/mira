'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const team = [
  {
    name: 'Likhith Reddy Rechintala',
    initials: 'LR',
    github: 'https://github.com/likhithreddy',
    linkedin: 'https://www.linkedin.com/in/likhithreddyrechintala/',
  },
  {
    name: 'Jaya Sriharshita Koneti',
    initials: 'JK',
    github: 'https://github.com/jayasriharshitakoneti',
    linkedin: 'https://www.linkedin.com/in/jaya-sriharshita-koneti/',
  },
] as const;

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="scroll-mt-20 bg-background py-24 lg:py-32">
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
                  <div className="flex gap-3">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} GitHub`}
                      className="text-muted-foreground/60 transition-colors duration-200 hover:text-[#181717] dark:text-muted-foreground/40 dark:hover:text-[#f0f0f0]"
                    >
                      <GithubIcon className="h-5 w-5" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} LinkedIn`}
                      className="text-muted-foreground/60 transition-colors duration-200 hover:text-[#0A66C2] dark:text-muted-foreground/40 dark:hover:text-[#0A66C2]"
                    >
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
