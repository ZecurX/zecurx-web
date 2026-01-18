"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SessionInfo, Role, Resource, Action } from "@/types/auth";
import { hasPermission as checkPermission } from "@/lib/permissions";

interface AuthContextType {
    user: SessionInfo | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    hasPermission: (resource: Resource, action: Action) => boolean;
    isSuperAdmin: () => boolean;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchSession = useCallback(async () => {
        try {
            const response = await fetch("/api/zx-ctrl-6fdbff/auth", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch session:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    const hasPermission = useCallback(
        (resource: Resource, action: Action): boolean => {
            if (!user) return false;
            return checkPermission(user.role, resource, action);
        },
        [user]
    );

    const isSuperAdmin = useCallback((): boolean => {
        return user?.role === "super_admin";
    }, [user]);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/zx-ctrl-6fdbff/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            router.push("/zx-ctrl-6fdbff/login");
        }
    }, [router]);

    const refreshSession = useCallback(async () => {
        setIsLoading(true);
        await fetchSession();
    }, [fetchSession]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                hasPermission,
                isSuperAdmin,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Hook to check specific permission
export function usePermission(resource: Resource, action: Action): boolean {
    const { hasPermission } = useAuth();
    return hasPermission(resource, action);
}
