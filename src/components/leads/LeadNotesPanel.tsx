'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadNote } from '@/types/lead-types';

interface LeadNotesPanelProps {
    notes: LeadNote[];
    leadId: string;
    leadType: 'student' | 'enterprise';
    onNoteAdded?: (note: LeadNote) => void;
}

const cardClass = cn(
    "p-5 rounded-2xl",
    "bg-background/70 backdrop-blur-xl",
    "border border-white/[0.08] dark:border-white/[0.06]",
    "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]",
    "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.2)]"
);

export function LeadNotesPanel({ notes, leadId, leadType, onNoteAdded }: LeadNotesPanelProps) {
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/leads/${leadType}/${leadId}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newNote.trim() }),
            });

            if (!response.ok) throw new Error('Failed to add note');

            const { data } = await response.json();
            setNewNote('');
            onNoteAdded?.(data);
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cardClass}>
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="font-manrope font-semibold text-foreground">Notes</h3>
                <span className="text-xs text-muted-foreground">({notes.length})</span>
            </div>

            {/* Add note form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-2">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note..."
                        rows={2}
                        className={cn(
                            "flex-1 px-3 py-2 text-sm rounded-lg resize-none",
                            "bg-background border border-white/[0.08]",
                            "text-foreground placeholder:text-muted-foreground/50",
                            "focus:outline-none focus:ring-2 focus:ring-primary/30"
                        )}
                    />
                    <button
                        type="submit"
                        disabled={!newNote.trim() || isSubmitting}
                        className={cn(
                            "px-3 py-2 rounded-lg transition-all duration-200",
                            "bg-primary text-primary-foreground",
                            "hover:bg-primary/90 active:scale-[0.98]",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "flex items-center justify-center"
                        )}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Notes list */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground/60 text-center py-4">
                        No notes yet. Add one above.
                    </p>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                        >
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                                {note.content}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-2">
                                {new Date(note.created_at).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
