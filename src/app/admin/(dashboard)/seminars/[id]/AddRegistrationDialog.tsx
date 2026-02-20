"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AddRegistrationDialogProps {
    seminarId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddRegistrationDialog({ seminarId, onClose, onSuccess }: AddRegistrationDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        collegeName: '',
        year: '',
        cityState: '',
        attended: false
    });

    const handleSave = async () => {
        if (!formData.fullName || !formData.email) {
            alert("Name and email are required");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/seminars/${seminarId}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add participant');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to add participant");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 isolate">
            <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Add Participant</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Manually register a person for this seminar</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div
                    className="p-6 space-y-4 overflow-y-auto min-h-0 flex-1 [overscroll-behavior:contain]"
                    data-lenis-prevent
                >
                    <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>College Name</Label>
                        <Input
                            placeholder="University Name"
                            value={formData.collegeName}
                            onChange={(e) => handleChange('collegeName', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Year/Semester</Label>
                            <Input
                                placeholder="e.g. 3rd Year"
                                value={formData.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>City/State</Label>
                            <Input
                                placeholder="City, State"
                                value={formData.cityState}
                                onChange={(e) => handleChange('cityState', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="reg-attended"
                                checked={formData.attended}
                                onCheckedChange={(checked: boolean) => handleChange('attended', checked)}
                            />
                            <Label htmlFor="reg-attended" className="cursor-pointer">Mark as Attended</Label>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5 ml-6">
                            Registration will be automatically marked as email verified.
                        </p>
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Add Participant
                    </Button>
                </div>
            </div>
        </div>
    );
}
