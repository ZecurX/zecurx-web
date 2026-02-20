"use client";

import React, { useState } from 'react';
import { Lock, Loader2, CheckCircle2, XCircle, Shield } from 'lucide-react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import { Button } from '@/components/ui/button';

interface TLSResult {
    certificate: {
        issuer: string;
        subject: string;
        validFrom: string;
        validTo: string;
        daysRemaining: number;
        serialNumber: string;
        signatureAlgorithm: string;
    };
    grade: string;
    score: number;
    protocols: {
        TLSv1: boolean;
        'TLSv1.1': boolean;
        'TLSv1.2': boolean;
        'TLSv1.3': boolean;
    };
    ciphers: {
        name: string;
        version: string;
        bits: number;
        strength: string;
    };
}

export default function SSLAnalyzerPage() {
    const [domain, setDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<TLSResult | null>(null);
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
                body: JSON.stringify({ tool: 'tls', domain: domain.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Scan failed');
            }

            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const getGradeColor = (grade: string) => {
        if (grade === 'A+' || grade === 'A') return 'bg-green-500/10 border-green-500/20 text-green-600';
        if (grade === 'B') return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600';
        return 'bg-red-500/10 border-red-500/20 text-red-600';
    };

    return (
        <ToolPageLayout
            title="TLS/SSL Analyzer"
            description="Analyze SSL/TLS certificate configuration, verify encryption standards, and identify security weaknesses."
            icon={Lock}
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-foreground mb-3">
                        Target Domain
                    </label>
                    <div className="flex gap-4 relative z-50 isolate">
                        <input
                            type="text"
                            id="domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="example.com"
                            className="flex-1 px-4 py-3 bg-background/50 backdrop-blur-sm border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all !cursor-text"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !domain.trim()}
                            className="px-8 rounded-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze'
                            )}
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {results && (
                    <div className="border-t border-border pt-8 space-y-8">
                        {/* Grade & Score */}
                        <div className="flex items-center gap-6">
                            <div className={`w-24 h-24 rounded-xl border flex items-center justify-center ${getGradeColor(results.grade)}`}>
                                <span className="text-5xl font-bold">{results.grade}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">Security Grade</h3>
                                <p className="text-sm text-muted-foreground">Score: {results.score}/100</p>
                                <p className="text-sm text-muted-foreground">
                                    {results.certificate.daysRemaining > 0
                                        ? `${results.certificate.daysRemaining} days until expiry`
                                        : 'Certificate expired!'}
                                </p>
                            </div>
                        </div>

                        {/* Certificate Info */}
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Certificate Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Subject</p>
                                    <p className="text-sm font-medium text-foreground truncate">{results.certificate.subject}</p>
                                </div>
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Issuer</p>
                                    <p className="text-sm font-medium text-foreground">{results.certificate.issuer}</p>
                                </div>
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Algorithm</p>
                                    <p className="text-sm font-medium text-foreground">{results.certificate.signatureAlgorithm}</p>
                                </div>
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Valid From</p>
                                    <p className="text-sm font-medium text-foreground">{results.certificate.validFrom}</p>
                                </div>
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Valid Until</p>
                                    <p className="text-sm font-medium text-foreground">{results.certificate.validTo}</p>
                                </div>
                                <div className="p-4 bg-background rounded-lg border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">Serial Number</p>
                                    <p className="text-sm font-mono text-foreground truncate">{results.certificate.serialNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Protocols */}
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Protocol Support</h4>
                            <div className="flex flex-wrap gap-3">
                                {Object.entries(results.protocols).map(([protocol, supported]) => (
                                    <div
                                        key={protocol}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${supported
                                                ? 'bg-green-500/10 border-green-500/20'
                                                : 'bg-muted/50 border-border'
                                            }`}
                                    >
                                        {supported ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-muted-foreground" />
                                        )}
                                        <span className={`text-sm font-medium ${supported ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            {protocol}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cipher */}
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Active Cipher Suite</h4>
                            <div className="p-4 bg-background rounded-lg border border-border">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="w-5 h-5 text-foreground" />
                                    <span className="font-mono text-sm text-foreground">{results.ciphers.name}</span>
                                </div>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                    <span>Version: {results.ciphers.version}</span>
                                    <span>Strength: {results.ciphers.strength}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </ToolPageLayout>
    );
}
