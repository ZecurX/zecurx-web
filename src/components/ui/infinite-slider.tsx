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
    speed?: number; // Added speed prop matching usage
    speedOnHover?: number; // Added speedOnHover prop matching usage
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
    const [currentDuration, setCurrentDuration] = useState(duration);
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [key, setKey] = useState(0);

    // Allow speed to override duration if provided (rough conversion)
    useEffect(() => {
        if (speed) {
            setCurrentDuration(speed > 0 ? 1000 / speed : 25);
        }
    }, [speed]);


    useEffect(() => {
        let controls;
        const size = direction === 'horizontal' ? width : height;
        const contentSize = size + gap;
        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;

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
                onRepeat: () => {
                    translation.set(from);
                },
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

    const hoverProps = durationOnHover || speedOnHover
        ? {
            onHoverStart: () => {
                setIsTransitioning(true);
                // If speedOnHover is used, convert to duration (approximate logic, or just use durationOnHover)
                // For now, let's assume usage passes durationOnHover or we mapping speed to it if needed.
                // The snippet provided used `speed` and `speedOnHover`.
                // Let's defer to the user's snippet logic.
                // Actually, the user snippet for `LogoCloud` passes `speed` and `speedOnHover`.
                // The implementation of `InfiniteSlider` provided by the user uses `duration`.
                // This is a mismatch in the user's prompt (usage vs implementation).
                // I will adapt the implementation to accept partial speed or mapping.
                if (speedOnHover) setCurrentDuration(1000 / speedOnHover);
                else if (durationOnHover) setCurrentDuration(durationOnHover);
            },
            onHoverEnd: () => {
                setIsTransitioning(true);
                if (speed) setCurrentDuration(1000 / speed);
                else setCurrentDuration(duration);
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
                    gap: `${gap}px`,
                    flexDirection: direction === 'horizontal' ? 'row' : 'column',
                }}
                ref={ref}
                {...hoverProps}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}
