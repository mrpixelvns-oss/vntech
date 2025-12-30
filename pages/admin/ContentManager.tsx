
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Loader2, Layout, Type, Image as ImageIcon, RotateCcw } from 'lucide-react';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import { AnimatePresence } from 'framer-motion';
import { DEFAULT_CONTENT } from '../../lib/defaultContent';
import { PAGE_CONFIG } from '../../lib/pageConfig';

const ContentManager: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState('home');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [pageData, setPageData] = useState<Record<string, any>>({}); 
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [resetModal, setResetModal] = useState<{ isOpen: boolean; sectionKey: string | null }>({ isOpen: false, sectionKey: null });

    useEffect(() => {
        fetchPageData(selectedPage);
    }, [selectedPage]);

    const fetchPageData = async (slug: string) => {
        setLoading(true);
        
        // 1. Load Defaults First
        const defaults = DEFAULT_CONTENT[slug] || {};
        
        // 2. Load from DB
        const { data, error } = await supabase
            .from('page_sections')
            .select('*')
            .eq('page_slug', slug);

        // 3. Merge: Start with Defaults -> Override with DB content
        // IMPORTANT: We use deep copy to avoid mutation reference issues
        let mergedContent = JSON.parse(JSON.stringify(defaults)); 

        if (data && data.length > 0) {
            data.forEach((item: any) => {
                // If the section exists in defaults, merge it (so new default keys appear even if DB has old data)
                // If not in defaults (custom section?), just use DB data
                if (mergedContent[item.section_key]) {
                    mergedContent[item.section_key] = {
                        ...mergedContent[item.section_key],
                        ...item.content 
                    };
                } else {
                    mergedContent[item.section_key] = item.content;
                }
            });
        }
        
        setPageData(mergedContent);
        setLoading(false);
    };

    const handleInputChange = (sectionKey: string, fieldKey: string, value: string) => {
        setPageData(prev => ({
            ...prev,
            [sectionKey]: {
                ...(prev[sectionKey] || {}),
                [fieldKey]: value
            }
        }));
    };

    const handleResetClick = (sectionKey: string) => {
        setResetModal({ isOpen: true, sectionKey });
    };

    const handleConfirmReset = () => {
        const sectionKey = resetModal.sectionKey;
        if (!sectionKey) return;

        const defaultPageContent = DEFAULT_CONTENT[selectedPage];
        if (!defaultPageContent) {
            setToast({ message: 'Lỗi: Không tìm thấy file cấu hình mặc định.', type: 'error' });
            setResetModal({ isOpen: false, sectionKey: null });
            return;
        }

        const defaultSection = defaultPageContent[sectionKey];
        if (!defaultSection) {
             setToast({ message: `Không tìm thấy nội dung gốc cho phần này.`, type: 'error' });
             setResetModal({ isOpen: false, sectionKey: null });
             return;
        }

        // Deep copy to create new reference ensuring React updates the inputs immediately
        const newSectionData = JSON.parse(JSON.stringify(defaultSection));

        setPageData(prev => ({
            ...prev,
            [sectionKey]: newSectionData
        }));
        
        setToast({ message: 'Đã khôi phục nội dung gốc (Chưa lưu). Hãy bấm Lưu để áp dụng.', type: 'success' });
        setResetModal({ isOpen: false, sectionKey: null });
    };

    const handleSave = async () => {
        setSaving(true);
        
        // Prepare upsert array
        const updates = Object.keys(pageData).map(sectionKey => ({
            page_slug: selectedPage,
            section_key: sectionKey,
            content: pageData[sectionKey]
        }));

        if (updates.length === 0) {
            setSaving(false);
            return;
        }

        const { error } = await supabase
            .from('page_sections')
            .upsert(updates, { onConflict: 'page_slug,section_key' });

        if (error) {
            setToast({ message: 'Lỗi lưu dữ liệu: ' + error.message, type: 'error' });
        } else {
            setToast({ message: 'Đã cập nhật nội dung trang thành công!', type: 'success' });
        }
        setSaving(false);
    };

    const currentConfig = PAGE_CONFIG[selectedPage];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Quản lý Nội dung</h1>
                    <p className="text-slate-500 dark:text-slate-400">Chỉnh sửa nội dung text cho các trang tĩnh.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Lưu thay đổi
                </button>
            </div>

            {/* Page Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
                {Object.keys(PAGE_CONFIG).map(slug => (
                    <button
                        key={slug}
                        onClick={() => setSelectedPage(slug)}
                        className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-colors whitespace-nowrap ${
                            selectedPage === slug 
                            ? 'bg-white dark:bg-slate-900 text-accent border-b-2 border-accent' 
                            : 'text-slate-500 hover:text-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {PAGE_CONFIG[slug].label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {Object.keys(currentConfig.sections).map(sectionKey => {
                        const sectionConfig = currentConfig.sections[sectionKey];
                        const sectionData = pageData[sectionKey] || {};

                        return (
                            <div key={sectionKey} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                            <Layout size={18}/>
                                        </div>
                                        <h3 className="font-bold text-lg text-dark dark:text-white">{sectionConfig.label}</h3>
                                    </div>
                                    <button 
                                        onClick={() => handleResetClick(sectionKey)}
                                        className="text-xs flex items-center gap-1 text-slate-400 hover:text-accent transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                        title="Khôi phục nội dung gốc"
                                    >
                                        <RotateCcw size={14} /> Khôi phục mặc định
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {sectionConfig.fields.map((field: any) => (
                                        <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                                                {field.label}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    rows={3}
                                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white resize-y transition-all"
                                                    value={sectionData[field.key] || ''}
                                                    onChange={(e) => handleInputChange(sectionKey, field.key, e.target.value)}
                                                    placeholder={`Nhập ${field.label}...`}
                                                />
                                            ) : (
                                                <div className="relative">
                                                    <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white transition-all"
                                                        value={sectionData[field.key] || ''}
                                                        onChange={(e) => handleInputChange(sectionKey, field.key, e.target.value)}
                                                        placeholder={`Nhập ${field.label}...`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Confirm Reset Modal */}
            <ConfirmModal 
                isOpen={resetModal.isOpen}
                onClose={() => setResetModal({ isOpen: false, sectionKey: null })}
                onConfirm={handleConfirmReset}
                title="Khôi phục mặc định?"
                message="Toàn bộ nội dung của phần này sẽ bị thay thế bằng nội dung gốc của giao diện. Bạn có chắc chắn không?"
                confirmLabel="Khôi phục ngay"
            />

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default ContentManager;
