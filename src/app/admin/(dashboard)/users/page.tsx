'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Shield, UserPlus, Edit, Trash2, KeyRound, X } from 'lucide-react';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { useAuth } from '@/components/providers/AuthProvider';
import { Role, AdminPublic } from '@/types/auth';

type CreateUserData = {
  email: string;
  password: string;
  name: string;
  role: Role;
};

type UpdateUserData = {
  email?: string;
  name?: string | null;
  role?: Role;
  is_active?: boolean;
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminPublic | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    name: '',
    role: 'sales'
  });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      setSuccess('User created successfully');
      setShowCreateDialog(false);
      setFormData({ email: '', password: '', name: '', role: 'sales' });
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setError(null);
    setSuccess(null);

    try {
      const updateData: UpdateUserData = {
        email: selectedUser.email,
        name: selectedUser.name,
        role: selectedUser.role,
        is_active: selectedUser.is_active
      };

      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      setSuccess('User updated successfully');
      setShowEditDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteUser = async (permanent: boolean = false) => {
    if (!selectedUser) return;

    setError(null);
    setSuccess(null);

    try {
      const url = permanent 
        ? `/api/admin/users/${selectedUser.id}?permanent=true`
        : `/api/admin/users/${selectedUser.id}`;
      
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setSuccess(permanent ? 'User permanently deleted' : 'User deactivated successfully');
      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      setSuccess('Password reset successfully');
      setShowResetPasswordDialog(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const openEditDialog = (user: AdminPublic) => {
    setSelectedUser(user);
    setShowEditDialog(true);
    setError(null);
    setSuccess(null);
  };

  const openDeleteDialog = (user: AdminPublic) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
    setError(null);
    setSuccess(null);
  };

  const openResetPasswordDialog = (user: AdminPublic) => {
    setSelectedUser(user);
    setShowResetPasswordDialog(true);
    setNewPassword('');
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage admin users and their roles</p>
        </div>
        <button
          onClick={() => {
            setShowCreateDialog(true);
            setError(null);
            setSuccess(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
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

      {/* Users Table */}
      <div className="hidden md:block">
        <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditDialog(user)}
                          className={`p-1.5 rounded transition-colors ${
                            user.role === 'super_admin' 
                              ? 'text-muted-foreground/50 cursor-not-allowed' 
                              : 'text-blue-500 hover:bg-blue-500/10'
                          }`}
                          title={user.role === 'super_admin' ? 'Cannot edit super admin' : 'Edit user'}
                          disabled={user.role === 'super_admin'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openResetPasswordDialog(user)}
                          className="p-1.5 text-orange-500 hover:bg-orange-500/10 rounded transition-colors"
                          title="Reset password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(user)}
                          className={`p-1.5 rounded transition-colors ${
                            user.id === currentUser?.id || user.role === 'super_admin'
                              ? 'text-muted-foreground/50 cursor-not-allowed'
                              : 'text-destructive hover:bg-destructive/10'
                          }`}
                          title={
                            user.role === 'super_admin' 
                              ? 'Cannot delete super admin' 
                              : user.id === currentUser?.id 
                                ? 'Cannot delete yourself' 
                                : 'Delete user'
                          }
                          disabled={user.id === currentUser?.id || user.role === 'super_admin'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {users.map((user) => (
            <motion.article
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-4 bg-background/70 backdrop-blur-xl border border-white/[0.08] dark:border-white/[0.06] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)] space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-foreground">{user.name}</div>
                <div className="flex items-center gap-1 shrink-0 -mr-2 -mt-2">
                  <button
                    onClick={() => openEditDialog(user)}
                    className={`p-2 rounded transition-colors ${
                      user.role === 'super_admin' 
                        ? 'text-muted-foreground/50 cursor-not-allowed' 
                        : 'text-blue-500 hover:bg-blue-500/10'
                    }`}
                    title={user.role === 'super_admin' ? 'Cannot edit super admin' : 'Edit user'}
                    disabled={user.role === 'super_admin'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openResetPasswordDialog(user)}
                    className="p-2 text-orange-500 hover:bg-orange-500/10 rounded transition-colors"
                    title="Reset password"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(user)}
                    className={`p-2 rounded transition-colors ${
                      user.id === currentUser?.id || user.role === 'super_admin'
                        ? 'text-muted-foreground/50 cursor-not-allowed'
                        : 'text-destructive hover:bg-destructive/10'
                    }`}
                    title={
                      user.role === 'super_admin' 
                        ? 'Cannot delete super admin' 
                        : user.id === currentUser?.id 
                          ? 'Cannot delete yourself' 
                          : 'Delete user'
                    }
                    disabled={user.id === currentUser?.id || user.role === 'super_admin'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground truncate">
                {user.email}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <RoleBadge role={user.role} size="sm" />
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground bg-card/40 border border-border/50 rounded-xl backdrop-blur-sm">
            No users found.
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      {showCreateDialog && (
        <Dialog onClose={() => setShowCreateDialog(false)} title="Create New User">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Role</label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="media">Media</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Edit User Dialog */}
      {showEditDialog && selectedUser && (
        <Dialog onClose={() => setShowEditDialog(false)} title="Edit User">
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <input
                type="text"
                required
                value={selectedUser.name || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                required
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Role</label>
              <select
                required
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as Role })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={selectedUser.role === 'super_admin'}
              >
                {selectedUser.role === 'super_admin' && (
                  <option value="super_admin">Super Admin (Cannot be changed)</option>
                )}
                {selectedUser.role !== 'super_admin' && (
                  <>
                    <option value="admin">Admin</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="media">Media</option>
                  </>
                )}
              </select>
              {selectedUser.role === 'super_admin' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Super admin role cannot be modified for security reasons
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={selectedUser.is_active}
                onChange={(e) => setSelectedUser({ ...selectedUser, is_active: e.target.checked })}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="is_active" className="text-sm text-foreground">Account is active</label>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={() => setShowEditDialog(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Delete User Dialog */}
      {showDeleteDialog && selectedUser && (
        <Dialog onClose={() => setShowDeleteDialog(false)} title="Delete User">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              What would you like to do with <strong className="text-foreground">{selectedUser.name}</strong>?
            </p>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleDeleteUser(false)}
                className="w-full px-4 py-3 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-lg hover:bg-orange-500/20 transition-colors text-left"
              >
                <div className="font-medium">Deactivate</div>
                <div className="text-sm opacity-80">Prevent login, but preserve account data</div>
              </button>
              <button
                onClick={() => handleDeleteUser(true)}
                className="w-full px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-left"
              >
                <div className="font-medium">Permanently Delete</div>
                <div className="text-sm opacity-80">Remove user completely (irreversible)</div>
              </button>
            </div>
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors mt-2"
            >
              Cancel
            </button>
          </div>
        </Dialog>
      )}

      {/* Reset Password Dialog */}
      {showResetPasswordDialog && selectedUser && (
        <Dialog onClose={() => setShowResetPasswordDialog(false)} title="Reset Password">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reset password for <strong className="text-foreground">{selectedUser.name}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => setShowResetPasswordDialog(false)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}

// Dialog Component
function Dialog({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
