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
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent sm:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent sm:w-48" />

      <InfiniteSlider gap={42} reverse speed={28} speedOnHover={10}>
        {logos.map((logo) =>
          logo.darkSrc ? (
            <span
              key={`logo-${logo.alt}`}
              className="pointer-events-none select-none"
            >
              <img
                alt={logo.alt}
                className="h-16 w-auto md:h-24 dark:hidden"
                loading="lazy"
                decoding="async"
                src={logo.src}
              />
              <img
                alt={logo.alt}
                className="h-16 w-auto md:h-24 hidden dark:block"
                loading="lazy"
                decoding="async"
                src={logo.darkSrc}
              />
            </span>
          ) : (
            <img
              alt={logo.alt}
              className="pointer-events-none h-16 w-auto select-none md:h-24"
              key={`logo-${logo.alt}`}
              loading="lazy"
              decoding="async"
              src={logo.src}
            />
          ),
        )}
      </InfiniteSlider>
    </div>
  );
}
