import React from 'react';
import { Card } from './dashboard-card';
import { Button } from './button';
import { MoreHorizontal, Mail, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const users = [
    { id: 1, name: 'Alice Freeman', role: 'Employee', dept: 'Design', status: 'Active', email: 'alice@paypulse.ai' },
    { id: 2, name: 'Bob Smith', role: 'Admin', dept: 'Management', status: 'Active', email: 'bob@paypulse.ai' },
    { id: 3, name: 'Charlie Davis', role: 'Employee', dept: 'Engineering', status: 'Away', email: 'charlie@paypulse.ai' },
    { id: 4, name: 'Diana Prince', role: 'Employee', dept: 'Marketing', status: 'Active', email: 'diana@paypulse.ai' },
    { id: 5, name: 'Edward Norton', role: 'Employee', dept: 'Finance', status: 'Offline', email: 'ed@paypulse.ai' },
];

export const UsersTable = () => {
    return (
        <Card title="User Management" description="View and manage organization members">
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border/50">
                            <th className="pb-3 text-sm font-semibold text-muted-foreground">User</th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground">Department</th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground">Role</th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-sm">{user.dept}</td>
                                <td className="py-4">
                                    <span className={cn(
                                        'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                        user.status === 'Active' ? 'bg-emerald-400/10 text-emerald-400' :
                                            user.status === 'Away' ? 'bg-amber-400/10 text-amber-400' : 'bg-white/10 text-muted-foreground'
                                    )}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-1.5 text-xs">
                                        {user.role === 'Admin' ? <Shield size={14} className="text-primary" /> : <User size={14} />}
                                        {user.role}
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal size={18} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
