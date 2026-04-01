'use client';

import { useState } from 'react';
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

  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <motion.div
        className="flex cursor-pointer items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-foreground">
          MIRA
        </Link>
      </motion.div>

      {/* Center nav links — desktop */}
      <nav className="hidden items-center space-x-2 md:flex">
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

      {/* Right zone: theme toggle + gooey sign in button — desktop */}
      <div className="hidden items-center md:flex">
        <AnimatedThemeToggler className="mr-10 cursor-pointer text-foreground/70 transition-colors hover:text-foreground" />

        <div className="group relative flex items-center" style={{ filter: 'url(#gooey-filter)' }}>
          <Link
            href="/login"
            className="absolute right-0 z-0 flex h-8 -translate-x-[40px] cursor-pointer items-center justify-center rounded-full bg-foreground px-2.5 py-2 text-xs font-normal text-background transition-all duration-300 group-hover:-translate-x-[76px] group-hover:bg-foreground/90"
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
            className="relative z-10 flex h-8 cursor-pointer items-center rounded-full bg-foreground px-6 py-2 text-xs font-normal text-background transition-all duration-300 hover:bg-foreground/90"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden">
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
    </header>
  );
}
