"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Percent, DollarSign, Check, Copy } from "lucide-react";
import { ReferralCode, DiscountType } from "@/types/referral-types";

interface GenerateCodesDialogProps {
    onSuccess?: () => void;
}

export default function GenerateCodesDialog({ onSuccess }: GenerateCodesDialogProps) {
    const [open, setOpen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedCodes, setGeneratedCodes] = useState<ReferralCode[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        prefix: "",
        count: "1",
        discount_type: "percentage" as DiscountType,
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        max_uses: "",
        valid_until: "",
        is_active: true,
    });

    const resetForm = () => {
        setFormData({
            prefix: "",
            count: "1",
            discount_type: "percentage",
            discount_value: "",
            min_order_amount: "",
            max_discount: "",
            max_uses: "",
            valid_until: "",
            is_active: true,
        });
        setGeneratedCodes([]);
    };

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
        if (!val) resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        try {
            const response = await fetch('/api/admin/referral-codes/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prefix: formData.prefix.trim() || undefined,
                    count: parseInt(formData.count),
                    discount_type: formData.discount_type,
                    discount_value: parseFloat(formData.discount_value),
                    min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
                    max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
                    max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                    valid_until: formData.valid_until || null,
                    is_active: formData.is_active,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate codes');
            }

            const data = await response.json();
            setGeneratedCodes(data.codes);
            onSuccess?.();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to generate codes');
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch {
            // ignore
        }
    };

    const handleCopyAll = async () => {
        const all = generatedCodes.map(c => c.code).join('\n');
        try {
            await navigator.clipboard.writeText(all);
            setCopiedCode('__all__');
            setTimeout(() => setCopiedCode(null), 2000);
        } catch {
            // ignore
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Wand2 className="w-4 h-4" />
                    Generate Codes
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate Referral Codes</DialogTitle>
                </DialogHeader>

                {generatedCodes.length > 0 ? (
                    /* ── Result screen ── */
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {generatedCodes.length} code{generatedCodes.length > 1 ? 's' : ''} generated successfully.
                        </p>

                        <div className="rounded-lg border border-border/50 divide-y divide-border/40 overflow-hidden">
                            {generatedCodes.map((c) => (
                                <div key={c.id} className="flex items-center justify-between px-4 py-2.5 bg-muted/20">
                                    <code className="font-mono text-sm font-bold text-primary">
                                        {c.code}
                                    </code>
                                    <button
                                        onClick={() => handleCopy(c.code)}
                                        className="p-1.5 hover:bg-muted rounded transition-colors"
                                        title="Copy"
                                    >
                                        {copiedCode === c.code ? (
                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" className="flex-1 gap-2" onClick={handleCopyAll}>
                                {copiedCode === '__all__' ? (
                                    <><Check className="w-4 h-4 text-green-500" /> Copied!</>
                                ) : (
                                    <><Copy className="w-4 h-4" /> Copy All</>
                                )}
                            </Button>
                            <Button className="flex-1" onClick={() => { resetForm(); }}>
                                Generate More
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* ── Form screen ── */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Format preview */}
                        <div className="rounded-lg bg-muted/30 border border-border/40 px-4 py-2.5 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Format</span>
                            <code className="font-mono text-sm font-bold text-primary ml-2">
                                ZX-<span className="text-foreground">{formData.prefix || 'XX'}</span>-XXXXXX
                            </code>
                        </div>

                        {/* Prefix + Count */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prefix">Middle Segment (optional)</Label>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-sm text-muted-foreground shrink-0">ZX-</span>
                                    <Input
                                        id="prefix"
                                        value={formData.prefix}
                                        onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                                        placeholder="RT"
                                        className="font-mono uppercase"
                                        maxLength={6}
                                    />
                                    <span className="font-mono text-sm text-muted-foreground shrink-0">-XXXXXX</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    e.g. RT → ZX-RT-XXXXXX. Max 6 chars.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="count">Number of Codes</Label>
                                <Input
                                    id="count"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.count}
                                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Maximum 10 at a time.</p>
                            </div>
                        </div>

                        {/* Discount Type */}
                        <div className="space-y-2">
                            <Label>Discount Type</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.discount_type === 'percentage' ? 'default' : 'outline'}
                                    className="flex-1 gap-2"
                                    onClick={() => setFormData({ ...formData, discount_type: 'percentage' })}
                                >
                                    <Percent className="w-4 h-4" />
                                    Percentage
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.discount_type === 'fixed' ? 'default' : 'outline'}
                                    className="flex-1 gap-2"
                                    onClick={() => setFormData({ ...formData, discount_type: 'fixed' })}
                                >
                                    <DollarSign className="w-4 h-4" />
                                    Fixed Amount
                                </Button>
                            </div>
                        </div>

                        {/* Discount Value */}
                        <div className="space-y-2">
                            <Label htmlFor="gen_discount_value">
                                Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                            </Label>
                            <Input
                                id="gen_discount_value"
                                type="number"
                                min="0"
                                max={formData.discount_type === 'percentage' ? 100 : undefined}
                                step="0.01"
                                value={formData.discount_value}
                                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                placeholder={formData.discount_type === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                                required
                            />
                        </div>

                        {/* Min Order + Max Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gen_min_order">Min Order (₹)</Label>
                                <Input
                                    id="gen_min_order"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.min_order_amount}
                                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                            {formData.discount_type === 'percentage' && (
                                <div className="space-y-2">
                                    <Label htmlFor="gen_max_discount">Max Discount (₹)</Label>
                                    <Input
                                        id="gen_max_discount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.max_discount}
                                        onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                                        placeholder="No limit"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Max Uses + Valid Until */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gen_max_uses">Max Uses (per code)</Label>
                                <Input
                                    id="gen_max_uses"
                                    type="number"
                                    min="0"
                                    value={formData.max_uses}
                                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                    placeholder="Unlimited"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gen_valid_until">Valid Until</Label>
                                <Input
                                    id="gen_valid_until"
                                    type="date"
                                    value={formData.valid_until}
                                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Active */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="gen_is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 rounded border-border"
                            />
                            <Label htmlFor="gen_is_active" className="cursor-pointer">Active</Label>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={generating || !formData.discount_value} className="gap-2">
                                {generating ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><Wand2 className="w-4 h-4" /> Generate {formData.count || 1} Code{parseInt(formData.count) > 1 ? 's' : ''}</>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
