"use client";

import { useState } from "react";
import { Share2, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    recipientName: string;
    seminarTitle: string;
    certificateId: string;
    url?: string;
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

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    );
}

function getShareText(recipientName: string, seminarTitle: string) {
    return `I'm excited to share that I've successfully completed "${seminarTitle}" with ZecurX Academy!\n\nThis certification strengthens my expertise and I'm ready to take on new challenges in the field.\n\nView my certificate:`;
}

export function ShareButton({ recipientName, seminarTitle, certificateId: _certificateId, url: propUrl, compact, className }: ShareButtonProps) {
    const [copied, setCopied] = useState<"link" | "instagram" | null>(null);

    const getUrl = () => {
        if (propUrl) return propUrl;
        return window.location.href;
    };

    const shareText = getShareText(recipientName, seminarTitle);

    const handleShare = async () => {
        const url = getUrl();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${recipientName} — ${seminarTitle} Certificate`,
                    text: shareText,
                    url,
                });
            } catch {
                // User cancelled
            }
        } else {
            handleCopy();
        }
    };

    const handleCopy = async () => {
        const url = getUrl();
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setCopied("link");
        setTimeout(() => setCopied(null), 2000);
    };

    const handleLinkedIn = () => {
        const url = getUrl();
        const postText = `${shareText}\n${url}\n\n#ZecurX #Certification #ProfessionalDevelopment`;
        // Use LinkedIn's share post URL — this opens the "create a post" dialog with pre-filled text
        const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`;
        window.open(linkedInUrl, "_blank");
    };

    const handleTwitter = () => {
        const url = getUrl();
        const tweetText = `I just completed "${seminarTitle}" with @ZecurX! 🎓🛡️\n\nLeveling up my skills one certification at a time.\n\nView my certificate: ${url}\n\n#ZecurX #Certification #ProfessionalDevelopment`;
        const twitterUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, "_blank");
    };

    const handleInstagram = async () => {
        const url = getUrl();
        const igText = `I'm excited to share that I've successfully completed "${seminarTitle}" with ZecurX Academy! \u{1F393}\u{1F6E1}\uFE0F\n\nThis certification strengthens my expertise and I'm ready to take on new challenges in the field.\n\n\u{1F517} View my certificate: ${url}\n\n#ZecurX #Certification #ProfessionalDevelopment #Training`;
        try {
            await navigator.clipboard.writeText(igText);
        } catch {
            // Fallback for HTTP/insecure contexts
            const textarea = document.createElement('textarea');
            textarea.value = igText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setCopied("instagram");
        setTimeout(() => setCopied(null), 3000);
    };

    const handleWhatsApp = () => {
        const url = getUrl();
        const whatsAppText = `🎓 *Certificate Achievement*\n\nI've successfully completed *${seminarTitle}* with ZecurX Academy!\n\nView my certificate: ${url}`;
        const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppText)}`;
        window.open(whatsAppUrl, "_blank");
    };

    if (compact) {
        return (
            <div className={cn("flex items-center gap-4", className)}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors cursor-pointer"
                    onClick={handleLinkedIn}
                    title="Post on LinkedIn"
                >
                    <Linkedin className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-foreground/5 text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                    onClick={handleTwitter}
                    title="Post on X"
                >
                    <XIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-10 w-10 rounded-full transition-colors cursor-pointer",
                        copied === "instagram"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gradient-to-br from-[#f09433]/10 via-[#dc2743]/10 to-[#bc1888]/10 text-[#dc2743] hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white"
                    )}
                    onClick={handleInstagram}
                    title={copied === "instagram" ? "Caption copied!" : "Copy caption for Instagram"}
                >
                    {copied === "instagram" ? <Check className="w-5 h-5" /> : <InstagramIcon className="w-5 h-5" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
                    onClick={handleWhatsApp}
                    title="Share on WhatsApp"
                >
                    <WhatsAppIcon className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                    onClick={handleCopy}
                    title="Copy link"
                >
                    {copied === "link" ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("space-y-3", className)}>
            <p className="text-sm text-muted-foreground text-center">Share your achievement</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2 cursor-pointer"
                    onClick={handleLinkedIn}
                >
                    <Linkedin className="w-4 h-4" />
                    Post on LinkedIn
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2 cursor-pointer"
                    onClick={handleTwitter}
                >
                    <XIcon className="w-4 h-4" />
                    Post on X
                </Button>
                <Button
                    variant="outline"
                    className={cn(
                        "h-11 rounded-xl px-4 gap-2 cursor-pointer",
                        copied === "instagram" && "border-green-500 text-green-500"
                    )}
                    onClick={handleInstagram}
                >
                    {copied === "instagram" ? (
                        <>
                            <Check className="w-4 h-4 text-green-500" />
                            Caption Copied!
                        </>
                    ) : (
                        <>
                            <InstagramIcon className="w-4 h-4" />
                            Instagram
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2 cursor-pointer"
                    onClick={handleWhatsApp}
                >
                    <WhatsAppIcon className="w-4 h-4" />
                    WhatsApp
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-xl px-4 gap-2 cursor-pointer"
                    onClick={handleCopy}
                >
                    {copied === "link" ? (
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
                    className="h-11 rounded-xl px-4 gap-2 cursor-pointer"
                    onClick={handleShare}
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            </div>
        </div>
    );
}
