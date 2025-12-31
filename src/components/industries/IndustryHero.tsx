"use client";

import React from 'react';
import { motion } from "framer-motion";

export default function IndustryHero() {

  return (
    <section className="relative w-full min-h-[90vh] bg-background overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Industry-Specific Security
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/50 mb-8 relative z-20">
            Securing <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Critical Infrastructure</span> <br className="hidden md:block" /> Across Every Sector.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-manrope font-light leading-relaxed max-w-3xl mx-auto mb-12">
            Cloud adoption and digital transformation have created unique cybersecurity needs for each industry. ZecurX delivers tailored protection for your specific threat landscape.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
