
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  UploadCloud, File as FileIcon, Trash2, Search, Grid, List, 
  Loader2, Copy, Edit2, X, ZoomIn, ZoomOut, Download, Check
} from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';

// --- UTILS: Client-side WebP Conversion ---
const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        if (file.type === 'image/webp' || !file.type.startsWith('image/')) {
            resolve(file); 
            return;
        }
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Conversion failed'));
                }, 'image/webp', 0.85); 
            } else {
                reject(new Error('Canvas context failed'));
            }
        };
        img.onerror = (e) => reject(e);
        img.src = URL.createObjectURL(file);
    });
};

const safeDecode = (str: string) => {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
};

const MediaLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Selection & Actions
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Edit State (Rename & SEO)
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Rename Specific State
  const [renamingItem, setRenamingItem] = useState<any | null>(null);
  const [newName, setNewName] = useState('');

  // SEO Edit Form
  const [seoForm, setSeoForm] = useState({ name: '', title: '', alt: '', description: '' });

  // Preview Image State
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Modals
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; items: any[] }>({ isOpen: false, items: [] });
  
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EFFECT: Fetch Files ---
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    
    // List all files at ROOT level
    const { data, error } = await supabase.storage.from('media').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }, // Show newest first
    });

    if (error) {
        console.error(error);
        setToast({ message: 'Lỗi tải dữ liệu: ' + error.message, type: 'error' });
    } else if (data) {
       // Filter out folders (items where id is null) and .keep files
       const detectedFiles = data
           .filter(item => item.id !== null && item.name !== '.keep')
           .map(file => {
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
                return { 
                    ...file, 
                    publicUrl, 
                    fullPath: file.name, // In root, fullPath is just name
                    displayName: safeDecode(file.name)
                };
           });

       setFiles(detectedFiles);
    }
    setLoading(false);
  };

  // --- FILE UPLOAD (With WebP Conversion) ---
  const processUpload = async (fileList: FileList | File[]) => {
      setUploading(true);
      setUploadProgress(0);
      const total = fileList.length;
      let successCount = 0;

      for (let i = 0; i < total; i++) {
          const file = fileList[i];
          let fileToUpload: Blob | File = file;
          let fileName = file.name;

          // 1. Auto Convert to WebP if Image
          if (file.type.startsWith('image/')) {
              try {
                  const webpBlob = await convertToWebP(file);
                  fileToUpload = webpBlob;
                  fileName = fileName.replace(/\.[^/.]+$/, "") + ".webp"; 
              } catch (e) {
                  console.warn("WebP conversion failed, uploading original.", e);
              }
          }

          // 2. Upload directly to ROOT using cleaned filename
          // Remove special chars to avoid issues, just keep it simple
          const safeName = Date.now() + '-' + fileName.replace(/[^a-zA-Z0-9.-]/g, '');

          const { error } = await supabase.storage.from('media').upload(safeName, fileToUpload, {
              upsert: true,
              cacheControl: '3600',
              contentType: fileToUpload.type === 'blob' ? 'image/webp' : file.type
          });

          if (!error) successCount++;
          setUploadProgress(Math.round(((i + 1) / total) * 100));
      }

      setUploading(false);
      setUploadProgress(0);
      if (successCount > 0) {
          setToast({ message: `Đã tải lên ${successCount}/${total} file.`, type: 'success' });
          fetchContent();
      } else {
          setToast({ message: 'Upload thất bại.', type: 'error' });
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          processUpload(e.target.files);
      }
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processUpload(e.dataTransfer.files);
      }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
      if (deleteModal.items.length === 0) return;
      setLoading(true);

      try {
          const filesToDelete = deleteModal.items.map(i => i.name); // In root, name is path

          if (filesToDelete.length > 0) {
              const { error } = await supabase.storage.from('media').remove(filesToDelete);
              if (error) throw error;
              setToast({ message: `Đã xóa thành công.`, type: 'success' });
          }

          fetchContent();
          setSelectedItems([]);

      } catch (error: any) {
          setToast({ message: 'Lỗi xóa: ' + error.message, type: 'error' });
      }
      
      setLoading(false);
      setDeleteModal({ isOpen: false, items: [] });
  };

  // --- RENAME LOGIC ---
  const openRenameModal = (item: any) => {
      setRenamingItem(item);
      setNewName(item.displayName); 
  };

  const handleRename = async () => {
      if (!renamingItem || !newName || renamingItem.displayName === newName) {
          setRenamingItem(null);
          return;
      }
      setLoading(true);

      const oldPath = renamingItem.name; // Root path
      // Ensure new name has extension or sanitize it
      // Simple approach: Keep extension from old name if user removed it? 
      // Or just trust user. Let's just sanitize for safety.
      const safeNewName = newName.trim().replace(/[^a-zA-Z0-9.-]/g, '-'); 
      const newPath = safeNewName;
      
      try {
          const { error } = await supabase.storage.from('media').move(oldPath, newPath);
          if (error) throw error;

          setToast({ message: 'Đổi tên thành công!', type: 'success' });
          fetchContent();

      } catch (error: any) {
          setToast({ message: 'Đổi tên thất bại: ' + error.message, type: 'error' });
      }

      setRenamingItem(null);
      setNewName('');
      setLoading(false);
  };

  // --- SEO EDIT LOGIC ---
  const openSeoModal = (item: any) => {
      setEditingItem(item);
      setSeoForm({
          name: item.displayName,
          title: item.metadata?.customTitle || '', 
          alt: item.metadata?.customAlt || '', 
          description: item.metadata?.customDescription || ''
      });
  };

  const handleSaveSeo = async () => {
      // Reuse rename logic if name changed
      if (editingItem && seoForm.name !== editingItem.displayName) {
          const oldPath = editingItem.name;
          const safeNewName = seoForm.name.trim().replace(/[^a-zA-Z0-9.-]/g, '-');
          await supabase.storage.from('media').move(oldPath, safeNewName);
      }
      
      setToast({ message: 'Đã cập nhật thông tin!', type: 'success' });
      setEditingItem(null);
      fetchContent();
  };

  // --- PREVIEW LOGIC ---
  const openPreview = (file: any) => {
      if (file.metadata?.mimetype?.includes('image')) {
          setPreviewImage(file);
          setZoomLevel(1);
      }
  };

  const handleZoom = (delta: number) => {
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // --- HELPERS ---
  const copyToClipboard = (url: string) => {
      navigator.clipboard.writeText(url);
      setToast({ message: 'Đã sao chép đường dẫn!', type: 'success' });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
        className="h-[calc(100vh-4rem)] flex flex-col relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
       <input 
         type="file" 
         ref={fileInputRef} 
         onChange={handleFileSelect} 
         className="hidden" 
         multiple
         accept="image/*,application/pdf,video/*"
       />

       {/* Drag Overlay */}
       <AnimatePresence>
           {isDragging && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 z-50 bg-accent/10 backdrop-blur-sm border-4 border-dashed border-accent rounded-xl flex items-center justify-center pointer-events-none"
               >
                   <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                       <UploadCloud size={64} className="text-accent mb-4 animate-bounce" />
                       <h3 className="text-2xl font-bold text-accent">Thả file để upload ngay</h3>
                       <p className="text-slate-500">Hỗ trợ tự động chuyển đổi sang WebP</p>
                   </div>
               </motion.div>
           )}
       </AnimatePresence>

       {/* HEADER & TOOLBAR */}
       <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Thư viện Media</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Quản lý tập trung toàn bộ hình ảnh.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                        Tải lên
                    </button>
                </div>
            </div>
       </div>

       {/* MAIN CONTENT */}
       <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Filter & View Mode */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
               <div className="flex items-center gap-2">
                   <span className="text-xs text-slate-400 ml-2 font-bold">
                       {files.length} file
                   </span>
               </div>
               <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                   <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}><Grid size={16}/></button>
                   <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}><List size={16}/></button>
               </div>
            </div>

            {/* Grid/List Area */}
            <div className="flex-1 overflow-y-auto p-6 relative bg-slate-50 dark:bg-slate-950/20">
               {loading ? (
                   <div className="flex h-full items-center justify-center flex-col gap-2">
                       <Loader2 className="animate-spin text-accent" size={32} />
                       <span className="text-xs text-slate-400">Đang tải dữ liệu...</span>
                   </div>
               ) : (
                   <>
                       {files.length === 0 && (
                           <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                               <UploadCloud size={64} className="mb-4" />
                               <p>Thư viện trống. Kéo thả file vào đây.</p>
                           </div>
                       )}

                       {viewMode === 'grid' ? (
                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                               {/* Render Files */}
                               {files.map(file => (
                                   <div key={file.id} className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-accent dark:hover:border-accent overflow-hidden transition-all hover:shadow-lg">
                                       <div 
                                            className="aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-900 relative cursor-pointer"
                                            onClick={() => openPreview(file)}
                                       >
                                           {file.metadata?.mimetype?.includes('image') ? (
                                               <img src={file.publicUrl} alt={file.displayName} className="w-full h-full object-cover" />
                                           ) : (
                                               <FileIcon size={32} className="text-slate-400" />
                                           )}
                                           
                                           {/* WebP Badge */}
                                           {file.metadata?.mimetype === 'image/webp' && (
                                               <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">WebP</span>
                                           )}

                                           {/* Hover Actions */}
                                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                               <button onClick={(e) => { e.stopPropagation(); copyToClipboard(file.publicUrl); }} className="p-2 bg-white rounded-full hover:scale-110 transition-transform" title="Copy Link"><Copy size={14} className="text-slate-800"/></button>
                                               <button onClick={(e) => { e.stopPropagation(); openSeoModal(file); }} className="p-2 bg-white rounded-full hover:scale-110 transition-transform" title="Edit Info"><Edit2 size={14} className="text-blue-600"/></button>
                                               <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, items: [file] }); }} className="p-2 bg-white rounded-full hover:scale-110 transition-transform" title="Delete"><Trash2 size={14} className="text-red-600"/></button>
                                           </div>
                                       </div>
                                       <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                                           <div className="text-[11px] font-medium text-dark dark:text-white truncate" title={file.displayName}>{file.displayName}</div>
                                           <div className="text-[9px] text-slate-400">{formatSize(file.metadata?.size || 0)}</div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       ) : (
                           // List View Implementation
                           <table className="w-full text-left">
                               <thead className="text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
                                   <tr>
                                       <th className="p-3">Tên file</th>
                                       <th className="p-3">Loại</th>
                                       <th className="p-3">Kích thước</th>
                                       <th className="p-3 text-right">Hành động</th>
                                   </tr>
                               </thead>
                               <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                   {files.map(file => (
                                       <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                           <td className="p-3 flex items-center gap-3">
                                                {file.metadata?.mimetype?.includes('image') ? (
                                                    <div className="w-8 h-8 rounded overflow-hidden bg-slate-200 cursor-pointer" onClick={() => openPreview(file)}><img src={file.publicUrl} className="w-full h-full object-cover"/></div>
                                                ) : <FileIcon size={18} className="text-slate-400"/>}
                                                <span className="truncate max-w-xs font-medium text-dark dark:text-white cursor-pointer hover:text-accent" onClick={() => openPreview(file)}>{file.displayName}</span>
                                                {file.metadata?.mimetype === 'image/webp' && <span className="bg-green-100 text-green-700 text-[9px] px-1 rounded">WebP</span>}
                                           </td>
                                           <td className="p-3 text-slate-500">{file.metadata?.mimetype}</td>
                                           <td className="p-3 text-slate-500">{formatSize(file.metadata?.size || 0)}</td>
                                           <td className="p-3 text-right">
                                               <div className="flex justify-end gap-2">
                                                   <button onClick={() => copyToClipboard(file.publicUrl)} className="text-slate-400 hover:text-blue-500"><Copy size={16}/></button>
                                                   <button onClick={() => openSeoModal(file)} className="text-slate-400 hover:text-orange-500"><Edit2 size={16}/></button>
                                                   <button onClick={() => setDeleteModal({ isOpen: true, items: [file] })} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                                               </div>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       )}
                   </>
               )}
            </div>
       </div>

       {/* --- RENAME MODAL (Generic) --- */}
       <AnimatePresence>
           {renamingItem && (
               <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                   <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 dark:border-slate-800">
                       <h3 className="font-bold text-lg mb-4 text-dark dark:text-white">Đổi tên file</h3>
                       <input 
                         autoFocus
                         className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white mb-4"
                         value={newName}
                         onChange={(e) => setNewName(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                       />
                       <div className="flex gap-3 justify-end">
                           <button onClick={() => setRenamingItem(null)} className="px-4 py-2 text-slate-500 font-bold text-sm">Hủy</button>
                           <button onClick={handleRename} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm">Lưu</button>
                       </div>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>

       {/* --- SEO EDIT MODAL (Files Only) --- */}
       <AnimatePresence>
           {editingItem && (
               <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                   <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-lg text-dark dark:text-white">Chỉnh sửa thông tin</h3>
                           <button onClick={() => setEditingItem(null)}><X size={20} className="text-slate-400"/></button>
                       </div>
                       
                       <div className="space-y-4">
                           {/* Filename */}
                           <div>
                               <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tên file</label>
                               <input 
                                 className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white"
                                 value={seoForm.name}
                                 onChange={(e) => setSeoForm({...seoForm, name: e.target.value})}
                               />
                               <p className="text-[10px] text-slate-400 mt-1">Lưu ý: Tên file nên viết liền không dấu hoặc gạch ngang (VD: anh-du-an-1.jpg)</p>
                           </div>

                           {/* SEO Fields */}
                           <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                               <h4 className="text-sm font-bold text-accent mb-3 flex items-center gap-2"><Search size={14}/> Cấu hình SEO (Metadata)</h4>
                               <div className="space-y-3">
                                   <div>
                                       <label className="block text-xs font-bold text-slate-500 mb-1">Tiêu đề (Title)</label>
                                       <input 
                                         className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white text-sm"
                                         placeholder="Tiêu đề ảnh..."
                                         value={seoForm.title}
                                         onChange={(e) => setSeoForm({...seoForm, title: e.target.value})}
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-slate-500 mb-1">Văn bản thay thế (Alt Text)</label>
                                       <input 
                                         className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white text-sm"
                                         placeholder="Mô tả nội dung ảnh cho Google..."
                                         value={seoForm.alt}
                                         onChange={(e) => setSeoForm({...seoForm, alt: e.target.value})}
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-slate-500 mb-1">Mô tả (Description)</label>
                                       <textarea 
                                         rows={2}
                                         className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white text-sm resize-none"
                                         placeholder="Chi tiết về hình ảnh..."
                                         value={seoForm.description}
                                         onChange={(e) => setSeoForm({...seoForm, description: e.target.value})}
                                       />
                                   </div>
                               </div>
                           </div>
                       </div>

                       <div className="flex gap-3 justify-end mt-6">
                           <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Hủy</button>
                           <button onClick={handleSaveSeo} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">Lưu thay đổi</button>
                       </div>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>

       {/* --- IMAGE VIEWER (LIGHTBOX) --- */}
       <AnimatePresence>
           {previewImage && (
               <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-in fade-in duration-200">
                   {/* Toolbar */}
                   <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur text-white absolute top-0 left-0 right-0 z-10">
                       <div className="flex items-center gap-4">
                           <h3 className="font-bold truncate max-w-md">{previewImage.displayName}</h3>
                           <span className="text-xs bg-white/20 px-2 py-1 rounded">{formatSize(previewImage.metadata?.size || 0)}</span>
                       </div>
                       <div className="flex items-center gap-2">
                           <button onClick={() => handleZoom(-0.2)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><ZoomOut size={20}/></button>
                           <span className="text-xs font-mono w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                           <button onClick={() => handleZoom(0.2)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><ZoomIn size={20}/></button>
                           <div className="w-px h-6 bg-white/20 mx-2"></div>
                           <a href={previewImage.publicUrl} download target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/20 rounded-full transition-colors"><Download size={20}/></a>
                           <button onClick={() => setPreviewImage(null)} className="p-2 hover:bg-red-500/50 rounded-full transition-colors ml-2"><X size={24}/></button>
                       </div>
                   </div>

                   {/* Image Container */}
                   <div 
                        className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-10"
                        onClick={() => setPreviewImage(null)} // Close on clicking background
                   >
                        <motion.img 
                            src={previewImage.publicUrl} 
                            alt={previewImage.name}
                            className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-200"
                            style={{ scale: zoomLevel }}
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                            drag
                            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                        />
                   </div>
               </div>
           )}
       </AnimatePresence>

       {/* --- CONFIRM DELETE --- */}
       <ConfirmModal 
         isOpen={deleteModal.isOpen}
         onClose={() => setDeleteModal({ isOpen: false, items: [] })}
         onConfirm={handleDelete}
         title="Xóa đối tượng?"
         message={`Bạn có chắc chắn muốn xóa ${deleteModal.items.length} file này không? Hành động này không thể hoàn tác.`}
       />

       <AnimatePresence>
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
       </AnimatePresence>
    </div>
  );
};

export default MediaLibrary;
