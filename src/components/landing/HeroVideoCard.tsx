import React from 'react';

export default function HeroVideoCard() {
    return (
        <div className="relative mt-20 w-full max-w-5xl mx-auto aspect-video bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm z-10 flex items-center justify-center group">

            {/* Placeholder / Fallback Content */}
            <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                </div>
                <p className="text-gray-500 font-manrope text-sm">Watch Platform Demo</p>
            </div>

            {/* Optional: Add video tag here if asset is available */}
            {/* <video src="/demo.mp4" className="absolute inset-0 w-full h-full object-cover opacity-50" autoPlay loop muted playsInline /> */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
}
