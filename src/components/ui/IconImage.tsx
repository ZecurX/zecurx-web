"use client";

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconImageProps {
    src?: string;
    alt: string;
    fallback: LucideIcon;
    className?: string; // Class for the container/image
    iconClassName?: string; // Class specifically for the fallback icon
}

export function IconImage({ src, alt, fallback: Fallback, className, iconClassName }: IconImageProps) {
    const [imageError, setImageError] = useState(false);

    // If no src is provided, or if image failed to load, show fallback
    if (!src || imageError) {
        return <Fallback className={cn("w-full h-full", iconClassName)} />;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn("w-full h-full object-contain", className)}
            onError={() => setImageError(true)}
        />
    );
}
