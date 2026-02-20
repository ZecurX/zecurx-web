"use client";

import { useState } from "react";
import { Linkedin, Facebook, Copy, Check } from "lucide-react";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const url =
        typeof window !== "undefined"
            ? `${window.location.origin}/blog/${slug}`
            : `https://zecurx.com/blog/${slug}`;

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleShare = (platform: string) => {
        let shareUrl = "";

        if (platform === "twitter") {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        } else if (platform === "linkedin") {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        } else if (platform === "facebook") {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = url;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Share:</span>
            <div className="flex gap-2">
                <button
                    onClick={() => handleShare("twitter")}
                    className="p-2.5 bg-muted/50 hover:bg-muted rounded-full transition-all duration-200 text-foreground hover:-translate-y-1 hover:shadow-lg"
                    aria-label="Share on X"
                    title="Share on X"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleShare("linkedin")}
                    className="p-2.5 bg-muted/50 hover:bg-muted rounded-full transition-all duration-200 text-foreground hover:-translate-y-1 hover:shadow-lg"
                    aria-label="Share on LinkedIn"
                    title="Share on LinkedIn"
                >
                    <Linkedin className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleShare("facebook")}
                    className="p-2.5 bg-muted/50 hover:bg-muted rounded-full transition-all duration-200 text-foreground hover:-translate-y-1 hover:shadow-lg"
                    aria-label="Share on Facebook"
                    title="Share on Facebook"
                >
                    <Facebook className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCopy}
                    className="p-2.5 bg-muted/50 hover:bg-muted rounded-full transition-all duration-200 text-foreground hover:-translate-y-1 hover:shadow-lg"
                    aria-label={copied ? "Link copied!" : "Copy Link"}
                    title={copied ? "Link copied!" : "Copy link"}
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
