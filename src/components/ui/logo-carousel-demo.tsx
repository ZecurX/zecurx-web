"use client";

import { cn } from "@/lib/utils";
import { LogoCloud } from "@/components/ui/logo-cloud-4";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

const logos = [
    { src: `${CDN_URL}/logos/GURUDEV.webp`, alt: "Gurudev" },
    { src: `${CDN_URL}/logos/HONEY%20HERBAL.webp`, alt: "Honey Herbal" },
    { src: `${CDN_URL}/logos/IBM.webp`, alt: "IBM" },
    { src: `${CDN_URL}/logos/KANTI.webp`, alt: "Kanti" },
    { src: `${CDN_URL}/logos/MATEX.webp`, alt: "Matex" },
    { src: `${CDN_URL}/logos/MY%20GARDEN.webp`, alt: "My Garden" },
];

export function LogoCarouselBasic() {
    return (
        <section className="relative py-4 md:py-6 px-4 sm:px-12 bg-transparent w-full">
            <div
                aria-hidden="true"
                className={cn(
                    "-top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[120vmin] w-[120vmin] rounded-b-full",
                    "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
                    "blur-[30px]"
                )}
            />
            <div className="max-w-7xl mx-auto">
                <h2 className="mb-5 text-center">
                    <span className="block font-medium text-2xl text-muted-foreground">
                        Already used by
                    </span>
                    <span className="font-black text-2xl text-primary tracking-tight md:text-3xl">
                        Best in the Game
                    </span>
                </h2>

                <LogoCloud logos={logos} />
            </div>
        </section>
    );
}
