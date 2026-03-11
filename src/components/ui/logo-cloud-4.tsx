import { InfiniteSlider } from "@/components/ui/infinite-slider";

type Logo = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
    return (
        <div className="relative mx-auto max-w-3xl bg-gradient-to-r from-secondary via-transparent to-secondary py-6 md:border-x">
            <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

            <InfiniteSlider gap={42} reverse speed={60} speedOnHover={20}>
                {logos.map((logo) => (
                    <img
                        alt={logo.alt}
                        className="pointer-events-none h-20 select-none md:h-28 brightness-200 invert"
                        height="auto"
                        key={`logo-${logo.alt}`}
                        loading="lazy"
                        src={logo.src}
                        width="auto"
                    />
                ))}
            </InfiniteSlider>

            <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
        </div>
    );
}
