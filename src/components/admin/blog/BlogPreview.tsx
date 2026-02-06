'use client';

import { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';

interface BlogPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    labels: Array<{ id: string; name: string; color: string }>;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function BlogPreview({
    isOpen,
    onClose,
    title,
    content,
    excerpt,
    featuredImage,
    labels
}: BlogPreviewProps) {
    const [viewport, setViewport] = useState<ViewportSize>('desktop');

    if (!isOpen) return null;

    const viewportStyles = {
        desktop: 'w-full',
        tablet: 'w-[768px] mx-auto',
        mobile: 'w-[375px] mx-auto'
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Preview</h2>

                    {/* Viewport Toggles */}
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <button
                            onClick={() => setViewport('desktop')}
                            className={`p-2 rounded-md transition-colors ${viewport === 'desktop' ? 'bg-background shadow-sm' : 'hover:bg-muted'
                                }`}
                            title="Desktop"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewport('tablet')}
                            className={`p-2 rounded-md transition-colors ${viewport === 'tablet' ? 'bg-background shadow-sm' : 'hover:bg-muted'
                                }`}
                            title="Tablet"
                        >
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewport('mobile')}
                            className={`p-2 rounded-md transition-colors ${viewport === 'mobile' ? 'bg-background shadow-sm' : 'hover:bg-muted'
                                }`}
                            title="Mobile"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto bg-muted/30 p-6">
                <div className={`${viewportStyles[viewport]} transition-all duration-300`}>
                    <article className="bg-background rounded-2xl shadow-lg overflow-hidden">
                        {/* Featured Image */}
                        {featuredImage && (
                            <div className="aspect-video relative">
                                <img
                                    src={featuredImage}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 md:p-10">
                            {/* Labels */}
                            {labels.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {labels.map(label => (
                                        <span
                                            key={label.id}
                                            className="px-3 py-1 text-xs font-medium rounded-full"
                                            style={{
                                                backgroundColor: label.color + '20',
                                                color: label.color
                                            }}
                                        >
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                                {title || 'Untitled Post'}
                            </h1>

                            {/* Excerpt */}
                            {excerpt && (
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    {excerpt}
                                </p>
                            )}

                            {/* Divider */}
                            <hr className="border-border mb-8" />

                            {/* Content */}
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: content || '<p>Start writing your content...</p>' }}
                            />
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
