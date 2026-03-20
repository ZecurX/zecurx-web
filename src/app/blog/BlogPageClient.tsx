"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { calculateReadingTime, formatBlogDate } from "@/lib/blog-utils";
import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

interface BlogLabel {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface BlogAuthor {
  name: string;
  email: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  published_at?: string;
  labels: Array<{ blog_labels: BlogLabel }>;
  author?: BlogAuthor;
}

interface BlogPageClientProps {
  posts?: BlogPost[];
  allLabels?: BlogLabel[];
  page?: number;
  totalPages?: number;
  search?: string;
  labelSlug?: string;
  error?: "label_not_found" | "fetch_failed";
}

export function BlogPageClient({
  posts,
  allLabels,
  page = 1,
  totalPages = 1,
  search = "",
  labelSlug = "",
  error,
}: BlogPageClientProps) {
  if (error === "label_not_found" || error === "fetch_failed") {
    return (
      <div className="bg-[#f8fbff] min-h-screen relative overflow-hidden pt-32 pb-24 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4a6ffa]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
          <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
        </div>

        <BlurFade delay={0.2}>
          <div className="relative z-10 text-center p-8 lg:p-12 glass-card border border-slate-200/60 rounded-3xl max-w-lg mx-auto shadow-[0_18px_44px_rgba(30,58,95,0.05)] bg-white/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f8fbff] border border-blue-100 mb-6">
              {error === "label_not_found" ? (
                <Search className="w-8 h-8 text-[#4a6ffa]" />
              ) : (
                <TrendingUp className="w-8 h-8 text-[#4a6ffa]" />
              )}
            </div>
            <h2 className="text-3xl font-bold font-manrope mb-4 text-[#0c1a2e]">
              {error === "label_not_found" ? "Label Not Found" : "Temporarily Unavailable"}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-inter">
              {error === "label_not_found" 
                ? "The requested category could not be found." 
                : "We're currently unable to load the blog posts. Please try again later."}
            </p>
          </div>
        </BlurFade>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fbff] min-h-screen relative overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4a6ffa]/10 blur-[120px] rounded-full mix-blend-multiply opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-blue-300/10 blur-[100px] rounded-full mix-blend-multiply opacity-60 pointer-events-none" />
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <BlurFade delay={0.1}>
          <div className="flex justify-center mb-6">
            <Link href="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#4a6ffa] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-inter font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Back to Resources</span>
            </Link>
          </div>
        </BlurFade>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <BlurFade delay={0.2}>
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center bg-[#1e3a5f] text-white font-space-grotesk rounded-md px-3 py-1 text-xs font-medium tracking-widest uppercase">
                SECURITY BLOG
              </span>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.3}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-manrope text-[#0c1a2e] mb-6 tracking-tight leading-[1.1]">
              Intelligence <span className="text-[#4a6ffa]">Hub</span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.4}>
            <p className="text-lg text-slate-600 font-inter leading-relaxed">
              Expert analysis, threat intelligence, and industry insights from the ZecurX security team.
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.5}>
          <div className="mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between p-4 lg:p-6 bg-white/80 border border-slate-200/60 rounded-3xl backdrop-blur-xl shadow-[0_18px_44px_rgba(30,58,95,0.05)]">
              {/* Mobile: Horizontal Scroll, Desktop: Wrap */}
              <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
                <div className="flex lg:flex-wrap gap-2 lg:gap-3 min-w-max lg:min-w-0">
                  <Link
                    href="/blog"
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-inter font-medium transition-all duration-300 whitespace-nowrap",
                      !labelSlug
                        ? "bg-[#4a6ffa] text-white shadow-md border border-transparent"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0c1a2e] border border-slate-200",
                    )}
                  >
                    All Posts
                  </Link>
                  {allLabels?.map((label) => (
                    <Link
                      key={label.id}
                      href={`/blog?label=${label.slug}${search ? `&search=${search}` : ""}`}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-inter font-medium transition-all duration-300 whitespace-nowrap",
                        labelSlug === label.slug
                          ? "bg-[#4a6ffa] text-white shadow-md border border-transparent"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0c1a2e] border border-slate-200",
                      )}
                    >
                      {label.name}
                    </Link>
                  ))}
                </div>
              </div>

              <form className="relative w-full lg:w-80 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search articles..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4a6ffa]/20 focus:border-[#4a6ffa] text-sm font-inter transition-all placeholder:text-slate-400 text-[#0c1a2e]"
                />
                {labelSlug && (
                  <input type="hidden" name="label" value={labelSlug} />
                )}
              </form>
            </div>
          </div>
        </BlurFade>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post, index) => (
              <BlurFade key={post.id} delay={0.2 + (0.1 * index)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group h-full flex flex-col glass-card bg-white/50 border border-slate-200/60 rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[0_18px_44px_rgba(30,58,95,0.05)] hover:shadow-[0_20px_55px_rgba(30,58,95,0.12)] relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a6ffa]/5 blur-[40px] rounded-full group-hover:bg-[#4a6ffa]/10 transition-colors pointer-events-none z-0" />
                  
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden z-10 m-2 rounded-2xl">
                    {post.featured_image_url ? (
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f8fbff] flex items-center justify-center border border-blue-50">
                        <TrendingUp className="w-12 h-12 text-[#4a6ffa]/30" />
                      </div>
                    )}

                    {post.labels.length > 0 && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                        {post.labels.slice(0, 2).map((l) => (
                          <span
                            key={l.blog_labels.id}
                            className="px-3 py-1 text-[11px] font-space-grotesk font-semibold uppercase tracking-widest text-white rounded-full shadow-sm"
                            style={{ backgroundColor: l.blog_labels.color || '#4a6ffa' }}
                          >
                            {l.blog_labels.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6 space-y-4 flex flex-col relative z-10">
                    <div className="flex items-center gap-3 text-xs font-inter text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#4a6ffa]" />
                        <span>
                          {post.published_at
                            ? formatBlogDate(post.published_at)
                            : ""}
                        </span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#4a6ffa]" />
                        <span>{calculateReadingTime(post.content)} min</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold font-manrope group-hover:text-[#4a6ffa] transition-colors line-clamp-2 text-[#0c1a2e] leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 text-[14px] font-inter leading-relaxed line-clamp-3 flex-grow">
                      {post.excerpt ||
                        post.content.replace(/<[^>]*>?/gm, "").substring(0, 150) +
                          "..."}
                    </p>

                    <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                      {post.author && (
                        <div className="text-xs font-inter font-medium text-slate-600">
                          By <span className="text-[#0c1a2e]">{post.author.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[#4a6ffa] font-inter font-semibold text-[13px] group-hover:gap-2 transition-all duration-300">
                        <span>Read</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        ) : (
          <BlurFade delay={0.3}>
            <div className="relative z-10 text-center py-24 glass-card border border-slate-200/60 rounded-3xl bg-white/50 shadow-[0_18px_44px_rgba(30,58,95,0.03)]">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f8fbff] border border-blue-100 mb-6">
                <Search className="w-6 h-6 text-[#4a6ffa]" />
              </div>
              <h3 className="text-xl font-bold font-manrope mb-2 text-[#0c1a2e]">
                No posts found
              </h3>
              <p className="text-slate-500 font-inter text-[15px]">
                Try adjusting your search or category filters.
              </p>
            </div>
          </BlurFade>
        )}

        {totalPages > 1 && (
          <BlurFade delay={0.4}>
            <div className="flex justify-center items-center gap-2 mt-16">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}${search ? `&search=${search}` : ""}${labelSlug ? `&label=${labelSlug}` : ""}`}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-[#4a6ffa] hover:text-[#4a6ffa] transition-all duration-200 text-[14px] font-inter font-medium text-slate-600 shadow-sm"
                >
                  Previous
                </Link>
              )}
              <div className="flex gap-2 mx-4">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Link
                      key={pageNum}
                      href={`/blog?page=${pageNum}${search ? `&search=${search}` : ""}${labelSlug ? `&label=${labelSlug}` : ""}`}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 text-[15px] font-inter font-medium",
                        pageNum === page
                          ? "bg-[#4a6ffa] text-white shadow-md"
                          : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm"
                      )}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
              {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}${search ? `&search=${search}` : ""}${labelSlug ? `&label=${labelSlug}` : ""}`}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-[#4a6ffa] hover:text-[#4a6ffa] transition-all duration-200 text-[14px] font-inter font-medium text-slate-600 shadow-sm"
                >
                  Next
                </Link>
              )}
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
