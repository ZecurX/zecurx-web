"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Receipt, Check, X } from "lucide-react";
import { PartnerReferralUsage } from "@/types/partner-referral-types";

interface PartnerUsagesDialogProps {
    partnerId: string;
    partnerName: string;
    trigger?: React.ReactNode;
}

export default function PartnerUsagesDialog({ partnerId, partnerName, trigger }: PartnerUsagesDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usages, setUsages] = useState<PartnerReferralUsage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchUsages = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/zx-ctrl-6fdbff/partner-referrals/${partnerId}/usages`);
            if (!res.ok) throw new Error("Failed to fetch usages");
            const data = await res.json();
            setUsages(data.usages || []);
        } catch (err) {
            setError("Could not load usage history");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchUsages();
        }
    }, [open, partnerId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const totalCommission = usages.reduce((sum, usage) => sum + usage.commission_earned, 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" title="View Usage History">
                        <Eye className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
                        Usage History: {partnerName}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">{error}</div>
                ) : (
                    <div className="flex flex-col gap-4 overflow-hidden">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Usages</p>
                                <p className="text-2xl font-bold">{usages.length}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Commission Earned</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCommission)}</p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-auto border rounded-md">
                            {usages.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No usage history found for this partner.
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 font-medium">Date</th>
                                            <th className="p-3 font-medium">Order ID</th>
                                            <th className="p-3 font-medium">Customer</th>
                                            <th className="p-3 font-medium text-right">Order Amount</th>
                                            <th className="p-3 font-medium text-right">Discount</th>
                                            <th className="p-3 font-medium text-right">Final Paid</th>
                                            <th className="p-3 font-medium text-right">Commission</th>
                                            <th className="p-3 font-medium text-center">Paid Out</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {usages.map((usage) => (
                                            <tr key={usage.id} className="hover:bg-muted/50">
                                                <td className="p-3 whitespace-nowrap">
                                                    {new Date(usage.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 font-mono text-xs">{usage.order_id}</td>
                                                <td className="p-3">
                                                    <div className="font-medium">{usage.customer_name || 'N/A'}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={usage.customer_email}>
                                                        {usage.customer_email}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right text-muted-foreground">
                                                    {formatCurrency(usage.original_amount)}
                                                </td>
                                                <td className="p-3 text-right text-red-600">
                                                    -{formatCurrency(usage.discount_applied)}
                                                </td>
                                                <td className="p-3 text-right font-medium">
                                                    {formatCurrency(usage.final_amount)}
                                                </td>
                                                <td className="p-3 text-right font-bold text-green-600">
                                                    {formatCurrency(usage.commission_earned)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {usage.is_paid_out ? (
                                                        <div className="flex justify-center" title={`Paid: ${usage.paid_out_at ? new Date(usage.paid_out_at).toLocaleDateString() : ''}`}>
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center" title="Pending">
                                                            <X className="w-4 h-4 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
