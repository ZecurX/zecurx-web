'use client';

import Image from 'next/image';
import { getCdnUrl } from '@/lib/cdn';
import { InfiniteSlider } from './infinite-slider';

const baseLogos = [
  { src: getCdnUrl('logos/GURUDEV.webp'), alt: 'Gurudev', size: '' },
  {
    src: `${getCdnUrl('logos/HONEY-HERBAL.webp')}?v=4`,
    alt: 'Honey Herbal',
    size: 'large',
  },
  { src: getCdnUrl('logos/IBM.webp'), alt: 'IBM', size: 'large' },
  { src: getCdnUrl('logos/MATEX.webp'), alt: 'Matex', size: 'large' },
  { src: getCdnUrl('logos/my-garden-v3.webp'), alt: 'My Garden', size: '' },
];

const logos = Array.from({ length: 4 }, () => baseLogos).flat();

export function LogoCarouselBasic() {
  return (
    <section className="relative z-10 w-full pt-4 sm:pt-8 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-12">
      <div className="max-w-[90rem] mx-auto text-center">
        <p className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-[14px] py-1 text-xs font-medium tracking-[0.24em] uppercase mb-4 sm:mb-6">
          Trusted by
        </p>
        <InfiniteSlider gap={18} duration={30} durationOnHover={60} className="mt-[-4px] sm:mt-0">
          {logos.map((logo, index) => (
            <div
              key={`${logo.alt}-${index}`}
              className="flex items-center justify-center group shrink-0"
            >
              <Image
                src={logo.src!}
                alt={logo.alt}
                width={200}
                height={72}
                className={`
                  ${logo.size === 'large' ? 'h-24 md:h-32' : 'h-20 md:h-24'}
                  w-auto object-contain
                  grayscale-0 opacity-100
                  lg:grayscale lg:opacity-50
                  lg:hover:grayscale-0
                  lg:hover:opacity-100
                  transition-all duration-300
                `}
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
