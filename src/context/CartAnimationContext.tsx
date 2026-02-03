'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingItem {
    id: number;
    image: string;
    startRect: { x: number; y: number; width: number; height: number };
    targetRect: { x: number; y: number; width: number; height: number };
}

interface CartAnimationContextType {
    fly: (startEl: HTMLElement, image: string) => void;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export function CartAnimationProvider({ children }: { children: ReactNode }) {
    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

    const fly = useCallback((startEl: HTMLElement, image: string) => {
        const startRect = startEl.getBoundingClientRect();
        const cartEl = document.getElementById('cart-icon-container');
        
        if (!cartEl) return;
        
        const targetRect = cartEl.getBoundingClientRect();
        
        const newItem: FlyingItem = {
            id: Date.now(),
            image,
            startRect: {
                x: startRect.left,
                y: startRect.top,
                width: startRect.width,
                height: startRect.height
            },
            targetRect: {
                x: targetRect.left + (targetRect.width / 2),
                y: targetRect.top + (targetRect.height / 2),
                width: 24,
                height: 24
            }
        };

        setFlyingItems(prev => [...prev, newItem]);
        
        // Remove after animation
        setTimeout(() => {
            setFlyingItems(prev => prev.filter(item => item.id !== newItem.id));
        }, 1000);
    }, []);

    return (
        <CartAnimationContext.Provider value={{ fly }}>
            {children}
            {/* Animation Layer */}
            <div className="fixed inset-0 pointer-events-none z-[100]">
                <AnimatePresence>
                    {flyingItems.map(item => (
                        <motion.img
                            key={item.id}
                            src={item.image}
                            initial={{ 
                                x: item.startRect.x, 
                                y: item.startRect.y,
                                width: item.startRect.width,
                                height: item.startRect.height,
                                opacity: 0.8,
                                scale: 1
                            }}
                            animate={{ 
                                x: item.targetRect.x - 12, // Center the target
                                y: item.targetRect.y - 12,
                                width: 24,
                                height: 24,
                                opacity: 0.5,
                                scale: 0.5,
                                rotate: 360
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ 
                                duration: 0.8,
                                ease: "easeInOut"
                                // type: "spring", stiffness: 50, damping: 15
                            }}
                            className="absolute object-cover rounded-lg shadow-xl"
                            style={{ position: 'fixed' }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </CartAnimationContext.Provider>
    );
}

export function useCartAnimation() {
    const context = useContext(CartAnimationContext);
    if (!context) {
        throw new Error('useCartAnimation must be used within CartAnimationProvider');
    }
    return context;
}
