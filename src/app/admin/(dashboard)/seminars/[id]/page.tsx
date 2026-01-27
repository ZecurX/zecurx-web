'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Building2,
  User,
  Loader2,
  Save,
  ExternalLink,
  Copy,
  Award,
  MessageSquare
} from 'lucide-react';
import { Seminar, SeminarRegistration, SeminarStatus } from '@/types/seminar';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<SeminarStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending Approval', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10 border-yellow-500/20' },
  approved: { label: 'Approved', color: 'text-green-600', bgColor: 'bg-green-500/10 border-green-500/20' },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-500/10 border-red-500/20' },
  completed: { label: 'Completed', color: 'text-blue-600', bgColor: 'bg-blue-500/10 border-blue-500/20' },
};

export default function SeminarDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const seminarId = params.id as string;

  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [registrations, setRegistrations] = useState<SeminarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'registrations'>('details');

  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [certificateEnabled, setCertificateEnabled] = useState(false);

  const fetchSeminar = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}`);
      if (res.ok) {
        const data = await res.json();
        setSeminar(data.seminar);
        if (!saving) {
            setRegistrationEnabled(data.seminar.registration_enabled);
            setCertificateEnabled(data.seminar.certificate_enabled);
        }
      }
    } catch (error) {
      console.error('Failed to fetch seminar:', error);
    } finally {
      setLoading(false);
    }
  }, [seminarId, saving]);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/registrations`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  }, [seminarId]);

  useEffect(() => {
    fetchSeminar();
    fetchRegistrations();
  }, [fetchSeminar, fetchRegistrations]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_enabled: registrationEnabled,
          certificate_enabled: certificateEnabled,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSeminar(data.seminar);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Approve this seminar? An email will be sent to the organizer.')) return;

    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/approve`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchSeminar();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve');
      }
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        fetchSeminar();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const toggleAttendance = async (registrationId: string, attended: boolean) => {
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/registrations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, attended }),
      });

      if (res.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const copyRegistrationLink = () => {
    const link = `${window.location.origin}/seminars/${seminarId}/register`;
    navigator.clipboard.writeText(link);
  };

  const copyCertificateLink = () => {
    const link = `${window.location.origin}/seminars/${seminarId}/certificate`;
    navigator.clipboard.writeText(link);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canManage = user?.role === 'admin' || user?.role === 'super_admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!seminar) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">Seminar not found</h3>
        <Link href="/admin/seminars" className="text-primary hover:underline mt-2 inline-block">
          Back to seminars
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[seminar.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/seminars"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{seminar.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{seminar.organization_name}</p>
        </div>
        <div className={cn("px-3 py-1.5 rounded-full text-sm font-medium border", statusConfig.bgColor, statusConfig.color)}>
          {statusConfig.label}
        </div>
      </div>

      {seminar.status === 'pending' && canManage && (
        <div className="flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-yellow-600">Pending Approval</p>
            <p className="text-sm text-muted-foreground mt-1">
              Review the details and approve or reject this seminar request.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button onClick={handleReject} variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      )}

      {seminar.status === 'rejected' && seminar.rejection_reason && (
        <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <MessageSquare className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-600">Rejection Reason</p>
            <p className="text-sm text-muted-foreground mt-1">{seminar.rejection_reason}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('details')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === 'details'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
            activeTab === 'registrations'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Registrations
          <span className="px-1.5 py-0.5 text-xs bg-muted rounded-full">
            {registrations.length}
          </span>
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/40 border border-border/50 rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Seminar Details</h2>
              
              <div className="space-y-4">
                {seminar.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1 text-foreground">{seminar.description}</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="font-medium text-foreground">{formatDate(seminar.date)}</p>
                      <p className="text-sm text-muted-foreground">{seminar.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{seminar.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground capitalize">{seminar.location_type}</p>
                      {seminar.venue_address && (
                        <p className="text-sm text-muted-foreground">{seminar.venue_address}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expected Attendees</p>
                      <p className="font-medium text-foreground">{seminar.max_attendees || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">Speaker</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{seminar.speaker_name}</p>
                      {seminar.speaker_title && (
                        <p className="text-sm text-muted-foreground">{seminar.speaker_title}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/40 border border-border/50 rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Organization</p>
                    <p className="font-medium text-foreground">{seminar.organization_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Person</p>
                    <p className="font-medium text-foreground">{seminar.contact_person}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${seminar.contact_email}`} className="font-medium text-primary hover:underline">
                      {seminar.contact_email}
                    </a>
                  </div>
                </div>

                {seminar.contact_phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a href={`tel:${seminar.contact_phone}`} className="font-medium text-foreground">
                        {seminar.contact_phone}
                      </a>
                    </div>
                  </div>
                )}

                {seminar.additional_notes && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Additional Notes</p>
                    <p className="text-sm text-foreground">{seminar.additional_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {seminar.status === 'approved' && (
              <div className="bg-card/40 border border-border/50 rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-4">Quick Links</h2>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Registration Link</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        readOnly
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/seminars/${seminarId}/register`}
                        className="text-xs"
                      />
                      <Button size="icon" variant="outline" onClick={copyRegistrationLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Certificate Link</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        readOnly
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/seminars/${seminarId}/certificate`}
                        className="text-xs"
                      />
                      <Button size="icon" variant="outline" onClick={copyCertificateLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/seminars/${seminarId}/register`}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open public registration page
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {canManage && (
              <div className="bg-card/40 border border-border/50 rounded-xl p-6">
                <h2 className="font-semibold text-foreground mb-4">Settings</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Registration</p>
                        <p className="text-xs text-muted-foreground">Allow students to register</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={registrationEnabled}
                      onChange={(e) => setRegistrationEnabled(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground text-sm">Certificates</p>
                        <p className="text-xs text-muted-foreground">Allow certificate generation</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={certificateEnabled}
                      onChange={(e) => setCertificateEnabled(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={saving || saveSuccess}
                    className={`w-full transition-all ${saveSuccess ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-card/40 border border-border/50 rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Statistics</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
                  <p className="text-xs text-muted-foreground">Registered</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    {registrations.filter(r => r.attended).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Attended</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden">
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No registrations yet</h3>
              <p className="text-muted-foreground mt-1">
                Registrations will appear here when students sign up
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      College
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Year
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Attended
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{reg.full_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${reg.email}`} className="text-sm text-primary hover:underline">
                          {reg.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {reg.college_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {reg.year || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleAttendance(reg.id, !reg.attended)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center mx-auto transition-colors",
                            reg.attended
                              ? "bg-green-500/10 text-green-600"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {reg.attended && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
