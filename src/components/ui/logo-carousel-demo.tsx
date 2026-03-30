'use client';

import Image from 'next/image';
import { getCdnUrl } from '@/lib/cdn';
import { InfiniteSlider } from './infinite-slider';

const logos = [
  { src: getCdnUrl('logos/GURUDEV.webp'), alt: 'Gurudev', size: '' },
  {
    src: `${getCdnUrl('logos/HONEY-HERBAL.webp')}?v=4`,
    alt: 'Honey Herbal',
    size: 'large',
  },
  { src: getCdnUrl('logos/IBM.webp'), alt: 'IBM', size: 'large' },
  { src: getCdnUrl('logos/MATEX.webp'), alt: 'Matex', size: 'large' },
  { src: getCdnUrl('logos/my-garden-v3.webp'), alt: 'My Garden', size: '' },
  {
    src: getCdnUrl('logos/st-claret-college.webp'),
    alt: 'St. Claret College',
    size: '',
  },
];

export function LogoCarouselBasic() {
  return (
    <section className="relative z-10 w-full pt-8 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-12">
      <div className="max-w-[90rem] mx-auto">
        <p className="text-center text-muted-foreground text-sm font-medium mb-8">
          Trusted by
        </p>
        <InfiniteSlider gap={48} duration={30} durationOnHover={60}>
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center group shrink-0"
            >
              <Image
                src={logo.src!}
                alt={logo.alt}
                width={200}
                height={72}
                className={`${logo.size === 'large' ? 'h-16 md:h-20' : 'h-12 md:h-14'} w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300`}
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
