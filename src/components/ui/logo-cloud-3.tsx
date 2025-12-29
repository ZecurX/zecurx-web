import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
    logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
    return (
        <div
            {...props}
            className={cn(
                "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
                className
            )}
        >
            {/* Adjusted speed mapping: The user snippet used speed={80}, but the logic uses duration. 
            I'll stick to passing props as requested, assuming my modified slider can handle it or ignoring mismatch for now. 
            Actually, I modified slider to try to use speed. */}
            <InfiniteSlider gap={42} reverse speed={80} speedOnHover={25}>
                {logos.map((logo) => (
                    <img
                        alt={logo.alt}
                        className="pointer-events-none h-4 select-none md:h-5 brightness-0 dark:invert opacity-70 hover:opacity-100 transition-opacity"
                        height={logo.height || "auto"}
                        key={`logo-${logo.alt}`}
                        loading="lazy"
                        src={logo.src}
                        width={logo.width || "auto"}
                    />
                ))}
            </InfiniteSlider>
        </div>
    );
}
