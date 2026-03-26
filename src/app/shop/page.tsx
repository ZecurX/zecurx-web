import React, { Suspense } from "react";
import { Metadata } from "next";
import { Shield, Zap, Package, ArrowRight } from "lucide-react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import CartIcon from "@/components/shop/CartIcon";
import { query } from "@/lib/db";
import { CartAnimationProvider } from "@/context/CartAnimationContext";
import { ShopHero } from "./shop-hero";

export const metadata: Metadata = {
  title: "Security Hardware Store | ZecurX",
  description:
    "Pro-grade hardware for security research. Authentic penetration testing tools, RFID analyzers, and network auditing equipment.",
  keywords: [
    "security hardware",
    "penetration testing tools",
    "hacking hardware",
    "RFID tools",
    "network auditing",
  ],
  openGraph: {
    title: "Security Hardware Store | ZecurX",
    description:
      "Pro-grade hardware for security research. Authentic penetration testing tools and network auditing equipment.",
    type: "website",
    url: "https://zecurx.com/shop",
  },
  alternates: {
    canonical: "https://zecurx.com/shop",
  },
};

interface ShopProduct {
  id: string;
  name: string;
  price: number | string;
  description: string;
  image: string;
  images?: string[];
  stock: number;
  delivery_days?: number;
  features?: string[];
  tags?: string[];
  created_at: string;
}

async function getProducts() {
  try {
    const result = await query<ShopProduct>(`
            SELECT * FROM products 
            ORDER BY created_at DESC
        `);
    return result.rows;
  } catch {
    // Products fetch error - return empty array to show empty shop
    return [] as ShopProduct[];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <CartAnimationProvider>
      <main className="min-h-screen bg-[#f8fbff] flex flex-col font-sans relative overflow-hidden">
        <CreativeNavBar />

        <div className="fixed bottom-8 right-8 z-50" id="cart-icon-container">
          <CartIcon />
        </div>

        <div className="flex-1 relative z-10 bg-[#f8fbff]">
          <ShopHero />

          <section id="products" className="relative z-10 -mt-10">
            <Suspense
              fallback={
                <div className="max-w-[1320px] mx-auto px-6 py-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-white/40 rounded-3xl h-[400px] animate-pulse border border-slate-200/60"
                      />
                    ))}
                  </div>
                </div>
              }
            >
              <ProductGrid initialProducts={products} />
            </Suspense>
          </section>

          {/* WHY CHOOSE US SECTION */}
          <section className="py-20 md:py-32 border-y border-slate-200/60 bg-white/40 relative z-10 mt-20">
            <div className="max-w-[1320px] mx-auto px-6">
              <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase mb-2 mx-auto">
                  Quality Guaranteed
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-manrope text-[#0c1a2e]">
                  Why Choose <span className="text-[#4c69e4]">ZecurX?</span>
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg font-inter">
                  Verified hardware for serious security professionals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-10px_rgba(74,111,250,0.1)] hover:border-[#4c69e4]/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-[#4c69e4]/10 flex items-center justify-center mb-6 text-[#4c69e4] group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0c1a2e] mb-3 font-manrope">
                    Authentic Hardware
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-inter">
                    Sourced directly from manufacturers like Hak5, Great Scott
                    Gadgets, and more. 100% genuine components guaranteed.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/60 md:col-span-2 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-10px_rgba(74,111,250,0.1)] hover:border-[#4c69e4]/30 transition-all group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c69e4]/5 blur-[80px] rounded-full pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 h-full">
                    <div className="flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-[#4c69e4]/10 flex items-center justify-center mb-6 text-[#4c69e4] group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0c1a2e] mb-3 font-manrope">
                        Instant Knowledge Access
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-6 font-inter">
                        Every hardware purchase comes with exclusive access to
                        ZecurX Academy tutorials, setup guides, and attack vectors
                        for that specific tool.
                      </p>
                      <a
                        href="/academy"
                        className="inline-flex items-center text-sm font-bold text-[#4c69e4] group-hover:translate-x-1 transition-transform"
                      >
                        View Academy Preview{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_-10px_rgba(74,111,250,0.1)] hover:border-[#4c69e4]/30 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0c1a2e] mb-3 font-manrope">
                    Discreet Shipping
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-inter">
                    Plain packaging for privacy. Tracked express shipping across
                    India. Your operational security is our priority.
                  </p>
                </div>

                <div className="md:col-span-2 relative p-10 md:p-12 rounded-3xl border border-[#4c69e4]/20 bg-gradient-to-br from-[#f8fbff] to-blue-50/50 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                  <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4c69e410_1px,transparent_1px),linear-gradient(to_bottom,#4c69e410_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
                  </div>
                  <div className="relative z-10 flex-1">
                    <h3 className="text-2xl font-bold text-[#0c1a2e] mb-2 font-manrope">
                      Need a Custom Loadout?
                    </h3>
                    <p className="text-slate-600 font-inter">
                      Contact our sales team for bulk orders or enterprise kits.
                    </p>
                  </div>
                  <div className="relative z-10">
                    <a
                      href="/contact"
                      className="relative inline-flex items-center justify-center gap-2 bg-[#4c69e4] text-white rounded-full px-8 py-4 text-[15px] font-semibold font-inter cursor-pointer border border-transparent hover:translate-y-[-3px] hover:shadow-[0px_5px_0px_0px_#92c4fd] transition-all duration-200 whitespace-nowrap"
                    >
                      Contact Sales
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </CartAnimationProvider>
  );
}