"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

type Plan = {
    id: string;
    name: string;
    type: string;
    price: number;
    description: string;
    active: boolean;
    in_stock: boolean;
};

export default function EditPlanDialog({ plan, onClose, onUpdate }: { plan: Plan, onClose: () => void, onUpdate: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: plan.name,
        price: plan.price,
        description: plan.description || '',
        active: plan.active,
        in_stock: plan.in_stock ?? true
    });

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/plans/${plan.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    price: Number(formData.price),
                    description: formData.description,
                    active: formData.active,
                    in_stock: formData.in_stock
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update plan');
            }

            onUpdate();
            onClose();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to update plan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-zinc-800">
                    <h2 className="text-lg font-bold text-white">Edit Plan</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Plan Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Price (₹)</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={() => setFormData({ ...formData, active: !formData.active })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.active ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.active ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className="text-sm text-zinc-300">{formData.active ? "Active" : "Inactive"}</span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.in_stock ? 'bg-blue-500' : 'bg-zinc-700'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.in_stock ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className="text-sm text-zinc-300">{formData.in_stock ? "In Stock" : "Out of Stock"}</span>
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-black bg-white hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
