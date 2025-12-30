
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ShieldCheck, Globe, Clock, Server, Cloud, Video, Users, ArrowRight, X, Loader2, Send } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { useSettings } from '../context/SettingsContext';
import Toast from '../components/Toast';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';

const EmailService: React.FC = () => {
  const { settings } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | string>(''); // Store number of users as ID
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Dynamic Content
  const { getSection } = usePageContent('email_service');
  const hero = getSection('hero', DEFAULT_CONTENT.email_service.hero);
  const features = getSection('features', DEFAULT_CONTENT.email_service.features);
  const pricing = getSection('pricing', DEFAULT_CONTENT.email_service.pricing);

  const pricingData = [
    { users: 5, price: 4000000 },
    { users: 10, price: 6500000 },
    { users: 20, price: 10000000 },
    { users: 30, price: 15000000 },
    { users: 50, price: 20000000 },
    { users: 100, price: 35000000 },
    { users: 200, price: 60000000 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleOpenModal = (preSelectedUsers?: number) => {
      if (preSelectedUsers) {
          setSelectedPackage(preSelectedUsers);
      } else if (!selectedPackage) {
          setSelectedPackage(pricingData[0].users); // Default to first package
      }
      setIsModalOpen(true);
  };

  const scrollToPricing = (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById('pricing');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      // Find package details
      const pkg = pricingData.find(p => p.users === Number(selectedPackage));
      const packageDetail = pkg ? `${pkg.users} User - ${formatCurrency(pkg.price)}` : 'Tùy chỉnh/Chưa chọn';

      const fullMessage = `
--- ĐĂNG KÝ EMAIL DOANH NGHIỆP ---
Gói dịch vụ: ${packageDetail}
Công ty: ${formData.company}
----------------------------------
Lời nhắn:
${formData.message}
      `.trim();

      try {
          // 1. Save to Supabase
          const { error: dbError } = await supabase.from('contacts').insert([{
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              message: fullMessage,
              service: 'Email Workspace Registration',
              status: 'new'
          }]);

          if (dbError) throw dbError;

          // 2. Send Email
          if (settings.emailjs_service_id && settings.emailjs_template_id && settings.emailjs_public_key) {
              await emailjs.send(
                  settings.emailjs_service_id,
                  settings.emailjs_template_id,
                  {
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      message: fullMessage,
                      to_email: settings.site_email
                  },
                  settings.emailjs_public_key
              );
          }

          setToast({ message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.', type: 'success' });
          setIsModalOpen(false);
          setFormData({ name: '', phone: '', email: '', company: '', message: '' });

      } catch (error: any) {
          console.error("Registration Error:", error);
          setToast({ message: 'Có lỗi xảy ra: ' + (error.message || 'Vui lòng thử lại.'), type: 'error' });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-indigo-100/50 to-transparent dark:from-indigo-900/10 rounded-bl-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none mb-8 flex items-center justify-center text-indigo-600 dark:text-indigo-400"
              >
                 <Mail size={40} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-display font-bold text-5xl md:text-6xl text-slate-900 dark:text-white mb-6 leading-tight"
              >
                {hero.title_1} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{hero.title_highlight}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto"
              >
                {hero.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center gap-4"
              >
                 <a 
                    href="#pricing" 
                    onClick={scrollToPricing}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                 >
                    {hero.btn_text}
                 </a>
              </motion.div>
            </div>
        </div>
      </section>

      {/* 2. Benefits Grid */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
           <SectionHeader subtitle={features.subtitle} title={features.title} description={features.description} />

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Email theo tên miền riêng",
                  desc: "Xây dựng uy tín thương hiệu với địa chỉ email chuyên nghiệp (VD: ten.ban@tencongty.com).",
                  color: "text-blue-500"
                },
                {
                  icon: Cloud,
                  title: "Lưu trữ Đám mây 30GB+",
                  desc: "Mỗi người dùng có 30GB dung lượng lưu trữ Google Drive, an toàn và truy cập mọi lúc mọi nơi.",
                  color: "text-yellow-500"
                },
                {
                  icon: Video,
                  title: "Họp trực tuyến Google Meet",
                  desc: "Tổ chức cuộc họp chất lượng HD lên đến 100 người tham gia, không giới hạn thời gian.",
                  color: "text-green-500"
                },
                {
                  icon: ShieldCheck,
                  title: "Bảo mật cấp doanh nghiệp",
                  desc: "Chống Spam, Phishing và Malware với độ chính xác 99.9%. Bảo vệ dữ liệu doanh nghiệp an toàn.",
                  color: "text-red-500"
                },
                {
                  icon: Users,
                  title: "Cộng tác thời gian thực",
                  desc: "Làm việc cùng nhau trên Docs, Sheets, Slides. Chỉnh sửa và bình luận trực tiếp trong thời gian thực.",
                  color: "text-purple-500"
                },
                {
                  icon: Server,
                  title: "Uptime 99.9%",
                  desc: "Cam kết thời gian hoạt động liên tục từ Google. Đảm bảo công việc của bạn không bao giờ bị gián đoạn.",
                  color: "text-indigo-500"
                }
              ].map((item, idx) => (
                 <div key={idx} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 group">
                    <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                       <item.icon className={item.color} size={24} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. Pricing Table */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50">
         <div className="container mx-auto px-4">
            <SectionHeader 
               subtitle={pricing.subtitle} 
               title={pricing.title} 
               description={pricing.description}
            />

            <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
               {/* Table Header */}
               <div className="grid grid-cols-5 bg-slate-900 text-white text-sm md:text-base font-bold text-center py-5 px-2 uppercase tracking-wide">
                  <div className="col-span-1 flex items-center justify-center">Số lượng User</div>
                  <div className="col-span-1 flex items-center justify-center">Giá (VNĐ)</div>
                  <div className="col-span-1 flex items-center justify-center">Thanh toán</div>
                  <div className="col-span-1 flex items-center justify-center">Dung lượng</div>
                  <div className="col-span-1 flex items-center justify-center">Hỗ trợ KH</div>
               </div>

               {/* Table Body */}
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pricingData.map((row, idx) => (
                     <div 
                        key={idx} 
                        onClick={() => handleOpenModal(row.users)}
                        className="grid grid-cols-5 text-center py-6 px-2 text-slate-700 dark:text-slate-300 items-center hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer group"
                     >
                        <div className="col-span-1 font-bold text-indigo-600 dark:text-indigo-400 text-lg group-hover:scale-110 transition-transform">
                           {row.users} user
                        </div>
                        <div className="col-span-1 font-black text-slate-900 dark:text-white text-lg">
                           {formatCurrency(row.price)}
                        </div>
                        <div className="col-span-1 text-sm font-medium">
                           Giá cho 12 tháng
                        </div>
                        <div className="col-span-1 text-sm">
                           <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-bold text-xs">30 Gb/ user</span>
                        </div>
                        <div className="col-span-1 text-sm font-bold flex items-center justify-center gap-1">
                           <Clock size={14} className="text-indigo-500"/> Hỗ trợ 24/7
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="mt-12 text-center">
               <p className="text-slate-500 mb-6">
                  * Giá trên chưa bao gồm 10% VAT. <br/>
                  * Hợp đồng tối thiểu 12 tháng.
               </p>
               <button 
                  onClick={() => handleOpenModal()} 
                  className="inline-flex items-center px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
               >
                  Liên hệ đăng ký ngay <ArrowRight size={18} className="ml-2" />
               </button>
            </div>
         </div>
      </section>

      {/* --- REGISTRATION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             {/* Backdrop */}
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             
             {/* Modal Content */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
             >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                   <div>
                      <h3 className="font-bold text-xl text-dark dark:text-white">Đăng ký Email</h3>
                      <p className="text-xs text-slate-500">Google Workspace Business Starter</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-dark dark:hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                   <form onSubmit={handleSubmit} className="space-y-5">
                      
                      {/* Package Selection */}
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Chọn gói dịch vụ</label>
                         <div className="relative">
                             <select 
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(Number(e.target.value))}
                                className="w-full pl-4 pr-10 py-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 focus:outline-none focus:border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold appearance-none cursor-pointer"
                             >
                                {pricingData.map(pkg => (
                                    <option key={pkg.users} value={pkg.users}>
                                        {pkg.users} User - {formatCurrency(pkg.price)} / năm
                                    </option>
                                ))}
                             </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
                                <ArrowRight size={16} className="rotate-90" />
                             </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Họ tên *</label>
                            <input 
                                required
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-sm dark:text-white"
                                placeholder="Nguyễn Văn A"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số điện thoại *</label>
                            <input 
                                required
                                type="tel"
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-sm dark:text-white"
                                placeholder="09xx..."
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email liên hệ *</label>
                         <input 
                            required
                            type="email"
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-sm dark:text-white"
                            placeholder="contact@company.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                         />
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên công ty / Doanh nghiệp</label>
                         <input 
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-sm dark:text-white"
                            placeholder="Công ty TNHH..."
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                         />
                      </div>

                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ghi chú thêm</label>
                         <textarea 
                            rows={3}
                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500 text-sm dark:text-white resize-none"
                            placeholder="Yêu cầu đặc biệt..."
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                         ></textarea>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                         {loading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Gửi yêu cầu đăng ký
                      </button>
                   </form>
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

export default EmailService;
