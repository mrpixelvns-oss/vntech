import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { useSettings } from '../context/SettingsContext';
import Toast from '../components/Toast';
import { AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
                service: 'Liên hệ chung',
                status: 'new'
            }
        ]);

        if (dbError) throw dbError;

        // 2. Gửi Email
        if (settings.emailjs_service_id && settings.emailjs_template_id && settings.emailjs_public_key) {
            await emailjs.send(
                settings.emailjs_service_id,
                settings.emailjs_template_id,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    to_email: settings.site_email
                },
                settings.emailjs_public_key
            );
            setToast({ message: 'Cảm ơn bạn! Yêu cầu đã được gửi thành công.', type: 'success' });
        } else {
            console.warn("Chưa cấu hình EmailJS");
            setToast({ message: 'Đã lưu thông tin! (Hệ thống email đang bảo trì).', type: 'success' });
        }

        setFormData({ name: '', email: '', phone: '', message: '' });

    } catch (error: any) {
        console.error('Error:', error);
        setToast({ message: error.message || 'Có lỗi xảy ra, vui lòng thử lại.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-soft dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Form Side */}
                <div className="p-8 md:p-16">
                    <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Liên hệ ngay</span>
                    <h2 className="font-display font-bold text-4xl text-dark dark:text-white mb-8">Bắt đầu dự án mới?</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-dark dark:text-slate-300 mb-2">Họ và tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-4 text-dark dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-dark dark:text-slate-300 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-4 text-dark dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="09xx..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-dark dark:text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-4 text-dark dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-dark dark:text-slate-300 mb-2">Nội dung tư vấn</label>
                            <textarea
                                name="message"
                                rows={4}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-4 text-dark dark:text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                placeholder="Tôi cần tư vấn..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-dark dark:bg-accent hover:bg-accent dark:hover:bg-white text-white dark:text-dark font-bold py-5 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 flex justify-center items-center text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Gửi yêu cầu <Send size={20} className="ml-2" /></>}
                        </button>
                    </form>
                </div>

                {/* Info Side */}
                <div className="bg-dark dark:bg-slate-950 text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h3 className="font-display font-bold text-3xl mb-8 relative z-10">Thông tin liên hệ</h3>
                    <p className="text-slate-400 mb-12 relative z-10 text-lg">
                        Grifow Creative luôn sẵn sàng lắng nghe câu chuyện của bạn. Hãy để chúng tôi giúp bạn hiện thực hóa ý tưởng.
                    </p>

                    <div className="space-y-8 relative z-10">
                         <div className="flex items-start">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mr-6 flex-shrink-0">
                                <MapPin className="text-accent" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Văn phòng</h4>
                                <p className="text-slate-400">{settings.site_address || 'Hà Nội, Việt Nam'}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mr-6 flex-shrink-0">
                                <Phone className="text-accent" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Hotline</h4>
                                <a href={`tel:${settings.site_phone}`} className="text-slate-400 hover:text-white transition-colors">{settings.site_phone || '09xx...'}</a>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mr-6 flex-shrink-0">
                                <Mail className="text-accent" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Email</h4>
                                <a href={`mailto:${settings.site_email}`} className="text-slate-400 hover:text-white transition-colors">{settings.site_email || 'support@grifow.com'}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;