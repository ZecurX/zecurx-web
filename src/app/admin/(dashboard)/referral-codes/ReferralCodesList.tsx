"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, Pencil, Trash2, Ticket, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReferralCodeDialog from "./ReferralCodeDialog";
import { useRouter } from "next/navigation";
import { ReferralCodeWithStats } from "@/types/referral-types";

export default function ReferralCodesList() {
    const [search, setSearch] = useState("");
    const [codes, setCodes] = useState<ReferralCodeWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const router = useRouter();

    const fetchCodes = async () => {
        try {
            const response = await fetch('/api/admin/referral-codes');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || response.statusText;
                console.error("Error fetching referral codes:", errorMessage, errorData.stack);
                return;
            }
            const data = await response.json();
            if (data.referral_codes) {
                setCodes(data.referral_codes);
            }
        } catch (err) {
            console.error("Failed to fetch referral codes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const filteredCodes = codes.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this referral code?")) return;

        try {
            const response = await fetch(`/api/admin/referral-codes/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete referral code");
            }

            setCodes(codes.filter(c => c.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting referral code:", error);
            alert("Failed to delete referral code");
        }
    };

    const handleCopyCode = async (code: string, id: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    const formatDiscount = (code: ReferralCodeWithStats) => {
        if (code.discount_type === 'percentage') {
            return `${code.discount_value}%`;
        }
        return `₹${code.discount_value.toLocaleString()}`;
    };

    const isExpired = (code: ReferralCodeWithStats) => {
        if (!code.valid_until) return false;
        return new Date(code.valid_until) < new Date();
    };

    const isMaxedOut = (code: ReferralCodeWithStats) => {
        if (!code.max_uses) return false;
        return code.current_uses >= code.max_uses;
    };

    const refreshCodes = async () => {
        await fetchCodes();
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse bg-muted/30 p-4 rounded-xl h-14" />
                <div className="animate-pulse bg-card rounded-xl h-64" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/40 backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search referral codes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                    />
                </div>
                <ReferralCodeDialog onSuccess={refreshCodes} />
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
                <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/40 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-2">Code</div>
                        <div className="col-span-2 text-center">Discount</div>
                        <div className="col-span-2 text-center">Usage</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-2">Valid Until</div>
                        <div className="col-span-2"></div>
                    </div>

                    <div className="divide-y divide-border/40">
                        <AnimatePresence>
                            {filteredCodes.map((code) => (
                                <motion.div
                                    key={code.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                                >
                                    <div className="col-span-2 flex items-center gap-2">
                                        <code className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                            {code.code}
                                        </code>
                                        <button
                                            onClick={() => handleCopyCode(code.code, code.id)}
                                            className="p-1 hover:bg-muted rounded transition-colors"
                                            title="Copy code"
                                        >
                                            {copiedId === code.id ? (
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className={`font-mono text-sm font-medium ${code.discount_type === 'percentage'
                                            ? 'text-purple-400'
                                            : 'text-green-400'
                                            }`}>
                                            {formatDiscount(code)}
                                        </span>
                                        <span className="text-xs text-muted-foreground block">
                                            {code.discount_type}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <div className="text-sm">
                                            {code.current_uses}
                                            {code.max_uses && <span className="text-muted-foreground"> / {code.max_uses}</span>}
                                        </div>
                                        {code.total_discount_given && Number(code.total_discount_given) > 0 && (
                                            <div className="text-xs text-muted-foreground">
                                                ₹{Number(code.total_discount_given).toLocaleString()} saved
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        {!code.is_active ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                                Inactive
                                            </span>
                                        ) : isExpired(code) ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                Expired
                                            </span>
                                        ) : isMaxedOut(code) ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                Maxed Out
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-2 text-sm text-muted-foreground">
                                        {code.valid_until
                                            ? new Date(code.valid_until).toLocaleDateString()
                                            : 'No expiry'
                                        }
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <ReferralCodeDialog
                                                    referralCode={code}
                                                    onSuccess={refreshCodes}
                                                    trigger={
                                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted">
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </div>
                                                    }
                                                />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(code.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredCodes.length === 0 && (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                <Ticket className="w-12 h-12 mb-4 opacity-20" />
                                <p>No referral codes found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                <AnimatePresence>
                    {filteredCodes.map((code) => (
                        <motion.article
                            key={code.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-2xl p-4 bg-background/70 backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)] space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <code className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                        {code.code}
                                    </code>
                                    <button
                                        onClick={() => handleCopyCode(code.code, code.id)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                        title="Copy code"
                                    >
                                        {copiedId === code.id ? (
                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ReferralCodeDialog
                                            referralCode={code}
                                            onSuccess={refreshCodes}
                                            trigger={
                                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </div>
                                            }
                                        />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(code.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className={`font-mono text-sm font-medium ${code.discount_type === 'percentage'
                                        ? 'text-purple-400'
                                        : 'text-green-400'
                                        }`}>
                                        {formatDiscount(code)}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-1">{code.discount_type}</span>
                                </div>
                                <div className="text-sm text-foreground">
                                    {code.current_uses}{code.max_uses && <span className="text-muted-foreground"> / {code.max_uses}</span>} uses
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {!code.is_active ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                        Inactive
                                    </span>
                                ) : isExpired(code) ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                        Expired
                                    </span>
                                ) : isMaxedOut(code) ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                        Maxed Out
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        Active
                                    </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {code.valid_until
                                        ? new Date(code.valid_until).toLocaleDateString()
                                        : 'No expiry'
                                    }
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </AnimatePresence>

                {filteredCodes.length === 0 && (
                    <div className="rounded-2xl p-12 bg-background/70 backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] text-center text-muted-foreground flex flex-col items-center">
                        <Ticket className="w-12 h-12 mb-4 opacity-20" />
                        <p>No referral codes found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
