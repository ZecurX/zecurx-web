'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  { ssr: false, loading: () => <div>Loading editor...</div> }
);
import ImageUpload from '@/components/admin/ImageUpload';
import LabelSelector from '@/components/admin/LabelSelector';
import { BlogLabel, UpdateBlogPostRequest, BlogPost } from '@/types/auth';
import { uploadFileToS3 } from '@/lib/upload-utils';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [_publishing, _setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  // Fetch Post Data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        
        const post: BlogPost = await res.json();
        setOriginalPost(post);
        
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setFeaturedImage(post.featured_image_url || '');
        setMetaDescription(post.meta_description || '');
        setStatus(post.status);
        setSelectedLabels(post.labels?.map(l => l.id) || []);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load blog post');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageUpload = async (file: File): Promise<string> => {
    return await uploadFileToS3(file, 'blog');
  };

  const handleCreateLabel = async (name: string, color: string): Promise<BlogLabel> => {
    const res = await fetch('/api/admin/blog/labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create label');
    }

    return await res.json();
  };

  const handleSave = async (newStatus?: 'draft' | 'published', silent: boolean = false) => {
    if (!title.trim() || !content.trim()) return;

    if (!silent) setSaving(true);
    setError(null);

    try {
      const payload: UpdateBlogPostRequest = {
        title,
        content,
        excerpt,
        featured_image_url: featuredImage,
        meta_description: metaDescription,
        status: newStatus || status,
        label_ids: selectedLabels
      };

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update post');
      }

      const updatedPost = await res.json();
      if (newStatus) setStatus(newStatus);
      setLastSaved(new Date());
      
      // Update original post state to reflect saved changes
      // This is important for auto-save logic if we were comparing changes
      setOriginalPost(updatedPost);

    } catch (err: any) {
      console.error('Error saving post:', err);
      if (!silent) setError(err.message || 'Failed to save changes');
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/blog');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete post');
        setSaving(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
      setSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if there are changes to save
      // For simplicity, we just save if we have data loaded
      if (!initialLoading && title && content) {
        handleSave(undefined, true);
      }
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoading, title, content, excerpt, featuredImage, metaDescription, selectedLabels]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !originalPost) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold">Error Loading Post</h2>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/admin/blog" className="text-primary hover:underline">
          Back to Blog List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b border-border/40">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {status === 'published' && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </Link>
          )}
          
          <button
            onClick={() => handleSave(status === 'published' ? 'published' : 'draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={() => handleSave(status === 'published' ? 'draft' : 'published')}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              status === 'published' 
                ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-bold bg-transparent border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-0"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>slug:</span>
              <input
                type="text"
                value={slug}
                disabled
                className="bg-muted/50 border border-transparent rounded px-1 text-muted-foreground cursor-not-allowed flex-1"
                title="Slug cannot be changed after creation"
              />
            </div>
          </div>

          <RichTextEditor
            content={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-card/40 border border-border/50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Featured Image</h3>
            <ImageUpload
              currentImage={featuredImage}
              onUpload={handleImageUpload}
              onUrlChange={(url) => setFeaturedImage(url)}
              onRemove={() => setFeaturedImage('')}
            />
          </div>

          {/* Labels */}
          <div className="bg-card/40 border border-border/50 rounded-xl p-4 space-y-4 relative z-20">
            <h3 className="font-semibold text-foreground">Labels</h3>
            <LabelSelector
              selectedLabels={selectedLabels}
              onChange={setSelectedLabels}
              onCreateLabel={handleCreateLabel}
            />
          </div>

          {/* Excerpt */}
          <div className="bg-card/40 border border-border/50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Excerpt</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Short summary for preview cards..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>

          {/* SEO */}
          <div className="bg-card/40 border border-border/50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-foreground">SEO Settings</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                placeholder="Meta description for search engines..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>
          </div>

          {/* Delete Button */}
          <div className="bg-card/40 border border-border/50 rounded-xl p-4">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
