import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';

export const DashboardHeader = ({ title }: { title: string }) => {
    return (
        <header className="h-20 border-b border-border/50 px-8 flex items-center justify-between gap-4 sticky top-0 glass z-40">
            <div className="flex-1 flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu size={20} />
                </Button>
                <h1 className="text-xl font-bold gradient-text hidden sm:block">{title}</h1>
            </div>

            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search anything..."
                        className="pl-10 bg-white/5 border-border/30 focus:border-primary/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} className="text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                </Button>
            </div>
        </header>
    );
};
