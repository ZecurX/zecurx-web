"use client";

import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Card, CardContent } from "@/components/ui/card";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

// Using CDN-hosted client logos
const demoLogos = [
    { id: 1, name: "Gurudev", src: `${CDN_URL}/logos/GURUDEV.png` },
    { id: 2, name: "Honey Herbal", src: `${CDN_URL}/logos/HONEY HERBAL.png` },
    { id: 3, name: "IBM", src: `${CDN_URL}/logos/IBM.png` },
    { id: 4, name: "Kanti", src: `${CDN_URL}/logos/KANTI.png` },
    { id: 5, name: "Matex", src: `${CDN_URL}/logos/MATEX.png` },
    { id: 6, name: "My Garden", src: `${CDN_URL}/logos/MY GARDEN.png` }
];

export function LogoCarouselBasic() {
    return (
        <section className="py-12 md:py-24 px-4 sm:px-12 bg-transparent w-full">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                        TRUSTED BY TEAMS FROM AROUND THE WORLD
                    </p>
                    <h2 className="text-2xl md:text-5xl font-bold tracking-tight leading-none text-foreground">
                        The best are already here
                    </h2>
                </div>
                <div className="w-full">
                    <LogoCarousel logos={demoLogos} columns={2} />
                </div>
            </div>
        </section>
    );
}
