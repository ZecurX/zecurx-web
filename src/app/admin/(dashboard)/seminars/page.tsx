'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Eye, 
  Calendar,
  CalendarDays,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Building2,
  Trash2
} from 'lucide-react';
import { Seminar, SeminarStatus } from '@/types/seminar';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const STATUS_CONFIG: Record<SeminarStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle2 },
};

export default function SeminarsListPage() {
  const { user } = useAuth();
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SeminarStatus | 'all'>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  });

  const debouncedSearch = useDebounce(search, 500);

  const fetchSeminars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/seminars?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSeminars(data.seminars || []);
        const total = data.total || 0;
        const limit = data.limit || pagination.limit;
        setPagination(prev => ({
          ...prev,
          page: data.page || prev.page,
          limit: limit,
          total: total,
          total_pages: Math.ceil(total / limit)
        }));
      }
    } catch (error) {
      console.error('Failed to fetch seminars:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchSeminars();
  }, [fetchSeminars]);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this seminar? An email will be sent to the organizer with the registration link.')) return;

    try {
      const res = await fetch(`/api/admin/seminars/${id}/approve`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchSeminars();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve seminar');
      }
    } catch (error) {
      console.error('Error approving seminar:', error);
      alert('An error occurred while approving the seminar');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/seminars/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        fetchSeminars();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject seminar');
      }
    } catch (error) {
      console.error('Error rejecting seminar:', error);
      alert('An error occurred while rejecting the seminar');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone and will remove all registrations and certificates associated with this seminar.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/seminars/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSeminars();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete seminar');
      }
    } catch (error) {
      console.error('Error deleting seminar:', error);
      alert('An error occurred while deleting the seminar');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isPastDate = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const canManageSeminars = user?.role === 'admin' || user?.role === 'super_admin';
  const pendingCount = seminars.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Seminars</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage college seminar bookings and registrations
          </p>
        </div>
        
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{pendingCount} pending approval</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card/40 border border-border/50 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search seminars, colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SeminarStatus | 'all')}
          className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : seminars.length === 0 ? (
        <div className="text-center py-12 bg-card/40 border border-border/50 rounded-xl">
          <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No seminars found</h3>
          <p className="text-muted-foreground mt-1">
            {search || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Seminar bookings will appear here when colleges submit requests'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {seminars.map((seminar) => {
            const statusConfig = STATUS_CONFIG[seminar.status];
            const StatusIcon = statusConfig.icon;
            const isPast = isPastDate(seminar.date);

            return (
              <div 
                key={seminar.id}
                className="group flex flex-col p-5 bg-card/40 border border-border/50 rounded-xl hover:bg-card/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        statusConfig.color
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      {isPast && seminar.status === 'approved' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                          Past Event
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground text-lg">
                      {seminar.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>{seminar.organization_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(seminar.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{seminar.location_type === 'online' ? 'Online' : 'Onsite'}</span>
                      </div>
                      {seminar.registration_count !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>
                            {seminar.registration_count}
                            {seminar.max_attendees && ` / ${seminar.max_attendees}`} registered
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      Contact: {seminar.contact_person} ({seminar.contact_email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canManageSeminars && seminar.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(seminar.id)}
                          className="px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg transition-colors text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(seminar.id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {canManageSeminars && (
                      <button
                        onClick={() => handleDelete(seminar.id, seminar.title)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete seminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <Link
                      href={`/admin/seminars/${seminar.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-3 py-1 bg-card border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors text-sm"
          >
            Previous
          </button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
            disabled={pagination.page === pagination.total_pages}
            className="px-3 py-1 bg-card border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
