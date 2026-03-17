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
    <div className="relative mx-auto max-w-3xl overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-sky-200/45 to-transparent sm:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-sky-200/45 to-transparent sm:w-48" />

      <InfiniteSlider gap={42} reverse speed={28} speedOnHover={10}>
        {logos.map((logo) => (
          <img
            key={`logo-${logo.alt}`}
            alt={logo.alt}
            className="pointer-events-none h-16 w-auto select-none md:h-24 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            loading="lazy"
            decoding="async"
            src={logo.darkSrc ?? logo.src}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}
