"use client";

import React from "react";
import { motion, UseInViewOptions, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

interface ScrollAnimationProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    viewport?: UseInViewOptions;
    delay?: number;
    direction?: Direction;
    duration?: number;
}

export const ScrollAnimation = ({
    children,
    className,
    variants,
    viewport = { amount: 0.3, margin: "0px", once: true },
    delay = 0,
    direction = "down",
    duration = 0.5,
}: ScrollAnimationProps) => {
    const getDirectionVariants = (direction: Direction): Variants => {
        const distance = 20;

        switch (direction) {
            case "up":
                return {
                    hidden: { opacity: 0, y: distance },
                    visible: { opacity: 1, y: 0 },
                };
            case "down":
                return {
                    hidden: { opacity: 0, y: -distance },
                    visible: { opacity: 1, y: 0 },
                };
            case "left":
                return {
                    hidden: { opacity: 0, x: distance },
                    visible: { opacity: 1, x: 0 },
                };
            case "right":
                return {
                    hidden: { opacity: 0, x: -distance },
                    visible: { opacity: 1, x: 0 },
                };
            default:
                return {
                    hidden: { opacity: 0, y: distance },
                    visible: { opacity: 1, y: 0 },
                };
        }
    };

    const baseVariants = variants || getDirectionVariants(direction);

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={baseVariants}
            transition={{
                duration,
                delay,
                ease: "easeOut",
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
};
