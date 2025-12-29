"use client";
import React, { useState } from 'react';
import { imgGroup218 } from './assets';
import { ChevronRight } from 'lucide-react';

const capabilities = [
    {
        id: 1,
        title: "Endpoint Security",
        description: "Protect endpoints against sophisticated and persistent threats"
    },
    {
        id: 2,
        title: "Cloud Security (CNAPP)",
        description: "Secure cloud workloads, configurations, and cloud identities"
    },
    {
        id: 3,
        title: "Identity & Access Security",
        description: "Enforce least-privilege access and prevent identity abuse"
    },
    {
        id: 4,
        title: "Application Security",
        description: "Secure applications across the entire development lifecycle"
    },
    {
        id: 5,
        title: "Threat Intelligence & Hunting",
        description: "Proactively identify threats using real adversary intelligence"
    },
    {
        id: 6,
        title: "AI Detection & Response",
        description: "Accelerated detection powered by intelligent analytics"
    },
    {
        id: 7,
        title: "Security Automation (SOAR)",
        description: "Automated response workflows to reduce response time and impact"
    },
    {
        id: 8,
        title: "Data Protection",
        description: "Safeguard sensitive data across systems, platforms, and environments"
    }
];

export default function PlatformCapabilitiesSection() {
    const [activeIndex, setActiveIndex] = useState(1); // Default to index 1 (Cloud Security) to match design

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-manrope font-medium text-gray-300">
                        A Unified Enterprise Security Platform
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-3xl mx-auto text-lg">
                        A consolidated security approach that improves visibility, reduces operational complexity, and strengthens resilience across your digital ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Capability List */}
                    <div className="space-y-2">
                        {capabilities.map((cap, i) => {
                            const isActive = i === activeIndex;
                            return (
                                <div
                                    key={i}
                                    className="group cursor-pointer flex items-center justify-between py-2"
                                    onClick={() => setActiveIndex(i)}
                                    onMouseEnter={() => setActiveIndex(i)}
                                >
                                    <h3 className={`text-2xl md:text-4xl font-manrope font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-zinc-800 hover:text-zinc-600'}`}>
                                        {cap.title}
                                    </h3>
                                    {isActive && (
                                        <ChevronRight className="w-6 h-6 text-white opacity-0 animate-fadeIn" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Feature Showcase Card */}
                    <div className="relative lg:pl-10">
                        <div className="sticky top-32">
                            <div className="relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl p-8 md:p-12 h-[520px] flex flex-col justify-between group">

                                {/* Dynamic Background Gradient */}
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-400/20 transition-colors duration-700"></div>

                                <div>
                                    {/* Tech Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                                        CAPABILITY_ID_{capabilities[activeIndex].id.toString().padStart(2, '0')}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-3xl md:text-5xl font-manrope font-semibold text-white mb-6 animate-fadeIn key={activeIndex}">
                                        {capabilities[activeIndex].title}
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-relaxed max-w-md animate-fadeIn delay-100 key={activeIndex + 'desc'}">
                                        {capabilities[activeIndex].description}
                                    </p>
                                </div>

                                {/* Interactive Bottom Area */}
                                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center animate-fadeIn delay-200">
                                    <button
                                        onClick={handleScrollToContact}
                                        className="bg-white text-black px-6 py-3 rounded-full font-manrope font-semibold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        Book a Demo
                                        <img src={imgGroup218} alt="" className="w-4 h-4" />
                                    </button>
                                    <button className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 transition-colors group/btn">
                                        Explore Feature
                                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
