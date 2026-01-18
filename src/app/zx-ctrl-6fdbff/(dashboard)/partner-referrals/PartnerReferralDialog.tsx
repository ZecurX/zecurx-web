"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Percent, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { PartnerReferral, DiscountType, CommissionType } from "@/types/partner-referral-types";

interface PartnerReferralDialogProps {
    partnerReferral?: PartnerReferral;
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export default function PartnerReferralDialog({ partnerReferral, trigger, onSuccess }: PartnerReferralDialogProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        partner_name: "",
        partner_email: "",
        partner_phone: "",
        partner_notes: "",
        code: "",
        user_discount_type: "percentage" as DiscountType,
        user_discount_value: "",
        max_user_discount: "",
        min_order_amount: "",
        commission_type: "percentage" as CommissionType,
        commission_value: "",
        max_uses: "",
        valid_until: "",
        is_active: true,
    });

    useEffect(() => {
        if (partnerReferral) {
            setFormData({
                partner_name: partnerReferral.partner_name,
                partner_email: partnerReferral.partner_email,
                partner_phone: partnerReferral.partner_phone || "",
                partner_notes: partnerReferral.partner_notes || "",
                code: partnerReferral.code,
                user_discount_type: partnerReferral.user_discount_type,
                user_discount_value: partnerReferral.user_discount_value.toString(),
                max_user_discount: partnerReferral.max_user_discount?.toString() || "",
                min_order_amount: partnerReferral.min_order_amount.toString(),
                commission_type: partnerReferral.commission_type,
                commission_value: partnerReferral.commission_value.toString(),
                max_uses: partnerReferral.max_uses?.toString() || "",
                valid_until: partnerReferral.valid_until
                    ? new Date(partnerReferral.valid_until).toISOString().split('T')[0]
                    : "",
                is_active: partnerReferral.is_active,
            });
        } else {
            setFormData({
                partner_name: "",
                partner_email: "",
                partner_phone: "",
                partner_notes: "",
                code: "",
                user_discount_type: "percentage",
                user_discount_value: "",
                max_user_discount: "",
                min_order_amount: "",
                commission_type: "percentage",
                commission_value: "",
                max_uses: "",
                valid_until: "",
                is_active: true,
            });
        }
    }, [partnerReferral, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                partner_name: formData.partner_name,
                partner_email: formData.partner_email,
                partner_phone: formData.partner_phone || null,
                partner_notes: formData.partner_notes || null,
                code: formData.code || undefined,
                user_discount_type: formData.user_discount_type,
                user_discount_value: parseFloat(formData.user_discount_value),
                max_user_discount: formData.max_user_discount ? parseFloat(formData.max_user_discount) : null,
                min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
                commission_type: formData.commission_type,
                commission_value: parseFloat(formData.commission_value),
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                valid_until: formData.valid_until || null,
                is_active: formData.is_active,
            };

            const url = partnerReferral
                ? `/api/zx-ctrl-6fdbff/partner-referrals/${partnerReferral.id}`
                : '/api/zx-ctrl-6fdbff/partner-referrals';
            const method = partnerReferral ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save partner referral');
            }

            setOpen(false);
            router.refresh();
            onSuccess?.();
        } catch (error) {
            console.error('Error saving partner referral:', error);
            alert(error instanceof Error ? error.message : 'Failed to save partner referral');
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
                        Add Partner
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {partnerReferral ? 'Edit Partner Referral' : 'Create Partner Referral'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground border-b border-border/50 pb-2">Partner Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="partner_name">Name</Label>
                                <Input
                                    id="partner_name"
                                    value={formData.partner_name}
                                    onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="partner_email">Email</Label>
                                <Input
                                    id="partner_email"
                                    type="email"
                                    value={formData.partner_email}
                                    onChange={(e) => setFormData({ ...formData, partner_email: e.target.value })}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="partner_phone">Phone (Optional)</Label>
                                <Input
                                    id="partner_phone"
                                    value={formData.partner_phone}
                                    onChange={(e) => setFormData({ ...formData, partner_phone: e.target.value })}
                                    placeholder="+91..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Referral Code (Empty to Auto-gen)</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., PARTNER20"
                                    className="font-mono uppercase"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="partner_notes">Notes (Optional)</Label>
                            <Textarea
                                id="partner_notes"
                                value={formData.partner_notes}
                                onChange={(e) => setFormData({ ...formData, partner_notes: e.target.value })}
                                placeholder="Internal notes about this partner..."
                                className="resize-none h-20"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground border-b border-border/50 pb-2">Commission Settings</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Commission Type</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={formData.commission_type === 'percentage' ? 'default' : 'outline'}
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setFormData({ ...formData, commission_type: 'percentage' })}
                                    >
                                        <Percent className="w-4 h-4" />
                                        Percentage
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formData.commission_type === 'fixed' ? 'default' : 'outline'}
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setFormData({ ...formData, commission_type: 'fixed' })}
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Fixed
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commission_value">
                                    Commission Value {formData.commission_type === 'percentage' ? '(%)' : '(₹)'}
                                </Label>
                                <Input
                                    id="commission_value"
                                    type="number"
                                    min="0"
                                    max={formData.commission_type === 'percentage' ? 100 : undefined}
                                    step="0.01"
                                    value={formData.commission_value}
                                    onChange={(e) => setFormData({ ...formData, commission_value: e.target.value })}
                                    placeholder={formData.commission_type === 'percentage' ? "e.g., 10" : "e.g., 500"}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground border-b border-border/50 pb-2">User Discount Settings</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Discount Type</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={formData.user_discount_type === 'percentage' ? 'default' : 'outline'}
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setFormData({ ...formData, user_discount_type: 'percentage' })}
                                    >
                                        <Percent className="w-4 h-4" />
                                        Percentage
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formData.user_discount_type === 'fixed' ? 'default' : 'outline'}
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setFormData({ ...formData, user_discount_type: 'fixed' })}
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        Fixed
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user_discount_value">
                                    Discount Value {formData.user_discount_type === 'percentage' ? '(%)' : '(₹)'}
                                </Label>
                                <Input
                                    id="user_discount_value"
                                    type="number"
                                    min="0"
                                    max={formData.user_discount_type === 'percentage' ? 100 : undefined}
                                    step="0.01"
                                    value={formData.user_discount_value}
                                    onChange={(e) => setFormData({ ...formData, user_discount_value: e.target.value })}
                                    placeholder={formData.user_discount_type === 'percentage' ? "e.g., 10" : "e.g., 500"}
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
                                {formData.user_discount_type === 'percentage' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="max_user_discount">Max Discount (₹)</Label>
                                        <Input
                                            id="max_user_discount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.max_user_discount}
                                            onChange={(e) => setFormData({ ...formData, max_user_discount: e.target.value })}
                                            placeholder="No limit"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground border-b border-border/50 pb-2">Limits & Validity</h3>
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
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 rounded border-border"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || !formData.partner_name || !formData.partner_email || !formData.user_discount_value || !formData.commission_value}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {partnerReferral ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
