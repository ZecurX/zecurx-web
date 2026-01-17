"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { PayoutMethod } from "@/types/partner-referral-types";

interface PartnerPayoutDialogProps {
    partnerId: string;
    partnerName: string;
    pendingAmount: number;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export default function PartnerPayoutDialog({
    partnerId,
    partnerName,
    pendingAmount,
    onSuccess,
    trigger
}: PartnerPayoutDialogProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        amount: "",
        payout_method: "bank_transfer" as PayoutMethod,
        payout_reference: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                amount: parseFloat(formData.amount),
                payout_method: formData.payout_method,
                payout_reference: formData.payout_reference || undefined,
                notes: formData.notes || undefined,
            };

            const response = await fetch(`/api/admin/partner-referrals/${partnerId}/payouts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create payout');
            }

            setOpen(false);
            setFormData({
                amount: "",
                payout_method: "bank_transfer",
                payout_reference: "",
                notes: "",
            });
            router.refresh();
            onSuccess?.();
        } catch (error) {
            console.error('Error creating payout:', error);
            alert(error instanceof Error ? error.message : 'Failed to create payout');
        } finally {
            setSaving(false);
        }
    };

    const amount = parseFloat(formData.amount) || 0;
    const isValidAmount = amount > 0 && amount <= pendingAmount;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <DollarSign className="w-4 h-4" />
                        Record Payout
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Payout - {partnerName}</DialogTitle>
                </DialogHeader>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
                    <p className="text-sm text-muted-foreground">Pending Balance</p>
                    <p className="text-2xl font-bold text-green-500">
                        ₹{pendingAmount.toLocaleString()}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Payout Amount (₹)</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="0"
                            max={pendingAmount}
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder={`Max: ₹${pendingAmount}`}
                            required
                        />
                        {amount > pendingAmount && (
                            <p className="text-xs text-red-500">Amount cannot exceed pending balance</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Payout Method</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['bank_transfer', 'upi', 'wallet', 'other'] as PayoutMethod[]).map((method) => (
                                <Button
                                    key={method}
                                    type="button"
                                    variant={formData.payout_method === method ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, payout_method: method })}
                                    className="capitalize"
                                >
                                    {method.replace('_', ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payout_reference">Reference / Transaction ID</Label>
                        <Input
                            id="payout_reference"
                            value={formData.payout_reference}
                            onChange={(e) => setFormData({ ...formData, payout_reference: e.target.value })}
                            placeholder="e.g., TXN123456789"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Optional notes..."
                            className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || !isValidAmount}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Record Payout
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
