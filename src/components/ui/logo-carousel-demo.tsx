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
        <section className="py-4 md:py-6 px-4 sm:px-12 bg-transparent w-full">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-3 mb-4">
                    <p className="text-primary font-manrope font-semibold tracking-widest text-sm uppercase">
                        Trusted By Teams From Around The World
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-manrope font-light tracking-tighter text-foreground">
                        The best are <span className="font-newsreader italic text-muted-foreground">already here</span>
                    </h2>
                </div>
                <div className="w-full">
                    <LogoCarousel logos={demoLogos} columns={2} />
                </div>
            </div>
        </section>
    );
}
