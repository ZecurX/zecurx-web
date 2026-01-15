"use client";

import React, { useState } from 'react';
import { Search, Loader2, Globe, ExternalLink } from 'lucide-react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';

interface SubdomainResult {
    subdomain: string;
    source: string;
    ipAddresses: string[];
}

export default function SubdomainFinderPage() {
    const [domain, setDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SubdomainResult[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domain.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('/api/tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: 'subdomain', domain: domain.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Scan failed');
            }

            setResults(data.subdomains || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const getSourceBadge = (source: string) => {
        const colors: Record<string, string> = {
            'certificate': 'bg-blue-500/10 text-blue-600',
            'bruteforce': 'bg-orange-500/10 text-orange-600',
            'both': 'bg-green-500/10 text-green-600',
        };
        return colors[source] || 'bg-muted text-muted-foreground';
    };

    return (
        <ToolPageLayout
            title="Subdomain Finder"
            description="Discover hidden subdomains and map the complete attack surface of any target domain using advanced enumeration techniques."
            icon={Search}
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-foreground mb-3">
                        Target Domain
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            id="domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="example.com"
                            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all cursor-text"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !domain.trim()}
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
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter a root domain without protocol (e.g., example.com)
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {results && results.length > 0 && (
                    <div className="border-t border-border pt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">
                                Found {results.length} subdomains
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600">Certificate</span>
                                <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-600">Bruteforce</span>
                                <span className="px-2 py-1 rounded bg-green-500/10 text-green-600">Both</span>
                            </div>
                        </div>
                        <div className="bg-background rounded-lg border border-border overflow-hidden max-h-[500px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Subdomain</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Source</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">IP Addresses</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map((result, idx) => (
                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-mono text-sm text-foreground">{result.subdomain}</span>
                                                    <a
                                                        href={`https://${result.subdomain}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${getSourceBadge(result.source)}`}>
                                                    {result.source}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {result.ipAddresses.length > 0 ? (
                                                        result.ipAddresses.slice(0, 3).map((ip, i) => (
                                                            <span key={i} className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                                {ip}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                    {result.ipAddresses.length > 3 && (
                                                        <span className="text-xs text-muted-foreground">+{result.ipAddresses.length - 3}</span>
                                                    )}
                                                </div>
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
                        <p className="text-muted-foreground text-sm">No subdomains found for this domain.</p>
                    </div>
                )}
            </form>
        </ToolPageLayout>
    );
}
