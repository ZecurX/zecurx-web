import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    // Verify the user has permission to view products
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    
    if (!sessionCookie) {
        redirect('/admin/login');
    }

    const session = await verifySession(sessionCookie.value);
    if (!session) {
        redirect('/admin/login');
    }

    // Check if user has read permission for products
    if (!hasPermission(session.role, 'products', 'read')) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground">You don't have permission to view products.</p>
                </div>
            </div>
        );
    }

    // Import dynamically to avoid SSR hydration issues with Radix UI
    const ProductsList = require("./ProductsList").default;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Products</h1>
                    <p className="text-zinc-400">Manage hardware products and inventory.</p>
                </div>
            </div>

            <ProductsList />
        </div>
    );
}
