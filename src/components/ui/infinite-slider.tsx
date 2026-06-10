'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useMeasure from 'react-use-measure';

type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    duration?: number;
    durationOnHover?: number;
    direction?: 'horizontal' | 'vertical';
    reverse?: boolean;
    className?: string;
    speed?: number;
    speedOnHover?: number;
};

export function InfiniteSlider({
    children,
    gap = 16,
    duration = 25,
    durationOnHover,
    direction = 'horizontal',
    reverse = false,
    className,
    speed,
    speedOnHover,
}: InfiniteSliderProps) {
    const effectiveDuration = speed ? 1000 / speed : duration;
    const effectiveHoverDuration = speedOnHover
        ? 1000 / speedOnHover
        : durationOnHover;

    const [currentDuration, setCurrentDuration] = useState(effectiveDuration);
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        setCurrentDuration(effectiveDuration);
    }, [effectiveDuration]);

    useEffect(() => {
        let controls;
        const contentSize = direction === 'horizontal' ? width : height;
        const from = reverse ? -contentSize : 0;
        const to = reverse ? 0 : -contentSize;

        if (!contentSize) {
            return;
        }

        if (isTransitioning) {
            controls = animate(translation, [translation.get(), to], {
                ease: 'linear',
                duration:
                    currentDuration * Math.abs((translation.get() - to) / contentSize),
                onComplete: () => {
                    setIsTransitioning(false);
                    setKey((prevKey) => prevKey + 1);
                },
            });
        } else {
            controls = animate(translation, [from, to], {
                ease: 'linear',
                duration: currentDuration,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0,
            });
        }

        return controls?.stop;
    }, [
        key,
        translation,
        currentDuration,
        width,
        height,
        gap,
        isTransitioning,
        direction,
        reverse,
    ]);

    const hoverProps = effectiveHoverDuration
        ? {
            onHoverStart: () => {
                setIsTransitioning(true);
                setCurrentDuration(effectiveHoverDuration);
            },
            onHoverEnd: () => {
                setIsTransitioning(true);
                setCurrentDuration(effectiveDuration);
            },
        }
        : {};

    return (
        <div className={cn('overflow-hidden', className)}>
            <motion.div
                className='flex w-max'
                style={{
                    ...(direction === 'horizontal'
                        ? { x: translation }
                        : { y: translation }),
                    flexDirection: direction === 'horizontal' ? 'row' : 'column',
                }}
                {...hoverProps}
            >
                <div
                    ref={ref}
                    className={cn(
                        'flex shrink-0 items-center',
                        direction === 'horizontal' ? 'flex-row' : 'flex-col'
                    )}
                    style={{ gap: `${gap}px` }}
                >
                    {children}
                </div>
                <div
                    aria-hidden="true"
                    className={cn(
                        'flex shrink-0 items-center',
                        direction === 'horizontal' ? 'flex-row' : 'flex-col'
                    )}
                    style={{ gap: `${gap}px` }}
                >
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
