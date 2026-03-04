import React from "react";
import { motion } from "motion/react";
import { Shield, Users, Zap } from "lucide-react";

export default function RoleSelection({ onSelect }: { onSelect: (role: 'admin' | 'employee') => void }) {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] -z-10 rounded-full" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex aspect-square size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-6"
                >
                    <Zap className="size-8" />
                </motion.div>
                <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Select your role</h1>
                <p className="mt-4 text-muted-foreground">How will you be using PayPulse today?</p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
                {[
                    {
                        role: 'admin',
                        title: 'HR Admin',
                        desc: 'Manage payroll, employees, and compliance reports.',
                        icon: Shield,
                        color: 'text-primary'
                    },
                    {
                        role: 'employee',
                        title: 'Employee',
                        desc: 'View payslips, benefits, and request advances.',
                        icon: Users,
                        color: 'text-emerald-400'
                    }
                ].map((option, i) => (
                    <motion.button
                        key={option.role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => onSelect(option.role as 'admin' | 'employee')}
                        className="group relative flex flex-col items-center p-8 rounded-3xl glass border-white/10 hover:border-primary/50 transition-all text-center"
                    >
                        <div className={`p-4 rounded-2xl bg-white/5 ${option.color} mb-6 group-hover:scale-110 transition-transform`}>
                            <option.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                        <div className="mt-8 flex items-center gap-2 text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Continue as {option.title} <Zap className="size-4" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
