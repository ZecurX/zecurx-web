import React from 'react';
import { imgIcon } from './assets';
import { ChevronDown } from 'lucide-react';

export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
            <div className="flex items-center gap-12 bg-black/40 backdrop-blur-md rounded-full pl-6 pr-2 py-2 border border-blue-500/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">

                {/* Logo */}
                <div className="flex items-center gap-3 mr-6">
                    <img src="/logo_new.png" alt="ZecurX" className="w-10 h-10 object-contain" />
                    <span className="font-manrope font-extrabold text-white text-2xl tracking-tight hidden lg:block">ZecurX</span>
                </div>

                {/* Menu Items (Desktop) */}
                <div className="hidden md:flex items-center gap-1">

                    <a href="#" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1c2333] text-blue-200 border border-blue-500/30 transition-all hover:bg-[#252d40]">
                        <ChevronDown className="w-3 h-3" />
                        <span className="text-sm font-inter">home</span>
                    </a>

                    <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-colors group">
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                        <span className="text-sm font-inter">solutions</span>
                    </a>

                    <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-colors group">
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                        <span className="text-sm font-inter">services</span>
                    </a>

                    <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-colors group">
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                        <span className="text-sm font-inter">industries</span>
                    </a>

                    <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-colors group">
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                        <span className="text-sm font-inter whitespace-nowrap">why zecurx</span>
                    </a>

                    <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-colors group">
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                        <span className="text-sm font-inter">resources</span>
                    </a>

                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Button pushed to the right, maybe slightly separated if desired, but kept inside the pill as per modern trends or separated if strict design. 
               The original image shows a long pill. I'll keep them inside for a cohesive look or outside if the user prefers. 
               Looking at the image, it seems it's ONE big container. 
               Wait, the image shows "home" having a specific dark blueish background. 
           */}

                    <button className="ml-4 bg-white text-black text-sm font-manrope font-semibold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity">
                        contact
                    </button>
                </div>

            </div>
        </nav>
    );
}
