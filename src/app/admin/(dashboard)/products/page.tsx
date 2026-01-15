import { requirePagePermission } from "@/lib/page-auth";
import { RESOURCES, ACTIONS } from "@/types/auth";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    await requirePagePermission(RESOURCES.PRODUCTS, ACTIONS.READ);

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
