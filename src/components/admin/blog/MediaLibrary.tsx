'use client';

import { useState, useEffect } from 'react';
import { X, Search, Upload, Loader2, Image as ImageIcon, Check, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
    url: string;
    filename: string;
    size: number;
    type: string;
    created_at: string;
}

interface MediaLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    onUpload: (file: File) => Promise<string>;
}

export default function MediaLibrary({
    isOpen,
    onClose,
    onSelect,
    onUpload
}: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/blog/media');
            if (res.ok) {
                const data = await res.json();
                setMedia(data.media || []);
            }
        } catch (err) {
            console.error('Failed to fetch media:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await onUpload(file);
            setMedia(prev => [{
                url,
                filename: file.name,
                size: file.size,
                type: file.type,
                created_at: new Date().toISOString()
            }, ...prev]);
            setSelectedUrl(url);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleInsert = () => {
        if (selectedUrl) {
            onSelect(selectedUrl);
            onClose();
        }
    };

    const filteredMedia = media.filter(item =>
        item.filename.toLowerCase().includes(search.toLowerCase())
    );

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">Media Library</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4 p-4 border-b border-border/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Upload</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">
                                {search ? 'No images found' : 'No images uploaded yet'}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Upload images to see them here
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-4">
                            {filteredMedia.map((item, index) => (
                                <button
                                    key={item.url + index}
                                    onClick={() => setSelectedUrl(item.url === selectedUrl ? null : item.url)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedUrl === item.url
                                            ? 'border-primary ring-2 ring-primary/30'
                                            : 'border-transparent hover:border-border'
                                        }`}
                                >
                                    <Image
                                        src={item.url}
                                        alt={item.filename}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {selectedUrl === item.url && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-xs text-white truncate">{item.filename}</p>
                                        <p className="text-xs text-white/70">{formatSize(item.size)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                        {filteredMedia.length} image{filteredMedia.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInsert}
                            disabled={!selectedUrl}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Insert Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
