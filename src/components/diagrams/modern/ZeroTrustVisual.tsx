"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Smartphone, Server, Check } from 'lucide-react';

export function ZeroTrustVisual() {
    return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
            {/* Central Hub (Zero Trust Engine) */}
            <div className="relative z-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-primary/30 w-32 h-32 -m-8"
                />
                <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                    <Shield className="w-8 h-8 text-primary" />
                </div>
                
                {/* Status Indicator */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="px-3 py-1 rounded-full bg-background/80 border border-primary/30 text-[10px] font-mono text-primary flex items-center gap-2 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        POLICY ENGINE ACTIVE
                    </div>
                </div>
            </div>

            {/* Connecting Nodes */}
            <Node 
                icon={User} 
                label="User Identity" 
                angle={0} 
                delay={0} 
                status="verified"
            />
            <Node 
                icon={Smartphone} 
                label="Device Health" 
                angle={72} 
                delay={1} 
                status="scanning"
            />
            <Node 
                icon={Lock} 
                label="Context" 
                angle={144} 
                delay={2} 
                status="verified"
            />
            <Node 
                icon={Server} 
                label="App Resource" 
                angle={216} 
                delay={3} 
                status="locked"
            />
            <Node 
                icon={NetworkIcon} 
                label="Network" 
                angle={288} 
                delay={4} 
                status="verified"
            />

            {/* Scanning Radar Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-primary/5" />
            </div>
        </div>
    );
}

function Node({ icon: Icon, label, angle, delay, status }: any) {
    const radius = 140; // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay * 0.2, duration: 0.5 }}
            className="absolute z-20 flex flex-col items-center gap-2"
            style={{ 
                left: `calc(50% + ${x}px)`, 
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </div>
                {/* Connection Line */}
                <svg className="absolute top-1/2 left-1/2 w-[140px] h-[2px] -z-10 overflow-visible" style={{ 
                    transform: `translate(-50%, -50%) rotate(${angle + 180}deg)`,
                    transformOrigin: 'center'
                }}>
                    <line x1="20" y1="0" x2="120" y2="0" stroke="currentColor" strokeWidth="1" className="text-border/30" strokeDasharray="4 4" />
                    <motion.circle 
                        r="2" 
                        fill="currentColor" 
                        className="text-primary"
                        animate={{ cx: [120, 20] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: delay * 0.5 }}
                    />
                </svg>
                
                {status === 'verified' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                        <Check className="w-2 h-2 text-white" />
                    </div>
                )}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-background/80 px-2 py-0.5 rounded-full border border-border/50">
                {label}
            </span>
        </motion.div>
    );
}

// Simple Network Icon since Lucide 'Network' might conflict or be missing in older versions
function NetworkIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="16" y="16" width="6" height="6" rx="1" />
            <rect x="2" y="16" width="6" height="6" rx="1" />
            <rect x="9" y="2" width="6" height="6" rx="1" />
            <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
            <path d="M12 12V8" />
        </svg>
    )
}
