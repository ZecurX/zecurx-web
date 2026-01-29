"use client";

import { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
import { Seminar, SeminarStatus, LocationType, DURATION_OPTIONS, SEMINAR_TYPES } from "@/types/seminar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EditSeminarDialogProps {
  seminar: Seminar;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditSeminarDialog({ seminar, onClose, onUpdate }: EditSeminarDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: seminar.title,
    description: seminar.description || '',
    date: new Date(seminar.date).toISOString().split('T')[0],
    time: seminar.time,
    duration: seminar.duration,
    speaker_name: seminar.speaker_name,
    speaker_title: seminar.speaker_title || '',
    seminar_type: seminar.seminar_type || '',
    topic: seminar.topic || '',
    location_type: seminar.location_type,
    venue_address: seminar.venue_address || '',
    max_attendees: seminar.max_attendees || 0,
    organization_name: seminar.organization_name,
    contact_person: seminar.contact_person,
    contact_email: seminar.contact_email,
    contact_phone: seminar.contact_phone || '',
    additional_notes: seminar.additional_notes || '',
    image_url: seminar.image_url || '',
    brochure_url: seminar.brochure_url || '',
    status: seminar.status,
    rejection_reason: seminar.rejection_reason || '',
    registration_enabled: seminar.registration_enabled,
    certificate_enabled: seminar.certificate_enabled
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/seminars/${seminar.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update seminar');
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update seminar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 isolate">
      <div className="bg-background border border-border rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
          <h2 className="text-xl font-bold text-foreground">Edit Seminar</h2>
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
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => handleChange('title', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input 
                  value={formData.topic} 
                  onChange={(e) => handleChange('topic', e.target.value)} 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea 
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
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={formData.date} 
                  onChange={(e) => handleChange('date', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
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
                <Label>Speaker Name</Label>
                <Input 
                  value={formData.speaker_name} 
                  onChange={(e) => handleChange('speaker_name', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Speaker Title</Label>
                <Input 
                  value={formData.speaker_title} 
                  onChange={(e) => handleChange('speaker_title', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Seminar Type</Label>
                <Select value={formData.seminar_type} onValueChange={(val) => handleChange('seminar_type', val)}>
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
                <Select value={formData.location_type} onValueChange={(val) => handleChange('location_type', val)}>
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
                  value={formData.max_attendees} 
                  onChange={(e) => handleChange('max_attendees', parseInt(e.target.value))} 
                />
              </div>
              {formData.location_type === 'onsite' && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Venue Address</Label>
                  <Textarea 
                    value={formData.venue_address} 
                    onChange={(e) => handleChange('venue_address', e.target.value)} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input 
                  value={formData.organization_name} 
                  onChange={(e) => handleChange('organization_name', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input 
                  value={formData.contact_person} 
                  onChange={(e) => handleChange('contact_person', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input 
                  type="email"
                  value={formData.contact_email} 
                  onChange={(e) => handleChange('contact_email', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input 
                  value={formData.contact_phone} 
                  onChange={(e) => handleChange('contact_phone', e.target.value)} 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Additional Notes</Label>
                <Textarea 
                  value={formData.additional_notes} 
                  onChange={(e) => handleChange('additional_notes', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  value={formData.image_url} 
                  onChange={(e) => handleChange('image_url', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Brochure URL</Label>
                <Input 
                  value={formData.brochure_url} 
                  onChange={(e) => handleChange('brochure_url', e.target.value)} 
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
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.status === 'rejected' && (
                <div className="space-y-2">
                  <Label>Rejection Reason</Label>
                  <Input 
                    value={formData.rejection_reason} 
                    onChange={(e) => handleChange('rejection_reason', e.target.value)} 
                  />
                </div>
              )}
            </div>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reg-enabled"
                  checked={formData.registration_enabled}
                  onCheckedChange={(checked: boolean) => handleChange('registration_enabled', checked)}
                />
                <Label htmlFor="reg-enabled">Registration Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cert-enabled"
                  checked={formData.certificate_enabled}
                  onCheckedChange={(checked: boolean) => handleChange('certificate_enabled', checked)}
                />
                <Label htmlFor="cert-enabled">Certificate Enabled</Label>
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
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
