"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { SeminarRegistration } from "@/types/seminar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EditRegistrationDialogProps {
  registration: SeminarRegistration;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditRegistrationDialog({ registration, onClose, onUpdate }: EditRegistrationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: registration.full_name,
    email: registration.email,
    phone: registration.phone || '',
    college_name: registration.college_name || '',
    year: registration.year || '',
    city_state: registration.city_state || '',
    email_verified: registration.email_verified,
    attended: registration.attended,
    is_retroactive: registration.is_retroactive
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/seminars/${registration.seminar_id}/registrations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registration.id,
          ...formData
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update registration');
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to update registration");
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
          <h2 className="text-lg font-bold text-foreground">Edit Registration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div 
          className="p-6 space-y-4 overflow-y-auto min-h-0 flex-1 [overscroll-behavior:contain]" 
          data-lenis-prevent
        >
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              value={formData.full_name} 
              onChange={(e) => handleChange('full_name', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input 
              value={formData.phone} 
              onChange={(e) => handleChange('phone', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>College Name</Label>
            <Input 
              value={formData.college_name} 
              onChange={(e) => handleChange('college_name', e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <Input 
                value={formData.year} 
                onChange={(e) => handleChange('year', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>City/State</Label>
              <Input 
                value={formData.city_state} 
                onChange={(e) => handleChange('city_state', e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
             <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reg-attended"
                  checked={formData.attended}
                  onCheckedChange={(checked: boolean) => handleChange('attended', checked)}
                />
                <Label htmlFor="reg-attended">Attended</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reg-verified"
                  checked={formData.email_verified}
                  onCheckedChange={(checked: boolean) => handleChange('email_verified', checked)}
                />
                <Label htmlFor="reg-verified">Email Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="reg-retro"
                  checked={formData.is_retroactive}
                  onCheckedChange={(checked: boolean) => handleChange('is_retroactive', checked)}
                />
                <Label htmlFor="reg-retro">Retroactive Registration</Label>
              </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
