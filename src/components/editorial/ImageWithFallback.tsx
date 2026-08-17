"use client";

import React, { useState } from "react";

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) return <>{fallback}</>;

  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} />;
}
