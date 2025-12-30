
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Save, Globe, Mail, Phone, MapPin, Shield, Loader2, Image as ImageIcon, UploadCloud, Check, FileText, Key, Layout, Type } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext'; // Import context hook
import Toast from '../../components/Toast'; // Import Toast
import { AnimatePresence } from 'framer-motion';
import { LOADERS, LoaderKey } from '../../components/loaders';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>({});
  
  // Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  
  // Track which setting is being edited (site_logo or site_favicon)
  const [activeMediaKey, setActiveMediaKey] = useState<string>('site_logo');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const { refreshSettings } = useSettings(); // Get refresh function

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
        // Convert array to object key:value
        const settingsObj = data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        
        // Handle boolean values stored as strings if necessary, though supabase usually handles types well if defined
        // For settings table usually key-value strings, so we might need parsing.
        if (settingsObj.show_loader_text === 'false') settingsObj.show_loader_text = false;
        if (settingsObj.show_loader_text === 'true') settingsObj.show_loader_text = true;

        setSettings(settingsObj);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    const updates = Object.keys(settings).map(key => ({
        key, 
        value: settings[key]
    }));
    
    // Upsert all settings
    const { error } = await supabase.from('site_settings').upsert(updates);
    
    if(!error) {
        await refreshSettings(); // Cập nhật ngay lập tức các thay đổi ra ngoài App (Favicon, Title...)
        setToast({ message: 'Đã lưu cấu hình hệ thống thành công!', type: 'success' });
    } else {
        setToast({ message: 'Lỗi khi lưu: ' + error.message, type: 'error' });
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  // --- GENERIC IMAGE UPLOAD LOGIC ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileName = file.name; 
      setLoading(true);

      // Upload to 'media' bucket
      const { data, error } = await supabase.storage.from('media').upload(fileName, file, { upsert: true });

      if (error) {
          setToast({ message: 'Upload thất bại: ' + error.message, type: 'error' });
      } else {
          // Get Public URL
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
          handleChange(key, publicUrl);
          setToast({ message: 'Đã tải ảnh lên thành công!', type: 'success' });
      }
      setLoading(false);
  };

  const fetchMediaForModal = async () => {
      setMediaLoading(true);
      const { data } = await supabase.storage.from('media').list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
      });
      if (data) {
          const filesWithUrl = data.map(file => {
              const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
              return { ...file, publicUrl };
          });
          // Filter only images
          const images = filesWithUrl.filter(f => f.metadata?.mimetype?.includes('image'));
          setMediaFiles(images);
      }
      setMediaLoading(false);
  };

  const openMediaModal = (key: string) => {
      setActiveMediaKey(key);
      setIsMediaModalOpen(true);
      fetchMediaForModal();
  };

  const selectMedia = (url: string) => {
      handleChange(activeMediaKey, url);
      setIsMediaModalOpen(false);
  };

  const tabs = [
    { id: 'general', label: 'Thông tin chung', icon: Globe },
    { id: 'ui', label: 'Giao diện (UI)', icon: Layout },
    { id: 'contact', label: 'Liên hệ & Địa chỉ', icon: MapPin },
    { id: 'email', label: 'Cấu hình Email (SMTP)', icon: Mail },
    { id: 'security', label: 'Bảo mật & Admin', icon: Shield },
  ];

  if (loading && Object.keys(settings).length === 0) {
      return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark dark:text-white">Cấu hình Hệ thống</h1>
          <p className="text-slate-500 dark:text-slate-400">Quản lý thông tin website và tài khoản quản trị.</p>
        </div>
        <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
               {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-6 py-4 flex items-center gap-3 font-medium transition-colors ${
                       activeTab === tab.id 
                       ? 'bg-slate-50 dark:bg-slate-800 text-accent border-l-4 border-accent' 
                       : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                     <tab.icon size={18} /> {tab.label}
                  </button>
               ))}
            </div>
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                
                {/* General Settings */}
                {activeTab === 'general' && (
                   <div className="space-y-8 animate-in fade-in duration-300">
                      <div>
                          <h3 className="font-bold text-xl text-dark dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Thông tin Cơ bản</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tên Website (Title)</label>
                                <input 
                                    type="text" 
                                    value={settings.site_title || ''}
                                    onChange={(e) => handleChange('site_title', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white" 
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Slogan</label>
                                <input 
                                    type="text" 
                                    value={settings.site_slogan || ''}
                                    onChange={(e) => handleChange('site_slogan', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white" 
                                />
                             </div>
                          </div>
                      </div>

                      {/* --- BRANDING SECTION (Logo & Favicon) --- */}
                      <div>
                         <h3 className="font-bold text-xl text-dark dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Hình ảnh thương hiệu</h3>
                         
                         {/* Logo */}
                         <div className="mb-8">
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Logo Website (Header)</label>
                             <div className="flex flex-col md:flex-row gap-6 items-start">
                                 {/* Preview Logo */}
                                 <div className="w-40 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                                     {settings.site_logo ? (
                                         <img src={settings.site_logo} alt="Site Logo" className="w-full h-full object-contain p-2" />
                                     ) : (
                                         <span className="text-slate-400 text-xs font-bold">Chưa có Logo</span>
                                     )}
                                 </div>

                                 {/* Inputs Logo */}
                                 <div className="flex-1 w-full space-y-3">
                                     <input 
                                        type="text"
                                        value={settings.site_logo || ''}
                                        onChange={(e) => handleChange('site_logo', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white text-sm"
                                        placeholder="https://... (Link ảnh Logo)"
                                     />
                                     <div className="flex gap-3">
                                         <button 
                                            onClick={() => logoInputRef.current?.click()}
                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                         >
                                             <UploadCloud size={16} /> Tải ảnh
                                         </button>
                                         <input 
                                            type="file" 
                                            ref={logoInputRef} 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => handleImageUpload(e, 'site_logo')}
                                         />
                                         <button 
                                            onClick={() => openMediaModal('site_logo')}
                                            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                         >
                                             <ImageIcon size={16} /> Thư viện
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Favicon */}
                         <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Favicon (Icon trên tab trình duyệt)</label>
                             <div className="flex flex-col md:flex-row gap-6 items-start">
                                 {/* Preview Favicon */}
                                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                     {settings.site_favicon ? (
                                         <img src={settings.site_favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                                     ) : (
                                         <Globe size={24} className="text-slate-400" />
                                     )}
                                 </div>

                                 {/* Inputs Favicon */}
                                 <div className="flex-1 w-full space-y-3">
                                     <input 
                                        type="text"
                                        value={settings.site_favicon || ''}
                                        onChange={(e) => handleChange('site_favicon', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white text-sm"
                                        placeholder="https://... (Link ảnh Favicon, ưu tiên .png, .ico)"
                                     />
                                     <div className="flex gap-3">
                                         <button 
                                            onClick={() => faviconInputRef.current?.click()}
                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                         >
                                             <UploadCloud size={16} /> Tải ảnh
                                         </button>
                                         <input 
                                            type="file" 
                                            ref={faviconInputRef} 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => handleImageUpload(e, 'site_favicon')}
                                         />
                                         <button 
                                            onClick={() => openMediaModal('site_favicon')}
                                            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                         >
                                             <ImageIcon size={16} /> Thư viện
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                      </div>

                      {/* Meta Description */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mô tả (Meta Description)</label>
                         <textarea 
                             rows={3} 
                             value={settings.site_description || ''}
                             onChange={(e) => handleChange('site_description', e.target.value)}
                             className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white"
                         ></textarea>
                      </div>
                   </div>
                )}

                {/* UI / Loaders Settings */}
                {activeTab === 'ui' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="font-bold text-xl text-dark dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Màn hình chờ (Loading Screen)</h3>
                            
                            {/* Toggle Show Text */}
                            <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors mb-6">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_loader_text !== false} // Default to true if undefined
                                        onChange={(e) => handleChange('show_loader_text', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                </div>
                                <div>
                                    <div className="font-bold text-dark dark:text-white flex items-center gap-2">
                                        <Type size={16} /> Hiển thị tên thương hiệu khi tải
                                    </div>
                                    <div className="text-xs text-slate-500">Bật/tắt dòng chữ tên website và slogan bên dưới hiệu ứng loading.</div>
                                </div>
                            </label>

                            <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-4">Chọn hiệu ứng</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(LOADERS).map(([key, loader]) => {
                                    const isActive = settings.active_loader === key || (!settings.active_loader && key === 'default');
                                    return (
                                        <div 
                                            key={key}
                                            onClick={() => handleChange('active_loader', key)}
                                            className={`relative cursor-pointer group rounded-2xl overflow-hidden border-2 transition-all ${isActive ? 'border-accent ring-4 ring-accent/20' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                                        >
                                            {/* Preview Area */}
                                            <div className="aspect-square bg-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
                                                {/* Render Loader Component */}
                                                <div className="transform scale-75">
                                                    <loader.component />
                                                </div>
                                                
                                                {isActive && (
                                                    <div className="absolute top-4 right-4 bg-accent text-white p-1 rounded-full shadow-lg">
                                                        <Check size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="p-4 bg-white dark:bg-slate-800">
                                                <h4 className={`font-bold text-lg mb-1 ${isActive ? 'text-accent' : 'text-dark dark:text-white'}`}>{loader.name}</h4>
                                                <p className="text-xs text-slate-500">{loader.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Settings */}
                {activeTab === 'contact' && (
                   <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="font-bold text-xl text-dark dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Thông tin Liên hệ</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email hỗ trợ</label>
                            <div className="relative">
                               <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                               <input 
                                    type="email" 
                                    value={settings.site_email || ''}
                                    onChange={(e) => handleChange('site_email', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white" 
                                />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hotline</label>
                            <div className="relative">
                               <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                               <input 
                                    type="text" 
                                    value={settings.site_phone || ''}
                                    onChange={(e) => handleChange('site_phone', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white" 
                                />
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Địa chỉ văn phòng</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={settings.site_address || ''}
                                    onChange={(e) => handleChange('site_address', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white" 
                                />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mã số thuế (Tax Code)</label>
                            <div className="relative">
                                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={settings.site_tax_code || ''}
                                    onChange={(e) => handleChange('site_tax_code', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white" 
                                    placeholder="0123456789"
                                />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* EmailJS Settings */}
                {activeTab === 'email' && (
                   <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="font-bold text-xl text-dark dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Cấu hình Gửi Email (EmailJS)</h3>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg text-sm text-blue-800 dark:text-blue-200 mb-6">
                          Sử dụng dịch vụ <strong>EmailJS</strong> để gửi email trực tiếp từ website mà không cần backend. <a href="https://dashboard.emailjs.com/" target="_blank" className="underline font-bold">Lấy Key tại đây</a>.
                      </div>

                      <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service ID</label>
                            <div className="relative">
                               <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                               <input 
                                    type="text" 
                                    value={settings.emailjs_service_id || ''}
                                    onChange={(e) => handleChange('emailjs_service_id', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white font-mono" 
                                    placeholder="service_xxxxxx"
                                />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Template ID</label>
                            <div className="relative">
                               <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                               <input 
                                    type="text" 
                                    value={settings.emailjs_template_id || ''}
                                    onChange={(e) => handleChange('emailjs_template_id', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white font-mono" 
                                    placeholder="template_xxxxxx"
                                />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Public Key</label>
                            <div className="relative">
                               <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                               <input 
                                    type="text" 
                                    value={settings.emailjs_public_key || ''}
                                    onChange={(e) => handleChange('emailjs_public_key', e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent dark:text-white font-mono" 
                                    placeholder="Public Key from Account"
                                />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                   <div className="space-y-6 animate-in fade-in duration-300">
                      <h3 className="font-bold text-xl text-dark dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">Bảo mật & Admin</h3>
                      
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                          Để thay đổi mật khẩu, vui lòng sử dụng tính năng "Forgot Password" tại màn hình đăng nhập hoặc quản lý trực tiếp trong Supabase Authentication Dashboard.
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                         <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-4">Thông báo Email</h4>
                         <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                               <input type="checkbox" defaultChecked className="w-4 h-4 text-accent rounded border-slate-300 focus:ring-accent" />
                               <span className="text-sm text-slate-600 dark:text-slate-400">Nhận email khi có liên hệ mới</span>
                            </label>
                         </div>
                      </div>
                   </div>
                )}

             </div>
         </div>
      </div>

      {/* --- MEDIA SELECTION MODAL --- */}
      {isMediaModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                      <h3 className="font-bold text-lg text-dark dark:text-white">Chọn ảnh từ thư viện</h3>
                      <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-500 hover:text-dark dark:hover:text-white">Đóng</button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-900/50">
                      {mediaLoading ? (
                          <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>
                      ) : mediaFiles.length === 0 ? (
                          <div className="flex h-full items-center justify-center text-slate-500">Thư viện trống.</div>
                      ) : (
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {mediaFiles.map((file, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => selectMedia(file.publicUrl)}
                                    className="aspect-square bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-accent hover:shadow-lg transition-all relative group overflow-hidden"
                                  >
                                      <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <Check className="text-white bg-accent rounded-full p-1" size={24} />
                                      </div>
                                      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                                          {file.name}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Settings;
