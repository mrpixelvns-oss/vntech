import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, Quote, Link as LinkIcon, Image as ImageIcon2, Undo, Redo, Check, X, Trash2 } from 'lucide-react';

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
    onImageUploadRequest: () => void;
    pendingImageToInsert: string | null;
    onImageInserted: () => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ 
    content, 
    onChange, 
    onImageUploadRequest,
    pendingImageToInsert,
    onImageInserted
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
            }),
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-accent underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Nhập nội dung bài viết...',
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (html !== content) {
                onChange(html);
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-2',
            },
        },
    });

    const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    // Handle Content Updates from Parent
    useEffect(() => {
        if (editor && content !== undefined) {
             const currentContent = editor.getHTML();
             if (content !== currentContent) {
                 editor.commands.setContent(content, false);
             }
        }
    }, [content, editor]);

    // Handle Image Insertion
    useEffect(() => {
        if (editor && pendingImageToInsert) {
            editor.chain().focus().setImage({ src: pendingImageToInsert }).run();
            onImageInserted(); 
        }
    }, [pendingImageToInsert, editor, onImageInserted]);

    // Force re-render to update toolbar active states
    const [, setUpdateTrigger] = useState(0);
    useEffect(() => {
        if (!editor) return;
        const handler = () => setUpdateTrigger(prev => prev + 1);
        editor.on('transaction', handler);
        editor.on('selectionUpdate', handler);
        return () => {
            editor.off('transaction', handler);
            editor.off('selectionUpdate', handler);
        };
    }, [editor]);

    const openLinkSelector = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || '');
        setIsLinkSelectorOpen(true);
    }, [editor]);

    const applyLink = useCallback(() => {
        if (!editor) return;
        
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            const isImageSelection = editor.state.selection.node?.type.name === 'image';
            if (isImageSelection) {
                 editor.chain().focus().setLink({ href: linkUrl }).run();
            } else {
                 if (editor.isActive('link')) {
                    editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
                 } else {
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                 }
            }
        }
        setIsLinkSelectorOpen(false);
    }, [editor, linkUrl]);

    const cancelLink = useCallback(() => {
        setIsLinkSelectorOpen(false);
        setLinkUrl('');
        editor?.commands.focus();
    }, [editor]);

    const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'p') {
            editor?.chain().focus().setParagraph().run();
        } else {
            editor?.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
        }
    };

    const deleteSelectedImage = () => {
        if (editor?.isActive('image')) {
            editor.chain().focus().deleteSelection().run();
        }
    };

    const getCurrentHeadingValue = () => {
        if (!editor) return 'p';
        if (editor.isActive('heading', { level: 2 })) return '2';
        if (editor.isActive('heading', { level: 3 })) return '3';
        if (editor.isActive('heading', { level: 4 })) return '4';
        if (editor.isActive('heading', { level: 5 })) return '5';
        if (editor.isActive('heading', { level: 6 })) return '6';
        return 'p';
    };

    if (!editor) return null;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* --- Main Toolbar --- */}
            <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 flex-wrap min-h-[50px]">
                
                {isLinkSelectorOpen ? (
                    <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                       <LinkIcon size={18} className="text-blue-500 ml-2" />
                       <input 
                          autoFocus
                          type="text" 
                          className="flex-1 bg-white dark:bg-slate-800 border border-blue-500 rounded px-3 py-1.5 text-sm outline-none dark:text-white"
                          placeholder="Dán đường dẫn (URL) vào đây..."
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') applyLink(); if(e.key === 'Escape') cancelLink(); }}
                       />
                       <button onClick={applyLink} className="p-1.5 bg-green-500 text-white hover:bg-green-600 rounded shadow-sm"><Check size={16}/></button>
                       <button onClick={cancelLink} className="p-1.5 bg-red-100 text-red-500 hover:bg-red-200 rounded shadow-sm"><X size={16}/></button>
                    </div>
                ) : (
                    <>
                        {/* 1. Heading Dropdown */}
                        <div className="mr-2">
                            <select 
                                value={getCurrentHeadingValue()} 
                                onChange={handleHeadingChange}
                                className="h-9 px-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-accent w-32"
                            >
                                <option value="p">Normal</option>
                                <option value="2">Heading 2</option>
                                <option value="3">Heading 3</option>
                                <option value="4">Heading 4</option>
                                <option value="5">Heading 5</option>
                                <option value="6">Heading 6</option>
                            </select>
                        </div>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                        {/* 2. Text Formatting */}
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800 text-accent' : 'text-slate-600 dark:text-slate-300'}`}><Bold size={18}/></button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800 text-accent' : 'text-slate-600 dark:text-slate-300'}`}><Italic size={18}/></button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded ${editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800 text-accent' : 'text-slate-600 dark:text-slate-300'}`}><Quote size={18}/></button>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                        {/* 3. Lists */}
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800 text-accent' : 'text-slate-600 dark:text-slate-300'}`}><List size={18}/></button>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                        {/* 4. Inserts */}
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={openLinkSelector} className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}><LinkIcon size={18}/></button>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onImageUploadRequest} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"><ImageIcon2 size={18}/></button>

                        {editor.isActive('image') && (
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={deleteSelectedImage} className="ml-2 flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100 border border-red-200"><Trash2 size={14} /> Xóa ảnh</button>
                        )}

                        <div className="flex-1"></div>
                        
                        <div className="flex items-center gap-1 text-slate-400">
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().undo().run()} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded" disabled={!editor.can().undo()}><Undo size={16}/></button>
                            <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().redo().run()} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded" disabled={!editor.can().redo()}><Redo size={16}/></button>
                        </div>
                    </>
                )}
            </div>

            <div className="flex-1 overflow-y-auto cursor-text bg-white dark:bg-slate-900" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default TipTapEditor;