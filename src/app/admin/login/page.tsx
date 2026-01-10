"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.refresh(); // Refresh to update server components (layout)
                router.push("/admin");
            } else {
                const data = await res.json();
                setError(data.error || "Invalid password");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
                    <p className="text-zinc-400 text-sm mt-2">Enter the master password to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full h-11 px-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 outline-none transition-all placeholder:text-zinc-600"
                            required
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full h-11 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
                            loading && "opacity-80"
                        )}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
