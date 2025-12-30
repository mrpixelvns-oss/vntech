import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Trash2 } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import Toast from '../../../components/Toast';
import { AnimatePresence } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    slug: string;
}

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
        if (data) setCategories(data);
        setLoading(false);
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setLoading(true);
        const slug = newCategoryName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        
        const { error } = await supabase.from('categories').insert([{ name: newCategoryName, slug }]);
        
        if (error) {
            setToast({ message: 'Lỗi: ' + error.message, type: 'error' });
        } else {
            setToast({ message: 'Đã thêm chuyên mục!', type: 'success' });
            setNewCategoryName('');
            fetchCategories();
        }
        setLoading(false);
    };

    const confirmDeleteCategory = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        const { error } = await supabase.from('categories').delete().eq('id', deleteModal.id);
        
        if (error) {
            setToast({ message: 'Lỗi khi xóa: ' + error.message, type: 'error' });
        } else {
            setCategories(prev => prev.filter(c => c.id !== deleteModal.id));
            setToast({ message: 'Đã xóa chuyên mục thành công!', type: 'success' });
        }
        setIsDeleting(false);
        setDeleteModal({ isOpen: false, id: null });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 h-fit">
                <h3 className="font-bold text-lg mb-4 text-dark dark:text-white">Thêm chuyên mục mới</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Tên chuyên mục</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="VD: Công nghệ..."
                            disabled={loading}
                        />
                    </div>
                    <button 
                        onClick={handleAddCategory} 
                        disabled={loading}
                        className="w-full py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm mới'}
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-4 w-12 text-center">ID</th>
                            <th className="p-4">Tên chuyên mục</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {categories.map(cat => (
                            <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="p-4 text-center text-slate-400">{cat.id}</td>
                                <td className="p-4 font-bold text-dark dark:text-white">{cat.name}</td>
                                <td className="p-4 text-slate-500 text-sm">{cat.slug}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => confirmDeleteCategory(cat.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && !loading && <tr><td colSpan={4} className="p-4 text-center text-slate-500">Chưa có chuyên mục nào.</td></tr>}
                    </tbody>
                </table>
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Xóa chuyên mục?"
                message="Xóa chuyên mục sẽ không xóa các bài viết bên trong, nhưng có thể ảnh hưởng đến phân loại."
                isLoading={isDeleting}
            />
            
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CategoryManager;