'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartIcon() {
    const { totalItems } = useCart();

    return (
        <Link href="/cart" className="relative group">
            <div className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <ShoppingCart className="w-6 h-6" />
                
                <AnimatePresence>
                    {totalItems > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"
                        >
                            {totalItems > 9 ? '9+' : totalItems}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Link>
    );
}
