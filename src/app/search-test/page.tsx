"use client"

import { DemoOne } from "@/components/demo";

export default function SearchTestPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-12">
            <h1 className="text-white text-3xl font-bold">Glowing Search Bar Test</h1>
            <DemoOne />
            <p className="text-gray-500 max-w-md text-center">
                Hover over the search bar or click into the input to see the animated glowing border effects.
            </p>
        </div>
    );
}
