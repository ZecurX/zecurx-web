import { Metadata } from "next";
import RedesignLandingClient from "./RedesignLandingClient";
import { getLatestBlogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
    title: "ZecurX — Landing Page Redesign",
    description: "Redesigned landing page preview — cinematic, scroll-driven narrative.",
    robots: { index: false, follow: false },
};

export default async function RedesignPage() {
    const posts = await getLatestBlogPosts(3);
    return <RedesignLandingClient posts={posts} />;
}
