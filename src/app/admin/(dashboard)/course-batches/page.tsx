"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Users, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateBatchDialog from "./CreateBatchDialog";

interface Batch {
    id: string;
    plan_id: string;
    course_name: string;
    name: string;
    start_date: string;
    end_date: string | null;
    capacity: number;
    seats_booked: number;
    status: 'active' | 'closed' | 'cancelled';
}

const STATUS_CONFIG: Record<Batch['status'], { label: string; color: string }> = {
    active: { label: 'Active', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    closed: { label: 'Closed', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

export default function CourseBatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const fetchBatches = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/course-batches');
            if (res.ok) {
                const data = await res.json();
                setBatches(data.batches || []);
            }
        } catch (error) {
            console.error('Failed to fetch batches:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    const handleToggleStatus = async (batch: Batch) => {
        const newStatus = batch.status === 'active' ? 'closed' : 'active';
        try {
            const res = await fetch(`/api/admin/course-batches/${batch.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) fetchBatches();
        } catch (error) {
            console.error('Failed to update batch:', error);
        }
    };

    const handleDelete = async (batch: Batch) => {
        if (!confirm(`Delete "${batch.name}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/admin/course-batches/${batch.id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchBatches();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete batch');
            }
        } catch (error) {
            console.error('Failed to delete batch:', error);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Batches</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage bookable slots for academy courses
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateDialog(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Create Batch
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : batches.length === 0 ? (
                <div className="text-center py-12 bg-card/40 border border-border/50 rounded-xl">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No batches yet</h3>
                    <p className="text-muted-foreground mt-1">Create a batch so visitors can book a slot for a course</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {batches.map((batch) => {
                        const statusConfig = STATUS_CONFIG[batch.status];
                        const seatsLeft = Math.max(0, batch.capacity - batch.seats_booked);
                        return (
                            <div
                                key={batch.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card/40 border border-border/50 rounded-xl hover:bg-card/60 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                                            statusConfig.color
                                        )}>
                                            {statusConfig.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{batch.course_name}</span>
                                    </div>
                                    <h3 className="font-semibold text-foreground text-lg">{batch.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {formatDate(batch.start_date)}
                                                {batch.end_date ? ` – ${formatDate(batch.end_date)}` : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            <span>{batch.seats_booked} / {batch.capacity} booked ({seatsLeft} left)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {batch.status !== 'cancelled' && (
                                        <button
                                            onClick={() => handleToggleStatus(batch)}
                                            className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            {batch.status === 'active' ? 'Close' : 'Reopen'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(batch)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                                        title="Delete batch"
                                    >
                                        {batch.seats_booked > 0 ? <XCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showCreateDialog && (
                <CreateBatchDialog
                    onClose={() => setShowCreateDialog(false)}
                    onSuccess={fetchBatches}
                />
            )}
        </div>
    );
}
