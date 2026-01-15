import type { Metadata } from "next";
import { Manrope, Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pixelify = localFont({
  src: "../../public/fonts/PixelifySans.ttf",
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zecurx.com'),
  title: {
    default: "ZecurX - Advanced Cybersecurity Solutions & Threat Intelligence",
    template: "%s | ZecurX"
  },
  description: "ZecurX delivers cutting-edge cybersecurity solutions including threat intelligence, endpoint security, cloud protection, zero-trust architecture, and professional security training with ISO-verified certifications.",
  keywords: ["cybersecurity", "threat intelligence", "endpoint security", "cloud security", "zero trust", "penetration testing", "security automation", "AI security", "ransomware defense", "compliance", "VAPT", "cybersecurity training", "ethical hacking certification", "cybersecurity courses", "penetration testing certification", "security certifications", "cybersecurity academy"],
  authors: [{ name: "ZecurX Security Team" }],
  creator: "ZecurX",
  publisher: "ZecurX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zecurx.com",
    siteName: "ZecurX",
    title: "ZecurX - Advanced Cybersecurity Solutions & Threat Intelligence",
    description: "Cutting-edge cybersecurity solutions including threat intelligence, endpoint security, cloud protection, zero-trust architecture, and professional security training with ISO-verified certifications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZecurX - Advanced Cybersecurity Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZecurX - Advanced Cybersecurity Solutions & Threat Intelligence",
    description: "Cutting-edge cybersecurity solutions including threat intelligence, endpoint security, cloud protection, zero-trust architecture, and professional security training with ISO-verified certifications.",
    images: ["/og-image.png"],
    creator: "@zecurx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/zecurx-logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/zecurx-logo.png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://zecurx.com",
  },
};

import NextTopLoader from 'nextjs-toploader';
import { StructuredData, getOrganizationSchema, getWebSiteSchema } from '@/components/seo/StructuredData';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={getOrganizationSchema()} />
        <StructuredData data={getWebSiteSchema()} />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable} ${pixelify.variable} antialiased`}
      >
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

