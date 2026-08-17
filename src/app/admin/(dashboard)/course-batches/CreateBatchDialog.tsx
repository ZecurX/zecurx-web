"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Plan {
    id: string;
    name: string;
    type: string;
    pricing_type: string;
}

interface CreateBatchDialogProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateBatchDialog({ onClose, onSuccess }: CreateBatchDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [formData, setFormData] = useState({
        planId: '',
        name: '',
        startDate: '',
        endDate: '',
        capacity: 30,
    });

    useEffect(() => {
        fetch('/api/admin/plans?all=true')
            .then((res) => res.json())
            .then((data) => {
                const eligible = (data.plans || []).filter(
                    (p: Plan) => p.type === 'academy' && p.pricing_type !== 'institutional'
                );
                setPlans(eligible);
            })
            .catch((err) => console.error('Failed to load courses:', err));
    }, []);

    const handleChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.planId || !formData.name || !formData.startDate || !formData.capacity) {
            alert('Please fill in Course, Batch Name, Start Date, and Capacity');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/course-batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create batch');
            }

            onSuccess();
            onClose();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create batch');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 isolate">
            <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Create Batch</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Open a new bookable slot for a course</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-4 min-h-0">
                    <div className="space-y-2">
                        <Label>Course *</Label>
                        <Select value={formData.planId} onValueChange={(v) => handleChange('planId', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Batch Name *</Label>
                        <Input
                            placeholder="e.g. Batch A - September 2026"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date *</Label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Seat Capacity *</Label>
                        <Input
                            type="number"
                            min={1}
                            value={formData.capacity}
                            onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Batch'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
