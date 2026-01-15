'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImage?: string | null;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  currentImage, 
  onUpload, 
  onRemove,
  label = 'Featured Image',
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const url = await onUpload(file);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-3">
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
      ) : (
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
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
