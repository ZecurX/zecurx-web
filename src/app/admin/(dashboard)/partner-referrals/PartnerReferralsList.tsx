"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MoreVertical, Pencil, Trash2, Check, Copy, Eye, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import PartnerReferralDialog from "./PartnerReferralDialog";
import PartnerUsagesDialog from "./PartnerUsagesDialog";
import PartnerPayoutDialog from "./PartnerPayoutDialog";
import { useRouter } from "next/navigation";
import { PartnerReferralWithStats } from "@/types/partner-referral-types";

export default function PartnerReferralsList() {
    const [search, setSearch] = useState("");
    const [referrals, setReferrals] = useState<PartnerReferralWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const router = useRouter();

    const fetchReferrals = async () => {
        try {
            const response = await fetch('/api/admin/partner-referrals');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || response.statusText;
                console.error("Error fetching partner referrals:", errorMessage);
                return;
            }
            const data = await response.json();
            if (data.partner_referrals) {
                setReferrals(data.partner_referrals);
            }
        } catch (err) {
            console.error("Failed to fetch partner referrals:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, []);

    const filteredReferrals = referrals.filter(r =>
        r.partner_name.toLowerCase().includes(search.toLowerCase()) ||
        r.partner_email.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this partner referral?")) return;

        try {
            const response = await fetch(`/api/admin/partner-referrals/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete partner referral");
            }

            setReferrals(referrals.filter(r => r.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting partner referral:", error);
            alert("Failed to delete partner referral");
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

    const formatDiscount = (referral: PartnerReferralWithStats) => {
        if (referral.user_discount_type === 'percentage') {
            return `${referral.user_discount_value}% OFF`;
        }
        return `₹${referral.user_discount_value.toLocaleString()} OFF`;
    };

    const formatCommission = (referral: PartnerReferralWithStats) => {
        if (referral.commission_type === 'percentage') {
            return `${referral.commission_value}% COMM`;
        }
        return `₹${referral.commission_value.toLocaleString()} COMM`;
    };

    const isExpired = (referral: PartnerReferralWithStats) => {
        if (!referral.valid_until) return false;
        return new Date(referral.valid_until) < new Date();
    };

    const isMaxedOut = (referral: PartnerReferralWithStats) => {
        if (!referral.max_uses) return false;
        return referral.current_uses >= referral.max_uses;
    };

    const refreshReferrals = async () => {
        await fetchReferrals();
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/40 backdrop-blur-md">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search partners, emails, or codes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <PartnerReferralDialog onSuccess={refreshReferrals} />
                </div>
            </div>

            <div className="hidden md:block">
                <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/40 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-3">Partner & Code</div>
                        <div className="col-span-2 text-center">Offer / Comm.</div>
                        <div className="col-span-3 text-center">Stats</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-2"></div>
                    </div>

                    <div className="divide-y divide-border/40">
                        <AnimatePresence>
                            {filteredReferrals.map((referral) => (
                                <motion.div
                                    key={referral.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors"
                                >
                                    <div className="col-span-3 space-y-1">
                                        <div className="font-medium text-sm">{referral.partner_name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{referral.partner_email}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {referral.code}
                                            </code>
                                            <button
                                                onClick={() => handleCopyCode(referral.code, referral.id)}
                                                className="p-1 hover:bg-muted rounded transition-colors"
                                                title="Copy code"
                                            >
                                                {copiedId === referral.id ? (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <Copy className="w-3 h-3 text-muted-foreground" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center space-y-1">
                                        <div className={`font-mono text-xs font-medium ${referral.user_discount_type === 'percentage'
                                            ? 'text-purple-400'
                                            : 'text-green-400'
                                            }`}>
                                            {formatDiscount(referral)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            + {formatCommission(referral)}
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-muted-foreground mb-0.5">Uses</span>
                                                <span className="text-sm font-medium">{referral.current_uses}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-muted-foreground mb-0.5">Earned</span>
                                                <span className="text-sm font-medium text-green-500">
                                                    ₹{referral.total_earnings.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-muted-foreground mb-0.5">Pending</span>
                                                <span className="text-sm font-medium text-yellow-500">
                                                    ₹{referral.pending_payout.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        {!referral.is_active ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                                Inactive
                                            </span>
                                        ) : isExpired(referral) ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                Expired
                                            </span>
                                        ) : isMaxedOut(referral) ? (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                Maxed Out
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <PartnerReferralDialog
                                                    partnerReferral={referral}
                                                    onSuccess={refreshReferrals}
                                                    trigger={
                                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted w-full">
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </div>
                                                    }
                                                />
                                                <PartnerUsagesDialog
                                                    partnerId={referral.id}
                                                    partnerName={referral.partner_name}
                                                    trigger={
                                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted w-full">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            <span>View Usages</span>
                                                        </div>
                                                    }
                                                />
                                                {Number(referral.pending_payout) > 0 && (
                                                    <PartnerPayoutDialog
                                                        partnerId={referral.id}
                                                        partnerName={referral.partner_name}
                                                        pendingAmount={Number(referral.pending_payout)}
                                                        onSuccess={refreshReferrals}
                                                        trigger={
                                                            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted w-full text-green-500">
                                                                <Wallet className="mr-2 h-4 w-4" />
                                                                <span>Record Payout</span>
                                                            </div>
                                                        }
                                                    />
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(referral.id)}
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

                        {filteredReferrals.length === 0 && (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                <Users className="w-12 h-12 mb-4 opacity-20" />
                                <p>No partner referrals found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="md:hidden space-y-3">
                <AnimatePresence>
                    {filteredReferrals.map((referral) => (
                        <motion.article
                            key={referral.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-2xl p-4 bg-background/70 backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)] space-y-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="font-medium text-sm">{referral.partner_name}</div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <PartnerReferralDialog
                                            partnerReferral={referral}
                                            onSuccess={refreshReferrals}
                                            trigger={
                                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted w-full">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </div>
                                            }
                                        />
                                        <PartnerUsagesDialog
                                            partnerId={referral.id}
                                            partnerName={referral.partner_name}
                                            trigger={
                                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted w-full">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    <span>View Usages</span>
                                                </div>
                                            }
                                        />
                                        {Number(referral.pending_payout) > 0 && (
                                            <PartnerPayoutDialog
                                                partnerId={referral.id}
                                                partnerName={referral.partner_name}
                                                pendingAmount={Number(referral.pending_payout)}
                                                onSuccess={refreshReferrals}
                                                trigger={
                                                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted w-full text-green-500">
                                                        <Wallet className="mr-2 h-4 w-4" />
                                                        <span>Record Payout</span>
                                                    </div>
                                                }
                                            />
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(referral.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="text-xs text-muted-foreground truncate">{referral.partner_email}</div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <code className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        {referral.code}
                                    </code>
                                    <button
                                        onClick={() => handleCopyCode(referral.code, referral.id)}
                                        className="p-1 hover:bg-muted rounded transition-colors"
                                        title="Copy code"
                                    >
                                        {copiedId === referral.id ? (
                                            <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <Copy className="w-3 h-3 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded-lg">
                                <div className={`font-mono text-xs font-medium ${referral.user_discount_type === 'percentage'
                                    ? 'text-purple-400'
                                    : 'text-green-400'
                                    }`}>
                                    {formatDiscount(referral)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    + {formatCommission(referral)}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center bg-muted/30 p-2 rounded-lg">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground mb-0.5">Uses</span>
                                    <span className="text-sm font-medium">{referral.current_uses}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground mb-0.5">Earned</span>
                                    <span className="text-sm font-medium text-green-500">
                                        ₹{referral.total_earnings.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground mb-0.5">Pending</span>
                                    <span className="text-sm font-medium text-yellow-500">
                                        ₹{referral.pending_payout.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                {!referral.is_active ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                        Inactive
                                    </span>
                                ) : isExpired(referral) ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                        Expired
                                    </span>
                                ) : isMaxedOut(referral) ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                        Maxed Out
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        Active
                                    </span>
                                )}
                            </div>
                        </motion.article>
                    ))}
                </AnimatePresence>

                {filteredReferrals.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center bg-card/40 border border-border/50 rounded-xl backdrop-blur-sm">
                        <Users className="w-12 h-12 mb-4 opacity-20" />
                        <p>No partner referrals found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
