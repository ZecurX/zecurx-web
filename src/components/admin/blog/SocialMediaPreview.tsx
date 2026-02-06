'use client';

import { Twitter, Facebook, Linkedin } from 'lucide-react';

interface SocialMediaPreviewProps {
    title: string;
    description: string;
    imageUrl: string;
    url?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
}

export default function SocialMediaPreview({
    title,
    description,
    imageUrl,
    url = 'https://zecurx.com/blog/...',
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription
}: SocialMediaPreviewProps) {
    const displayTitle = title || 'Your Blog Post Title';
    const displayDescription = description || 'Your blog post description will appear here...';
    const displayImage = imageUrl || '/placeholder-og.png';

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
                Social Media Previews
            </h3>

            {/* Twitter/X Preview */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Twitter className="w-4 h-4" />
                    <span>Twitter / X</span>
                </div>
                <div className="border border-border rounded-2xl overflow-hidden bg-card">
                    {displayImage && (
                        <div className="aspect-[2/1] relative bg-muted">
                            <img
                                src={ogImage || displayImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                            {twitterTitle || ogTitle || displayTitle}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {twitterDescription || ogDescription || displayDescription}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            🔗 zecurx.com
                        </p>
                    </div>
                </div>
            </div>

            {/* Facebook Preview */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                    {displayImage && (
                        <div className="aspect-[1.91/1] relative bg-muted">
                            <img
                                src={ogImage || displayImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-3 bg-muted/30">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            zecurx.com
                        </p>
                        <p className="text-sm font-semibold text-foreground line-clamp-2 mt-1">
                            {ogTitle || displayTitle}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {ogDescription || displayDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* LinkedIn Preview */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                </div>
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                    {displayImage && (
                        <div className="aspect-[1.91/1] relative bg-muted">
                            <img
                                src={ogImage || displayImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-3">
                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                            {ogTitle || displayTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            zecurx.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
