import { supabase } from "@/lib/supabase";
import ProductsList from "./ProductsList";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Products</h1>
                    <p className="text-zinc-400">Manage hardware products and inventory.</p>
                </div>
            </div>

            <ProductsList initialProducts={products || []} />
        </div>
    );
}
