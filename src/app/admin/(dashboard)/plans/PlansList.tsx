"use client";

import { useState, useCallback } from "react";
import { Plus, Search, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditPlanDialog from "./EditPlanDialog";

type Plan = {
    id: string;
    name: string;
    type: string;
    price: number;
    description: string | null;
    active: boolean;
    in_stock: boolean;
    test_mode: boolean;
    duration?: string | null;
    level?: string | null;
    features?: string[] | null;
    logo?: string | null;
    original_price?: number | null;
    popular?: boolean;
    students_count?: number | null;
    brochure_link?: string | null;
    pricing_type?: string;
};

export default function PlansList({ initialPlans }: { initialPlans: Plan[] }) {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [activeTab, setActiveTab] = useState<'all' | 'internship' | 'academy'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const refetchPlans = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/plans?all=true');
            if (res.ok) {
                const data = await res.json();
                setPlans(data.plans);
            }
        } catch (err) {
            console.error('Failed to refetch plans:', err);
        }
    }, []);

    const filteredPlans = plans.filter(plan => {
        const matchesTab = activeTab === 'all' || plan.type === activeTab;
        const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <EditPlanDialog
                plan={editingPlan}
                open={!!editingPlan}
                onOpenChange={(open) => !open && setEditingPlan(null)}
                onUpdate={refetchPlans}
            />
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">

                {/* Tabs */}
                <div className="flex p-1 bg-secondary/50 border border-border rounded-lg">
                    {(['all', 'internship', 'academy'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${activeTab === tab
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search plans..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredPlans?.map((plan) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={plan.id}
                            className="group bg-card/40 hover:bg-card/80 border border-border/50 hover:border-border rounded-xl p-6 space-y-4 transition-colors relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${plan.type === 'internship'
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            }`}>
                                            {plan.type}
                                        </span>
                                        {plan.level && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                                                {plan.level}
                                            </span>
                                        )}
                                        {plan.duration && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                                                {plan.duration}
                                            </span>
                                        )}
                                        {plan.active && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        )}
                                        {!plan.in_stock && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
                                                Out of Stock
                                            </span>
                                        )}
                                        {plan.test_mode && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                                                🧪 Test Mode
                                            </span>
                                        )}
                                        {plan.pricing_type === 'institutional' && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-orange-500/10 text-orange-400 border-orange-500/20">
                                                Institutional
                                            </span>
                                        )}
                                        {plan.pricing_type === 'contact' && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                                                Contact Pricing
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{plan.name}</h3>
                                        {plan.popular && (
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{plan.description}</p>

                            <div className="flex items-end justify-between pt-4 border-t border-border/50">
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {plan.test_mode ? '₹1' : (plan.price === 0 ? "Custom" : `₹${plan.price.toLocaleString('en-IN')}`)}
                                    </p>
                                    {plan.test_mode && (
                                        <p className="text-xs text-amber-400">Original: ₹{plan.price.toLocaleString('en-IN')}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setEditingPlan(plan)}
                                        className="px-3 py-1.5 text-xs font-medium text-background bg-foreground rounded hover:bg-foreground/80 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Card (Animated to flow with grid) */}
                <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-xl hover:bg-secondary/50 hover:border-foreground/20 transition-colors group h-full min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Create New Plan</span>
                </motion.button>
            </motion.div>

            {(!filteredPlans || filteredPlans.length === 0) && (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">No plans found matching your filter.</p>
                </div>
            )}
        </div>
    );
}
