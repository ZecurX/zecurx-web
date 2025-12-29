"use client";

import { motion, useInView, UseInViewOptions, HTMLMotionProps } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    once?: boolean;
    offset?: number;
}

export const ScrollReveal = ({
    children,
    width = "fit-content",
    delay = 0,
    duration = 0.5,
    threshold = 0.2, // Default threshold
    className,
    once = true,
    offset = 20, // y-offset
    ...props
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: once,
        amount: threshold
    });

    return (
        <div ref={ref} style={{ width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: offset },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration, delay, ease: "easeOut" }}
                className={cn(className)}
                {...props}
            >
                {children}
            </motion.div>
        </div>
    );
};
