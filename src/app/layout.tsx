import type { Metadata } from "next";
import { Manrope, Inter, Space_Grotesk, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/context/CartContext";

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

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zecurx.com'),
  title: {
    default: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
    template: "%s | ZecurX"
  },
  description: "Security that helps you ship faster. We help startups, SMEs, and AI teams secure applications, cloud infrastructure, and AI systems with practical, real-world security testing.",
  keywords: ["cybersecurity services", "penetration testing", "application security", "cloud security", "AI security", "DevSecOps", "compliance", "VAPT", "cybersecurity training", "ethical hacking certification", "security assessment"],
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
    title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
    description: "Security that helps you ship faster. Practical security testing for applications, cloud infrastructure, and AI systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZecurX - Cybersecurity Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZecurX - Cybersecurity Services for Startups, SMEs & AI Teams",
    description: "Security that helps you ship faster. Practical security testing for applications, cloud infrastructure, and AI systems.",
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
        className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable} ${pixelify.variable} ${newsreader.variable} antialiased`}
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
          <CartProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

