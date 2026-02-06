'use client';

import { useState, useEffect } from 'react';
import { History, RotateCcw, Trash2, Eye, Loader2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Version {
    id: string;
    version_number: number;
    title: string;
    content: string;
    excerpt: string | null;
    created_by: string;
    created_at: string;
    author_name?: string;
}

interface VersionHistoryPanelProps {
    postId: string;
    currentContent: string;
    onRestore: (version: Version) => void;
    onPreview: (version: Version) => void;
}

export default function VersionHistoryPanel({
    postId,
    currentContent,
    onRestore,
    onPreview
}: VersionHistoryPanelProps) {
    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVersions = async () => {
        try {
            const res = await fetch(`/api/admin/blog/versions?postId=${postId}`);
            if (res.ok) {
                const data = await res.json();
                setVersions(data.versions || []);
            }
        } catch (err) {
            console.error('Failed to fetch versions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchVersions();
        }
    }, [postId]);

    const saveVersion = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/blog/versions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId })
            });

            if (res.ok) {
                await fetchVersions();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save version');
            }
        } catch (err) {
            setError('Failed to save version');
        } finally {
            setSaving(false);
        }
    };

    const deleteVersion = async (versionId: string) => {
        if (!confirm('Delete this version?')) return;

        try {
            const res = await fetch(`/api/admin/blog/versions/${versionId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setVersions(prev => prev.filter(v => v.id !== versionId));
            }
        } catch (err) {
            console.error('Failed to delete version:', err);
        }
    };

    return (
        <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Version History</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {versions.length}
                    </span>
                </div>
                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {expanded && (
                <div className="border-t border-border/50 p-4 space-y-4">
                    <button
                        onClick={saveVersion}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <History className="w-4 h-4" />
                        )}
                        Save Current Version
                    </button>

                    {error && (
                        <p className="text-xs text-destructive">{error}</p>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : versions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No saved versions yet
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {versions.map((version) => (
                                <div
                                    key={version.id}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            v{version.version_number}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onPreview(version)}
                                            className="p-1.5 hover:bg-muted rounded transition-colors"
                                            title="Preview"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => onRestore(version)}
                                            className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                                            title="Restore"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5 text-primary" />
                                        </button>
                                        <button
                                            onClick={() => deleteVersion(version.id)}
                                            className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
