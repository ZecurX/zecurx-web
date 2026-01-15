"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
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
};

export default function PlansList({ initialPlans }: { initialPlans: Plan[] }) {
    const [activeTab, setActiveTab] = useState<'all' | 'internship' | 'academy'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const filteredPlans = initialPlans?.filter(plan => {
        const matchesTab = activeTab === 'all' || plan.type === activeTab;
        const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {editingPlan && (
                <EditPlanDialog
                    plan={editingPlan}
                    onClose={() => setEditingPlan(null)}
                    onUpdate={() => window.location.reload()}
                />
            )}
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
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${plan.type === 'internship'
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            }`}>
                                            {plan.type}
                                        </span>
                                        {plan.active && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        )}
                                        {!plan.in_stock && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors w-full line-clamp-1">{plan.name}</h3>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{plan.description}</p>

                            <div className="flex items-end justify-between pt-4 border-t border-border/50">
                                <p className="text-2xl font-bold text-foreground">
                                    {plan.price === 0 ? "Custom" : `₹${plan.price.toLocaleString('en-IN')}`}
                                </p>
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
