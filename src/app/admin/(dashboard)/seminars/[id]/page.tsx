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
  MessageSquare,
  Pencil,
  Star,
  Download,
  Send,
  X,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { Seminar, SeminarRegistration, SeminarFeedback, SeminarStatus, CertificateNameRequest } from '@/types/seminar';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import EditSeminarDialog from './EditSeminarDialog';
import EditRegistrationDialog from './EditRegistrationDialog';

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
  const [feedback, setFeedback] = useState<SeminarFeedback[]>([]);
  const [nameRequests, setNameRequests] = useState<CertificateNameRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'registrations' | 'feedback' | 'name-requests'>('details');
  const [showEditSeminar, setShowEditSeminar] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<SeminarRegistration | null>(null);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [certificateEnabled, setCertificateEnabled] = useState(false);

  // Alert coordinator state
  const [alertingCoordinator, setAlertingCoordinator] = useState(false);

  // Notify all participants state
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [notifySubject, setNotifySubject] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);

  useEffect(() => {
    if (showEditSeminar || editingRegistration || showNotifyDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showEditSeminar, editingRegistration, showNotifyDialog]);

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

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/feedback`);
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    }
  }, [seminarId]);

  const fetchNameRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/name-requests`);
      if (res.ok) {
        const data = await res.json();
        setNameRequests(data.nameRequests || []);
      }
    } catch (error) {
      console.error('Failed to fetch name requests:', error);
    }
  }, [seminarId]);

  useEffect(() => {
    fetchSeminar();
    fetchRegistrations();
    fetchFeedback();
    fetchNameRequests();
  }, [fetchSeminar, fetchRegistrations, fetchFeedback, fetchNameRequests]);

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

  const handleAlertCoordinator = async () => {
    if (!confirm(`Send certificate release alert to coordinator (${seminar?.contact_person}) and all registered students?`)) return;

    setAlertingCoordinator(true);
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/notify-coordinator`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
      } else {
        alert(data.error || 'Failed to send alert');
      }
    } catch (error) {
      console.error('Error alerting coordinator:', error);
      alert('An error occurred');
    } finally {
      setAlertingCoordinator(false);
    }
  };

  const handleNotifyAll = async () => {
    if (!notifySubject.trim() || !notifyMessage.trim()) {
      alert('Please enter both subject and message');
      return;
    }

    setSendingNotification(true);
    try {
      const res = await fetch(`/api/admin/seminars/${seminarId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: notifySubject,
          message: notifyMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setShowNotifyDialog(false);
        setNotifySubject('');
        setNotifyMessage('');
      } else {
        alert(data.error || 'Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('An error occurred while sending notifications');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleCleanupOldData = async () => {
    if (!confirm('Delete all certificate data older than 30 days? This includes certificates, feedback, name requests, promo codes, and PDF files from CDN. This action cannot be undone.')) return;

    setCleaningUp(true);
    try {
      const res = await fetch(`/api/admin/seminars/cleanup`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        alert(`${data.message}\n\nDeleted:\n• ${data.deleted.certificates} certificate(s)\n• ${data.deleted.feedback} feedback record(s)\n• ${data.deleted.nameRequests} name request(s)\n• ${data.deleted.promoCodes} promo code(s)\n• ${data.deleted.s3Files} PDF file(s) from CDN`);
        fetchSeminar();
        fetchFeedback();
        fetchNameRequests();
      } else {
        alert(data.error || 'Cleanup failed');
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      alert('An error occurred during cleanup');
    } finally {
      setCleaningUp(false);
    }
  };

  const downloadCSV = <T,>(data: T[], filename: string, headers: string[], mapping: (item: T) => string[]) => {
    const csvRows = [
      headers.join(','),
      ...data.map(item => mapping(item).map(val =>
        `"${String(val || '').replace(/"/g, '""')}"`
      ).join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadRegistrations = () => {
    if (!seminar) return;
    const headers = ['Full Name', 'Email', 'Phone', 'College', 'Year', 'City/State', 'Verified', 'Attended', 'Registered At'];
    const mapping = (reg: SeminarRegistration) => [
      reg.full_name,
      reg.email,
      reg.phone || '',
      reg.college_name || '',
      reg.year || '',
      reg.city_state || '',
      reg.email_verified ? 'Yes' : 'No',
      reg.attended ? 'Yes' : 'No',
      new Date(reg.registered_at).toLocaleString()
    ];
    downloadCSV(registrations, `registrations-${seminar.title.toLowerCase().replace(/\s+/g, '-')}`, headers, mapping);
  };

  const handleDownloadFeedback = () => {
    if (!seminar) return;
    const headers = [
      'Submitted At', 'Full Name', 'Email', 'College', 'Year', 'City/State',
      'Rating', 'Career Interests', 'Offensive Security Reason',
      'Most Valuable Part', 'Future Suggestions', 'Interested in ZecurX',
      'Certificate Name', 'Reminder Contact'
    ];
    const mapping = (item: SeminarFeedback) => [
      new Date(item.submitted_at).toLocaleString(),
      item.full_name,
      item.email,
      item.college_name || '',
      item.year || '',
      item.city_state || '',
      item.seminar_rating?.toString() || '',
      item.career_interest || '',
      item.offensive_security_reason || '',
      item.most_valuable_part || '',
      item.future_suggestions || '',
      item.join_zecurx ? 'Yes' : 'No',
      item.certificate_name,
      item.reminder_contact || ''
    ];
    downloadCSV(feedback, `feedback-${seminar.title.toLowerCase().replace(/\s+/g, '-')}`, headers, mapping);
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{seminar.title}</h1>
            {canManage && (
              <Button size="icon" variant="ghost" onClick={() => setShowEditSeminar(true)}>
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
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
        <button
          onClick={() => setActiveTab('feedback')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
            activeTab === 'feedback'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Feedback
          <span className="px-1.5 py-0.5 text-xs bg-muted rounded-full">
            {feedback.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('name-requests')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
            activeTab === 'name-requests'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Name Requests
          {nameRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 rounded-full font-semibold">
              {nameRequests.filter(r => r.status === 'pending').length}
            </span>
          )}
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

                  {certificateEnabled && seminar.contact_email && (
                    <Button
                      onClick={handleAlertCoordinator}
                      disabled={alertingCoordinator}
                      variant="outline"
                      className="w-full"
                    >
                      {alertingCoordinator ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Alert Students & Coordinator
                        </>
                      )}
                    </Button>
                  )}

                  <div className="pt-3 mt-3 border-t border-border">
                    <Button
                      onClick={handleCleanupOldData}
                      disabled={cleaningUp}
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      {cleaningUp ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cleaning up...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cleanup Old Data (30d)
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                      Deletes certificates, feedback &amp; promo codes older than 30 days
                    </p>
                  </div>
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
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifyDialog(true)}
              disabled={registrations.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Notify All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadRegistrations}
              disabled={registrations.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
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
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
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
                        <td className="px-4 py-3 text-right">
                          <Button size="icon" variant="ghost" onClick={() => setEditingRegistration(reg)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadFeedback}
              disabled={feedback.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
          <div className="space-y-4">
            {feedback.length === 0 ? (
              <div className="bg-card/40 border border-border/50 rounded-xl p-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No feedback yet</h3>
                <p className="text-muted-foreground mt-1">
                  Student feedback will appear here after they receive certificates
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {feedback.map((item) => (
                  <div key={item.id} className="bg-card/40 border border-border/50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{item.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{item.email} • {item.college_name}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="font-bold text-primary">{item.seminar_rating}/5</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-border/50">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Career Interests</p>
                          <p className="text-sm text-foreground">{item.career_interest || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Most Valuable Part</p>
                          <p className="text-sm text-foreground italic">"{item.most_valuable_part}"</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Future Suggestions</p>
                          <p className="text-sm text-foreground">{item.future_suggestions || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Certificate Name</p>
                          <p className="text-sm font-medium text-primary uppercase">{item.certificate_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-2 text-[10px] text-muted-foreground flex justify-between items-center">
                      <span>Submitted on {new Date(item.submitted_at).toLocaleString()}</span>
                      {item.join_zecurx && (
                        <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-medium">Interested in ZecurX</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'name-requests' && (
        <div className="space-y-4">
          {nameRequests.length === 0 ? (
            <div className="bg-card/40 border border-border/50 rounded-xl p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No name change requests</h3>
              <p className="text-muted-foreground mt-1">
                Name change requests will appear here when students request a different certificate name
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {nameRequests.map((req) => {
                const isPending = req.status === 'pending';
                const isApproved = req.status === 'approved';
                const isRejected = req.status === 'rejected';

                return (
                  <div key={req.id} className="bg-card/40 border border-border/50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{req.email}</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold border",
                        isPending && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                        isApproved && "bg-green-500/10 text-green-600 border-green-500/20",
                        isRejected && "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Registered Name</p>
                        <p className="text-sm text-foreground">{req.registered_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Requested Name</p>
                        <p className="text-sm font-semibold text-primary">{req.requested_name}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-sm text-foreground italic">&ldquo;{req.reason}&rdquo;</p>
                    </div>

                    {req.admin_notes && (
                      <div className="mb-4 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                        <p className="text-xs font-medium text-red-600 mb-1">Admin Notes</p>
                        <p className="text-sm text-foreground">{req.admin_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground">
                        Submitted {new Date(req.created_at).toLocaleString()}
                        {req.reviewed_at && ` • Reviewed ${new Date(req.reviewed_at).toLocaleString()}`}
                      </span>

                      {isPending && canManage && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                              if (!confirm('Approve this name change? A certificate will be generated and emailed.')) return;
                              try {
                                const res = await fetch(`/api/admin/seminars/${seminarId}/name-requests/${req.id}/approve`, {
                                  method: 'POST',
                                });
                                const data = await res.json();
                                if (res.ok) {
                                  alert(data.message);
                                  fetchNameRequests();
                                } else {
                                  alert(data.error || 'Failed to approve');
                                }
                              } catch (err) {
                                console.error('Error approving:', err);
                                alert('An error occurred');
                              }
                            }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              const reason = prompt('Enter rejection reason (optional):');
                              try {
                                const res = await fetch(`/api/admin/seminars/${seminarId}/name-requests/${req.id}/reject`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ reason }),
                                });
                                const data = await res.json();
                                if (res.ok) {
                                  alert(data.message);
                                  fetchNameRequests();
                                } else {
                                  alert(data.error || 'Failed to reject');
                                }
                              } catch (err) {
                                console.error('Error rejecting:', err);
                                alert('An error occurred');
                              }
                            }}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showEditSeminar && seminar && (
        <EditSeminarDialog
          seminar={seminar}
          onClose={() => setShowEditSeminar(false)}
          onUpdate={fetchSeminar}
        />
      )}

      {editingRegistration && (
        <EditRegistrationDialog
          registration={editingRegistration}
          onClose={() => setEditingRegistration(null)}
          onUpdate={fetchRegistrations}
        />
      )}

      {/* Notify All Participants Dialog */}
      {showNotifyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !sendingNotification && setShowNotifyDialog(false)}
          />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Notify All Participants</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Send an email to all {registrations.filter(r => r.email_verified).length} verified participants
                </p>
              </div>
              <button
                onClick={() => !sendingNotification && setShowNotifyDialog(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                disabled={sendingNotification}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="notify-subject" className="text-foreground">Subject</Label>
                <Input
                  id="notify-subject"
                  value={notifySubject}
                  onChange={(e) => setNotifySubject(e.target.value)}
                  placeholder="e.g., Important Update About Tomorrow's Seminar"
                  className="mt-1.5"
                  disabled={sendingNotification}
                />
              </div>

              <div>
                <Label htmlFor="notify-message" className="text-foreground">Message</Label>
                <textarea
                  id="notify-message"
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={6}
                  className="mt-1.5 w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                  disabled={sendingNotification}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This message will be sent to all verified participants along with seminar details.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
              <Button
                variant="outline"
                onClick={() => setShowNotifyDialog(false)}
                disabled={sendingNotification}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNotifyAll}
                disabled={sendingNotification || !notifySubject.trim() || !notifyMessage.trim()}
              >
                {sendingNotification ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
