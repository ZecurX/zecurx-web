'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { generateSlug } from '@/lib/blog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import LabelSelector from '@/components/admin/LabelSelector';
import { BlogLabel, CreateBlogPostRequest } from '@/types/auth';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
  // Auto-generate slug from title
  useEffect(() => {
    if (!slug || slug === generateSlug(title.slice(0, slug.length))) { // Simple heuristic to check if slug was auto-generated
        // Actually, better to just update slug if it wasn't manually edited. 
        // For simplicity: if slug is empty or matches slugified previous title.
        // Let's just update it if user hasn't manually touched it? 
        // Simplest: Update slug when title changes IF slug is empty.
    }
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/blog/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await res.json();
    return data.url;
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

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateBlogPostRequest = {
        title,
        slug,
        content,
        excerpt,
        featured_image_url: featuredImage,
        meta_description: metaDescription,
        status,
        label_ids: selectedLabels
      };

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create post');
      }

      router.push('/admin/blog');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">New Blog Post</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish
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
              onChange={handleTitleChange}
              className="w-full text-4xl font-bold bg-transparent border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-0"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>slug:</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-transparent border border-transparent hover:border-border rounded px-1 focus:border-primary focus:outline-none transition-colors flex-1"
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
              onRemove={() => setFeaturedImage('')}
            />
          </div>

          {/* Labels */}
          <div className="bg-card/40 border border-border/50 rounded-xl p-4 space-y-4">
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
        </div>
      </div>
    </div>
  );
}
