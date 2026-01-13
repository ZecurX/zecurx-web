'use client';

import { useEffect } from 'react';

export default function ViewIncrement({ slug }: { slug: string }) {
  useEffect(() => {
    // Call API to increment view count
    // We can use the public API route which handles this
    fetch(`/api/blog/${slug}`);
  }, [slug]);

  return null;
}
