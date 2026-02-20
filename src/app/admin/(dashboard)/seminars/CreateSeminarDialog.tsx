"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { LocationType, DURATION_OPTIONS, SEMINAR_TYPES } from "@/types/seminar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateSeminarDialogProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateSeminarDialog({ onClose, onSuccess }: CreateSeminarDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: DURATION_OPTIONS[0],
        speakerName: '',
        speakerTitle: '',
        seminarType: SEMINAR_TYPES[0],
        topic: '',
        locationType: 'onsite' as LocationType,
        venueAddress: '',
        maxAttendees: 60,
        organizationName: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        additionalNotes: '',
        imageUrl: '',
        brochureUrl: '',
        status: 'approved', // Default to approved when admin creates it
        registrationEnabled: true,
        certificateEnabled: true
    });

    const handleSave = async () => {
        if (!formData.title || !formData.date || !formData.time || !formData.organizationName || !formData.contactEmail) {
            alert("Please fill in all required fields (Title, Date, Time, Organization, Contact Email)");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/seminars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create seminar');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to create seminar");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 isolate">
            <div className="bg-background border border-border rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Create Seminar</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Add a new seminar to the platform</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div
                    className="p-6 overflow-y-auto flex-1 space-y-8 min-h-0 [overscroll-behavior:contain]"
                    data-lenis-prevent
                >
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input
                                    placeholder="e.g. Advanced Ethical Hacking Workshop"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Topic</Label>
                                <Input
                                    placeholder="e.g. Cybersecurity"
                                    value={formData.topic}
                                    onChange={(e) => handleChange('topic', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Tell us about the seminar..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="h-24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Date & Time</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Date *</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Time *</Label>
                                <Input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => handleChange('time', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <Select value={formData.duration} onValueChange={(val) => handleChange('duration', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DURATION_OPTIONS.map((opt) => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Speaker Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Speaker & Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Speaker Name *</Label>
                                <Input
                                    placeholder="Speaker's Full Name"
                                    value={formData.speakerName}
                                    onChange={(e) => handleChange('speakerName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Speaker Title</Label>
                                <Input
                                    placeholder="e.g. Security Reseacher at ZecurX"
                                    value={formData.speakerTitle}
                                    onChange={(e) => handleChange('speakerTitle', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Seminar Type</Label>
                                <Select value={formData.seminarType} onValueChange={(val) => handleChange('seminarType', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMINAR_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Location & Capacity */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Location & Capacity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Location Type</Label>
                                <Select value={formData.locationType} onValueChange={(val) => handleChange('locationType', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="onsite">Onsite</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Max Attendees</Label>
                                <Input
                                    type="number"
                                    value={formData.maxAttendees}
                                    onChange={(e) => handleChange('maxAttendees', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            {formData.locationType === 'onsite' && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Venue Address</Label>
                                    <Textarea
                                        placeholder="Enter full address of the venue..."
                                        value={formData.venueAddress}
                                        onChange={(e) => handleChange('venueAddress', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organization Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Organization *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Organization Name *</Label>
                                <Input
                                    placeholder="College or Company Name"
                                    value={formData.organizationName}
                                    onChange={(e) => handleChange('organizationName', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Person *</Label>
                                <Input
                                    placeholder="Name of the coordinator"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="coordinator@college.edu"
                                    value={formData.contactEmail}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Phone</Label>
                                <Input
                                    placeholder="+91 00000 00000"
                                    value={formData.contactPhone}
                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Additional Notes</Label>
                                <Textarea
                                    placeholder="Internal notes or requirements..."
                                    value={formData.additionalNotes}
                                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Image URL (Optional)</Label>
                                <Input
                                    placeholder="Link to seminar poster"
                                    value={formData.imageUrl}
                                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Brochure URL (Optional)</Label>
                                <Input
                                    placeholder="Link to brochure PDF"
                                    value={formData.brochureUrl}
                                    onChange={(e) => handleChange('brochureUrl', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings & Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Settings & Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="reg-enabled"
                                    checked={formData.registrationEnabled}
                                    onCheckedChange={(checked: boolean) => handleChange('registrationEnabled', checked)}
                                />
                                <Label htmlFor="reg-enabled" className="cursor-pointer">Registration Enabled</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="cert-enabled"
                                    checked={formData.certificateEnabled}
                                    onCheckedChange={(checked: boolean) => handleChange('certificateEnabled', checked)}
                                />
                                <Label htmlFor="cert-enabled" className="cursor-pointer">Certificate Enabled</Label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-border shrink-0 flex justify-end gap-3 bg-muted/20">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Seminar
                    </Button>
                </div>
            </div>
        </div>
    );
}
