'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import { NumberTicker } from '@/components/ui/number-ticker'

const stats = [
  { value: 50, suffix: '+', label: 'Companies Secured' },
  { value: 500, suffix: '+', label: 'Vulnerabilities Found' },
  { value: 99.9, suffix: '%', label: 'Client Satisfaction', decimalPlaces: 1 },
  { value: 72, suffix: 'h', label: 'Avg. Assessment Delivery' },
]

export function Stats() {
  return (
    <section className='py-16 md:py-20 bg-card border-y border-border'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <BlurFade key={stat.label} inView={true} delay={0.1 * index}>
              <div className='text-center'>
                <div className='text-3xl md:text-4xl font-manrope font-bold text-foreground'>
                  <NumberTicker
                    value={stat.value}
                    delay={0.2}
                    decimalPlaces={stat.decimalPlaces ?? 0}
                  />
                  <span className='text-primary'>{stat.suffix}</span>
                </div>
                <p className='text-sm text-muted-foreground mt-1 font-inter'>
                  {stat.label}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
