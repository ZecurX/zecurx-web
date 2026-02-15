"use client";

import { useState } from "react";
import { Share2, Linkedin, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    certificateId?: string;
    compact?: boolean;
    className?: string;
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export function ShareButton({ title, text, url: propUrl, certificateId, compact, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const getUrl = () => {
        if (propUrl) return propUrl;
        if (certificateId) return `${window.location.origin}/verify/${certificateId}`;
        return window.location.href;
    };

    const handleShare = async () => {
        const url = getUrl();
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch {
                // User cancelled
            }
        } else {
            handleCopy();
        }
    };

    const handleCopy = async () => {
        const url = getUrl();
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLinkedIn = () => {
        const url = getUrl();
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, "_blank", "width=600,height=600");
    };

    const handleTwitter = () => {
        const url = getUrl();
        const tweetText = `${text}\n\nVerify: ${url}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
    };

    const handleWhatsApp = () => {
        const url = getUrl();
        const whatsAppText = `${text}\n\n${url}`;
        const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppText)}`;
        window.open(whatsAppUrl, "_blank");
    };

    if (compact) {
        return (
            <div className={`flex items-center gap-2 ${className || ""}`}>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={handleLinkedIn}
                    title="Share on LinkedIn"
                >
                    <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={handleTwitter}
                    title="Share on X"
                >
                    <XIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={handleWhatsApp}
                    title="Share on WhatsApp"
                >
                    <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={handleCopy}
                    title="Copy link"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={handleShare}
                    title="More sharing options"
                >
                    <Share2 className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className || ""}`}>
            <p className="text-sm text-muted-foreground text-center">Share your achievement</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2"
                    onClick={handleLinkedIn}
                >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2"
                    onClick={handleTwitter}
                >
                    <XIcon className="w-4 h-4" />
                    Post
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2"
                    onClick={handleWhatsApp}
                >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-500" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2"
                    onClick={handleShare}
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            </div>
        </div>
    );
}
