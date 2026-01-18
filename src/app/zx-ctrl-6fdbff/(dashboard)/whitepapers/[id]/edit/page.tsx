'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Loader2, AlertCircle, Upload, FileText, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UpdateWhitepaperRequest, WhitepaperStatus, Whitepaper } from '@/types/auth';
import Image from 'next/image';

const CATEGORIES = [
  'Zero Trust Security',
  'Cloud Compliance',
  'Threat Intelligence',
  'Data Protection',
  'Incident Response',
  'API Security',
  'General',
];

export default function EditWhitepaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('General');
  const [pages, setPages] = useState<number>(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<WhitepaperStatus>('draft');

  useEffect(() => {
    const fetchWhitepaper = async () => {
      try {
        const res = await fetch(`/api/zx-ctrl-6fdbff/whitepapers/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch whitepaper');
        }
        const data = await res.json();
        const whitepaper: Whitepaper = data.whitepaper;
        
        setTitle(whitepaper.title);
        setSlug(whitepaper.slug);
        setSummary(whitepaper.summary);
        setCategory(whitepaper.category);
        setPages(whitepaper.pages);
        setPdfUrl(whitepaper.pdf_url);
        setCoverImageUrl(whitepaper.cover_image_url || '');
        setStatus(whitepaper.status as WhitepaperStatus);
      } catch (err) {
        setError('Failed to load whitepaper');
      } finally {
        setFetching(false);
      }
    };

    fetchWhitepaper();
  }, [id]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('PDF file must be less than 50MB');
      return;
    }

    setUploadingPdf(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'pdf');

      const res = await fetch('/api/zx-ctrl-6fdbff/whitepapers/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload PDF');
      }

      const data = await res.json();
      setPdfUrl(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload PDF';
      setError(message);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const res = await fetch('/api/zx-ctrl-6fdbff/whitepapers/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await res.json();
      setCoverImageUrl(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (newStatus: WhitepaperStatus) => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!summary.trim()) {
      setError('Summary is required');
      return;
    }
    if (!pdfUrl) {
      setError('PDF file is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: UpdateWhitepaperRequest = {
        title,
        summary,
        category,
        pages: pages || 0,
        cover_image_url: coverImageUrl || undefined,
        pdf_url: pdfUrl,
        status: newStatus,
      };

      const res = await fetch(`/api/zx-ctrl-6fdbff/whitepapers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update whitepaper');
      }

      router.push('/zx-ctrl-6fdbff/whitepapers');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/zx-ctrl-6fdbff/whitepapers"
                className="p-2 hover:bg-muted/50 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-xl font-bold font-manrope text-foreground">Edit Whitepaper</h1>
                <p className="text-xs text-muted-foreground mt-0.5">/{slug}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
                {status === 'published' ? 'Update' : 'Publish'}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter whitepaper title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl font-bold font-manrope bg-transparent border-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-0 text-foreground"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">slug:</span>
                <span className="text-foreground">{slug}</span>
              </div>
            </div>

            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground font-manrope">Summary</h3>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                placeholder="Write a compelling summary of the whitepaper..."
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground font-manrope">PDF Document</h3>
              
              {pdfUrl ? (
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">PDF uploaded</p>
                    <a 
                      href={pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View PDF
                    </a>
                  </div>
                  <label className="px-3 py-1.5 bg-muted text-foreground text-sm rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                    />
                  </label>
                </div>
              ) : (
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                  uploadingPdf 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingPdf ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    )}
                    <p className="mb-2 text-sm text-muted-foreground">
                      {uploadingPdf ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF (max 50MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    disabled={uploadingPdf}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground font-manrope">Cover Image</h3>
              
              {coverImageUrl ? (
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden">
                  <Image
                    src={coverImageUrl}
                    alt="Cover"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() => setCoverImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className={cn(
                  "flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                  uploadingImage 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}>
                  <div className="flex flex-col items-center justify-center">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                    )}
                    <p className="mb-1 text-sm text-muted-foreground text-center px-4">
                      {uploadingImage ? 'Uploading...' : 'Upload cover image'}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>

            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground font-manrope">Details</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Page Count</label>
                <input
                  type="number"
                  value={pages || ''}
                  onChange={(e) => setPages(parseInt(e.target.value) || 0)}
                  placeholder="e.g., 24"
                  min={0}
                  className="w-full px-4 py-2.5 bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
