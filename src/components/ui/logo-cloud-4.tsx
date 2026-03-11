import { InfiniteSlider } from "@/components/ui/infinite-slider";

type Logo = {
    src: string;
    darkSrc?: string;
    alt: string;
    width?: number;
    height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
    return (
        <div className="relative mx-auto max-w-3xl overflow-hidden py-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background via-background/80 to-transparent" />

            <InfiniteSlider gap={42} reverse speed={28} speedOnHover={10}>
                {logos.map((logo) =>
                    logo.darkSrc ? (
                        <span key={`logo-${logo.alt}`} className="pointer-events-none select-none">
                            <img
                                alt={logo.alt}
                                className="h-20 md:h-28 dark:hidden"
                                height="auto"
                                loading="lazy"
                                src={logo.src}
                                width="auto"
                            />
                            <img
                                alt={logo.alt}
                                className="h-20 md:h-28 hidden dark:block"
                                height="auto"
                                loading="lazy"
                                src={logo.darkSrc}
                                width="auto"
                            />
                        </span>
                    ) : (
                        <img
                            alt={logo.alt}
                            className="pointer-events-none h-20 select-none md:h-28"
                            height="auto"
                            key={`logo-${logo.alt}`}
                            loading="lazy"
                            src={logo.src}
                            width="auto"
                        />
                    )
                )}
            </InfiniteSlider>


        </div>
    );
}
