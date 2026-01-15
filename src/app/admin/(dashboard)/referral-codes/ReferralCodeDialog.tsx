"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Percent, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReferralCode, DiscountType } from "@/types/referral-types";

interface ReferralCodeDialogProps {
    referralCode?: ReferralCode;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export default function ReferralCodeDialog({ referralCode, trigger, onSuccess }: ReferralCodeDialogProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        code: "",
        discount_type: "percentage" as DiscountType,
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        max_uses: "",
        valid_until: "",
        is_active: true,
    });

    useEffect(() => {
        if (referralCode) {
            setFormData({
                code: referralCode.code,
                discount_type: referralCode.discount_type,
                discount_value: referralCode.discount_value.toString(),
                min_order_amount: referralCode.min_order_amount?.toString() || "",
                max_discount: referralCode.max_discount?.toString() || "",
                max_uses: referralCode.max_uses?.toString() || "",
                valid_until: referralCode.valid_until
                    ? new Date(referralCode.valid_until).toISOString().split('T')[0]
                    : "",
                is_active: referralCode.is_active,
            });
        } else {
            setFormData({
                code: "",
                discount_type: "percentage",
                discount_value: "",
                min_order_amount: "",
                max_discount: "",
                max_uses: "",
                valid_until: "",
                is_active: true,
            });
        }
    }, [referralCode, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                code: formData.code || undefined, // Let server auto-generate if empty
                discount_type: formData.discount_type,
                discount_value: parseFloat(formData.discount_value),
                min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
                max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                valid_until: formData.valid_until || null,
                is_active: formData.is_active,
            };

            const url = referralCode
                ? `/api/admin/referral-codes/${referralCode.id}`
                : '/api/admin/referral-codes';
            const method = referralCode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save referral code');
            }

            setOpen(false);
            router.refresh();
            onSuccess?.();
        } catch (error) {
            console.error('Error saving referral code:', error);
            alert(error instanceof Error ? error.message : 'Failed to save referral code');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Referral Code
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {referralCode ? 'Edit Referral Code' : 'Create Referral Code'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Code (leave empty to auto-generate)</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            placeholder="e.g., SAVE20"
                            className="font-mono uppercase"
                        />
                    </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="discount_value">
                            Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                        </Label>
                        <Input
                            id="discount_value"
                            type="number"
                            min="0"
                            max={formData.discount_type === 'percentage' ? 100 : undefined}
                            step="0.01"
                            value={formData.discount_value}
                            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                            placeholder={formData.discount_type === 'percentage' ? "e.g., 10" : "e.g., 500"}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="min_order_amount">Min Order (₹)</Label>
                            <Input
                                id="min_order_amount"
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
                                <Label htmlFor="max_discount">Max Discount (₹)</Label>
                                <Input
                                    id="max_discount"
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="max_uses">Max Uses</Label>
                            <Input
                                id="max_uses"
                                type="number"
                                min="0"
                                value={formData.max_uses}
                                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                placeholder="Unlimited"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="valid_until">Valid Until</Label>
                            <Input
                                id="valid_until"
                                type="date"
                                value={formData.valid_until}
                                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 rounded border-border"
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || !formData.discount_value}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {referralCode ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
