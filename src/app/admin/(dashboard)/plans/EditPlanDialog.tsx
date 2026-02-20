"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Plus, Trash2, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Plan = {
    id: string;
    name: string;
    type: string;
    price: number;
    description: string | null;
    active: boolean;
    in_stock: boolean;
    test_mode: boolean;
    duration?: string | null;
    level?: string | null;
    features?: string[] | null;
    logo?: string | null;
    original_price?: number | null;
    popular?: boolean;
    students_count?: number | null;
    brochure_link?: string | null;
    pricing_type?: string;
};

export default function EditPlanDialog({ plan, open, onOpenChange, onUpdate }: { plan: Plan | null, open: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        active: false,
        in_stock: true,
        test_mode: false,
        duration: '',
        level: 'Beginner',
        features: [] as string[],
        logo: '',
        original_price: '' as string | number,
        popular: false,
        students_count: '' as string | number,
        brochure_link: '',
        pricing_type: 'fixed'
    });
    const [newFeature, setNewFeature] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [brochureUploading, setBrochureUploading] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const brochureInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                description: plan.description || '',
                active: plan.active,
                in_stock: plan.in_stock ?? true,
                test_mode: plan.test_mode ?? false,
                duration: plan.duration || '',
                level: plan.level || 'Beginner',
                features: plan.features || [],
                logo: plan.logo || '',
                original_price: plan.original_price || '',
                popular: plan.popular ?? false,
                students_count: plan.students_count || '',
                brochure_link: plan.brochure_link || '',
                pricing_type: plan.pricing_type || 'fixed'
            });
        }
    }, [plan]);

    if (!plan) return null;

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleLogoUpload = async (file: File) => {
        setLogoUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('type', 'logo');
            const res = await fetch('/api/admin/plans/upload', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Upload failed');
            }
            const data = await res.json();
            setFormData(prev => ({ ...prev, logo: data.url }));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Logo upload failed');
        } finally {
            setLogoUploading(false);
            if (logoInputRef.current) logoInputRef.current.value = '';
        }
    };

    const handleBrochureUpload = async (file: File) => {
        setBrochureUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('type', 'brochure');
            const res = await fetch('/api/admin/plans/upload', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Upload failed');
            }
            const data = await res.json();
            setFormData(prev => ({ ...prev, brochure_link: data.url }));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Brochure upload failed');
        } finally {
            setBrochureUploading(false);
            if (brochureInputRef.current) brochureInputRef.current.value = '';
        }
    };

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
                    in_stock: formData.in_stock,
                    test_mode: formData.test_mode,
                    duration: formData.duration || null,
                    level: formData.level || null,
                    features: formData.features.length > 0 ? formData.features : null,
                    logo: formData.logo || null,
                    original_price: formData.original_price ? Number(formData.original_price) : null,
                    popular: formData.popular,
                    students_count: formData.students_count ? Number(formData.students_count) : null,
                    brochure_link: formData.brochure_link || null,
                    pricing_type: formData.pricing_type
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update plan');
            }

            onUpdate();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to update plan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] !flex !flex-col overflow-hidden p-0 gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader className="p-6 border-b border-border shrink-0">
                    <DialogTitle className="text-lg font-bold text-foreground">Edit Plan</DialogTitle>
                </DialogHeader>

                <div
                    className="overflow-y-auto overscroll-contain flex-1 min-h-0 p-6 space-y-8"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Basic Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Plan Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Original Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="No original price"
                                    value={formData.original_price}
                                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pricing Type</label>
                                <select
                                    value={formData.pricing_type}
                                    onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                >
                                    <option value="fixed" className="bg-background text-foreground">Fixed Price</option>
                                    <option value="contact" className="bg-background text-foreground">Contact for Pricing</option>
                                    <option value="institutional" className="bg-background text-foreground">Institutional Only</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full h-24 bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Course Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Duration</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 3 Months"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Level</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                >
                                    <option value="Beginner" className="bg-background text-foreground">Beginner</option>
                                    <option value="Intermediate" className="bg-background text-foreground">Intermediate</option>
                                    <option value="Advanced" className="bg-background text-foreground">Advanced</option>
                                    <option value="Expert" className="bg-background text-foreground">Expert</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Features</label>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground">
                                            {feature}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFeature(index)}
                                            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add a feature..."
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                                        className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                                    />
                                    <button
                                        onClick={handleAddFeature}
                                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Course Logo</label>
                                {formData.logo && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-secondary">
                                        <img src={formData.logo} alt="Logo preview" className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                            className="absolute top-1 right-1 p-0.5 bg-background/80 rounded-full text-muted-foreground hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleLogoUpload(file);
                                    }}
                                />
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={logoUploading}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground bg-secondary border border-border rounded-lg hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {logoUploading
                                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
                                        : <><ImageIcon className="w-3.5 h-3.5" /> {formData.logo ? 'Replace Logo' : 'Upload Logo'}</>
                                    }
                                </button>
                                <input
                                    type="text"
                                    placeholder="Or paste URL manually…"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Brochure (PDF)</label>
                                {formData.brochure_link && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg">
                                        <FileText className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-xs text-foreground truncate flex-1">
                                            {formData.brochure_link.split('/').pop() || 'brochure.pdf'}
                                        </span>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, brochure_link: '' }))}
                                            className="text-muted-foreground hover:text-red-400 transition-colors shrink-0"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                <input
                                    ref={brochureInputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleBrochureUpload(file);
                                    }}
                                />
                                <button
                                    onClick={() => brochureInputRef.current?.click()}
                                    disabled={brochureUploading}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground bg-secondary border border-border rounded-lg hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {brochureUploading
                                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
                                        : <><Upload className="w-3.5 h-3.5" /> {formData.brochure_link ? 'Replace PDF' : 'Upload PDF'}</>
                                    }
                                </button>
                                <input
                                    type="text"
                                    placeholder="Or paste URL manually…"
                                    value={formData.brochure_link}
                                    onChange={(e) => setFormData({ ...formData, brochure_link: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Students Count</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.students_count}
                                    onChange={(e) => setFormData({ ...formData, students_count: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.active ? 'bg-emerald-500' : 'bg-muted'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.active ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className="text-sm text-foreground">{formData.active ? "Active" : "Inactive"}</span>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.in_stock ? 'bg-blue-500' : 'bg-muted'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.in_stock ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className="text-sm text-foreground">{formData.in_stock ? "In Stock" : "Out of Stock"}</span>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setFormData({ ...formData, popular: !formData.popular })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.popular ? 'bg-purple-500' : 'bg-muted'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.popular ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className="text-sm text-foreground">{formData.popular ? "Popular" : "Not Popular"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-4">
                            <button
                                onClick={() => setFormData({ ...formData, test_mode: !formData.test_mode })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${formData.test_mode ? 'bg-amber-500' : 'bg-muted'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.test_mode ? 'left-7' : 'left-1'}`} />
                            </button>
                            <div>
                                <span className="text-sm text-amber-400 font-medium">🧪 Test Mode</span>
                                {formData.test_mode && (
                                    <p className="text-xs text-amber-400/70 mt-0.5">Price will be ₹1. Payments marked as test.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-border shrink-0 flex gap-3 sm:justify-start">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
