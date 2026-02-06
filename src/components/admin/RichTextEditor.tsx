'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Keyboard,
  LayoutGrid,
  Trash2,
  Plus,
  Minus,
  RowsIcon,
  ColumnsIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
  onOpenMediaLibrary?: () => void;
  onOpenKeyboardShortcuts?: () => void;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
  onImageUpload,
  onOpenMediaLibrary,
  onOpenKeyboardShortcuts
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showTableMenu, setShowTableMenu] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80 transition-colors'
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4'
        }
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-border'
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-border bg-muted px-4 py-2 text-left font-semibold'
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-4 py-2'
        }
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'my-4 rounded-lg overflow-hidden w-full aspect-video'
        }
      }),
      CharacterCount
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-6 py-4 text-foreground'
      }
    }
  });

  // Close menus on click outside
  useEffect(() => {
    const handleClick = () => {
      setShowTableMenu(false);
    };
    if (showTableMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showTableMenu]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (onImageUpload) {
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert('Failed to upload image. Please try again.');
        }
      }
    };

    input.click();
  };

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  };

  const handleAddYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({ src: youtubeUrl });
      setYoutubeUrl('');
      setShowYoutubeInput(false);
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  };

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
    title
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed",
        active
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <div className="border-b border-border bg-muted/50 px-4 py-2 flex flex-wrap gap-1">
        <div className="flex gap-1 pr-2 border-r border-border/50 mr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 pr-3 border-r border-border/50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 pr-3 border-r border-border/50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 pr-3 border-r border-border/50">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 pr-3 border-r border-border/50">
          <ToolbarButton
            onClick={() => {
              if (editor.isActive('link')) {
                handleRemoveLink();
              } else {
                setShowLinkInput(!showLinkInput);
              }
            }}
            active={editor.isActive('link')}
            title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {onImageUpload && (
            <ToolbarButton
              onClick={handleImageUpload}
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </ToolbarButton>
          )}
          {onOpenMediaLibrary && (
            <ToolbarButton
              onClick={onOpenMediaLibrary}
              title="Media Library"
            >
              <LayoutGrid className="w-4 h-4" />
            </ToolbarButton>
          )}
        </div>

        {/* Table and YouTube */}
        <div className="flex gap-1 pr-3 border-r border-border/50 relative">
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setShowTableMenu(!showTableMenu);
              }}
              active={editor.isActive('table')}
              title="Table"
            >
              <TableIcon className="w-4 h-4" />
            </ToolbarButton>

            {showTableMenu && (
              <div
                className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 z-50 min-w-[160px]"
                onClick={(e) => e.stopPropagation()}
              >
                {!editor.isActive('table') ? (
                  <button
                    onClick={insertTable}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insert Table
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        editor.chain().focus().addColumnAfter().run();
                        setShowTableMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                    >
                      <ColumnsIcon className="w-3.5 h-3.5" />
                      Add Column
                    </button>
                    <button
                      onClick={() => {
                        editor.chain().focus().addRowAfter().run();
                        setShowTableMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                    >
                      <RowsIcon className="w-3.5 h-3.5" />
                      Add Row
                    </button>
                    <button
                      onClick={() => {
                        editor.chain().focus().deleteColumn().run();
                        setShowTableMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2 text-destructive"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      Delete Column
                    </button>
                    <button
                      onClick={() => {
                        editor.chain().focus().deleteRow().run();
                        setShowTableMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2 text-destructive"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      Delete Row
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => {
                        editor.chain().focus().deleteTable().run();
                        setShowTableMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 rounded-md flex items-center gap-2 text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Table
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <ToolbarButton
            onClick={() => setShowYoutubeInput(!showYoutubeInput)}
            title="Embed YouTube Video"
          >
            <YoutubeIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 pr-3 border-r border-border/50">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {onOpenKeyboardShortcuts && (
          <div className="flex gap-1">
            <ToolbarButton
              onClick={onOpenKeyboardShortcuts}
              title="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </ToolbarButton>
          </div>
        )}
      </div>

      {showLinkInput && (
        <div className="border-b border-border/50 bg-muted/30 px-4 py-3 flex gap-3">
          <input
            type="url"
            placeholder="Enter URL (https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLink();
              }
            }}
            className="flex-1 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors font-medium"
          >
            Add Link
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {showYoutubeInput && (
        <div className="border-b border-border/50 bg-muted/30 px-4 py-3 flex gap-3">
          <input
            type="url"
            placeholder="Paste YouTube URL (https://youtube.com/watch?v=...)"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddYoutube();
              }
            }}
            className="flex-1 px-4 py-2 bg-background border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={handleAddYoutube}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
          >
            Embed Video
          </button>
          <button
            type="button"
            onClick={() => setShowYoutubeInput(false)}
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      <EditorContent editor={editor} />

      {/* Word and Character Count */}
      <div className="border-t border-border bg-muted/30 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <span>~{Math.ceil(wordCount / 200)} min read</span>
      </div>
    </div>
  );
}
