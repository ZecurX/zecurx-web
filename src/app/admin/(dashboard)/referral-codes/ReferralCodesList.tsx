"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, MoreVertical, Pencil, Trash2, Ticket,
    Check, Copy, CheckSquare, Square, Minus,
    ToggleLeft, ToggleRight, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReferralCodeDialog from "./ReferralCodeDialog";
import GenerateCodesDialog from "./GenerateCodesDialog";
import { useRouter } from "next/navigation";
import { ReferralCodeWithStats } from "@/types/referral-types";

export default function ReferralCodesList() {
    const [search, setSearch] = useState("");
    const [codes, setCodes] = useState<ReferralCodeWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);
    const router = useRouter();

    const fetchCodes = async () => {
        try {
            const response = await fetch('/api/admin/referral-codes');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error fetching referral codes:", errorData.error || response.statusText);
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

    // ── Selection helpers ────────────────────────────────────────────────────

    const allFilteredSelected =
        filteredCodes.length > 0 && filteredCodes.every(c => selectedIds.has(c.id));
    const someFilteredSelected =
        filteredCodes.some(c => selectedIds.has(c.id)) && !allFilteredSelected;

    const toggleSelectAll = () => {
        if (allFilteredSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                filteredCodes.forEach(c => next.delete(c.id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                filteredCodes.forEach(c => next.add(c.id));
                return next;
            });
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const clearSelection = () => setSelectedIds(new Set());

    // ── Single row actions ───────────────────────────────────────────────────

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this referral code?")) return;
        try {
            const response = await fetch(`/api/admin/referral-codes/${id}`, { method: "DELETE" });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to delete referral code");
            }
            setCodes(prev => prev.filter(c => c.id !== id));
            setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
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
        } catch {
            // ignore
        }
    };

    // ── Bulk actions ─────────────────────────────────────────────────────────

    const handleBulkDelete = async () => {
        const ids = [...selectedIds];
        if (!confirm(`Delete ${ids.length} referral code${ids.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
        setBulkLoading(true);
        try {
            const response = await fetch('/api/admin/referral-codes/bulk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to delete codes');
            }
            setCodes(prev => prev.filter(c => !selectedIds.has(c.id)));
            clearSelection();
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete codes');
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkSetActive = async (is_active: boolean) => {
        const ids = [...selectedIds];
        setBulkLoading(true);
        try {
            const response = await fetch('/api/admin/referral-codes/bulk', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, is_active }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to update codes');
            }
            setCodes(prev =>
                prev.map(c => selectedIds.has(c.id) ? { ...c, is_active } : c)
            );
            clearSelection();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update codes');
        } finally {
            setBulkLoading(false);
        }
    };

    // ── Helpers ──────────────────────────────────────────────────────────────

    const formatDiscount = (code: ReferralCodeWithStats) =>
        code.discount_type === 'percentage'
            ? `${code.discount_value}%`
            : `₹${code.discount_value.toLocaleString()}`;

    const isExpired = (code: ReferralCodeWithStats) =>
        !!code.valid_until && new Date(code.valid_until) < new Date();

    const isMaxedOut = (code: ReferralCodeWithStats) =>
        !!code.max_uses && code.current_uses >= code.max_uses;

    const refreshCodes = async () => {
        clearSelection();
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

    const selectedCount = selectedIds.size;

    return (
        <div className="space-y-4">
            {/* ── Toolbar ── */}
            <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-xl border border-border/40 backdrop-blur-md flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search referral codes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                    />
                </div>
                <GenerateCodesDialog onSuccess={refreshCodes} />
                <ReferralCodeDialog onSuccess={refreshCodes} />
            </div>

            {/* ── Bulk Action Bar (visible when items are selected) ── */}
            <AnimatePresence>
                {selectedCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex-wrap"
                    >
                        <span className="text-sm font-semibold text-primary min-w-max">
                            {selectedCount} selected
                        </span>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-8"
                                disabled={bulkLoading}
                                onClick={() => handleBulkSetActive(true)}
                            >
                                <ToggleRight className="w-4 h-4 text-green-500" />
                                Activate
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-8"
                                disabled={bulkLoading}
                                onClick={() => handleBulkSetActive(false)}
                            >
                                <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                                Deactivate
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 h-8 border-destructive/40 text-destructive hover:bg-destructive/10"
                                disabled={bulkLoading}
                                onClick={handleBulkDelete}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </div>

                        <button
                            onClick={clearSelection}
                            className="ml-auto p-1 hover:bg-muted rounded-full transition-colors"
                            title="Clear selection"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Table ── */}
            <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-13 gap-4 p-4 border-b border-border/40 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider items-center"
                    style={{ gridTemplateColumns: '2.5rem 1fr 7rem 7rem 7rem 7rem 2.5rem' }}
                >
                    {/* Select-all checkbox */}
                    <button
                        onClick={toggleSelectAll}
                        className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                        title={allFilteredSelected ? 'Deselect all' : 'Select all'}
                    >
                        {allFilteredSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                        ) : someFilteredSelected ? (
                            <Minus className="w-4 h-4 text-primary" />
                        ) : (
                            <Square className="w-4 h-4" />
                        )}
                    </button>
                    <div>Code</div>
                    <div className="text-center">Discount</div>
                    <div className="text-center">Usage</div>
                    <div className="text-center">Status</div>
                    <div>Valid Until</div>
                    <div />
                </div>

                {/* Rows */}
                <div className="divide-y divide-border/40">
                    <AnimatePresence>
                        {filteredCodes.map((code) => {
                            const isSelected = selectedIds.has(code.id);
                            return (
                                <motion.div
                                    key={code.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`grid gap-4 p-4 items-center transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                                    style={{ gridTemplateColumns: '2.5rem 1fr 7rem 7rem 7rem 7rem 2.5rem' }}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleSelect(code.id)}
                                        className="flex items-center justify-center w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {isSelected ? (
                                            <CheckSquare className="w-4 h-4 text-primary" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>

                                    {/* Code */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <code className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded truncate">
                                            {code.code}
                                        </code>
                                        <button
                                            onClick={() => handleCopyCode(code.code, code.id)}
                                            className="p-1 hover:bg-muted rounded transition-colors shrink-0"
                                            title="Copy code"
                                        >
                                            {copiedId === code.id ? (
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Discount */}
                                    <div className="text-center">
                                        <span className={`font-mono text-sm font-medium ${code.discount_type === 'percentage' ? 'text-purple-400' : 'text-green-400'}`}>
                                            {formatDiscount(code)}
                                        </span>
                                        <span className="text-xs text-muted-foreground block">
                                            {code.discount_type}
                                        </span>
                                    </div>

                                    {/* Usage */}
                                    <div className="text-center">
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

                                    {/* Status badge */}
                                    <div className="flex justify-center">
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

                                    {/* Valid until */}
                                    <div className="text-sm text-muted-foreground">
                                        {code.valid_until
                                            ? new Date(code.valid_until).toLocaleDateString()
                                            : 'No expiry'
                                        }
                                    </div>

                                    {/* Row actions */}
                                    <div className="flex justify-end">
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
                            );
                        })}
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
    );
}
