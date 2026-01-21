"use client";

import { useState, useEffect } from "react";
import {
    Link2,
    Plus,
    Trash2,
    Copy,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Users,
    Calendar,
    IndianRupee,
    ToggleLeft,
    ToggleRight,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Plan {
    id: string;
    name: string;
    price: number;
    type: string;
}

interface PromoLink {
    id: string;
    plan_id: string | null;
    plan_name: string | null;
    plan_name_pattern: string | null;
    min_price: number;
    max_price: number;
    promo_code: string;
    description: string | null;
    max_uses: number | null;
    current_uses: number;
    is_active: boolean;
    valid_from: string;
    valid_until: string | null;
    created_at: string;
}

export default function PromoLinksPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [promoLinks, setPromoLinks] = useState<PromoLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        planId: "",
        planNamePattern: "",
        price: "",
        description: "",
        maxUses: "1",
        validDays: "7",
    });

    const [usePattern, setUsePattern] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [plansRes, linksRes] = await Promise.all([
                fetch("/api/admin/plans"),
                fetch("/api/admin/promo-links"),
            ]);

            const plansData = await plansRes.json();
            const linksData = await linksRes.json();

            setPlans(plansData.plans || []);
            setPromoLinks(linksData.promoLinks || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert("Please enter a valid price");
            return;
        }

        if (!usePattern && !formData.planId) {
            alert("Please select a plan");
            return;
        }

        if (usePattern && !formData.planNamePattern) {
            alert("Please enter a plan name pattern");
            return;
        }

        setCreating(true);
        try {
            const res = await fetch("/api/admin/promo-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: usePattern ? null : formData.planId,
                    planNamePattern: usePattern ? formData.planNamePattern : null,
                    price: parseFloat(formData.price),
                    description: formData.description || null,
                    maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                    validDays: formData.validDays ? parseInt(formData.validDays) : null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                await fetchData();
                setFormData({
                    planId: "",
                    planNamePattern: "",
                    price: "",
                    description: "",
                    maxUses: "1",
                    validDays: "7",
                });

                if (data.checkoutUrl) {
                    copyToClipboard(data.promoLink.id, window.location.origin + data.checkoutUrl);
                }
            } else {
                alert(data.error || "Failed to create promo link");
            }
        } catch (error) {
            console.error("Failed to create promo link:", error);
            alert("Failed to create promo link");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promo link?")) return;

        try {
            await fetch(`/api/admin/promo-links/${id}`, { method: "DELETE" });
            await fetchData();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
        try {
            await fetch(`/api/admin/promo-links/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !currentActive }),
            });
            await fetchData();
        } catch (error) {
            console.error("Failed to toggle:", error);
        }
    };

    const copyToClipboard = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getCheckoutUrl = (link: PromoLink) => {
        if (link.plan_id) {
            return `${window.location.origin}/checkout?itemId=${link.plan_id}&type=internship&promoCode=${link.promo_code}`;
        }
        return null;
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Never";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isExpired = (link: PromoLink) => {
        if (!link.valid_until) return false;
        return new Date(link.valid_until) < new Date();
    };

    const isUsedUp = (link: PromoLink) => {
        if (!link.max_uses) return false;
        return link.current_uses >= link.max_uses;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/system-test"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Promo Link Generator</h1>
                    <p className="text-muted-foreground mt-1">
                        Create custom checkout links with special pricing
                    </p>
                </div>
            </div>

            <div className="border border-border rounded-xl p-6 bg-card">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Promo Link
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => setUsePattern(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    !usePattern
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                            >
                                Select Plan
                            </button>
                            <button
                                onClick={() => setUsePattern(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    usePattern
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                            >
                                Use Pattern
                            </button>
                        </div>

                        {!usePattern ? (
                            <div>
                                <label className="block text-sm font-medium mb-2">Plan</label>
                                <select
                                    value={formData.planId}
                                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Select a plan...</option>
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name} (₹{plan.price})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Plan Name Pattern
                                </label>
                                <input
                                    type="text"
                                    value={formData.planNamePattern}
                                    onChange={(e) =>
                                        setFormData({ ...formData, planNamePattern: e.target.value })
                                    }
                                    placeholder="%3 Months% or %6 Months%"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use % as wildcard. E.g., %3 Months% matches all 3-month plans
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <IndianRupee className="w-4 h-4 inline mr-1" />
                                Special Price
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="3199"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Special offer for students"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Max Uses
                            </label>
                            <input
                                type="number"
                                value={formData.maxUses}
                                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                placeholder="Leave empty for unlimited"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Leave empty for unlimited uses
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Valid For (days)
                            </label>
                            <input
                                type="number"
                                value={formData.validDays}
                                onChange={(e) =>
                                    setFormData({ ...formData, validDays: e.target.value })
                                }
                                placeholder="Leave empty for no expiration"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Leave empty for no expiration
                            </p>
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={creating}
                            className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {creating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Link2 className="w-5 h-5" />
                            )}
                            Generate Promo Link
                        </button>
                    </div>
                </div>
            </div>

            <div className="border border-border rounded-xl bg-card">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Link2 className="w-5 h-5" />
                        Existing Promo Links
                    </h2>
                </div>

                {promoLinks.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        No promo links created yet
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {promoLinks.map((link) => {
                            const checkoutUrl = getCheckoutUrl(link);
                            const expired = isExpired(link);
                            const usedUp = isUsedUp(link);
                            const inactive = !link.is_active || expired || usedUp;

                            return (
                                <div
                                    key={link.id}
                                    className={`p-6 ${inactive ? "opacity-60" : ""}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <code className="px-3 py-1 bg-muted rounded-lg text-sm font-mono font-bold">
                                                    {link.promo_code}
                                                </code>
                                                {expired && (
                                                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded-full">
                                                        Expired
                                                    </span>
                                                )}
                                                {usedUp && (
                                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs rounded-full">
                                                        Used Up
                                                    </span>
                                                )}
                                                {!link.is_active && (
                                                    <span className="px-2 py-0.5 bg-gray-500/10 text-gray-500 text-xs rounded-full">
                                                        Disabled
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-foreground mb-1">
                                                {link.plan_name || link.plan_name_pattern || "Unknown plan"}
                                            </p>

                                            {link.description && (
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {link.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <IndianRupee className="w-3 h-3" />
                                                    ₹{link.min_price}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {link.current_uses}/{link.max_uses || "∞"} uses
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Expires: {formatDate(link.valid_until)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {checkoutUrl && (
                                                <>
                                                    <button
                                                        onClick={() => copyToClipboard(link.id, checkoutUrl)}
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="Copy checkout URL"
                                                    >
                                                        {copiedId === link.id ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <a
                                                        href={checkoutUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                        title="Open checkout URL"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handleToggleActive(link.id, link.is_active)}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                title={link.is_active ? "Disable" : "Enable"}
                                            >
                                                {link.is_active ? (
                                                    <ToggleRight className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(link.id)}
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
