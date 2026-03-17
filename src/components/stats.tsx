'use client'

import { motion } from 'motion/react'
import { Zap, ShieldCheck, Wrench } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    phrase: '72-Hour Delivery',
    detail: 'Most assessments completed and reported within 3 days.',
  },
  {
    icon: ShieldCheck,
    phrase: 'Manual-First Testing',
    detail: 'Real engineers, not just scanners. Every finding is verified.',
  },
  {
    icon: Wrench,
    phrase: 'Fix Support Included',
    detail: 'Code-level remediation guidance with every report.',
  },
]

export function Stats() {
  return (
    <section className="relative py-20 md:py-28 bg-sky-50/60 overflow-hidden">
      {/* Faint center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(59,130,246,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8">
        {/* Horizontal line with centered label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200" />
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60 whitespace-nowrap">
            Why teams choose us
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200" />
        </div>

        {/* 3 cards — clean, airy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {benefits.map((b, i) => (
            <motion.div
              key={b.phrase}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0, 0, 1] }}
              className="group relative"
            >
              {/* Numbered accent */}
              <span className="text-[11px] font-mono text-muted-foreground/30 tracking-widest">
                0{i + 1}
              </span>

              {/* Icon + title row */}
              <div className="flex items-center gap-3 mt-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-blue-50">
                  <b.icon className="w-4 h-4 text-slate-500 transition-colors duration-300 group-hover:text-blue-500" />
                </div>
                <h3
                  className="text-[15px] font-manrope font-semibold text-foreground"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {b.phrase}
                </h3>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-12">
                {b.detail}
              </p>

              {/* Bottom accent line — expands on hover */}
              <div className="mt-5 pl-12">
                <div className="h-px w-8 bg-slate-200 transition-all duration-500 group-hover:w-16 group-hover:bg-blue-400/40" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
