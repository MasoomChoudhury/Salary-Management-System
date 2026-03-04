/**
 * INSTRUCTIONS FOR COPY-PASTE:
 * 1. Go to MVPBlocks and pick a Testimonials block
 * 2. Copy the component code
 * 3. Replace EVERYTHING below the imports with the pasted code
 * 4. Remove 'use client' at the top if present
 * 5. Change: import { cn } from '@/lib/utils'  ← keep this (it works)
 * 6. Change: import { Button } from '@/components/ui/button'
 *       TO:  import { Button } from '@/components/mvpblocks/ui/button'
 * 7. Remove any `next/font` imports — use inline style for fonts
 * 8. The component MUST be exported as: export default function TestimonialsSection()
 * 9. Save — Vite hot-reloads automatically.
 */

'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const defaultTestimonials = [
    {
        text: 'PayPulse cut our entire monthly payroll cycle from 3 days to under 2 hours. The one-click run is genuinely magical.',
        imageSrc: 'https://i.pravatar.cc/150?img=11',
        name: 'Priya Sharma',
        username: 'Head of HR',
        role: 'FinTech Startup, Bengaluru',
    },
    {
        text: 'The Labour Code 2026 compliance module saved us from a potential audit penalty. It flags issues before we even run payroll.',
        imageSrc: 'https://i.pravatar.cc/150?img=20',
        name: 'Rajan Mehta',
        username: 'Finance Controller',
        role: 'Manufacturing Co., Pune',
    },
    {
        text: 'Our employees love the EWA feature. Attrition dropped 18% in the first quarter after we rolled out on-demand pay.',
        imageSrc: 'https://i.pravatar.cc/150?img=33',
        name: 'Ananya Iyer',
        username: 'Chief People Officer',
        role: 'D2C Brand, Mumbai',
    },
    {
        text: 'The AI anomaly detection caught a ₹2.4L duplicate salary entry before disbursement. Literally paid for itself on day one.',
        imageSrc: 'https://i.pravatar.cc/150?img=47',
        name: 'Vikram Nair',
        username: 'CEO',
        role: 'SaaS Company, Hyderabad',
    },
    {
        text: 'Generating Form 16 Part B for 400+ employees used to take a week. PayPulse does it in minutes. Absolutely seamless.',
        imageSrc: 'https://i.pravatar.cc/150?img=57',
        name: 'Deepa Krishnan',
        username: 'Payroll Manager',
        role: 'IT Services Firm, Chennai',
    },
    {
        text: 'The flexi-benefits wallet has made our compensation package much more attractive without increasing our cost-to-company.',
        imageSrc: 'https://i.pravatar.cc/150?img=65',
        name: 'Saurabh Gupta',
        username: 'VP — People & Culture',
        role: 'E-commerce Co., Delhi',
    },
];

interface TestimonialProps {
    testimonials?: {
        text: string;
        imageSrc: string;
        name: string;
        username: string;
        role?: string;
    }[];
    title?: string;
    subtitle?: string;
    autoplaySpeed?: number;
    className?: string;
}

export default function TestimonialsCarousel({
    testimonials = defaultTestimonials,
    title = 'Trusted by HR & Finance teams across India',
    subtitle = 'From fast-growing startups to 500-employee enterprises, PayPulse is the payroll platform teams actually love using.',
    autoplaySpeed = 3000,
    className,
}: TestimonialProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        containScroll: 'trimSnaps',
        dragFree: true,
    });

    useEffect(() => {
        if (!emblaApi) return;

        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, autoplaySpeed);

        return () => {
            clearInterval(autoplay);
        };
    }, [emblaApi, autoplaySpeed]);

    const allTestimonials = [...testimonials, ...testimonials];

    return (
        <section
            className={cn('relative overflow-hidden py-16 md:py-24', className)}
        >
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
                <div className="bg-primary/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
                <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative mb-12 text-center md:mb-16"
                >
                    <h2 className="from-foreground to-foreground/40 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                        {title}
                    </h2>

                    <motion.p
                        className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        {subtitle}
                    </motion.p>
                </motion.div>

                {/* Testimonials carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {allTestimonials.map((testimonial, index) => (
                            <div
                                key={`${testimonial.name}-${index}`}
                                className="flex justify-center px-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="border-border from-secondary/20 to-card relative h-full w-fit rounded-2xl border bg-gradient-to-b p-6 shadow-md backdrop-blur-sm"
                                >
                                    {/* Enhanced decorative gradients */}
                                    <div className="from-primary/15 to-card absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b blur-md" />
                                    <div className="from-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t to-transparent opacity-70 blur-xl" />

                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                        viewport={{ once: true }}
                                        className="text-primary mb-4"
                                    >
                                        <div className="relative">
                                            <Quote className="h-10 w-10 -rotate-180" />
                                        </div>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                                        viewport={{ once: true }}
                                        className="text-foreground/90 relative mb-6 text-base leading-relaxed"
                                    >
                                        <span className="relative">{testimonial.text}</span>
                                    </motion.p>

                                    {/* Enhanced user info with animation */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                                        viewport={{ once: true }}
                                        className="border-border/40 mt-auto flex items-center gap-3 border-t pt-2"
                                    >
                                        <Avatar className="border-border ring-primary/10 ring-offset-background h-10 w-10 border ring-2 ring-offset-1">
                                            <AvatarImage
                                                src={testimonial.imageSrc}
                                                alt={testimonial.name}
                                            />
                                            <AvatarFallback>
                                                {testimonial.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <h4 className="text-foreground font-medium whitespace-nowrap">
                                                {testimonial.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <p className="text-primary/80 text-sm whitespace-nowrap">
                                                    {testimonial.username}
                                                </p>
                                                {testimonial.role && (
                                                    <>
                                                        <span className="text-muted-foreground flex-shrink-0">
                                                            •
                                                        </span>
                                                        <p className="text-muted-foreground text-sm whitespace-nowrap">
                                                            {testimonial.role}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
