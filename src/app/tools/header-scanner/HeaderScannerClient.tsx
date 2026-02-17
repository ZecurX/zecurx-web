"use client";

import React, { useState } from 'react';
import { FileSearch, Loader2, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';

interface HeaderResult {
    header: string;
    status: 'present' | 'missing' | 'warning';
    value?: string;
    description: string;
    recommendation?: string;
}

export default function HeaderScannerPage() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<HeaderResult[] | null>(null);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: 'header', url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Scan failed');
            }

            setResults(data.results || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        if (status === 'present') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
        return <XCircle className="w-5 h-5 text-red-600" />;
    };

    const getStatusBg = (status: string) => {
        if (status === 'present') return 'border-l-green-500';
        if (status === 'warning') return 'border-l-yellow-500';
        return 'border-l-red-500';
    };

    const presentCount = results?.filter(r => r.status === 'present').length || 0;
    const warningCount = results?.filter(r => r.status === 'warning').length || 0;
    const missingCount = results?.filter(r => r.status === 'missing').length || 0;

    return (
        <ToolPageLayout
            title="Header Scanner"
            description="Analyze HTTP security headers to verify proper implementation of HSTS, CSP, X-Frame-Options, and more."
            icon={FileSearch}
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-foreground mb-3">
                        Target URL
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all !cursor-text relative z-50"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="px-8 rounded-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                'Scan'
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
                    <div className="border-t border-border pt-8">
                        {/* Summary */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-foreground">Security Headers</h3>
                            <div className="flex gap-4 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-muted-foreground">{presentCount} Present</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                    <span className="text-muted-foreground">{warningCount} Warning</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-muted-foreground">{missingCount} Missing</span>
                                </span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="space-y-3">
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-background rounded-lg border border-border border-l-4 ${getStatusBg(result.status)} overflow-hidden`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                {getStatusIcon(result.status)}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-mono text-sm font-semibold text-foreground mb-1">
                                                        {result.header}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        {result.description}
                                                    </p>
                                                    {result.value && (
                                                        <div className="bg-muted/50 rounded px-2 py-1 inline-block">
                                                            <code className="text-xs text-foreground">{result.value}</code>
                                                        </div>
                                                    )}
                                                    {result.recommendation && result.status !== 'present' && (
                                                        <div className="mt-2 flex items-start gap-2 text-xs">
                                                            <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-muted-foreground">{result.recommendation}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results && results.length === 0 && (
                    <div className="border-t border-border pt-8">
                        <p className="text-muted-foreground text-sm">No security headers found.</p>
                    </div>
                )}
            </form>
        </ToolPageLayout>
    );
}
