'use client';

import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Check, X, Wand2 } from 'lucide-react';

interface AIContentSuggestionsProps {
    content: string;
    currentTitle: string;
    currentExcerpt: string;
    currentMetaDescription: string;
    onApplyTitle: (title: string) => void;
    onApplyExcerpt: (excerpt: string) => void;
    onApplyMetaDescription: (description: string) => void;
}

export default function AIContentSuggestions({
    content,
    currentTitle,
    currentExcerpt,
    currentMetaDescription,
    onApplyTitle,
    onApplyExcerpt,
    onApplyMetaDescription
}: AIContentSuggestionsProps) {
    const [loading, setLoading] = useState<'title' | 'excerpt' | 'meta' | null>(null);
    const [suggestions, setSuggestions] = useState<{
        titles: string[];
        excerpt: string | null;
        metaDescription: string | null;
    }>({
        titles: [],
        excerpt: null,
        metaDescription: null
    });
    const [error, setError] = useState<string | null>(null);

    const generateSuggestions = async (type: 'title' | 'excerpt' | 'meta') => {
        if (!content || content.length < 50) {
            setError('Please add more content before generating suggestions');
            return;
        }

        setLoading(type);
        setError(null);

        try {
            const res = await fetch('/api/admin/blog/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    content: content.substring(0, 5000), // Limit content length
                    currentTitle
                })
            });

            if (!res.ok) {
                throw new Error('Failed to generate suggestions');
            }

            const data = await res.json();

            if (type === 'title') {
                setSuggestions(prev => ({ ...prev, titles: data.suggestions || [] }));
            } else if (type === 'excerpt') {
                setSuggestions(prev => ({ ...prev, excerpt: data.suggestion }));
            } else {
                setSuggestions(prev => ({ ...prev, metaDescription: data.suggestion }));
            }
        } catch (err) {
            setError('Failed to generate suggestions. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">AI Content Assistant</h3>
                    <p className="text-xs text-muted-foreground">Generate suggestions using AI</p>
                </div>
            </div>

            {error && (
                <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                    {error}
                </div>
            )}

            {/* Title Suggestions */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Title Ideas</span>
                    <button
                        onClick={() => generateSuggestions('title')}
                        disabled={loading === 'title'}
                        className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
                    >
                        {loading === 'title' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Wand2 className="w-3 h-3" />
                        )}
                        Generate
                    </button>
                </div>
                {suggestions.titles.length > 0 && (
                    <div className="space-y-1">
                        {suggestions.titles.map((title, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-background/50 rounded-lg text-sm group"
                            >
                                <span className="text-foreground">{title}</span>
                                <button
                                    onClick={() => onApplyTitle(title)}
                                    className="p-1 hover:bg-primary/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Apply this title"
                                >
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Excerpt Suggestion */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Excerpt</span>
                    <button
                        onClick={() => generateSuggestions('excerpt')}
                        disabled={loading === 'excerpt'}
                        className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
                    >
                        {loading === 'excerpt' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Wand2 className="w-3 h-3" />
                        )}
                        Generate
                    </button>
                </div>
                {suggestions.excerpt && (
                    <div className="flex items-start justify-between p-2 bg-background/50 rounded-lg text-sm group">
                        <span className="text-foreground text-xs">{suggestions.excerpt}</span>
                        <button
                            onClick={() => onApplyExcerpt(suggestions.excerpt!)}
                            className="p-1 hover:bg-primary/10 rounded shrink-0 ml-2"
                            title="Apply this excerpt"
                        >
                            <Check className="w-3.5 h-3.5 text-primary" />
                        </button>
                    </div>
                )}
            </div>

            {/* Meta Description Suggestion */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Meta Description</span>
                    <button
                        onClick={() => generateSuggestions('meta')}
                        disabled={loading === 'meta'}
                        className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
                    >
                        {loading === 'meta' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <Wand2 className="w-3 h-3" />
                        )}
                        Generate
                    </button>
                </div>
                {suggestions.metaDescription && (
                    <div className="flex items-start justify-between p-2 bg-background/50 rounded-lg text-sm group">
                        <span className="text-foreground text-xs">{suggestions.metaDescription}</span>
                        <button
                            onClick={() => onApplyMetaDescription(suggestions.metaDescription!)}
                            className="p-1 hover:bg-primary/10 rounded shrink-0 ml-2"
                            title="Apply this description"
                        >
                            <Check className="w-3.5 h-3.5 text-primary" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
