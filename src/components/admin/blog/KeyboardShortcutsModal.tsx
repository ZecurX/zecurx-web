'use client';

import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcuts = [
    {
        category: 'Text Formatting',
        items: [
            { keys: ['Ctrl', 'B'], description: 'Bold' },
            { keys: ['Ctrl', 'I'], description: 'Italic' },
            { keys: ['Ctrl', 'U'], description: 'Underline' },
            { keys: ['Ctrl', '`'], description: 'Inline code' },
            { keys: ['Ctrl', 'Shift', 'X'], description: 'Strikethrough' },
        ]
    },
    {
        category: 'Headings',
        items: [
            { keys: ['Ctrl', 'Alt', '1'], description: 'Heading 1' },
            { keys: ['Ctrl', 'Alt', '2'], description: 'Heading 2' },
            { keys: ['Ctrl', 'Alt', '3'], description: 'Heading 3' },
            { keys: ['Ctrl', 'Alt', '0'], description: 'Paragraph' },
        ]
    },
    {
        category: 'Lists',
        items: [
            { keys: ['Ctrl', 'Shift', '8'], description: 'Bullet list' },
            { keys: ['Ctrl', 'Shift', '7'], description: 'Numbered list' },
            { keys: ['Tab'], description: 'Indent list item' },
            { keys: ['Shift', 'Tab'], description: 'Outdent list item' },
        ]
    },
    {
        category: 'Blocks',
        items: [
            { keys: ['Ctrl', 'Shift', 'B'], description: 'Blockquote' },
            { keys: ['Ctrl', 'Alt', 'C'], description: 'Code block' },
            { keys: ['---'], description: 'Horizontal rule (type and press Enter)' },
        ]
    },
    {
        category: 'General',
        items: [
            { keys: ['Ctrl', 'Z'], description: 'Undo' },
            { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
            { keys: ['Ctrl', 'A'], description: 'Select all' },
            { keys: ['Ctrl', 'K'], description: 'Insert link' },
        ]
    },
];

export default function KeyboardShortcutsModal({
    isOpen,
    onClose
}: KeyboardShortcutsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[65vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {shortcuts.map((group) => (
                            <div key={group.category} className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground">
                                    {group.category}
                                </h3>
                                <div className="space-y-2">
                                    {group.items.map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-1.5"
                                        >
                                            <span className="text-sm text-muted-foreground">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, keyIndex) => (
                                                    <span key={keyIndex} className="flex items-center gap-1">
                                                        <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded shadow-sm">
                                                            {key}
                                                        </kbd>
                                                        {keyIndex < shortcut.keys.length - 1 && (
                                                            <span className="text-muted-foreground text-xs">+</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-4 border-t border-border bg-muted/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
