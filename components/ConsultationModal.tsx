import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { useSettings } from '../context/SettingsContext';
import Toast from './Toast';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. Lưu vào Supabase
        const { error: dbError } = await supabase.from('contacts').insert([
            {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                service: 'Đăng ký tư vấn (Modal)',
                status: 'new'
            }
        ]);

        if (dbError) throw dbError;

        // 2. Gửi Email (Nếu cấu hình tồn tại)
        if (settings.emailjs_service_id && settings.emailjs_template_id && settings.emailjs_public_key) {
            await emailjs.send(
                settings.emailjs_service_id,
                settings.emailjs_template_id,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    to_email: 'admin@grifow.com' 
                },
                settings.emailjs_public_key
            );
            setToast({ message: 'Gửi thành công! Chúng tôi sẽ liên hệ sớm.', type: 'success' });
        } else {
            console.warn("Chưa cấu hình EmailJS");
            setToast({ message: 'Đã nhận thông tin (Email đang bảo trì).', type: 'success' });
        }

        setFormData({ name: '', phone: '', email: '', message: '' });
        
        // Đóng modal sau 2s để người dùng kịp đọc thông báo
        setTimeout(() => {
            onClose();
            setToast(null); // Reset toast khi đóng
        }, 2000);

    } catch (error: any) {
        console.error("Lỗi:", error);
        setToast({ message: 'Có lỗi xảy ra, vui lòng thử lại.', type: 'error' });
        setLoading(false); // Chỉ stop loading khi lỗi để người dùng thử lại
    }
    // Note: Không set loading false ngay khi success để giữ UI không bị nháy trước khi đóng
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={!loading ? onClose : undefined}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800"
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors z-10 disabled:opacity-50"
                >
                  <X size={20} />
                </button>

                <div className="p-8">
                  <div className="text-center mb-8">
                     <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Liên hệ ngay</span>
                     <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Đăng ký tư vấn</h2>
                     <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                       Để lại thông tin, chuyên gia của Grifow sẽ liên hệ tư vấn giải pháp phù hợp nhất cho bạn.
                     </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Họ tên</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dark:text-white text-sm font-medium disabled:opacity-50"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Số điện thoại</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dark:text-white text-sm font-medium disabled:opacity-50"
                            placeholder="0912..."
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dark:text-white text-sm font-medium disabled:opacity-50"
                            placeholder="email@..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nội dung</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-4 text-slate-400" size={18} />
                        <textarea
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all dark:text-white resize-none text-sm font-medium disabled:opacity-50"
                          placeholder="Tôi cần tư vấn về dịch vụ..."
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:bg-accentHover transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin"/> : <>Gửi yêu cầu ngay <Send size={18} /></>}
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Global Toast for Modal */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ConsultationModal;