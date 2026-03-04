import React from 'react';
import { easeInOut, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/mvpblocks/ui/button';
import { cn } from '@/lib/utils';

// ── Section components — paste your MVPBlocks blocks into each file ──
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FooterSection from '@/components/landing/FooterSection';

// ─────────────────────────────────────────────────────────────────────
// ElegantShape — exact MVPBlocks code (Vite-compatible)
// ─────────────────────────────────────────────────────────────────────
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'border-2 border-white/80',
            'shadow-[0_8px_32px_0_rgba(255,255,255,0.4)]',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.6),transparent_70%)]',
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// HeroGeometric — exact MVPBlocks layout, PayPulse content
// ─────────────────────────────────────────────────────────────────────
function HeroGeometric() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: easeInOut },
    }),
  };

  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <div className="from-primary/20 to-primary/20 absolute inset-0 bg-gradient-to-br via-transparent blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/70" className="top-[15%] left-[-10%] md:top-[20%] md:left-[-5%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-rose-400" className="top-[70%] right-[-5%] md:top-[75%] md:right-[0%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-400" className="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]" />
        <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-amber-500/70" className="top-[10%] right-[15%] md:top-[15%] md:right-[20%]" />
        <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-cyan-500/70" className="top-[5%] left-[20%] md:top-[10%] md:left-[25%]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <motion.div
            custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
            className="border-primary/30 bg-card/50 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-sm backdrop-blur-sm md:mb-12"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <span className="text-foreground text-sm font-medium tracking-wide">
              Labour Code 2026 Compliant
            </span>
          </motion.div>

          {/* Headline — capped at text-6xl so it matches MVPBlocks at full screen width */}
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="mx-4 mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:mb-6 md:text-6xl">
              <span className="from-foreground to-foreground/80 bg-gradient-to-b bg-clip-text text-transparent">
                Modern Payroll for
              </span>
              <br />
              <span
                className="from-primary via-primary/90 to-primary bg-gradient-to-r bg-clip-text p-4 text-transparent"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Modern Teams.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-muted-foreground mx-auto mb-10 max-w-xl px-4 text-base leading-relaxed sm:text-lg md:text-xl">
              Streamline your entire payroll lifecycle — from onboarding and salary structures to
              one-click payroll runs, flexi-benefits, and AI-powered compliance.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link to="/login">
              <Button size="lg" className="from-primary shadow-primary/10 hover:from-primary/90 to-primary hover:to-primary/90 rounded-full border-none bg-gradient-to-r shadow-md w-full sm:w-auto">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/5 rounded-full shadow-sm w-full sm:w-auto">
                View Features
              </Button>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="from-background to-background/80 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// LandingPage — composes Navbar + Hero + all section components
// ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">

      {/* Navbar — overlaid on top of the full-screen hero */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto sm:px-8">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">PayPulse</span>
        </div>
        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-5">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
          <Link to="/login">
            <Button size="sm" className="rounded-full">Start Free Trial</Button>
          </Link>
        </div>
        {/* Mobile login */}
        <Link to="/login" className="sm:hidden">
          <Button size="sm" className="rounded-full text-xs px-3">Login</Button>
        </Link>
      </nav>

      {/* Hero */}
      <HeroGeometric />

      {/* ── Paste sections below — each lives in its own file ── */}
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
}
