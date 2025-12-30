import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Search, Edit3, Trash2, Briefcase, Image as ImageIcon, Loader2, XCircle } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { AnimatePresence } from 'framer-motion';

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: 'Website',
    img: '',
    status: 'completed',
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) // e.g., "Oct 2023"
  });

  // Delete State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if(data) setProjects(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = editingProject 
      ? await supabase.from('projects').update(formData).eq('id', editingProject.id)
      : await supabase.from('projects').insert([formData]);

    setLoading(false);
    
    if (error) {
        setToast({ message: 'Lỗi: ' + error.message, type: 'error' });
    } else {
        setToast({ message: 'Đã lưu dự án thành công!', type: 'success' });
        setIsModalOpen(false);
        fetchProjects();
    }
  };

  const confirmDelete = (id: number) => {
      setDeleteModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
      if (!deleteModal.id) return;
      setIsDeleting(true);
      const { error } = await supabase.from('projects').delete().eq('id', deleteModal.id);
      
      if (error) {
          setToast({ message: 'Lỗi xóa dự án: ' + error.message, type: 'error' });
      } else {
          setToast({ message: 'Đã xóa dự án thành công!', type: 'success' });
          fetchProjects();
      }
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, id: null });
  };

  const openModal = (project: any = null) => {
      setEditingProject(project);
      if (project) {
          setFormData({
              title: project.title,
              client: project.client,
              category: project.category,
              img: project.img,
              status: project.status,
              date: project.date
          });
      } else {
          setFormData({
              title: '', client: '', category: 'Website', img: '', status: 'completed',
              date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          });
      }
      setIsModalOpen(true);
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.client?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Quản lý Dự án</h1>
          <p className="text-slate-500 dark:text-slate-400">Cập nhật Portfolio và Case Studies hiển thị trên website.</p>
        </div>
        <button 
            onClick={() => openModal()}
            className="px-4 py-2 bg-dark dark:bg-white text-white dark:text-dark font-bold rounded-lg hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Thêm dự án
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
         <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
               type="text" 
               placeholder="Tìm theo tên dự án, khách hàng..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-accent dark:text-white"
            />
         </div>
      </div>

      {/* Grid Projects */}
      {loading && !isModalOpen ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" size={32}/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map(project => (
                <div key={project.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                {/* Thumbnail */}
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {project.img ? (
                        <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon size={32} />
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            project.status === 'completed' ? 'bg-green-500 text-white' : 
                            project.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
                        }`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{project.category}</div>
                    <h3 className="font-bold text-lg text-dark dark:text-white mb-2 truncate">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <Briefcase size={14} /> {project.client}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">{project.date}</span>
                        <div className="flex gap-2">
                            <button onClick={() => openModal(project)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Edit3 size={16} />
                            </button>
                            <button onClick={() => confirmDelete(project.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            ))}
            
            {/* Add New Placeholder */}
            <button 
                onClick={() => openModal()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400 hover:border-accent hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
            >
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Plus size={24} />
                </div>
                <span className="font-bold">Thêm Dự án Mới</span>
            </button>
        </div>
      )}

      {/* --- MODAL EDITOR --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-xl text-dark dark:text-white">
                        {editingProject ? 'Sửa dự án' : 'Thêm dự án mới'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Tên dự án</label>
                        <input 
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none" 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Khách hàng (Client)</label>
                        <input 
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none" 
                            value={formData.client}
                            onChange={e => setFormData({...formData, client: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold mb-2">Hạng mục</label>
                            <input 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none" 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Thời gian (Date)</label>
                            <input 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none" 
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">URL Hình ảnh</label>
                        <input 
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none" 
                            value={formData.img}
                            onChange={e => setFormData({...formData, img: e.target.value})}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Trạng thái</label>
                        <select 
                             className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none"
                             value={formData.status}
                             onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="completed">Hoàn thành (Completed)</option>
                            <option value="in-progress">Đang thực hiện (In Progress)</option>
                            <option value="archived">Lưu trữ (Archived)</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="w-full py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accentHover transition-colors mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Lưu dự án'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Xóa dự án?"
        message="Bạn có chắc chắn muốn xóa dự án này? Hành động này sẽ xóa vĩnh viễn khỏi portfolio."
        isLoading={isDeleting}
      />

      {/* --- TOAST --- */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

    </div>
  );
};

export default ProjectManager;