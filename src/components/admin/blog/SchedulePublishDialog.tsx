'use client';

import { useState } from 'react';
import { Calendar, Clock, X, Loader2, AlertCircle } from 'lucide-react';

interface SchedulePublishDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (scheduledDate: Date) => Promise<void>;
    currentSchedule?: string | null;
}

export default function SchedulePublishDialog({
    isOpen,
    onClose,
    onSchedule,
    currentSchedule
}: SchedulePublishDialogProps) {
    const [date, setDate] = useState(() => {
        if (currentSchedule) {
            return new Date(currentSchedule).toISOString().slice(0, 10);
        }
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().slice(0, 10);
    });

    const [time, setTime] = useState(() => {
        if (currentSchedule) {
            return new Date(currentSchedule).toTimeString().slice(0, 5);
        }
        return '09:00';
    });

    const [scheduling, setScheduling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSchedule = async () => {
        const scheduledDate = new Date(`${date}T${time}`);

        if (scheduledDate <= new Date()) {
            setError('Scheduled date must be in the future');
            return;
        }

        setScheduling(true);
        setError(null);

        try {
            await onSchedule(scheduledDate);
            onClose();
        } catch (err) {
            setError('Failed to schedule post');
        } finally {
            setScheduling(false);
        }
    };

    const handleClearSchedule = async () => {
        setScheduling(true);
        try {
            // Pass null date to clear schedule
            await onSchedule(null as unknown as Date);
            onClose();
        } catch (err) {
            setError('Failed to clear schedule');
        } finally {
            setScheduling(false);
        }
    };

    if (!isOpen) return null;

    const minDate = new Date().toISOString().slice(0, 10);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Schedule Publishing</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {currentSchedule && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <p className="text-sm text-primary font-medium">Currently scheduled for:</p>
                            <p className="text-lg font-semibold text-foreground mt-1">
                                {new Date(currentSchedule).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="date"
                                    value={date}
                                    min={minDate}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Your timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                    {currentSchedule && (
                        <button
                            onClick={handleClearSchedule}
                            disabled={scheduling}
                            className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Clear Schedule
                        </button>
                    )}
                    <div className={`flex items-center gap-2 ${!currentSchedule ? 'ml-auto' : ''}`}>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSchedule}
                            disabled={scheduling}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {scheduling && <Loader2 className="w-4 h-4 animate-spin" />}
                            Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
