"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

const LandingCard = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ className, ...props }, ref) => (
        <motion.div
            ref={ref}
            whileHover={{ y: -4 }}
            className={cn(
                "bg-bg-card border border-border rounded-xl p-6 md:p-8 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.06)] transition-all duration-300",
                className
            )}
            {...props}
        />
    )
)
LandingCard.displayName = "LandingCard"

export { LandingCard }
