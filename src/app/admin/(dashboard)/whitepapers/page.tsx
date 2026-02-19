'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Download,
  Globe,
  Loader2
} from 'lucide-react';
import { Whitepaper, WhitepaperStatus } from '@/types/auth';
import { useAuth } from '@/components/providers/AuthProvider';
import Image from 'next/image';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CATEGORIES = [
  'Zero Trust Security',
  'Cloud Compliance',
  'Threat Intelligence',
  'Data Protection',
  'Incident Response',
  'API Security',
  'General',
];

export default function WhitepapersListPage() {
  const { user } = useAuth();
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WhitepaperStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  });

  const debouncedSearch = useDebounce(search, 500);

  const fetchWhitepapers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);

      const res = await fetch(`/api/admin/whitepapers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setWhitepapers(data.whitepapers);
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
      console.error('Failed to fetch whitepapers:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchWhitepapers();
  }, [fetchWhitepapers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this whitepaper? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/whitepapers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchWhitepapers();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete whitepaper');
      }
    } catch (error) {
      console.error('Error deleting whitepaper:', error);
      alert('An error occurred while deleting the whitepaper');
    }
  };

  const canManageWhitepapers = ['super_admin', 'admin', 'media', 'marketing'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Whitepapers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage technical whitepapers and research documents</p>
        </div>

        {canManageWhitepapers && (
          <Link
            href="/admin/whitepapers/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Whitepaper
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card/40 border border-border/50 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search whitepapers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WhitepaperStatus | 'all')}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm max-w-[200px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : whitepapers.length === 0 ? (
        <div className="text-center py-12 bg-card/40 border border-border/50 rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No whitepapers found</h3>
          <p className="text-muted-foreground mt-1">
            {search || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by uploading your first whitepaper'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {whitepapers.map((paper) => (
            <div
              key={paper.id}
              className="group flex flex-col sm:flex-row gap-4 p-4 bg-card/40 border border-border/50 rounded-xl hover:bg-card/60 transition-colors"
            >
              <div className="relative w-full sm:w-48 aspect-[3/4] bg-muted rounded-lg overflow-hidden shrink-0">
                {paper.cover_image_url ? (
                  <Image
                    src={paper.cover_image_url}
                    alt={paper.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg truncate pr-4">
                      {paper.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${paper.status === 'published'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        }`}>
                        {paper.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                        {paper.category}
                      </span>
                      {paper.pages > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                          {paper.pages} pages
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {paper.status === 'published' && (
                      <Link
                        href={`/resources/whitepapers`}
                        target="_blank"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <Globe className="w-4 h-4" />
                      </Link>
                    )}
                    {canManageWhitepapers && (
                      <>
                        <Link
                          href={`/admin/whitepapers/${paper.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {!canManageWhitepapers && (
                      <Link
                        href={`/admin/whitepapers/${paper.id}/edit`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {paper.summary}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {paper.published_at
                        ? new Date(paper.published_at).toLocaleDateString()
                        : `Created ${new Date(paper.created_at).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{paper.download_count} downloads</span>
                  </div>
                  <div className="truncate">
                    by {paper.author_name || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
