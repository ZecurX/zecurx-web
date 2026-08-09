"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import CourseDetailClient from "@/components/academy/CourseDetailClient";
import { getCourseById } from "@/lib/courses";

interface CourseDetailData {
    id: string;
    title: string;
    description: string;
    price: number | string;
    originalPrice?: number;
    duration: string;
    students?: number;
    level: string;
    features: string[];
    popular?: boolean;
    brochureLink?: string;
    logo?: string;
    pricingType?: "fixed" | "contact" | "institutional";
    inStock?: boolean;
}

export default function CourseDetailPageClient({
    courseId,
}: {
    courseId: string;
}) {
    const router = useRouter();
    const [course, setCourse] = useState<CourseDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourse() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/academy/courses/${courseId}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        router.replace("/academy");
                        return;
                    }
                    throw new Error("Failed to load course details");
                }
                const data = await res.json();
                const staticCourse = getCourseById(courseId);
                setCourse({ ...data, unsplashId: data.unsplashId || staticCourse?.unsplashId });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fbff]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#4c69e4] animate-spin" />
                    <p className="text-slate-500 text-sm">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fbff]">
                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-slate-700 font-medium">
                        {error || "Course not found"}
                    </p>
                    <button
                        onClick={() => router.push("/academy")}
                        className="text-sm text-[#4c69e4] hover:underline"
                    >
                        Back to Academy
                    </button>
                </div>
            </div>
        );
    }

    return <CourseDetailClient course={course} />;
}
