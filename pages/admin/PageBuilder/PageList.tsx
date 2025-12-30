
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { DynamicPage } from '../../../types';
import { Plus, Edit3, Trash2, Eye, Loader2, Search, Globe, Home, Info, Briefcase, Megaphone, Cpu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../components/ConfirmModal';
import Toast from '../../../components/Toast';
import { AnimatePresence } from 'framer-motion';

const PageList: React.FC = () => {
    const [pages, setPages] = useState<DynamicPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('dynamic_pages').select('*').order('created_at', { ascending: false });
        if (data) setPages(data);
        else console.error(error);
        setLoading(false);
    };

    const handleCreateNew = async (forcedTitle?: string, forcedSlug?: string) => {
        const title = forcedTitle || prompt("Nhập tên trang mới (VD: Landing Page Black Friday):");
        if (!title) return;

        let slug = forcedSlug || title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        
        // Prevent dupes for custom pages, but allow overwrite logic for system pages
        if (!forcedSlug) {
             slug += '-' + Date.now().toString().slice(-4);
        }

        const { data, error } = await supabase.from('dynamic_pages').insert([{
            title,
            slug,
            published: false
        }]).select().single();

        if (error) {
            // If duplicate slug (system page already exists)
            if (error.code === '23505') { 
                setToast({ message: 'Trang này đã tồn tại trong danh sách.', type: 'error' });
            } else {
                setToast({ message: 'Lỗi tạo trang: ' + error.message, type: 'error' });
            }
        } else if (data) {
            navigate(`/admin/pages/builder/${data.id}`);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        const { error } = await supabase.from('dynamic_pages').delete().eq('id', deleteModal.id);
        
        if (error) {
            setToast({ message: 'Lỗi xóa: ' + error.message, type: 'error' });
        } else {
            setToast({ message: 'Đã xóa trang thành công', type: 'success' });
            setPages(prev => prev.filter(p => p.id !== deleteModal.id));
        }
        setIsDeleting(false);
        setDeleteModal({ isOpen: false, id: null });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Quản lý Trang</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tạo Landing Page hoặc chỉnh sửa các trang chính.</p>
                </div>
                <button 
                    onClick={() => handleCreateNew()}
                    className="px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors flex items-center gap-2 shadow-lg"
                >
                    <Plus size={18} /> Tạo Landing Page
                </button>
            </div>

            {/* Quick Actions for System Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <button 
                    onClick={() => handleCreateNew('Trang chủ (Home)', 'home')}
                    className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-left hover:shadow-md transition-all flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center"><Home size={20}/></div>
                    <div>
                        <div className="font-bold text-dark dark:text-white text-sm">Sửa trang chủ</div>
                        <div className="text-xs text-slate-500">Tạo bản chỉnh sửa cho "/"</div>
                    </div>
                </button>
                <button 
                    onClick={() => handleCreateNew('Về chúng tôi (About)', 'about')}
                    className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl text-left hover:shadow-md transition-all flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 flex items-center justify-center"><Info size={20}/></div>
                    <div>
                        <div className="font-bold text-dark dark:text-white text-sm">Sửa trang About</div>
                        <div className="text-xs text-slate-500">Tạo bản chỉnh sửa cho "/about"</div>
                    </div>
                </button>
                <button 
                    onClick={() => handleCreateNew('Dịch vụ (Services)', 'services')}
                    className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl text-left hover:shadow-md transition-all flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 flex items-center justify-center"><Briefcase size={20}/></div>
                    <div>
                        <div className="font-bold text-dark dark:text-white text-sm">Sửa trang Services</div>
                        <div className="text-xs text-slate-500">Tạo bản chỉnh sửa cho "/services"</div>
                    </div>
                </button>
                
                {/* NEW SERVICE PAGES */}
                <button 
                    onClick={() => handleCreateNew('Digital Marketing', 'digital-marketing')}
                    className="p-4 bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30 rounded-xl text-left hover:shadow-md transition-all flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 flex items-center justify-center"><Megaphone size={20}/></div>
                    <div>
                        <div className="font-bold text-dark dark:text-white text-sm">Sửa Digital Marketing</div>
                        <div className="text-xs text-slate-500">Tạo bản chỉnh sửa cho "/digital-marketing"</div>
                    </div>
                </button>
                <button 
                    onClick={() => handleCreateNew('Giải pháp Công nghệ', 'tech-solutions')}
                    className="p-4 bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 rounded-xl text-left hover:shadow-md transition-all flex items-center gap-3"
                >
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-600 flex items-center justify-center"><Cpu size={20}/></div>
                    <div>
                        <div className="font-bold text-dark dark:text-white text-sm">Sửa Tech Solutions</div>
                        <div className="text-xs text-slate-500">Tạo bản chỉnh sửa cho "/tech-solutions"</div>
                    </div>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : pages.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">Chưa có trang nào. Hãy tạo mới.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="p-4">Tên trang</th>
                                <th className="p-4">Đường dẫn (Slug)</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                            {pages.map(page => (
                                <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-bold text-dark dark:text-white">
                                        {page.title}
                                        {['home', 'about', 'services', 'digital-marketing', 'tech-solutions'].includes(page.slug) && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded uppercase">System</span>}
                                    </td>
                                    <td className="p-4 text-slate-500 flex items-center gap-2">
                                        <Globe size={14}/> {page.slug === 'home' ? '/' : (page.slug.includes('-') ? `/services/${page.slug}` : `/p/${page.slug}`)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${page.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {page.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {page.published && (
                                                <Link to={`/admin/pages/builder/${page.id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 rounded transition-colors" title="Xem trang">
                                                    <Eye size={18}/>
                                                </Link>
                                            )}
                                            <Link to={`/admin/pages/builder/${page.id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-accent rounded transition-colors" title="Sửa giao diện">
                                                <Edit3 size={18}/>
                                            </Link>
                                            <button onClick={() => setDeleteModal({ isOpen: true, id: page.id })} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded transition-colors" title="Xóa">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Xóa trang?"
                message="Hành động này sẽ xóa vĩnh viễn trang này và không thể khôi phục."
                isLoading={isDeleting}
            />

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default PageList;
