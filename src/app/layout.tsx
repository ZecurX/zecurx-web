import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import NextTopLoader from 'nextjs-toploader';
import Analytics from "@/components/Analytics";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schemas";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pixelify = localFont({
  src: "../../public/fonts/PixelifySans.ttf",
  variable: "--font-pixel",
  display: "swap",
});

// Site-wide metadata defaults
const BASE_URL = "https://zecurx.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  
  // Basic metadata
  title: {
    default: "ZecurX - Advanced Cybersecurity Solutions & Training Academy | India",
    template: "%s | ZecurX",
  },
  description: "ZecurX provides advanced cybersecurity solutions, penetration testing (VAPT), vulnerability assessment, and ISO certified security training in India. 1200+ students trained, 95% pass rate. Expert VAPT services for enterprises.",
  keywords: [
    "cybersecurity",
    "penetration testing",
    "VAPT",
    "vulnerability assessment",
    "ethical hacking course",
    "cybersecurity training India",
    "security consulting",
    "ISO certified cybersecurity",
    "zxCPEH",
    "zxCPPT",
    "red team services",
    "cloud security",
    "application security",
    "DevSecOps",
    "security training academy",
    "cyber security courses India",
    "CEH alternative",
    "penetration testing services India"
  ],
  
  // Authors and creator
  authors: [{ name: "ZecurX", url: BASE_URL }],
  creator: "ZecurX",
  publisher: "ZecurX",
  
  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US", "en_GB"],
    url: BASE_URL,
    siteName: "ZecurX",
    title: "ZecurX - Advanced Cybersecurity Solutions & Training Academy",
    description: "Advanced cybersecurity solutions, VAPT services, and ISO certified security training. Trusted by enterprises for penetration testing, vulnerability assessment, and professional security courses.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ZecurX - Cybersecurity Solutions & Training Academy",
        type: "image/png",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@zecurx",
    creator: "@zecurx",
    title: "ZecurX - Advanced Cybersecurity Solutions & Training",
    description: "Advanced cybersecurity solutions, VAPT services, and ISO certified security training in India.",
    images: [`${BASE_URL}/og-image.png`],
  },
  
  // Alternate languages
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "en": BASE_URL,
    },
  },
  
  // App icons and manifest
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
    ],
  },
  manifest: "/site.webmanifest",
  
  // Verification (add your actual verification codes)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    // yandex: "",
    // yahoo: "",
  },
  
  // Category
  category: "technology",
  
  // Classification
  classification: "Cybersecurity Services, Training Academy, VAPT",
  
  // Other metadata
  other: {
    "geo.region": "IN",
    "geo.country": "India",
    "rating": "general",
    "revisit-after": "7 days",
    "author": "ZecurX",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate JSON-LD structured data
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical images for LCP */}
        <link
          rel="preload"
          href="/images/dashboard-hero.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/images/dashboard-hero-light.png"
          as="image"
          type="image/png"
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* JSON-LD Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* JSON-LD Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable} ${pixelify.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Analytics />
        
        {/* Top Loading Bar */}
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
        
        {/* Theme and Scroll Providers */}
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
