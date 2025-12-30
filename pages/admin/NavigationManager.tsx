
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MenuItem, PageRoutes } from '../../types';
import { 
  Plus, Save, Trash2, Edit3, Move, GripVertical, CornerDownRight, 
  Loader2, Link as LinkIcon, X, RotateCcw 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import { AnimatePresence, motion } from 'framer-motion';

const NavigationManager: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [parentId, setParentId] = useState<string | null>(null); // For adding child
  const [formData, setFormData] = useState({ name: '', path: '' });

  // Delete State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  // Drag State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (settings.main_menu) {
      setMenuItems(settings.main_menu);
    }
  }, [settings.main_menu]);

  const handleSaveMenu = async () => {
    setLoading(true);
    // Convert to JSON string
    const menuJson = JSON.stringify(menuItems);
    
    const { error } = await supabase.from('site_settings').upsert({
        key: 'main_menu',
        value: menuJson
    });

    if (error) {
        setToast({ message: 'Lỗi lưu menu: ' + error.message, type: 'error' });
    } else {
        await refreshSettings();
        setToast({ message: 'Đã cập nhật menu thành công!', type: 'success' });
    }
    setLoading(false);
  };

  const handleLoadDefaults = () => {
      const defaultMenu: MenuItem[] = [
        { id: 'home', name: 'Trang chủ', path: PageRoutes.HOME },
        { id: 'about', name: 'Về chúng tôi', path: PageRoutes.ABOUT },
        { 
          id: 'services',
          name: 'Dịch vụ', 
          path: PageRoutes.SERVICES,
          children: [
            { id: 'web', name: 'Thiết kế Website', path: PageRoutes.WEBSITE_DESIGN },
            { id: 'email', name: 'Email Doanh nghiệp', path: PageRoutes.EMAIL_SERVICE },
            { id: 'brand', name: 'Nhận diện Thương hiệu', path: PageRoutes.BRANDING },
            { id: 'marketing', name: 'Digital Marketing', path: PageRoutes.DIGITAL_MARKETING },
            { id: 'tech', name: 'Giải pháp Công nghệ', path: PageRoutes.TECH_SOLUTIONS },
          ]
        },
        { id: 'blog', name: 'Blog', path: PageRoutes.BLOG },
        { id: 'contact', name: 'Liên hệ', path: PageRoutes.CONTACT },
      ];

      if (menuItems.length > 0 && !window.confirm('Hành động này sẽ ghi đè menu hiện tại bằng menu mặc định bao gồm 2 dịch vụ mới. Bạn có chắc chắn không?')) {
          return;
      }
      
      // Deep copy to ensure new references
      setMenuItems(JSON.parse(JSON.stringify(defaultMenu)));
      setToast({ message: 'Đã nạp menu mẫu. Hãy nhấn "Lưu Menu" để áp dụng.', type: 'success' });
  };

  // --- CRUD OPERATIONS ---

  const openModal = (item?: MenuItem, parentId?: string) => {
      setEditingItem(item || null);
      setParentId(parentId || null);
      setFormData({
          name: item?.name || '',
          path: item?.path || ''
      });
      setIsModalOpen(true);
  };

  const handleSaveItem = () => {
      if (!formData.name || !formData.path) {
          setToast({ message: 'Vui lòng nhập tên và đường dẫn', type: 'error' });
          return;
      }

      const newItem: MenuItem = {
          id: editingItem?.id || `menu-${Date.now()}`,
          name: formData.name,
          path: formData.path,
          children: editingItem?.children || []
      };

      if (editingItem) {
          // Update existing
          updateItemRecursive(menuItems, newItem);
      } else {
          // Add new
          if (parentId) {
              addChildRecursive(menuItems, parentId, newItem);
          } else {
              setMenuItems([...menuItems, newItem]);
          }
      }

      setIsModalOpen(false);
  };

  const updateItemRecursive = (items: MenuItem[], updated: MenuItem) => {
      const clone = JSON.parse(JSON.stringify(items));
      const update = (list: MenuItem[]) => {
          for (let i = 0; i < list.length; i++) {
              if (list[i].id === updated.id) {
                  list[i] = { ...updated, children: list[i].children };
                  return true;
              }
              if (list[i].children) {
                  if (update(list[i].children!)) return true;
              }
          }
          return false;
      };
      update(clone);
      setMenuItems(clone);
  };

  const addChildRecursive = (items: MenuItem[], pId: string, child: MenuItem) => {
      const clone = JSON.parse(JSON.stringify(items));
      const add = (list: MenuItem[]) => {
          for (const item of list) {
              if (item.id === pId) {
                  if (!item.children) item.children = [];
                  item.children.push(child);
                  return true;
              }
              if (item.children) {
                  if (add(item.children)) return true;
              }
          }
          return false;
      };
      add(clone);
      setMenuItems(clone);
  };

  // Triggered by Confirm Modal
  const confirmDelete = () => {
      const id = deleteModal.id;
      if (!id) return;

      const clone = JSON.parse(JSON.stringify(menuItems));
      const remove = (list: MenuItem[]) => {
          const idx = list.findIndex(i => i.id === id);
          if (idx !== -1) {
              list.splice(idx, 1);
              return true;
          }
          for (const item of list) {
              if (item.children) {
                  if (remove(item.children)) return true;
              }
          }
          return false;
      };
      
      remove(clone);
      setMenuItems(clone);
      setToast({ message: 'Đã xóa mục menu', type: 'success' });
      setDeleteModal({ isOpen: false, id: null });
  };

  const openDeleteModal = (id: string) => {
      setDeleteModal({ isOpen: true, id });
  };

  // --- DRAG AND DROP (Simple Reordering for Top Level) ---
  const handleDragStart = (index: number) => {
      setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault(); // Allow drop
  };

  const handleDrop = (index: number) => {
      if (draggedItemIndex === null || draggedItemIndex === index) return;
      
      const newItems = [...menuItems];
      const draggedItem = newItems[draggedItemIndex];
      
      // Remove dragged item
      newItems.splice(draggedItemIndex, 1);
      // Insert at new position
      newItems.splice(index, 0, draggedItem);
      
      setMenuItems(newItems);
      setDraggedItemIndex(null);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
      e.preventDefault();
      e.stopPropagation();
      action();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
              <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Quản lý Menu</h1>
              <p className="text-slate-500 dark:text-slate-400">Sắp xếp thanh điều hướng (Navbar) bằng cách kéo thả.</p>
          </div>
          <div className="flex gap-3">
              <button 
                  onClick={handleLoadDefaults}
                  className="p-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-accent border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-sm"
                  title="Nạp menu mặc định"
              >
                  <RotateCcw size={20} />
              </button>
              <button 
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                  <Plus size={18} /> Thêm mục mới
              </button>
              <button 
                  onClick={handleSaveMenu}
                  disabled={loading}
                  className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
              >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Lưu Menu
              </button>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
          {menuItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                  <p className="mb-4">Chưa có menu nào.</p>
                  <button 
                      onClick={handleLoadDefaults}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm flex items-center gap-2 mx-auto"
                  >
                      <RotateCcw size={16} /> Nạp Menu Mẫu
                  </button>
              </div>
          ) : (
              <div className="space-y-3">
                  {menuItems.map((item, index) => (
                      <div 
                          key={item.id}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={() => handleDrop(index)}
                          className={`bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all ${draggedItemIndex === index ? 'opacity-50 border-dashed border-accent' : 'hover:border-accent/50'}`}
                      >
                          {/* Parent Item */}
                          <div className="flex items-center gap-3">
                              <div className="cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
                                  <GripVertical size={20} />
                              </div>
                              <div className="flex-1">
                                  <div className="font-bold text-dark dark:text-white">{item.name}</div>
                                  <div className="text-xs text-slate-500 font-mono">{item.path}</div>
                              </div>
                              <div className="flex gap-2">
                                  <button 
                                    type="button"
                                    onClick={(e) => handleAction(e, () => openModal(undefined, item.id))} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-xs font-bold flex items-center gap-1" 
                                    title="Thêm menu con"
                                  >
                                      <Plus size={14} /> Sub-menu
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => handleAction(e, () => openModal(item))} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-lg"
                                  >
                                      <Edit3 size={16} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => handleAction(e, () => openDeleteModal(item.id))} 
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </div>

                          {/* Children Items */}
                          {item.children && item.children.length > 0 && (
                              <div className="mt-3 pl-8 ml-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-2">
                                  {item.children.map((child) => (
                                      <div key={child.id} className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                          <CornerDownRight size={14} className="text-slate-300" />
                                          <div className="flex-1">
                                              <div className="font-bold text-sm text-dark dark:text-white">{child.name}</div>
                                              <div className="text-[10px] text-slate-500 font-mono">{child.path}</div>
                                          </div>
                                          <div className="flex gap-1">
                                              <button 
                                                type="button"
                                                onClick={(e) => handleAction(e, () => openModal(child))} 
                                                onMouseDown={(e) => e.stopPropagation()}
                                                className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                              >
                                                  <Edit3 size={14} />
                                              </button>
                                              <button 
                                                type="button"
                                                onClick={(e) => handleAction(e, () => openDeleteModal(child.id))} 
                                                onMouseDown={(e) => e.stopPropagation()}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                              >
                                                  <Trash2 size={14} />
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
          {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-800"
                  >
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-xl text-dark dark:text-white">
                              {editingItem ? 'Chỉnh sửa Menu' : parentId ? 'Thêm Menu Con' : 'Thêm Menu Mới'}
                          </h3>
                          <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-dark dark:hover:text-white" /></button>
                      </div>
                      
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tên hiển thị</label>
                              <input 
                                  autoFocus
                                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white"
                                  placeholder="VD: Dịch vụ"
                                  value={formData.name}
                                  onChange={e => setFormData({...formData, name: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Đường dẫn (URL)</label>
                              <div className="relative">
                                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input 
                                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-accent dark:text-white"
                                      placeholder="/services"
                                      value={formData.path}
                                      onChange={e => setFormData({...formData, path: e.target.value})}
                                  />
                              </div>
                          </div>
                          <button 
                              onClick={handleSaveItem}
                              className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors mt-2"
                          >
                              {editingItem ? 'Cập nhật' : 'Thêm mới'}
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Xóa menu?"
        message="Hành động này sẽ xóa mục menu này (và các menu con nếu có). Bạn có chắc chắn không?"
      />

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default NavigationManager;
