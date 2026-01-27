"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
    title: string;
    text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch {
                // User cancelled or error
            }
        } else {
            await navigator.clipboard.writeText(url);
            // Could add a toast notification here
        }
    };

    return (
        <Button
            variant="outline"
            className="h-12 rounded-xl px-6"
            onClick={handleShare}
        >
            <Share2 className="w-4 h-4 mr-2" />
            Share
        </Button>
    );
}
