'use client';

import { useEffect, useState } from 'react';
import { FileText, Trash2, Filter, X } from 'lucide-react';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { AuditLog, AuditAction, Resource } from '@/types/auth';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filters
  const [filterAction, setFilterAction] = useState<AuditAction | 'all'>('all');
  const [filterResource, setFilterResource] = useState<Resource | 'all'>('all');
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterAction !== 'all') params.append('action', filterAction);
      if (filterResource !== 'all') params.append('resource', filterResource);
      if (filterUserId) params.append('user_id', filterUserId);

      const response = await fetch(`/api/admin/audit?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      setLogs(data.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/audit', {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cleanup logs');
      }

      const data = await response.json();
      setSuccess(`Deleted ${data.deleted_count} old logs`);
      setShowDeleteDialog(false);
      fetchLogs();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const applyFilters = () => {
    fetchLogs();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilterAction('all');
    setFilterResource('all');
    setFilterUserId('');
    fetchLogs();
  };

  const hasActiveFilters = filterAction !== 'all' || filterResource !== 'all' || filterUserId !== '';

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case 'create': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'update': return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
      case 'delete': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'login': return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
      case 'logout': return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
      case 'password_reset': return 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading audit logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">View all system activity and changes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasActiveFilters
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary-foreground rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Cleanup Old Logs
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-card/40 border border-border/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filter Logs</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as AuditAction | 'all')}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="password_reset">Password Reset</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Resource</label>
              <select
                value={filterResource}
                onChange={(e) => setFilterResource(e.target.value as Resource | 'all')}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Resources</option>
                <option value="users">Users</option>
                <option value="customers">Customers</option>
                <option value="sales">Sales</option>
                <option value="plans">Plans</option>
                <option value="products">Products</option>
                <option value="blog">Blog</option>
                <option value="auth">Auth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">User ID</label>
              <input
                type="text"
                placeholder="Enter user ID"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Resource</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{log.admin_email || log.admin_id}</span>
                  </td>
                  <td className="px-6 py-4">
                    {log.admin_role && <RoleBadge role={log.admin_role} size="sm" />}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground font-medium">{log.resource}</span>
                  </td>
                  <td className="px-6 py-4">
                    {log.details && (
                      <div className="max-w-md">
                        <details className="cursor-pointer">
                          <summary className="text-muted-foreground hover:text-foreground">
                            View details
                          </summary>
                          <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {log.ip_address || 'N/A'}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Count */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {logs.length} log{logs.length !== 1 ? 's' : ''}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog onClose={() => setShowDeleteDialog(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Cleanup Old Logs</h2>
                <p className="text-sm text-muted-foreground">Delete logs older than 90 days</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              This will permanently delete all audit logs that are older than 90 days.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCleanup}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Delete Old Logs
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

// Dialog Component
function Dialog({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
