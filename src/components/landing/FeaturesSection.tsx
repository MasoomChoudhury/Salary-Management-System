/**
 * INSTRUCTIONS FOR COPY-PASTE:
 * 1. Go to MVPBlocks and pick a Features block
 * 2. Copy the component code
 * 3. Replace EVERYTHING below the imports with the pasted code
 * 4. Remove 'use client' at the top if present
 * 5. Change: import { cn } from '@/lib/utils'  ← keep this (it works)
 * 6. Change: import { Button } from '@/components/ui/button'
 *       TO:  import { Button } from '@/components/mvpblocks/ui/button'
 * 7. Remove any `next/font` imports — use inline style for fonts
 * 8. The component MUST be exported as: export default function FeaturesSection()
 * 9. Save — Vite hot-reloads automatically.
 */

import {
    Zap,
    ShieldCheck,
    BarChart3,
    Wallet,
    TrendingUp,
    FileText,
    LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the feature item type
type FeatureItem = {
    icon: LucideIcon;
    title: string;
    description: string;
    position?: 'left' | 'right';
    cornerStyle?: string;
};

// Create feature data arrays for left and right columns
const leftFeatures: FeatureItem[] = [
    {
        icon: Zap,
        title: 'One-Click Payroll',
        description:
            'Compile active employees, compute prorated salaries, apply statutory deductions, and disburse — all in a single click.',
        position: 'left',
        cornerStyle: 'sm:translate-x-4 sm:rounded-br-[2px]',
    },
    {
        icon: ShieldCheck,
        title: 'Labour Code 2026',
        description:
            'Built-in compliance with the new Indian Labour Code — 50% wage rule, EPF, ESI, PT and LWF auto-calculated.',
        position: 'left',
        cornerStyle: 'sm:-translate-x-4 sm:rounded-br-[2px]',
    },
    {
        icon: BarChart3,
        title: 'AI Anomaly Detection',
        description:
            'Our AI agent scans every payroll run for unusual salary spikes or missing components before you approve.',
        position: 'left',
        cornerStyle: 'sm:translate-x-4 sm:rounded-tr-[2px]',
    },
];

const rightFeatures: FeatureItem[] = [
    {
        icon: TrendingUp,
        title: 'On-Demand Pay (EWA)',
        description:
            'Let employees access their earned wages before payday via instant bank transfer — zero employer risk.',
        position: 'right',
        cornerStyle: 'sm:-translate-x-4 sm:rounded-bl-[2px]',
    },
    {
        icon: Wallet,
        title: 'Flexi-Benefits Wallet',
        description:
            'Give every employee a personalised benefits wallet to allocate dynamically across food, fuel, health, and more.',
        position: 'right',
        cornerStyle: 'sm:translate-x-4 sm:rounded-bl-[2px]',
    },
    {
        icon: FileText,
        title: 'Document Center',
        description:
            'Generate appointment letters, Form 16 Part B, salary slips, and statutory registers with one click.',
        position: 'right',
        cornerStyle: 'sm:-translate-x-4 sm:rounded-tl-[2px]',
    },
];

// Feature card component
const FeatureCard = ({ feature }: { feature: FeatureItem }) => {
    const Icon = feature.icon;

    return (
        <div>
            <div
                className={cn(
                    'relative rounded-2xl px-4 pt-4 pb-4 text-sm',
                    'bg-secondary/50 ring-border ring',
                    feature.cornerStyle,
                )}
            >
                <div className="text-primary mb-3 text-[2rem]">
                    <Icon />
                </div>
                <h2 className="text-foreground mb-2.5 text-xl font-semibold">{feature.title}</h2>
                <p className="text-muted-foreground text-sm text-pretty">
                    {feature.description}
                </p>
                {/* Decorative elements */}
                <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
                <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--primary)/0.15)_0%,transparent_100%)] opacity-60"></span>
            </div>
        </div>
    );
};

export default function Feature3() {
    return (
        <section className="pt-20 pb-8" id="features">
            <div className="mx-6 max-w-[1120px] pt-2 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
                <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
                    {/* Left column */}
                    <div className="flex flex-col gap-6">
                        {leftFeatures.map((feature, index) => (
                            <FeatureCard key={`left-feature-${index}`} feature={feature} />
                        ))}
                    </div>

                    {/* Center column */}
                    <div className="order-[1] mb-6 self-center sm:order-[0] md:mb-0">
                        <div className="bg-secondary text-foreground ring-border relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm ring">
                            <span className="relative z-1 flex items-center gap-2">
                                Features
                            </span>
                            <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
                            <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(var(--primary)/0.25)_0%,transparent_100%)]"></span>
                        </div>
                        <h2 className="text-foreground mb-2 text-center text-3xl font-bold tracking-tight sm:mb-2.5 sm:text-4xl">
                            Everything Payroll, All in One Place
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-[20rem] text-center text-base text-pretty sm:text-lg">
                            PayPulse handles the full payroll lifecycle so your HR team can focus on people, not paperwork.
                        </p>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-6">
                        {rightFeatures.map((feature, index) => (
                            <FeatureCard key={`right-feature-${index}`} feature={feature} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

