
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Mail, Phone, Clock, CheckCircle2, MessageSquare, AlertCircle, Loader2, Trash2, Edit3, Save, X, FileText, HelpCircle, LayoutGrid, List as ListIcon, MoreHorizontal } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';

// --- HELPER & COMPONENT DEFINITIONS ---

const getStatusColor = (status: string) => {
  switch(status) {
    case 'new': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'processing': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'completed': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    default: return 'bg-slate-100 text-slate-600';
  }
};

interface ContactCardProps {
    contact: any;
    compact?: boolean;
    onStatusChange: (id: number, status: string) => void;
    onComment: (contact: any) => void;
    onDelete: (id: number) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, compact = false, onStatusChange, onComment, onDelete }) => (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative group ${compact ? 'p-4' : 'p-6'}`}>
        {!compact && (
           <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(contact.status)}`}>
              {contact.status === 'new' && 'Mới'}
              {contact.status === 'processing' && 'Đang xử lý'}
              {contact.status === 'completed' && 'Hoàn thành'}
           </div>
        )}

        <div className={`flex ${compact ? 'flex-col gap-3' : 'flex-col md:flex-row gap-6'}`}>
            {/* User Info */}
            <div className={`flex-shrink-0 flex flex-col gap-2 ${!compact && 'md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300">
                        {contact.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-sm text-dark dark:text-white truncate">{contact.name}</h3>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {new Date(contact.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate"><Mail size={12} className="text-slate-400"/> {contact.email}</div>
                    <div className="flex items-center gap-2 truncate"><Phone size={12} className="text-slate-400"/> {contact.phone}</div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
                <div className="mb-1">
                    {!compact && <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Dịch vụ</span>}
                    <div className="text-accent font-bold text-sm">{contact.service || 'Tư vấn chung'}</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1"><MessageSquare size={10}/> Lời nhắn:</div>
                    <div className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic line-clamp-3">
                        "{contact.message}"
                    </div>
                </div>

                {contact.note && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                        <div className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 flex items-center gap-1"><FileText size={10}/> Admin:</div>
                        <div className="text-slate-700 dark:text-slate-300 text-xs truncate">{contact.note}</div>
                    </div>
                )}
            </div>
        </div>

        {/* Actions */}
        <div className={`mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-end gap-2 ${compact ? 'flex-col' : ''}`}>
            {compact ? (
                <div className="flex gap-1 justify-between">
                    <button onClick={() => onComment(contact)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit3 size={14}/></button>
                    
                    {/* Status Dropdown Logic for Compact Card */}
                    <div className="flex gap-1">
                        {contact.status !== 'new' && <button onClick={() => onStatusChange(contact.id, 'new')} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Mới"><LayoutGrid size={14}/></button>}
                        {contact.status !== 'processing' && <button onClick={() => onStatusChange(contact.id, 'processing')} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Xử lý"><AlertCircle size={14}/></button>}
                        {contact.status !== 'completed' && <button onClick={() => onStatusChange(contact.id, 'completed')} className="p-2 text-slate-400 hover:text-green-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Hoàn thành"><CheckCircle2 size={14}/></button>}
                    </div>

                    <button onClick={() => onDelete(contact.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg"><Trash2 size={14}/></button>
                </div>
            ) : (
                <>
                    {contact.status !== 'new' && (
                        <button onClick={() => onStatusChange(contact.id, 'new')} className="text-xs font-bold text-slate-500 hover:text-dark dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Đánh dấu Mới</button>
                    )}
                    {contact.status !== 'processing' && (
                        <button onClick={() => onStatusChange(contact.id, 'processing')} className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-colors"><AlertCircle size={14}/> Đang tư vấn</button>
                    )}
                    {contact.status !== 'completed' && (
                        <button onClick={() => onStatusChange(contact.id, 'completed')} className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"><CheckCircle2 size={14}/> Hoàn thành</button>
                    )}
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <button onClick={() => onComment(contact)} className="flex items-center gap-1 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"><Edit3 size={14}/> {contact.note ? 'Sửa ghi chú' : 'Ghi chú'}</button>
                    <button onClick={() => onDelete(contact.id)} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-500 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"><Trash2 size={14}/></button>
                </>
            )}
        </div>
    </div>
);

const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list'); // 'list' or 'board'
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Delete State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Comment/Note State
  const [commentModal, setCommentModal] = useState<{ isOpen: boolean; id: number | null; note: string }>({ isOpen: false, id: null, note: '' });
  const [isSavingComment, setIsSavingComment] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching contacts:", error);
        setToast({ message: 'Lỗi tải dữ liệu: ' + error.message, type: 'error' });
    } else if (data) {
        setContacts(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistic UI update
    setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
    
    const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', id);
    if (error) {
        setToast({ message: 'Không thể cập nhật trạng thái: ' + error.message, type: 'error' });
        fetchContacts(); // Revert on error
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
      if (!deleteModal.id) return;
      setIsDeleting(true);
      const { error } = await supabase.from('contacts').delete().eq('id', deleteModal.id);
      
      if (error) {
          setToast({ message: 'Lỗi xóa: ' + error.message, type: 'error' });
      } else {
          setContacts(contacts.filter(c => c.id !== deleteModal.id));
          setToast({ message: 'Đã xóa liên hệ thành công!', type: 'success' });
      }
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, id: null });
  };

  // --- COMMENT LOGIC ---
  const openCommentModal = (contact: any) => {
      setCommentModal({ isOpen: true, id: contact.id, note: contact.note || '' });
  };

  const handleSaveComment = async () => {
      if (!commentModal.id) return;
      setIsSavingComment(true);

      const { error } = await supabase
          .from('contacts')
          .update({ note: commentModal.note })
          .eq('id', commentModal.id);

      if (error) {
          if (error.message.includes("Could not find the 'note' column") || error.code === 'PGRST204') {
             setToast({ 
                 message: "Lỗi DB: Chưa có cột 'note'. Vui lòng chạy SQL: ALTER TABLE contacts ADD COLUMN note text;", 
                 type: 'error' 
             });
          } else {
             setToast({ message: 'Lỗi lưu ghi chú: ' + error.message, type: 'error' });
          }
      } else {
          // Update local state
          setContacts(contacts.map(c => c.id === commentModal.id ? { ...c, note: commentModal.note } : c));
          setToast({ message: 'Đã lưu ghi chú thành công!', type: 'success' });
          setCommentModal({ isOpen: false, id: null, note: '' });
      }
      setIsSavingComment(false);
  };

  const filteredContacts = filterStatus === 'all' 
    ? contacts 
    : contacts.filter(c => c.status === filterStatus);

  if (loading) {
     return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-accent" size={32}/></div>;
  }

  return (
    <div className="space-y-6">
       {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Yêu cầu Liên hệ (CRM)</h1>
          <p className="text-slate-500 dark:text-slate-400">Quản lý danh sách khách hàng tiềm năng và trạng thái tư vấn.</p>
        </div>
      </div>

       {/* Toolbar */}
       <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    title="Danh sách"
                >
                    <ListIcon size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('board')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white dark:bg-slate-700 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    title="Kanban Board"
                >
                    <LayoutGrid size={18} />
                </button>
            </div>

            {/* Filter Tabs (Only show in List mode or filter global) */}
            {viewMode === 'list' && (
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'new', label: 'Mới' },
                    { id: 'processing', label: 'Đang tư vấn' },
                    { id: 'completed', label: 'Hoàn thành' },
                ].map(tab => (
                    <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                        filterStatus === tab.id 
                        ? 'bg-dark dark:bg-white text-white dark:text-dark' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    >
                    {tab.label}
                    </button>
                ))}
                </div>
            )}
        </div>
        
        <div className="relative w-full lg:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm tên, email, sđt..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-accent text-sm dark:text-white"
          />
        </div>
      </div>

      {/* --- LIST VIEW --- */}
      {viewMode === 'list' && (
          <div className="grid grid-cols-1 gap-4">
            {filteredContacts.map(contact => (
                <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    onStatusChange={handleStatusChange}
                    onComment={openCommentModal}
                    onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                />
            ))}
            {filteredContacts.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Mail size={32} />
                </div>
                <p className="text-slate-500 font-medium">Không tìm thấy yêu cầu nào.</p>
            </div>
            )}
          </div>
      )}

      {/* --- KANBAN BOARD VIEW --- */}
      {viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
              {/* COLUMN 1: NEW */}
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 h-full">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 rounded-t-2xl">
                      <h3 className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2"><Mail size={16}/> Mới</h3>
                      <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm">
                          {contacts.filter(c => c.status === 'new').length}
                      </span>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                      {contacts.filter(c => c.status === 'new').map(contact => (
                          <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            compact={true} 
                            onStatusChange={handleStatusChange}
                            onComment={openCommentModal}
                            onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                          />
                      ))}
                  </div>
              </div>

              {/* COLUMN 2: PROCESSING */}
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 h-full">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-orange-50/50 dark:bg-orange-900/10 rounded-t-2xl">
                      <h3 className="font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2"><AlertCircle size={16}/> Đang tư vấn</h3>
                      <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm">
                          {contacts.filter(c => c.status === 'processing').length}
                      </span>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                      {contacts.filter(c => c.status === 'processing').map(contact => (
                          <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            compact={true} 
                            onStatusChange={handleStatusChange}
                            onComment={openCommentModal}
                            onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                          />
                      ))}
                  </div>
              </div>

              {/* COLUMN 3: COMPLETED */}
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 h-full">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-green-50/50 dark:bg-green-900/10 rounded-t-2xl">
                      <h3 className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><CheckCircle2 size={16}/> Hoàn thành</h3>
                      <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm">
                          {contacts.filter(c => c.status === 'completed').length}
                      </span>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                      {contacts.filter(c => c.status === 'completed').map(contact => (
                          <ContactCard 
                            key={contact.id} 
                            contact={contact} 
                            compact={true} 
                            onStatusChange={handleStatusChange}
                            onComment={openCommentModal}
                            onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                          />
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Xóa liên hệ?"
        message="Hành động này sẽ xóa vĩnh viễn yêu cầu liên hệ này khỏi hệ thống. Bạn có chắc chắn không?"
        isLoading={isDeleting}
      />

      {/* --- COMMENT MODAL --- */}
      <AnimatePresence>
        {commentModal.isOpen && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-dark dark:text-white flex items-center gap-2">
                            <Edit3 size={18} className="text-accent"/> Ghi chú khách hàng
                        </h3>
                        <button onClick={() => setCommentModal({ ...commentModal, isOpen: false })} className="text-slate-400 hover:text-dark dark:hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800 mb-2 flex gap-2">
                            <HelpCircle className="text-blue-500 shrink-0" size={16} />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Ghi chú này chỉ hiển thị nội bộ với quản trị viên, khách hàng sẽ không nhìn thấy.
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nội dung ghi chú</label>
                            <textarea 
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent text-sm dark:text-white min-h-[120px]"
                                placeholder="VD: Khách hẹn gọi lại vào chiều thứ 2..."
                                value={commentModal.note}
                                onChange={(e) => setCommentModal({ ...commentModal, note: e.target.value })}
                                autoFocus
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setCommentModal({ ...commentModal, isOpen: false })}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleSaveComment}
                                disabled={isSavingComment}
                                className="px-4 py-2 bg-accent text-white font-bold rounded-lg text-sm hover:bg-accentHover transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSavingComment ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Lưu ghi chú
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default ContactManager;
