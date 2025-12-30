
import React, { useEffect, useState, useRef } from 'react';
import grapesjs from 'grapesjs';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Save, ArrowLeft, Eye, Loader2, Settings } from 'lucide-react';
import Toast from '../../../components/Toast';
import { AnimatePresence } from 'framer-motion';

const Editor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editor, setEditor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageData, setPageData] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const editorRef = useRef<any>(null);

    const getErrorMessage = (error: any): string => {
        if (!error) return 'Unknown error';
        if (typeof error === 'string') return error;
        if (error.message) return error.message;
        return JSON.stringify(error);
    };

    useEffect(() => {
        if (id) {
            fetchPageData();
        }
    }, [id]);

    const fetchPageData = async () => {
        const { data, error } = await supabase.from('dynamic_pages').select('*').eq('id', id).single();
        if (error) {
            console.error("Error fetching page:", error);
            alert("Không tìm thấy trang hoặc lỗi kết nối: " + getErrorMessage(error));
            navigate('/admin/pages');
            return;
        }
        setPageData(data);
        setLoading(false);
    };

    useEffect(() => {
        if (!loading && pageData && !editorRef.current) {
            initGrapes();
        }
        return () => {
            if (editorRef.current) {
                try {
                    editorRef.current.destroy();
                } catch (e) {
                    console.warn("GrapesJS destroy warning:", e);
                }
                editorRef.current = null;
                setEditor(null);
            }
        };
    }, [loading, pageData]);

    const initGrapes = () => {
        const container = document.getElementById('gjs');
        if (!container) return;

        const gjs = grapesjs.init({
            container: '#gjs',
            height: '100vh',
            width: '100%',
            fromElement: false, 
            storageManager: {
                type: 'remote', 
                autosave: false,
                autoload: false,
            },
            assetManager: {
                assets: [], 
                upload: false,
                embedAsBase64: true, 
            },
            blockManager: {
                appendTo: '#blocks',
            },
            styleManager: {
                appendTo: '#styles-container',
                sectors: [{
                    name: 'General',
                    open: false,
                    buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
                  },{
                    name: 'Dimension',
                    open: false,
                    buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding']
                  },{
                    name: 'Typography',
                    open: false,
                    buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow']
                  },{
                    name: 'Decorations',
                    open: false,
                    buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background']
                  }
                ],
            },
            layerManager: {
                appendTo: '#layers-container',
            },
            traitManager: {
                appendTo: '#traits-container',
            },
            panels: {
                defaults: []
            }
        });

        // Load Content Safely
        if (pageData.gjs_components) {
            try {
                let components = pageData.gjs_components;
                if (typeof components === 'string') {
                    components = JSON.parse(components);
                }
                if (components) {
                    gjs.setComponents(components);
                }
            } catch (e) {
                console.error("Error loading GJS components", e);
            }
        }

        if (pageData.gjs_styles) {
            try {
                let styles = pageData.gjs_styles;
                if (typeof styles === 'string') {
                    styles = JSON.parse(styles);
                }
                if (styles) {
                    gjs.setStyle(styles);
                }
            } catch (e) {
                console.error("Error loading GJS styles", e);
            }
        }

        // --- DEFINING GRIFOW DESIGN BLOCKS ---
        const bm = gjs.BlockManager;

        // 1. Hero Home
        bm.add('hero-home', {
            label: 'Hero Grifow',
            category: 'Grifow Design',
            media: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H4z" fill="none" stroke="currentColor"/><path d="M4 16h16v4H4z" fill="currentColor" opacity="0.3"/></svg>',
            content: `
                <section class="py-20 md:py-32 bg-white dark:bg-slate-950 px-4 text-center">
                    <div class="max-w-4xl mx-auto">
                        <div class="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-600 text-xs font-bold uppercase tracking-wider mb-6">Grifow Digital Agency</div>
                        <h1 class="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Chúng tôi kiến tạo <br/> <span class="text-cyan-500">Hệ sinh thái số</span>
                        </h1>
                        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Từ Website đẳng cấp đến chiến lược Marketing tổng thể. Chúng tôi giúp doanh nghiệp của bạn được tìm thấy, được yêu thích và tăng trưởng bền vững.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#/contact" class="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-cyan-500 transition-colors">Bắt đầu dự án</a>
                            <a href="#/services" class="px-8 py-4 border border-slate-200 text-slate-900 dark:text-white rounded-full font-bold hover:bg-slate-50 transition-colors">Xem dịch vụ</a>
                        </div>
                    </div>
                </section>
            `
        });

        // 2. Services Grid
        bm.add('services-grid', {
            label: 'Services 3 Col',
            category: 'Grifow Design',
            content: `
                <section class="py-24 bg-slate-50 dark:bg-slate-900 px-4">
                    <div class="max-w-7xl mx-auto">
                        <div class="text-center mb-16">
                            <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Hệ sinh thái dịch vụ</h2>
                            <p class="text-slate-500 dark:text-slate-400">Giải pháp toàn diện cho doanh nghiệp số.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl">💻</div>
                                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Thiết kế Website</h3>
                                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Giao diện độc quyền, chuẩn SEO, tối ưu trải nghiệm người dùng (UI/UX).</p>
                            </div>
                            <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                                <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-2xl">🎨</div>
                                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Branding</h3>
                                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Nhận diện thương hiệu nhất quán từ Logo, Namecard đến ấn phẩm truyền thông.</p>
                            </div>
                            <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                                <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 text-2xl">📈</div>
                                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Digital Marketing</h3>
                                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">SEO tổng thể, quảng cáo đa kênh giúp tăng trưởng doanh thu bền vững.</p>
                            </div>
                        </div>
                    </div>
                </section>
            `
        });

        // 3. Image with Text
        bm.add('image-text', {
            label: 'Image + Text',
            category: 'Grifow Design',
            content: `
                <section class="py-24 bg-white dark:bg-slate-950 px-4">
                    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                Nghệ thuật của sự <span class="text-cyan-500">Chính xác.</span>
                            </h2>
                            <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                Tại Grifow, chúng tôi không chỉ làm web. Chúng tôi kiến tạo những tác phẩm số nơi Logic gặp gỡ Cảm xúc. Mỗi pixel đều có mục đích, mỗi dòng code đều tối ưu.
                            </p>
                            <a href="#/about" class="text-slate-900 dark:text-white font-bold border-b-2 border-cyan-500 pb-1">Xem thêm về chúng tôi</a>
                        </div>
                        <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover" alt="About Us"/>
                        </div>
                    </div>
                </section>
            `
        });

        // 4. CTA Block
        bm.add('cta-block', {
            label: 'CTA Block',
            category: 'Grifow Design',
            content: `
                <section class="py-24 bg-slate-900 text-white px-4 text-center">
                    <div class="max-w-3xl mx-auto">
                        <h2 class="text-4xl md:text-5xl font-bold mb-6">Sẵn sàng nâng tầm thương hiệu?</h2>
                        <p class="text-xl text-slate-300 mb-10">Đừng để đối thủ vượt mặt. Hãy bắt đầu xây dựng đế chế số của bạn ngay hôm nay cùng Grifow.</p>
                        <a href="#/contact" class="inline-block px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-cyan-500 hover:text-white transition-colors">Nhận báo giá miễn phí</a>
                    </div>
                </section>
            `
        });

        editorRef.current = gjs;
        setEditor(gjs);
    };

    const handleSave = async () => {
        if (!editor) return;
        setSaving(true);
        
        try {
            const components = JSON.stringify(editor.getComponents());
            const styles = JSON.stringify(editor.getStyle());
            const html = editor.getHtml();
            const css = editor.getCss();

            const { error } = await supabase.from('dynamic_pages').update({
                gjs_components: components,
                gjs_styles: styles,
                html_content: html,
                css_content: css,
                updated_at: new Date().toISOString()
            }).eq('id', id);

            if (error) {
                throw error;
            } else {
                setToast({ message: 'Đã lưu trang thành công!', type: 'success' });
            }
        } catch (error: any) {
            console.error("Save error:", error);
            setToast({ message: 'Lỗi lưu: ' + getErrorMessage(error), type: 'error' });
        }
        setSaving(false);
    };

    const handlePublishToggle = async () => {
        const newStatus = !pageData.published;
        const { error } = await supabase.from('dynamic_pages').update({ published: newStatus }).eq('id', id);
        if(!error) {
            setPageData({...pageData, published: newStatus});
            setToast({ message: newStatus ? 'Đã xuất bản trang!' : 'Đã chuyển về bản nháp.', type: 'success' });
        } else {
            setToast({ message: 'Lỗi cập nhật trạng thái: ' + getErrorMessage(error), type: 'error' });
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin" /> Loading Builder...</div>;

    return (
        <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
            {/* Toolbar */}
            <div className="h-14 border-b border-slate-700 bg-slate-800 flex justify-between items-center px-4 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/pages')} className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20}/>
                    </button>
                    <div>
                        <h1 className="font-bold text-sm">{pageData.title}</h1>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${pageData.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {pageData.published ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handlePublishToggle} className="px-3 py-1.5 text-xs font-bold border border-slate-600 rounded hover:bg-slate-700 transition-colors">
                        {pageData.published ? 'Gỡ xuống' : 'Xuất bản'}
                    </button>
                    {/* Preview Link logic */}
                    <a 
                        href={pageData.slug === 'home' ? '/#/' : (pageData.slug === 'about' ? '/#/about' : (pageData.slug === 'services' ? '/#/services' : `/#/p/${pageData.slug}`))} 
                        target="_blank" 
                        className="px-3 py-1.5 text-xs font-bold border border-slate-600 rounded hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                        <Eye size={14}/> Preview
                    </a>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 bg-accent text-white text-xs font-bold rounded hover:bg-accentHover transition-colors flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>} Lưu
                    </button>
                </div>
            </div>

            {/* Main Editor Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Layers/Blocks */}
                <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                    <div className="flex border-b border-slate-700">
                        <div className="flex-1 p-3 text-center text-xs font-bold border-r border-slate-700 cursor-default bg-slate-700">Blocks</div>
                    </div>
                    <div id="blocks" className="flex-1 overflow-y-auto p-2"></div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 bg-[#1e1e1e] relative">
                    <div id="gjs" className="h-full w-full"></div>
                </div>

                {/* Right Panel: Styles/Traits */}
                <div className="w-72 bg-slate-800 border-l border-slate-700 flex flex-col">
                    <div className="p-2 border-b border-slate-700 text-xs font-bold flex items-center gap-2">
                        <Settings size={14}/> Properties
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div id="traits-container"></div>
                        <div id="styles-container"></div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* Global GrapesJS Styles Override for Dark Mode UI */}
            <style>{`
                .gjs-one-bg { background-color: #1e293b; }
                .gjs-two-color { color: #cbd5e1; }
                .gjs-three-bg { background-color: #00c4b4; color: white; }
                .gjs-four-color, .gjs-four-color-h:hover { color: #00c4b4; }
                .gjs-block { border: 1px solid #334155; background-color: #0f172a; color: white; padding: 10px; border-radius: 4px; margin-bottom: 5px; cursor: move; }
                .gjs-block:hover { border-color: #00c4b4; }
                .gjs-field { background-color: #0f172a; border: 1px solid #334155; color: white; border-radius: 4px; }
                .gjs-sm-sector .gjs-sm-title { background-color: #1e293b; border-bottom: 1px solid #334155; font-weight: bold; }
                .gjs-cv-canvas { width: 100%; height: 100%; top: 0; }
                input.gjs-field-color-picker { background-color: #334155; }
            `}</style>
        </div>
    );
};

export default Editor;
