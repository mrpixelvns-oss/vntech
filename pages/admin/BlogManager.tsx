import React, { useState } from 'react';
import { Plus, FileText, Layers, Sparkles } from 'lucide-react';
import PostList from './blog/PostList';
import CategoryManager from './blog/CategoryManager';
import PostEditor from './blog/PostEditor';
import Toast from '../../components/Toast';
import { AnimatePresence } from 'framer-motion';

const BlogManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const openPostEditor = (post: any = null) => {
      setEditingPost(post);
      setIsPostEditorOpen(true);
  };

  const handleSaveSuccess = () => {
      setToast({ message: 'Đã lưu bài viết thành công!', type: 'success' });
      setIsPostEditorOpen(false);
      // We rely on PostList to re-fetch when it mounts or receives a signal, 
      // but for now, re-mounting PostList by key or just closing modal is enough as List updates on state change.
      // Ideally, pass a refresh trigger to PostList.
      // Simplest way: Switch tab briefly or force re-render. 
      // Actually, PostList fetches on mount. When we close modal, PostList is still mounted.
      // To force refresh, we can pass a key to PostList.
  };

  // State to force refresh PostList
  const [refreshList, setRefreshList] = useState(0);
  const triggerRefresh = () => {
      handleSaveSuccess();
      setRefreshList(prev => prev + 1);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Quản lý Blog</h1>
          <div className="flex gap-6 mt-4 border-b border-slate-200 dark:border-slate-800 w-full md:w-auto">
             <button onClick={() => setActiveTab('posts')} className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'posts' ? 'border-accent text-accent' : 'border-transparent text-slate-500'}`}><FileText size={16} /> Bài viết</button>
             <button onClick={() => setActiveTab('categories')} className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'categories' ? 'border-accent text-accent' : 'border-transparent text-slate-500'}`}><Layers size={16} /> Chuyên mục</button>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => openPostEditor(null)} className="px-4 py-2 bg-dark dark:bg-white text-white dark:text-dark font-bold rounded-lg hover:bg-accent hover:text-white transition-colors flex items-center gap-2 shadow-lg"><Plus size={18} /> {activeTab === 'posts' ? 'Viết bài mới' : 'Thêm chuyên mục'}</button>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === 'posts' && (
          // Passing key to force re-mount on refresh is a simple way to reload data
          <PostList key={refreshList} onEdit={openPostEditor} />
      )}

      {activeTab === 'categories' && (
          <CategoryManager />
      )}

      {/* EDITOR MODAL */}
      {isPostEditorOpen && (
          <PostEditor 
            post={editingPost} 
            onClose={() => setIsPostEditorOpen(false)} 
            onSaveSuccess={triggerRefresh}
          />
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;