'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { uploadFileToS3 } from '@/lib/upload-utils';

interface ImageUploadProps {
  currentImage?: string | null;
  onUpload: (file: File) => Promise<string>;
  onUrlChange?: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  currentImage, 
  onUpload, 
  onUrlChange,
  onRemove,
  label = 'Featured Image',
  maxSizeMB = 20 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    setPreview(urlInput);
    if (onUrlChange) {
      onUrlChange(urlInput);
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.';
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `File too large. Maximum size is ${maxSizeMB}MB.`;
    }

    return null;
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      let url: string;
      if (onUpload) {
        url = await onUpload(file);
      } else {
        url = await uploadFileToS3(file, 'images');
      }
      
      setPreview(url);
      setError(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            mode === 'upload' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            mode === 'url' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL
        </button>
      </div>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full aspect-video bg-muted/50 rounded-xl overflow-hidden border border-border/50">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-3 right-3 p-2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground rounded-full hover:bg-destructive transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground font-medium">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : mode === 'upload' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border/50 hover:border-primary/50 bg-muted/20 hover:bg-muted/30',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
          />
          
          {uploading ? (
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop your image here, or{' '}
                  <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, GIF, WebP up to {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted/20 border-2 border-dashed border-border/50 rounded-xl p-8">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Paste image URL</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
