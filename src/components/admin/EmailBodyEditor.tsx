'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, List, ListOrdered,
    Link as LinkIcon, Undo, Redo,
    AlignLeft, AlignCenter, AlignRight,
    Quote, Tag
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const PLACEHOLDERS = [
    { label: 'First Name', value: '{{first_name}}' },
    { label: 'Full Name', value: '{{full_name}}' },
    { label: 'Email', value: '{{email}}' },
];

interface EmailBodyEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export default function EmailBodyEditor({ content, onChange }: EmailBodyEditorProps) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-primary underline' },
            }),
            Placeholder.configure({ placeholder: 'Write your email body here...' }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[280px] px-4 py-3 text-foreground',
            },
        },
    });

    if (!editor) return null;

    const Btn = ({
        onClick, active, disabled, title, children,
    }: {
        onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                'p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed',
                active
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-white/[0.04] text-muted-foreground hover:text-foreground'
            )}
        >
            {children}
        </button>
    );

    const handleAddLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    return (
        <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-background/50">
            {/* Toolbar */}
            <div className="border-b border-white/[0.06] bg-white/[0.02] px-3 py-2 flex flex-wrap gap-1">
                <div className="flex gap-0.5 pr-2 border-r border-white/[0.06] mr-1">
                    <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                        <Bold className="w-3.5 h-3.5" />
                    </Btn>
                    <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                        <Italic className="w-3.5 h-3.5" />
                    </Btn>
                    <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
                        <Quote className="w-3.5 h-3.5" />
                    </Btn>
                </div>

                <div className="flex gap-0.5 pr-2 border-r border-white/[0.06] mr-1">
                    <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                        <List className="w-3.5 h-3.5" />
                    </Btn>
                    <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
                        <ListOrdered className="w-3.5 h-3.5" />
                    </Btn>
                </div>

                <div className="flex gap-0.5 pr-2 border-r border-white/[0.06] mr-1">
                    <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Left">
                        <AlignLeft className="w-3.5 h-3.5" />
                    </Btn>
                    <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
                        <AlignCenter className="w-3.5 h-3.5" />
                    </Btn>
                    <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Right">
                        <AlignRight className="w-3.5 h-3.5" />
                    </Btn>
                </div>

                <div className="flex gap-0.5 pr-2 border-r border-white/[0.06] mr-1">
                    <Btn
                        onClick={() => {
                            if (editor.isActive('link')) {
                                editor.chain().focus().unsetLink().run();
                            } else {
                                setShowLinkInput(!showLinkInput);
                            }
                        }}
                        active={editor.isActive('link')}
                        title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </Btn>
                </div>

                <div className="flex gap-0.5 pr-2 border-r border-white/[0.06] mr-1">
                    <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                        <Undo className="w-3.5 h-3.5" />
                    </Btn>
                    <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                        <Redo className="w-3.5 h-3.5" />
                    </Btn>
                </div>

                {/* Placeholder insertions */}
                <div className="flex items-center gap-1 ml-1">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span className="text-xs text-muted-foreground/60 mr-1">Insert:</span>
                    {PLACEHOLDERS.map(p => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => editor.chain().focus().insertContent(p.value).run()}
                            title={`Insert ${p.label} placeholder`}
                            className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono"
                        >
                            {p.value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Link input */}
            {showLinkInput && (
                <div className="border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 flex gap-2">
                    <input
                        type="url"
                        placeholder="https://..."
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
                        className="flex-1 px-3 py-1.5 text-sm bg-background border border-white/[0.08] rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button type="button" onClick={handleAddLink} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Add</button>
                    <button type="button" onClick={() => setShowLinkInput(false)} className="px-3 py-1.5 text-sm bg-white/[0.04] text-foreground rounded-lg hover:bg-white/[0.08] transition-colors">Cancel</button>
                </div>
            )}

            <EditorContent editor={editor} />
        </div>
    );
}
