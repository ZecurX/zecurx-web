import { cn } from "@/lib/utils"

interface SectionHeaderProps {
    title: string
    subtitle?: string
    className?: string
    center?: boolean
}

export function SectionHeader({ title, subtitle, className, center = false }: SectionHeaderProps) {
    return (
        <div className={cn("mb-12 md:mb-16 max-w-3xl", center && "mx-auto text-center flex flex-col items-center", className)}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
                {title}
            </h2>
            <div className={cn("w-12 h-0.5 bg-accent mb-6", center && "mx-auto")} />
            {subtitle && (
                <p className="text-lg text-text-secondary leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
