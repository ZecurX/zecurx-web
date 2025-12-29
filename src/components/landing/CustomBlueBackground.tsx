import React from 'react';
import { imgTexture } from './assets';

export default function CustomBlueBackground() {
    return (
        <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none select-none">

            {/* Left Blue Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow -translate-x-1/2" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-700 -translate-x-1/2" />

            {/* Right Blue Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000 translate-x-1/2" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-500 translate-x-1/2" />

            {/* Center Connecting Beam (Subtle) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gradient-to-r from-transparent via-blue-900/10 to-transparent blur-3xl opacity-50" />

            {/* Noise Overlay */}
            <div
                className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url('${imgTexture}')`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px'
                }}
            />

        </div>
    );
}
