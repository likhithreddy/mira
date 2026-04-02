'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
] as const;

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed top-0 z-50 w-full">
      <div
        className={`mx-auto flex items-center justify-between border transition-all duration-500 ease-in-out ${
          scrolled
            ? 'mt-3 max-w-3xl rounded-full border-foreground/10 bg-background/20 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_8px_32px_rgba(255,255,255,0.04)]'
            : 'mt-0 max-w-full rounded-none border-transparent bg-transparent px-6 py-6'
        }`}
      >
        {/* Logo */}
        <motion.div
          className="pointer-events-auto flex cursor-pointer items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <a href="#" className="font-heading text-2xl font-bold tracking-tight text-foreground">
            MIRA
          </a>
        </motion.div>

        {/* Center nav links - desktop */}
        <nav className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center space-x-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-2 text-xs font-light text-foreground/80 transition-all duration-200 hover:bg-foreground/10 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right zone: theme toggle + gooey sign in - desktop */}
        <div className="pointer-events-auto hidden items-center md:flex">
          <AnimatedThemeToggler className="mr-6 cursor-pointer text-foreground/70 transition-colors hover:text-foreground" />

          <div
            className="group relative flex items-center"
            style={{ filter: 'url(#gooey-filter)' }}
          >
            <Link
              href="/login"
              className="absolute right-0 z-0 flex h-8 -translate-x-[40px] cursor-pointer items-center justify-center rounded-full bg-foreground px-2.5 py-2 text-xs font-normal text-background transition-all duration-300 group-hover:-translate-x-[76px]"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </Link>
            <Link
              href="/login"
              className="relative z-10 flex h-8 cursor-pointer items-center rounded-full bg-foreground px-6 py-2 text-xs font-normal text-background transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="pointer-events-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-heading text-xl">MIRA</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <AnimatedThemeToggler className="cursor-pointer text-foreground/70 transition-colors hover:text-foreground" />
                </div>
                <Button
                  variant="ghost"
                  asChild
                  className="justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
