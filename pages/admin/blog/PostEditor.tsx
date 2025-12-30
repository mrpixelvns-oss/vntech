
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { X, Save, Image as ImageIcon, Loader2, Sparkles, UploadCloud, Check, ChevronLeft, Bot, FolderOpen } from 'lucide-react';
import TipTapEditor from '../../../components/TipTapEditor';
import { GoogleGenAI } from "@google/genai";
import Toast from '../../../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';

interface PostEditorProps {
    post?: any;
    onClose: () => void;
    onSaveSuccess: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ post, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        status: 'published',
        image: '',
        author: 'Admin'
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // AI State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiImagePrompt, setAiImagePrompt] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    // Media Modal for Editor
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<any[]>([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    
    // Media Context: 'content' = insert to editor, 'featured' = set as featured image
    const [mediaContext, setMediaContext] = useState<'content' | 'featured'>('content');
    const [pendingImageToInsert, setPendingImageToInsert] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategories();
        if (post) {
            setFormData({
                title: post.title || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                category: post.category || '',
                status: post.status || 'published',
                image: post.image || '',
                author: post.author || 'Admin'
            });
        }
    }, [post]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({ 
            ...prev, 
            title, 
            slug: !post ? generateSlug(title) : prev.slug // Only auto-gen slug if creating new
        }));
    };

    const handleSave = async () => {
        if (!formData.title) return setToast({ message: 'Vui lòng nhập tiêu đề', type: 'error' });
        setSaving(true);

        const payload = {
            ...formData,
            // updated_at removed to prevent schema error if column is missing
        };

        let error;
        if (post) {
            const { error: updateError } = await supabase.from('posts').update(payload).eq('id', post.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('posts').insert([payload]);
            error = insertError;
        }

        setSaving(false);
        if (error) {
            setToast({ message: 'Lỗi lưu bài viết: ' + error.message, type: 'error' });
        } else {
            onSaveSuccess();
        }
    };

    // --- MEDIA HANDLING ---
    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setLoading(true);
        const file = e.target.files[0];
        const fileName = `blog-${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage.from('media').upload(fileName, file);
        if (!error) {
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, image: publicUrl }));
            setToast({ message: 'Đã tải ảnh lên!', type: 'success' });
        } else {
            setToast({ message: 'Upload thất bại', type: 'error' });
        }
        setLoading(false);
    };

    const openMediaModal = (context: 'content' | 'featured' = 'content') => {
        setMediaContext(context);
        setIsMediaModalOpen(true);
        fetchMediaFiles();
    };

    const fetchMediaFiles = async () => {
        setMediaLoading(true);
        const { data } = await supabase.storage.from('media').list('', { limit: 50, sortBy: { column: 'created_at', order: 'desc' }});
        if (data) {
            const files = data
              .filter(f => f.metadata?.mimetype?.includes('image'))
              .map(f => {
                  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(f.name);
                  return { ...f, publicUrl };
              });
            setMediaFiles(files);
        }
        setMediaLoading(false);
    };

    const handleMediaSelection = (url: string) => {
        if (mediaContext === 'featured') {
            setFormData(prev => ({ ...prev, image: url }));
            setToast({ message: 'Đã chọn ảnh đại diện!', type: 'success' });
        } else {
            setPendingImageToInsert(url); // Send to TipTap
        }
        setIsMediaModalOpen(false);
    };

    // --- AI GENERATION ---
    const handleAiImageGen = async () => {
        if (!aiImagePrompt) return alert("Nhập mô tả ảnh!");
        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: aiImagePrompt }]
                }
            });
            
            let base64Data = null;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        base64Data = part.inlineData.data;
                        break;
                    }
                }
            }

            if (base64Data) {
                // Convert base64 to blob and upload to Supabase
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });
                
                const fileName = `ai-gen-${Date.now()}.png`;
                const { error } = await supabase.storage.from('media').upload(fileName, blob);
                
                if (error) throw error;
                
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
                
                setFormData(prev => ({ ...prev, image: publicUrl }));
                setToast({ message: 'Đã tạo ảnh thành công!', type: 'success' });
                setIsAiModalOpen(false);
            } else {
                throw new Error("Không nhận được dữ liệu ảnh từ AI.");
            }

        } catch (e: any) {
            console.error("AI Image Error:", e);
            setToast({ message: 'Lỗi tạo ảnh: ' + (e.message || 'Unknown error'), type: 'error' });
        } finally {
            setIsGeneratingImage(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-slate-500" />
                    </button>
                    <h2 className="font-bold text-xl text-dark dark:text-white">{post ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</h2>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAiModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Sparkles size={18} /> AI Assistant
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Lưu bài viết
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <input 
                            type="text" 
                            placeholder="Tiêu đề bài viết..." 
                            className="w-full text-4xl font-black bg-transparent border-none outline-none placeholder:text-slate-300 dark:text-white"
                            value={formData.title}
                            onChange={handleTitleChange}
                        />
                        
                        <TipTapEditor 
                            content={formData.content} 
                            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                            onImageUploadRequest={() => openMediaModal('content')}
                            pendingImageToInsert={pendingImageToInsert}
                            onImageInserted={() => setPendingImageToInsert(null)}
                        />
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Trạng thái</label>
                            <select 
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm dark:text-white"
                                value={formData.status}
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="published">Công khai (Published)</option>
                                <option value="draft">Bản nháp (Draft)</option>
                                <option value="archived">Lưu trữ (Archived)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Chuyên mục</label>
                            <select 
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm dark:text-white"
                                value={formData.category}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            >
                                <option value="">-- Chọn chuyên mục --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Đường dẫn (Slug)</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm dark:text-white"
                                value={formData.slug}
                                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mô tả ngắn</label>
                            <textarea 
                                rows={4}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm dark:text-white resize-none"
                                value={formData.excerpt}
                                onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ảnh đại diện</label>
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative group border border-slate-200 dark:border-slate-700">
                                {formData.image ? (
                                    <img src={formData.image} alt="Featured" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => openMediaModal('featured')} 
                                        className="p-2 bg-white rounded-full text-slate-800 hover:text-blue-500" 
                                        title="Chọn từ thư viện"
                                    >
                                        <FolderOpen size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="p-2 bg-white rounded-full text-slate-800 hover:text-green-500"
                                        title="Tải ảnh mới"
                                    >
                                        <UploadCloud size={16}/>
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFeaturedImageUpload} />
                                </div>
                            </div>
                            {loading && <div className="text-xs text-center mt-2 text-accent">Đang tải ảnh...</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Generator Modal */}
            <AnimatePresence>
                {isAiModalOpen && (
                    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-dark dark:text-white"><Bot size={20}/> AI Image Generator</h3>
                                <button onClick={() => setIsAiModalOpen(false)}><X size={20} className="text-slate-500"/></button>
                            </div>
                            <textarea 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-sm mb-4 dark:text-white"
                                rows={3}
                                placeholder="Mô tả ảnh bạn muốn tạo..."
                                value={aiImagePrompt}
                                onChange={e => setAiImagePrompt(e.target.value)}
                            ></textarea>
                            <button 
                                onClick={handleAiImageGen}
                                disabled={isGeneratingImage}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isGeneratingImage ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>} Tạo ảnh ngay
                            </button>
                            <p className="text-xs text-slate-500 mt-3 text-center">Powered by Google Gemini 2.5 Flash Image</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Media Selection Modal */}
            <AnimatePresence>
                {isMediaModalOpen && (
                    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                                <h3 className="font-bold text-lg text-dark dark:text-white">
                                    {mediaContext === 'featured' ? 'Chọn Ảnh đại diện' : 'Chèn ảnh vào nội dung'}
                                </h3>
                                <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-500 hover:text-dark dark:hover:text-white"><X/></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-900/50">
                                {mediaLoading ? (
                                    <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>
                                ) : (
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {mediaFiles.map((file, idx) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => handleMediaSelection(file.publicUrl)}
                                                className="aspect-square bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-accent hover:shadow-lg transition-all relative group overflow-hidden"
                                            >
                                                <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Check className="text-white bg-accent rounded-full p-1" size={24} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default PostEditor;
