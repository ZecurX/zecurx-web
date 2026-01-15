"use client";

import React, { useState } from 'react';
import { Code2, Loader2 } from 'lucide-react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';

export default function ParamFinderPage() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ param: string; type?: string }[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('/api/tools', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tool: 'param', url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Scan failed');
            }

            const params = data.parameters || data.params || data.results || data.data || [];
            setResults(params.map((item: any) =>
                typeof item === 'string'
                    ? { param: item, type: 'Unknown' }
                    : { param: item.param || item.name || item.parameter, type: item.type || 'Unknown' }
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolPageLayout
            title="Param Finder"
            description="Detect hidden URL parameters that may be vulnerable to injection attacks like XSS, SQLi, and SSRF."
            icon={Code2}
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-foreground mb-3">
                        Target URL
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 relative z-50 isolate">
                        <input
                            type="text"
                            id="url"
                            aria-label="Target URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/search"
                            className="w-full sm:flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all !cursor-text"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="w-full sm:w-auto px-8 rounded-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Finding...
                                </>
                            ) : (
                                'Find'
                            )}
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {results && results.length > 0 && (
                    <div className="border-t border-border pt-8" role="region" aria-label="Found Parameters" aria-live="polite">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Found {results.length} parameters
                        </h3>
                        <div className="bg-background rounded-lg border border-border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Parameter</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Inferred Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map((result, idx) => (
                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-mono text-sm text-foreground">{result.param}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{result.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {results && results.length === 0 && (
                    <div className="border-t border-border pt-8">
                        <p className="text-muted-foreground text-sm">No parameters found.</p>
                    </div>
                )}
            </form>
        </ToolPageLayout>
    );
}
