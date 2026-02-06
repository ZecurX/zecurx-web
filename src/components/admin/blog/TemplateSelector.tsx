'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, X, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Template {
    id: string;
    name: string;
    description: string;
    content: string;
    category: string;
    thumbnail_url?: string;
}

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (content: string, title?: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
    tutorial: 'Tutorials',
    news: 'News & Announcements',
    product: 'Product Features',
    'case-study': 'Case Studies',
    general: 'General'
};

export default function TemplateSelector({
    isOpen,
    onClose,
    onSelect
}: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/blog/templates');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data.templates || []);

                // Auto-expand first category
                if (data.templates?.length > 0) {
                    setExpandedCategory(data.templates[0].category);
                }
            }
        } catch (err) {
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        const template = templates.find(t => t.id === selectedId);
        if (template) {
            onSelect(template.content, template.name);
            onClose();
        }
    };

    const groupedTemplates = templates.reduce((acc, template) => {
        const category = template.category || 'general';
        if (!acc[category]) acc[category] = [];
        acc[category].push(template);
        return acc;
    }, {} as Record<string, Template[]>);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Content Templates</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[55vh]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground">No templates available</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                                <div key={category} className="border border-border/50 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <span className="font-medium text-sm">
                                            {CATEGORY_LABELS[category] || category}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {categoryTemplates.length} template{categoryTemplates.length !== 1 ? 's' : ''}
                                            </span>
                                            {expandedCategory === category ? (
                                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </button>

                                    {expandedCategory === category && (
                                        <div className="p-2 space-y-2">
                                            {categoryTemplates.map(template => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => setSelectedId(template.id)}
                                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedId === template.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-foreground">{template.name}</h4>
                                                            {template.description && (
                                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                    {template.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {selectedId === template.id && (
                                                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                                                                <Check className="w-3 h-3 text-primary-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                        {selectedId ? 'Template selected' : 'Select a template to apply'}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!selectedId}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
