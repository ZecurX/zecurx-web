"use client";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
            <div className="text-center">
                {/* 404 */}
                <h1 className="text-[120px] sm:text-[180px] font-bold tracking-tight leading-none text-white/10 font-manrope">
                    404
                </h1>

                {/* Message */}
                <div className="-mt-8 sm:-mt-12">
                    <h2 className="text-xl sm:text-2xl font-medium text-white mb-2 font-manrope">
                        Page not found
                    </h2>
                    <p className="text-gray-500 text-sm mb-8">
                        The page you're looking for doesn't exist.
                    </p>
                </div>

                {/* Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </Link>
            </div>
        </div>
    );
}
