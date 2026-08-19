"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import CourseBookingPage from "@/components/academy/CourseBookingPage";

interface CourseData {
    id: string;
    title: string;
    description: string;
    price: number | string;
    level: string;
    pricingType?: "fixed" | "contact" | "institutional";
    inStock?: boolean;
}

export default function BookPageClient({ courseId }: { courseId: string }) {
    const router = useRouter();
    const [course, setCourse] = useState<CourseData | null>(null);
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
                const data: CourseData = await res.json();

                // Booking only applies to fixed-price, in-stock courses — everything else
                // routes through /contact on the course detail page instead.
                if (data.pricingType === "institutional" || data.pricingType === "contact" || data.inStock === false) {
                    router.replace(`/academy/${courseId}`);
                    return;
                }

                setCourse(data);
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <p className="text-foreground font-medium">
                        {error || "Course not found"}
                    </p>
                    <button
                        onClick={() => router.push("/academy")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Back to Academy
                    </button>
                </div>
            </div>
        );
    }

    return <CourseBookingPage course={course} />;
}
