
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Layout, Zap, Search, Smartphone, Code, ArrowRight, CheckCircle, Monitor, Layers, ShieldCheck, Sparkles, Box, Grid, ChevronDown, ChevronUp,
  User, Bell, Play, MapPin, Cloud, PieChart, Briefcase, Users, MoreHorizontal, Plus, TrendingUp, Calendar, MessageSquare, BarChart, ArrowUpRight,
  ShoppingBag, FileText, Globe, Star, Image as ImageIcon, Heart, Mail, Send,
  Atom, Wind, FileCode, Server, Terminal, Share2, Database, Cpu, Check, X, Languages, Lock,
  ShoppingCart, PenTool, BarChart3, Bot, MousePointer2, Command, Coffee, Loader2, Phone
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import DesignStylesShowcase from '../components/DesignStylesShowcase';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { useSettings } from '../context/SettingsContext';
import Toast from '../components/Toast';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';
import ConsultationModal from '../components/ConsultationModal';

// --- CONFIGURATOR DATA (No Prices) ---

interface WebComponent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  recommended?: boolean;
}

const CONFIG_CATEGORIES = [
  { id: 'core', name: 'Nền tảng (Core)', icon: Cpu },
  { id: 'design', name: 'Giao diện (UI/UX)', icon: Layout },
  { id: 'features', name: 'Tính năng', icon: Layers },
  { id: 'marketing', name: 'Marketing & SEO', icon: Search },
  { id: 'infrastructure', name: 'Hạ tầng', icon: Server },
];

const AVAILABLE_COMPONENTS: WebComponent[] = [
  // Core
  { id: 'core-landing', category: 'core', name: 'Landing Page', description: 'Trang đơn giới thiệu sản phẩm/sự kiện (Giới hạn 1 trang).', icon: Monitor },
  { id: 'core-company', category: 'core', name: 'Corporate Website', description: 'Website doanh nghiệp chuyên nghiệp (Mặc định 5 trang).', icon: Globe, recommended: true },
  { id: 'core-ecommerce', category: 'core', name: 'E-commerce Basic', description: 'Web bán hàng cơ bản, giỏ hàng, thanh toán COD.', icon: ShoppingCart },
  { id: 'core-ecommerce-pro', category: 'core', name: 'E-commerce Pro', description: 'Hệ thống TMĐT cao cấp, quản lý kho, CRM, thanh toán online.', icon: Database },

  // Design
  { id: 'design-template', category: 'design', name: 'Giao diện mẫu (Premium)', description: 'Tùy biến dựa trên kho giao diện Premium của Grifow.', icon: Layout },
  { id: 'design-custom', category: 'design', name: 'Thiết kế độc quyền', description: 'Design riêng theo Brand Identity, UI/UX "may đo" từng pixel.', icon: PenTool, recommended: true },
  
  // Features
  { id: 'feat-chat', category: 'features', name: 'Live Chat / Zalo', description: 'Tích hợp nút chat nổi, kết nối Messenger/Zalo.', icon: MessageSquare },
  { id: 'feat-ai-assistant', category: 'features', name: 'Trợ lý ảo AI', description: 'Chatbot AI thông minh, tự động trả lời khách hàng 24/7.', icon: Bot, recommended: true },
  { id: 'feat-multi-lang', category: 'features', name: 'Đa ngôn ngữ (Anh/Việt)', description: 'Hệ thống chuyển đổi ngôn ngữ thông minh.', icon: Languages },
  { id: 'feat-admin', category: 'features', name: 'Admin Dashboard Pro', description: 'Trang quản trị nâng cao, báo cáo thống kê trực quan.', icon: Layout },
  { id: 'feat-filter', category: 'features', name: 'Bộ lọc nâng cao', description: 'Tìm kiếm & lọc sản phẩm nhiều tiêu chí (Màu, size, giá...).', icon: Search },

  // Marketing
  { id: 'mkt-seo-basic', category: 'marketing', name: 'SEO On-page Basic', description: 'Cài đặt cấu trúc chuẩn SEO, sitemap, robots.txt.', icon: Search },
  { id: 'mkt-seo-pro', category: 'marketing', name: 'SEO Technical Pro', description: 'Tối ưu Schema, Speed 95+, Lazyload, WebP.', icon: Zap, recommended: true },
  { id: 'mkt-analytics', category: 'marketing', name: 'Analytics & Pixel', description: 'Cài đặt GA4, Facebook Pixel, Google Tag Manager.', icon: BarChart3 },

  // Infrastructure
  { id: 'infra-domain', category: 'infrastructure', name: 'Tên miền (.com/.net)', description: 'Đăng ký và cấu hình tên miền chính chủ (1 năm).', icon: Globe },
  { id: 'infra-ssl', category: 'infrastructure', name: 'Bảo mật SSL Premium', description: 'Chứng chỉ bảo mật cao cấp, chống tấn công cơ bản.', icon: Lock },
  { id: 'infra-hosting', category: 'infrastructure', name: 'Cloud Hosting (1 năm)', description: 'Hosting tốc độ cao, backup hàng ngày.', icon: Server },
  { id: 'infra-mail', category: 'infrastructure', name: 'Email Doanh nghiệp', description: 'Email theo tên miền riêng (5 user).', icon: Mail },
];

