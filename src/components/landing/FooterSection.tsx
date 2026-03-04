/**
 * INSTRUCTIONS FOR COPY-PASTE:
 * 1. Go to MVPBlocks and pick a Footer block
 * 2. Copy the component code
 * 3. Replace EVERYTHING below the imports with the pasted code
 * 4. Remove 'use client' at the top if present
 * 5. Change: import { cn } from '@/lib/utils'  ← keep this (it works)
 * 6. Change: import { Button } from '@/components/ui/button'
 *       TO:  import { Button } from '@/components/mvpblocks/ui/button'
 * 7. Change any next/link: import Link from 'next/link'
 *       TO:  import { Link } from 'react-router-dom'
 * 8. Remove any `next/font` imports — use inline style for fonts
 * 9. The component MUST be exported as: export default function FooterSection()
 * 10. Save — Vite hot-reloads automatically.
 */

'use client';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import {
    Github,
    Linkedin,
    Twitter,
    Moon,
    Sun,
    ArrowDownLeft,
    MessageCircle,
} from 'lucide-react';

const data = () => ({
    navigation: {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'On-Demand Pay', href: '#features' },
            { name: 'Roadmap', href: '#' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Careers', href: '/careers' },
            { name: 'Contact', href: '/contact' },
        ],
        resources: [
            { name: 'Documentation', href: '/docs' },
            { name: 'API Reference', href: '/api' },
            { name: 'Labour Code Guide', href: '/docs' },
            { name: 'Status', href: '/status' },
        ],
        legal: [
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
        ],
    },
    socialLinks: [
        { icon: Twitter, label: 'Twitter', href: '#' },
        { icon: Github, label: 'GitHub', href: '#' },
        { icon: MessageCircle, label: 'Discord', href: '#' },
        { icon: Linkedin, label: 'LinkedIn', href: '#' },
    ],
    bottomLinks: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/cookies', label: 'Cookie Policy' },
    ],
});

export default function FooterStandard() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentYear = new Date().getFullYear();

    if (!mounted) return null;

    return (
        <footer className="mt-20 w-full">
            <div className="animate-energy-flow via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
            <div className="relative w-full px-5">
                {/* Top Section */}
                <div className="container mx-auto grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Company Info */}
                    <div className="space-y-6 lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            </div>
                            <span className="text-xl font-semibold">PayPulse</span>
                        </Link>
                        <p className="text-muted-foreground max-w-md">
                            Modern payroll infrastructure for Indian businesses — compliant,
                            automated, and built for your people.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2">
                                {data().socialLinks.map(({ icon: Icon, label, href }) => (
                                    <Button
                                        key={label}
                                        size="icon"
                                        variant="outline"
                                        asChild
                                        className="hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-500 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md"
                                    >
                                        <Link to={href}>
                                            <Icon className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-1000 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </div>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="w-full max-w-md space-y-3"
                        >
                            <label htmlFor="email" className="block text-sm font-medium">
                                Get payroll tips & compliance updates
                            </label>
                            <div className="relative w-full">
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="your@company.com"
                                    className="h-12 w-full"
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="absolute top-1.5 right-1.5 cursor-pointer transition-all duration-1000 hover:px-10"
                                >
                                    Subscribe
                                </Button>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Get the latest updates, tutorials, and exclusive offers.
                            </p>
                        </form>
                        <h1 className="from-muted-foreground/15 bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl">
                            PayPulse
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="grid w-full grid-cols-2 items-start justify-between gap-8 px-5 lg:col-span-3">
                        {(['product', 'company', 'resources', 'legal'] as const).map(
                            (section) => (
                                <div key={section} className="w-full">
                                    <h3 className="border-primary mb-4 -ml-5 border-l-2 pl-5 text-sm font-semibold tracking-wider uppercase">
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </h3>
                                    <ul className="space-y-3">
                                        {data().navigation[section].map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className="group text-muted-foreground hover:text-foreground decoration-primary -ml-5 inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 hover:pl-5 hover:underline"
                                                >
                                                    <ArrowDownLeft className="text-primary rotate-[225deg] opacity-30 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 sm:group-hover:rotate-[225deg] md:rotate-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="animate-rotate-3d via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent" />
                <div className="text-muted-foreground container mx-auto flex flex-col items-center justify-between gap-4 p-4 text-xs md:flex-row md:px-0 md:text-sm">
                    <p className="">
                        &copy; {currentYear} PayPulse Technologies Pvt. Ltd. | All rights reserved
                    </p>
                    <div className="flex items-center gap-4">
                        {data().bottomLinks.map(({ href, label }) => (
                            <Link key={href} to={href} className="hover:text-foreground">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
                <span className="from-primary/20 absolute inset-x-0 bottom-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-t" />
            </div>

            {/* Animations */}
            <style>{`
        /* ===== Animation Presets ===== */
        .animate-rotate-3d {
          animation: rotate3d 8s linear infinite;
        }

        .animate-energy-flow {
          animation: energy-flow 4s linear infinite;
          background-size: 200% 100%;
        }

        /* ===== Keyframes ===== */
        @keyframes rotate3d {
          0% {
            transform: rotateY(0);
          }
          100% {
            transform: rotateY(360deg);
          }
        }

        @keyframes energy-flow {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
      `}</style>
        </footer>
    );
}

