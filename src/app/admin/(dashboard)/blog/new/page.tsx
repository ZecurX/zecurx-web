'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, AlertCircle, Eye, EyeOff, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { generateSlug, calculateReadingTime, stripHtml } from '@/lib/blog-utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  { ssr: false, loading: () => <div>Loading editor...</div> }
);
import ImageUpload from '@/components/admin/ImageUpload';
import LabelSelector from '@/components/admin/LabelSelector';
import { BlogLabel, CreateBlogPostRequest } from '@/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { uploadFileToS3 } from '@/lib/upload-utils';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const wordCount = stripHtml(content).split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = calculateReadingTime(content);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

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

  const autoSaveDraft = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
    
    setAutoSaving(true);
    try {
      const draftData = {
        title,
        slug,
        content,
        excerpt,
        featured_image_url: featuredImage,
        meta_description: metaDescription,
        label_ids: selectedLabels
      };
      localStorage.setItem('blog_draft_new', JSON.stringify(draftData));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to save draft:', err);
    } finally {
      setAutoSaving(false);
    }
  }, [title, slug, content, excerpt, featuredImage, metaDescription, selectedLabels]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('blog_draft_new');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || '');
        setSlug(draft.slug || '');
        setContent(draft.content || '');
        setExcerpt(draft.excerpt || '');
        setFeaturedImage(draft.featured_image_url || '');
        setMetaDescription(draft.meta_description || '');
        setSelectedLabels(draft.label_ids || []);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      autoSaveDraft();
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, excerpt, featuredImage, metaDescription, selectedLabels, autoSaveDraft]);

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

      localStorage.removeItem('blog_draft_new');
      router.push('/admin/blog');
    } catch (err: unknown) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="p-2 hover:bg-muted/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-xl font-bold font-manrope text-foreground">New Blog Post</h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{wordCount} words</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingTime} min read</span>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {autoSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Saved {lastSaved.toLocaleTimeString()}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium",
                  showPreview 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-muted/50 text-foreground hover:bg-muted border border-border/50"
                )}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-foreground rounded-full hover:bg-muted transition-colors disabled:opacity-50 border border-border/50 text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors disabled:opacity-50 text-sm font-semibold shadow-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Publish
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <article className="prose prose-lg dark:prose-invert max-w-none">
                {featuredImage && (
                  <Image src={featuredImage} alt={title} width={800} height={400} className="w-full rounded-2xl mb-8" />
                )}
                <h1>{title || 'Untitled Post'}</h1>
                {excerpt && <p className="lead">{excerpt}</p>}
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your post title..."
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full text-4xl font-bold font-manrope bg-transparent border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-0 text-foreground"
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">slug:</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="bg-transparent border border-transparent hover:border-border/50 rounded-lg px-2 py-1 focus:border-primary focus:outline-none transition-colors flex-1 text-foreground"
                    />
                  </div>
                </div>

                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  onImageUpload={handleImageUpload}
                />
              </div>

              <div className="space-y-6">
                <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                  <h3 className="font-semibold text-foreground font-manrope">Featured Image</h3>
                  <ImageUpload
                    currentImage={featuredImage}
                    onUpload={async (file) => {
                      const url = await handleImageUpload(file);
                      setFeaturedImage(url);
                      return url;
                    }}
                    onUrlChange={(url) => setFeaturedImage(url)}
                    onRemove={() => setFeaturedImage('')}
                  />
                </div>

                <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm relative z-20">
                  <h3 className="font-semibold text-foreground font-manrope">Labels</h3>
                  <LabelSelector
                    selectedLabels={selectedLabels}
                    onChange={setSelectedLabels}
                    onCreateLabel={handleCreateLabel}
                  />
                </div>

                <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                  <h3 className="font-semibold text-foreground font-manrope">Excerpt</h3>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={4}
                    placeholder="Write a short summary for preview cards..."
                    className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                  <h3 className="font-semibold text-foreground font-manrope">SEO Settings</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Meta Description</label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={4}
                      placeholder="Describe your post for search engines..."
                      className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
