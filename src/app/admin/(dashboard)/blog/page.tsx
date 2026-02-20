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
  Globe,
  Loader2
} from 'lucide-react';
import { BlogPost, BlogLabel, BlogStatus } from '@/types/auth';
import { useAuth } from '@/components/providers/AuthProvider';
import Image from 'next/image';

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BlogListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');
  const [labels, setLabels] = useState<BlogLabel[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  });

  const debouncedSearch = useDebounce(search, 500);

  const fetchLabels = async () => {
    try {
      const res = await fetch('/api/admin/blog/labels');
      if (res.ok) {
        const data = await res.json();
        setLabels(data);
      }
    } catch (error) {
      console.error('Failed to fetch labels:', error);
    }
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (selectedLabel !== 'all') params.append('label_id', selectedLabel);

      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        // API returns { posts, total, page, limit } - convert to pagination object
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
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, selectedLabel]);

  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
    }
  };

  const canManageBlog = ['super_admin', 'admin', 'marketing', 'media'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your blog posts, labels, and content</p>
        </div>

        {canManageBlog && (
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card/40 border border-border/50 rounded-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BlogStatus | 'all')}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm max-w-[200px]"
          >
            <option value="all">All Labels</option>
            {labels.map(label => (
              <option key={label.id} value={label.id}>{label.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-card/40 border border-border/50 rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No posts found</h3>
          <p className="text-muted-foreground mt-1">
            {search || statusFilter !== 'all' || selectedLabel !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first blog post'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col sm:flex-row gap-4 p-4 bg-card/40 border border-border/50 rounded-xl hover:bg-card/60 transition-colors"
            >
              {/* Image */}
              <div className="relative w-full sm:w-48 aspect-video bg-muted rounded-lg overflow-hidden shrink-0">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg truncate pr-4">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${post.status === 'published'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                        }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      {post.labels?.map(label => (
                        <span
                          key={label.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <Globe className="w-4 h-4" />
                      </Link>
                    )}
                    {canManageBlog && (
                      <>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {!canManageBlog && (
                      <Link
                        href={`/admin/blog/${post.id}/edit`} // Reuse edit page in read-only mode if possible, or just view. For now, let's link to edit page and handle read-only there.
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}

                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : `Created ${new Date(post.created_at).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.view_count} views</span>
                  </div>
                  <div className="truncate">
                    by {post.author_name || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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
