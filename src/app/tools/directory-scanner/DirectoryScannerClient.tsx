"use client";

import React, { useState } from 'react';
import { FolderSearch, Loader2 } from 'lucide-react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';

interface DirectoryResult {
    path: string;
    status: number;
    statusText: string;
    size: number | null;
    type: string;
}

export default function DirectoryScannerPage() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<DirectoryResult[] | null>(null);
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
                body: JSON.stringify({ tool: 'directory', url: url.trim() }),
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

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'bg-green-500/10 text-green-600';
        if (status >= 300 && status < 400) return 'bg-blue-500/10 text-blue-600';
        if (status >= 400 && status < 500) return 'bg-yellow-500/10 text-yellow-600';
        if (status >= 500) return 'bg-red-500/10 text-red-600';
        return 'bg-muted text-muted-foreground';
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'redirect': 'bg-blue-500/10 text-blue-600',
            'found': 'bg-green-500/10 text-green-600',
            'unknown': 'bg-muted text-muted-foreground',
        };
        return colors[type] || 'bg-muted text-muted-foreground';
    };

    return (
        <ToolPageLayout
            title="Directory Scanner"
            description="Discover hidden directories, backup files, and sensitive paths on web servers using intelligent wordlists."
            icon={FolderSearch}
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
                            className="flex-1 px-5 py-4 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4a69e6]/50 focus:border-[#4a69e6] transition-all !cursor-text relative z-50 shadow-sm font-mono text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="px-8 py-3 rounded-xl bg-[#4a69e6] text-white font-semibold font-inter transition-all duration-300 hover:bg-[#3b5bdb] hover:shadow-[0_0_20px_rgba(74,111,250,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                'Scan'
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {results && results.length > 0 && (
                    <div className="border-t border-border pt-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Scanned {results.length} paths
                        </h3>
                        <div className="bg-background rounded-lg border border-border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Path</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map((result, idx) => (
                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-mono text-sm text-foreground">{result.path}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-mono px-2 py-1 rounded ${getStatusColor(result.status)}`}>
                                                    {result.status} {result.statusText}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded ${getTypeColor(result.type)}`}>
                                                    {result.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {result.size ? `${result.size} bytes` : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {results && results.length === 0 && (
                    <div className="border-t border-border pt-8">
                        <p className="text-muted-foreground text-sm">No directories found.</p>
                    </div>
                )}
            </form>
        </ToolPageLayout>
    );
}
