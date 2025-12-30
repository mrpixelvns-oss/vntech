import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Search, Edit3, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
import Toast from '../../../components/Toast';
import { AnimatePresence } from 'framer-motion';

interface PostListProps {
    onEdit: (post: any) => void;
}

const ITEMS_PER_PAGE = 10;

const PostList: React.FC<PostListProps> = ({ onEdit }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postSearch, setPostSearch] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Delete State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchPosts(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [postSearch]);

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const fetchPosts = async (page: number) => {
        setLoading(true);
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        let query = supabase.from('posts').select('*', { count: 'exact' });

        if (postSearch) {
            query = query.ilike('title', `%${postSearch}%`);
        }

        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            setToast({ message: 'Lỗi tải dữ liệu: ' + error.message, type: 'error' });
        } else {
            setPosts(data || []);
            setTotalCount(count || 0);
            setCurrentPage(page);
        }
        setLoading(false);
    };

    const confirmDeletePost = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        const { error } = await supabase.from('posts').delete().eq('id', deleteModal.id);
        
        if (error) {
            setToast({ message: 'Lỗi khi xóa: ' + error.message, type: 'error' });
        } else {
            setToast({ message: 'Đã xóa bài viết thành công!', type: 'success' });
            fetchPosts(currentPage); // Refresh current page
        }
        
        setIsDeleting(false);
        setDeleteModal({ isOpen: false, id: null });
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm bài viết..." 
                        value={postSearch} 
                        onChange={(e) => setPostSearch(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-accent outline-none dark:text-white" 
                    />
                </div>
                <div className="text-xs text-slate-500 font-bold">
                    Tổng: {totalCount} bài viết
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" size={32}/></div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="p-4 w-12 text-center">ID</th>
                                    <th className="p-4">Tiêu đề</th>
                                    <th className="p-4">Trạng thái</th>
                                    <th className="p-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {posts.map(post => (
                                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="p-4 text-center text-slate-400">{post.id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-dark dark:text-white line-clamp-1">{post.title}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex gap-2">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 rounded">{post.category}</span>
                                                <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{post.status}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => onEdit(post)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded"><Edit3 size={18}/></button>
                                                <button onClick={() => confirmDeletePost(post.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Không tìm thấy bài viết nào.</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <ChevronLeft size={16} /> Trước
                            </button>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                Sau <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Xóa bài viết?"
                message="Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống."
                isLoading={isDeleting}
            />

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default PostList;