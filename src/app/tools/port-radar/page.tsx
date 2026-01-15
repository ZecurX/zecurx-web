"use client";

import React, { useState } from 'react';
import { Radar, Loader2, AlertTriangle } from 'lucide-react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';

interface PortResult {
    port: number;
    service: string;
    status: string;
    banner: string | null;
    risk: string;
    riskDescription: string | null;
}

export default function PortRadarPage() {
    const [target, setTarget] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<PortResult[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!target.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('/api/tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: 'port', target: target.trim() }),
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

    const getStatusColor = (status: string) => {
        if (status === 'open') return 'bg-green-500/10 text-green-600';
        if (status === 'filtered') return 'bg-yellow-500/10 text-yellow-600';
        if (status === 'closed') return 'bg-red-500/10 text-red-600';
        return 'bg-muted text-muted-foreground';
    };

    const getRiskColor = (risk: string) => {
        if (risk === 'high') return 'bg-red-500/10 text-red-600';
        if (risk === 'medium') return 'bg-yellow-500/10 text-yellow-600';
        if (risk === 'low') return 'bg-green-500/10 text-green-600';
        return 'bg-muted text-muted-foreground';
    };

    return (
        <ToolPageLayout
            title="Port Radar"
            description="Identify open network service ports and running services to map potential attack vectors and vulnerabilities."
            icon={Radar}
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="target" className="block text-sm font-medium text-foreground mb-3">
                        Target Host
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            id="target"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="192.168.1.1 or example.com"
                            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all !cursor-text relative z-50"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !target.trim()}
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
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Discovered {results.length} ports
                        </h3>
                        <div className="bg-background rounded-lg border border-border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Port</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Service</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Risk</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map((result, idx) => (
                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-mono text-sm text-foreground font-bold">{result.port}</td>
                                            <td className="px-4 py-3 text-sm text-foreground">{result.service}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-mono px-2 py-1 rounded ${getStatusColor(result.status)}`}>
                                                    {result.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded ${getRiskColor(result.risk)}`}>
                                                        {result.risk}
                                                    </span>
                                                    {result.risk === 'high' && (
                                                        <AlertTriangle className="w-4 h-4 text-red-600" />
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
                        <p className="text-muted-foreground text-sm">No open ports found.</p>
                    </div>
                )}
            </form>
        </ToolPageLayout>
    );
}