const WebsiteDesign: React.FC = () => {
  const [showMoreStyles, setShowMoreStyles] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'team' | 'shop' | 'blog' | 'contact'>('dashboard');

  // Dynamic Content
  const { getSection } = usePageContent('website_design');
  const hero = getSection('hero', DEFAULT_CONTENT.website_design.hero);
  const features = getSection('features', DEFAULT_CONTENT.website_design.features);
  const techStackContent = getSection('tech_stack', DEFAULT_CONTENT.website_design.tech_stack);
  const configurator = getSection('configurator', DEFAULT_CONTENT.website_design.configurator);
  const cta = getSection('cta', DEFAULT_CONTENT.website_design.cta);

  // --- CONFIGURATOR STATE ---
  const [selectedConfigIds, setSelectedConfigIds] = useState<string[]>(['core-company', 'design-custom']);
  const [activeConfigCategory, setActiveConfigCategory] = useState('core');

  // --- QUOTE FORM STATE ---
  const { settings } = useSettings();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // General Consultation Modal (Triggered from Hero)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const toggleConfigItem = (id: string) => {
    setSelectedConfigIds(prev => {
        const item = AVAILABLE_COMPONENTS.find(i => i.id === id);
        if (item?.category === 'core' || item?.category === 'design') {
            // Remove other items of same category (Radio behavior)
            const filtered = prev.filter(pid => {
                const pItem = AVAILABLE_COMPONENTS.find(i => i.id === pid);
                return pItem?.category !== item.category;
            });
            return [...filtered, id];
        }

        // Other items are additive toggles (Checkbox behavior)
        if (prev.includes(id)) {
            return prev.filter(i => i !== id);
        }
        return [...prev, id];
    });
  };

  const selectedComponents = useMemo(() => {
    return selectedConfigIds.map(id => AVAILABLE_COMPONENTS.find(i => i.id === id)).filter(Boolean) as WebComponent[];
  }, [selectedConfigIds]);

  // --- SUBMIT HANDLER ---
  const handleQuoteSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // 1. Prepare Configuration Details String
      const configList = selectedComponents.map(c => `- ${c.name}`).join('\n');
      const fullMessage = `
--- CẤU HÌNH WEBSITE YÊU CẦU ---
${configList}
---------------------------------
Tổng số thành phần: ${selectedComponents.length}

LỜI NHẮN CỦA KHÁCH:
${quoteForm.message || 'Không có lời nhắn.'}
      `.trim();

      try {
          // 2. Insert to Supabase CRM
          const { error: dbError } = await supabase.from('contacts').insert([{
              name: quoteForm.name,
              email: quoteForm.email,
              phone: quoteForm.phone,
              message: fullMessage,
              service: 'Báo giá Website Configurator',
              status: 'new'
          }]);

          if (dbError) throw dbError;

          // 3. Send Email via EmailJS
          if (settings.emailjs_service_id && settings.emailjs_template_id && settings.emailjs_public_key) {
              await emailjs.send(
                  settings.emailjs_service_id,
                  settings.emailjs_template_id,
                  {
                      name: quoteForm.name,
                      email: quoteForm.email,
                      phone: quoteForm.phone,
                      message: fullMessage,
                      to_email: settings.site_email
                  },
                  settings.emailjs_public_key
              );
          }

          setToast({ message: 'Đã gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ sớm.', type: 'success' });
          setQuoteForm({ name: '', phone: '', email: '', message: '' });
          setIsQuoteModalOpen(false);

      } catch (error: any) {
          console.error("Error submitting quote:", error);
          setToast({ message: 'Có lỗi xảy ra: ' + (error.message || 'Vui lòng thử lại.'), type: 'error' });
      } finally {
          setIsSubmitting(false);
      }
  };

  const scrollToConfigurator = () => {
    const element = document.getElementById('configurator');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const techStack = [
    {
      name: "Next.js",
      icon: Zap,
      color: "text-black dark:text-white",
      bg: "bg-slate-100 dark:bg-slate-800",
      desc: "Framework React tối ưu cho SEO và hiệu suất cao."
    },
    {
      name: "React",
      icon: Atom,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      desc: "Thư viện xây dựng giao diện người dùng hàng đầu."
    },
    {
      name: "Tailwind CSS",
      icon: Wind,
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      desc: "Framework CSS hiện đại giúp thiết kế nhanh chóng."
    },
    {
      name: "TypeScript",
      icon: FileCode,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      desc: "Ngôn ngữ lập trình giúp code an toàn và dễ bảo trì."
    },
    {
      name: "Framer Motion",
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      desc: "Thư viện chuyển động chuyên nghiệp cho React."
    },
    {
      name: "WordPress",
      icon: Database,
      color: "text-slate-700 dark:text-slate-300",
      bg: "bg-slate-100 dark:bg-slate-800",
      desc: "CMS linh hoạt và phổ biến nhất thế giới."
    },
    {
      name: "Golang",
      icon: Terminal,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      desc: "Ngôn ngữ Backend hiệu năng cao từ Google."
    },
    {
      name: "Supabase",
      icon: Cloud,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      desc: "Giải pháp Backend toàn diện và mã nguồn mở."
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-100 dark:border-blue-800">
                {hero.badge}
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-tight mb-6 tracking-tight [text-wrap:balance]">
                {hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-accent">{hero.title_highlight}</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                {hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* PRIMARY BUTTON: OPEN MODAL */}
                <button 
                  onClick={() => setIsConsultationOpen(true)}
                  className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all shadow-lg hover:shadow-accent/30 flex items-center justify-center"
                >
                  {hero.btn_primary}
                </button>
                {/* SECONDARY BUTTON: SCROLL TO CONFIGURATOR */}
                <button 
                  onClick={scrollToConfigurator}
                  className="px-8 py-4 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                >
                  {hero.btn_secondary}
                </button>
              </div>
            </motion.div>

            {/* INTERACTIVE BENTO SHOWCASE (BROWSER/APP WINDOW STYLE) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
               {/* Main Window Container */}
               <div className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden flex flex-col h-[520px]">
                  
                  {/* 1. Header / Toolbar / Address Bar */}
                  <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center gap-4 flex-shrink-0">
                     <div className="flex items-center gap-1.5 pl-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20"></div>
                     </div>
                     
                     <div className="flex gap-2 text-slate-400">
                        <ArrowRight size={16} className="rotate-180" />
                        <ArrowRight size={16} />
                     </div>

                     <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center justify-center gap-2 shadow-sm text-xs font-medium text-slate-600">
                        <div className="text-green-500"><ShieldCheck size={10} /></div>
                        <span className="opacity-50">https://</span>
                        <span>grifow.design</span>
                        <span className="opacity-50">/solution</span>
                     </div>

                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">
                        G
                     </div>
                  </div>

                  {/* 2. Body Content (Sidebar + Main View) */}
                  <div className="flex flex-1 overflow-hidden bg-slate-50/30">
                      {/* Sidebar Navigation */}
                      <div className="w-[70px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 z-10">
                          <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                            title="Dashboard"
                          >
                             <BarChart size={20} />
                             {activeTab === 'dashboard' && <motion.div layoutId="active-dot" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-600 rounded-r-full" />}
                          </button>
                          
                          <button 
                             onClick={() => setActiveTab('shop')}
                             className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === 'shop' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                             title="E-commerce"
                          >
                             <ShoppingBag size={20} />
                             {activeTab === 'shop' && <motion.div layoutId="active-dot" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-orange-500 rounded-r-full" />}
                          </button>

                          <button 
                             onClick={() => setActiveTab('blog')}
                             className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === 'blog' ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                             title="Blog / News"
                          >
                             <FileText size={20} />
                             {activeTab === 'blog' && <motion.div layoutId="active-dot" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-pink-500 rounded-r-full" />}
                          </button>

                          <button 
                             onClick={() => setActiveTab('projects')}
                             className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                             title="Projects"
                          >
                             <Briefcase size={20} />
                             {activeTab === 'projects' && <motion.div layoutId="active-dot" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-r-full" />}
                          </button>
                          
                          <button 
                             onClick={() => setActiveTab('team')}
                             className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === 'team' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                             title="Team"
                          >
                             <Users size={20} />
                             {activeTab === 'team' && <motion.div layoutId="active-dot" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal-600 rounded-r-full" />}
                          </button>

                          <button 
                             onClick={() => setActiveTab('contact')}
                             className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeTab === 'contact' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-200' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}
                             title="Contact"
                          >
                             <Mail size={20} />
                             {activeTab === 'contact' && <motion.div layoutId="active-dot" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-600 rounded-r-full" />}
                          </button>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-6 overflow-hidden relative bg-slate-50/50">
                          <AnimatePresence mode="wait">
                              {/* TAB 1: DASHBOARD (Business Growth) */}
                              {activeTab === 'dashboard' && (
                                  <motion.div 
                                    key="dashboard"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full flex flex-col"
                                  >
                                      <div className="flex justify-between items-start mb-6">
                                         <div>
                                            <h3 className="text-slate-800 font-bold text-xl">Dashboard</h3>
                                            <p className="text-slate-400 text-xs mt-1 font-medium">Grifow Growth Report</p>
                                         </div>
                                         <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
                                            <Calendar size={12} className="text-slate-400"/> This Month
                                         </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4 mb-6">
                                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
                                              <div className="flex items-center gap-2 mb-2">
                                                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><TrendingUp size={14}/></div>
                                                  <span className="text-slate-500 text-xs font-bold">Total Revenue</span>
                                              </div>
                                              <div className="text-slate-900 font-black text-2xl">$124.5k</div>
                                              <div className="text-green-500 text-[10px] font-bold mt-1 bg-green-50 inline-block px-1.5 rounded">+12.5% vs last month</div>
                                          </div>
                                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
                                              <div className="flex items-center gap-2 mb-2">
                                                  <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Users size={14}/></div>
                                                  <span className="text-slate-500 text-xs font-bold">New Clients</span>
                                              </div>
                                              <div className="text-slate-900 font-black text-2xl">342</div>
                                              <div className="text-green-500 text-[10px] font-bold mt-1 bg-green-50 inline-block px-1.5 rounded">+8.2% growth</div>
                                          </div>
                                      </div>

                                      <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col">
                                          <div className="flex justify-between items-center mb-4">
                                              <span className="text-slate-800 font-bold text-sm">Traffic Analysis</span>
                                              <ArrowUpRight size={16} className="text-slate-300" />
                                          </div>
                                          {/* Chart */}
                                          <div className="flex-1 w-full relative">
                                              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                                                  <path d="M0,80 C30,70 60,90 100,50 C150,0 200,60 250,40 C300,20 350,80 400,30 L400,100 L0,100 Z" fill="url(#gradient)" opacity="0.1" />
                                                  <path d="M0,80 C30,70 60,90 100,50 C150,0 200,60 250,40 C300,20 350,80 400,30" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                  <defs>
                                                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                          <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                                                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                                                      </linearGradient>
                                                  </defs>
                                              </svg>
                                              {/* Dot on line */}
                                              <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow-md z-10"></div>
                                              <div className="absolute top-[10%] left-[60%] bg-slate-800 text-white text-[9px] px-2 py-1 rounded shadow-lg">1,240 Visits</div>
                                          </div>
                                      </div>
                                  </motion.div>
                              )}

                              {/* TAB 2: SHOP (E-commerce) */}
                              {activeTab === 'shop' && (
                                  <motion.div
                                      key="shop"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.3 }}
                                      className="h-full flex flex-col"
                                  >
                                      {/* Header */}
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="text-slate-800 font-bold text-xl">Products</h3>
                                          <div className="flex gap-2">
                                              <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-slate-400"><Search size={14}/></div>
                                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><ShoppingCart size={14}/></div>
                                          </div>
                                      </div>
                                      {/* Product Grid */}
                                      <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-1 custom-scrollbar">
                                          {[1,2,3,4].map(i => (
                                              <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                                  <div className="aspect-square bg-slate-100 rounded-lg mb-3 relative overflow-hidden group">
                                                       <div className="absolute inset-0 bg-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-blue-600 font-bold text-xs">VIEW</div>
                                                       {/* Mock Image placeholder */}
                                                       <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag size={24}/></div>
                                                  </div>
                                                  <div className="text-sm font-bold text-slate-800">Product Item {i}</div>
                                                  <div className="text-xs text-slate-500 mb-2">Category</div>
                                                  <div className="flex justify-between items-center">
                                                      <span className="text-sm font-bold text-blue-600">$120.00</span>
                                                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer">+</div>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </motion.div>
                              )}

                              {/* TAB 3: BLOG */}
                              {activeTab === 'blog' && (
                                  <motion.div
                                      key="blog"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.3 }}
                                      className="h-full flex flex-col"
                                  >
                                      <div className="mb-6">
                                          <h3 className="text-slate-800 font-bold text-xl">Latest News</h3>
                                          <p className="text-xs text-slate-400">Insights & Updates</p>
                                      </div>
                                      <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                                          {[1,2,3].map(i => (
                                              <div key={i} className="flex gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0"></div>
                                                  <div>
                                                      <div className="text-[10px] text-blue-500 font-bold uppercase mb-1">Technology</div>
                                                      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">The Future of Web Design in 2025</h4>
                                                      <p className="text-[10px] text-slate-500 line-clamp-2">How AI and spatial computing are reshaping the digital landscape.</p>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </motion.div>
                              )}

                              {/* TAB 4: PROJECTS */}
                              {activeTab === 'projects' && (
                                  <motion.div
                                      key="projects"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.3 }}
                                      className="h-full flex flex-col"
                                  >
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="text-slate-800 font-bold text-xl">Portfolio</h3>
                                          <button className="text-xs bg-black text-white px-3 py-1.5 rounded-lg font-bold">Filter</button>
                                      </div>
                                      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-1 custom-scrollbar">
                                           {[1,2].map(i => (
                                               <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                                                   <div className="h-32 bg-slate-200 relative group">
                                                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                           <span className="text-white text-xs font-bold border border-white px-3 py-1 rounded-full">View Case Study</span>
                                                       </div>
                                                   </div>
                                                   <div className="p-4">
                                                       <div className="flex justify-between items-start">
                                                           <div>
                                                               <h4 className="font-bold text-slate-800">Project Name {i}</h4>
                                                               <p className="text-xs text-slate-500">Branding, Website</p>
                                                           </div>
                                                           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><ArrowUpRight size={14} className="text-slate-400"/></div>
                                                       </div>
                                                   </div>
                                               </div>
                                           ))}
                                      </div>
                                  </motion.div>
                              )}

                              {/* TAB 5: TEAM */}
                              {activeTab === 'team' && (
                                  <motion.div
                                      key="team"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.3 }}
                                      className="h-full flex flex-col"
                                  >
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="text-slate-800 font-bold text-xl">Our Team</h3>
                                          <div className="text-xs text-slate-500">12 Members</div>
                                      </div>
                                      <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1 custom-scrollbar">
                                          {[1,2,3,4].map(i => (
                                              <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400"></div>
                                                  <div className="flex-1">
                                                      <div className="text-sm font-bold text-slate-800">Member Name</div>
                                                      <div className="text-xs text-slate-500">{i % 2 === 0 ? 'Developer' : 'Designer'}</div>
                                                  </div>
                                                  <div className="flex gap-2">
                                                      <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={12}/></div>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </motion.div>
                              )}

                              {/* TAB 6: CONTACT */}
                              {activeTab === 'contact' && (
                                  <motion.div
                                      key="contact"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.3 }}
                                      className="h-full flex flex-col justify-center"
                                  >
                                      <div className="text-center mb-6">
                                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                              <Mail size={20}/>
                                          </div>
                                          <h3 className="text-slate-800 font-bold text-xl">Get in touch</h3>
                                          <p className="text-xs text-slate-500">We'd love to hear from you</p>
                                      </div>
                                      
                                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                                          <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 uppercase">Name</label>
                                              <div className="bg-slate-50 h-8 rounded-lg border border-slate-200"></div>
                                          </div>
                                          <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                                              <div className="bg-slate-50 h-8 rounded-lg border border-slate-200"></div>
                                          </div>
                                          <div className="space-y-1">
                                              <label className="text-[10px] font-bold text-slate-500 uppercase">Message</label>
                                              <div className="bg-slate-50 h-16 rounded-lg border border-slate-200"></div>
                                          </div>
                                          <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold mt-2">Send Message</button>
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                  </div>
               </div>
               
               {/* Decorative blobs - More subtle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-100/40 blur-[80px] -z-10 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Key Features */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle={features.subtitle}
            title={features.title}
            description={features.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Thiết kế UI/UX Độc quyền",
                desc: "Không sử dụng theme mẫu. Giao diện được thiết kế riêng biệt dựa trên bản sắc thương hiệu (Brand Identity) và hành vi người dùng.",
                color: "text-purple-500"
              },
              {
                icon: Zap,
                title: "Tốc độ tải trang tối ưu",
                desc: "Tối ưu Core Web Vitals, đạt điểm cao trên Google PageSpeed. Tốc độ nhanh giúp giữ chân khách hàng và hỗ trợ SEO tốt hơn.",
                color: "text-yellow-500"
              },
              {
                icon: Search,
                title: "Chuẩn SEO Technical",
                desc: "Cấu trúc HTML semantic, Schema Markup, Sitemap và tối ưu thẻ meta tự động giúp website dễ dàng lên Top Google.",
                color: "text-blue-500"
              },
              {
                icon: Smartphone,
                title: "Responsive Đa thiết bị",
                desc: "Hiển thị hoàn hảo trên mọi màn hình: Mobile, Tablet, Laptop, Desktop. Trải nghiệm mượt mà như Native App.",
                color: "text-green-500"
              },
              {
                icon: ShieldCheck,
                title: "Bảo mật & An toàn",
                desc: "Tích hợp SSL, chống DDoS, bảo vệ dữ liệu khách hàng. Hệ thống backup tự động hàng ngày đảm bảo an toàn tuyệt đối.",
                color: "text-red-500"
              },
              {
                icon: Code,
                title: "Công nghệ đa dạng",
                desc: "Linh hoạt lựa chọn: Code thuần (Next.js) cho hiệu năng tối đa hoặc WordPress CMS dễ dàng quản trị.",
                color: "text-accent"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tech Stack Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle={techStackContent.subtitle}
            title={techStackContent.title}
            description={techStackContent.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${tech.bg}`}
              >
                <div className="flex items-center gap-4 mb-4">
                   <div className={`w-10 h-10 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <tech.icon size={20} className={tech.color} />
                   </div>
                   <h4 className="font-bold text-lg text-slate-900 dark:text-white">{tech.name}</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                   {tech.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. INTERACTIVE DESIGN STYLE SHOWCASE (Simulated Screens) */}
      <DesignStylesShowcase />

      {/* 4. WEBSITE CONFIGURATOR SECTION */}
      <section id="configurator" className="py-24 bg-slate-50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
            <SectionHeader 
                subtitle={configurator.subtitle} 
                title={configurator.title} 
                description={configurator.description}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: Options */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {CONFIG_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveConfigCategory(cat.id)}
                                className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${
                                    activeConfigCategory === cat.id 
                                    ? 'bg-dark dark:bg-white text-white dark:text-dark shadow-lg' 
                                    : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <cat.icon size={16} />
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Available Items List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="wait">
                            {AVAILABLE_COMPONENTS.filter(item => item.category === activeConfigCategory).map(item => {
                                const isSelected = selectedConfigIds.includes(item.id);
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => toggleConfigItem(item.id)}
                                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all group h-full flex flex-col ${
                                            isSelected 
                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 shadow-md' 
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                <item.icon size={24} />
                                            </div>
                                            {isSelected ? (
                                                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                                    <Check size={14} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-400"></div>
                                            )}
                                        </div>
                                        
                                        <h4 className="font-bold text-lg text-dark dark:text-white mb-1">{item.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-grow">{item.description}</p>
                                        
                                        {item.recommended && (
                                            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase">Khuyên dùng</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT COLUMN: Summary */}
                <div className="lg:col-span-4 sticky top-24">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="bg-dark dark:bg-slate-950 p-6 text-white border-b border-slate-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white">
                                    <Cpu size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Danh sách đã chọn</h3>
                                    <p className="text-slate-400 text-xs">Grifow Custom Build</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            {selectedComponents.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <p className="mb-2">Chưa có thành phần nào.</p>
                                    <p className="text-xs">Hãy chọn linh kiện bên trái.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {selectedComponents.map((item) => (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                key={`selected-${item.id}`} 
                                                className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                            >
                                                <div className="mt-1 text-slate-400">
                                                    <item.icon size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-sm font-bold text-dark dark:text-white">{item.name}</h4>
                                                        <button 
                                                            onClick={() => toggleConfigItem(item.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{item.category}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="mb-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    Bạn đã chọn <span className="font-bold text-dark dark:text-white">{selectedConfigIds.length}</span> thành phần.
                                </p>
                            </div>
                            <button 
                              onClick={() => setIsQuoteModalOpen(true)}
                              className="w-full py-4 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:bg-accentHover transition-all flex items-center justify-center gap-2"
                            >
                                 Tư vấn & Nhận báo giá <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
           <div className="bg-gradient-to-r from-blue-600 to-accent rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">{cta.title}</h2>
                <p className="text-lg md:text-xl text-blue-50 mb-10">{cta.description}</p>
                {/* Changed Link to Button opening Modal */}
                <button 
                  onClick={() => setIsConsultationOpen(true)}
                  className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  {cta.btn_text} <ArrowRight className="ml-2" />
                </button>
              </div>
           </div>
        </div>
      </section>

      {/* --- QUOTE MODAL (Keep as is) --- */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
             >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                   <h3 className="font-bold text-lg text-dark dark:text-white">Gửi yêu cầu báo giá</h3>
                   <button onClick={() => setIsQuoteModalOpen(false)} className="text-slate-400 hover:text-dark dark:hover:text-white"><X size={24}/></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                   <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-6 border border-blue-100 dark:border-blue-900/20">
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-2 flex items-center gap-2"><Cpu size={16}/> Cấu hình đã chọn:</h4>
                      <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 ml-5 list-disc">
                         {selectedComponents.map(c => (
                            <li key={c.id}>{c.name}</li>
                         ))}
                      </ul>
                   </div>

                   <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      {/* ... Form Inputs (Keep as is) ... */}
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Họ tên *</label>
                         <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input 
                                required
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent text-sm dark:text-white"
                                placeholder="Nguyễn Văn A"
                                value={quoteForm.name}
                                onChange={e => setQuoteForm({...quoteForm, name: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số điện thoại *</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input 
                                    required
                                    type="tel"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent text-sm dark:text-white"
                                    placeholder="09xx..."
                                    value={quoteForm.phone}
                                    onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})}
                                />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input 
                                    type="email"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent text-sm dark:text-white"
                                    placeholder="email@..."
                                    value={quoteForm.email}
                                    onChange={e => setQuoteForm({...quoteForm, email: e.target.value})}
                                />
                            </div>
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lời nhắn thêm</label>
                         <textarea 
                            rows={3}
                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-accent text-sm dark:text-white resize-none"
                            placeholder="Ghi chú thêm về yêu cầu của bạn..."
                            value={quoteForm.message}
                            onChange={e => setQuoteForm({...quoteForm, message: e.target.value})}
                         ></textarea>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-accent text-white font-bold rounded-lg shadow-lg hover:bg-accentHover transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                         {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} Gửi yêu cầu ngay
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

      {/* General Consultation Modal */}
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />

    </div>
  );
};

// ... Helper Components (Keep as is) ...
const ProjectCard = ({ h, img }: { h: string, img: string }) => (
    <div className={`${h} rounded-xl bg-slate-100 relative overflow-hidden group cursor-pointer`}>
        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Project" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="text-white font-bold text-xs border border-white px-3 py-1 rounded-full uppercase tracking-wider">View</div>
        </div>
    </div>
);

const FilterButton = ({ label }: { label: string }) => (
    <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors">
        {label} <ChevronDown size={12} />
    </button>
);

export default WebsiteDesign;
