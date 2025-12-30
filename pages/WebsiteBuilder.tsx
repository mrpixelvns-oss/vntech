import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Cpu, Layout, Search, Globe, ShoppingCart, 
  Server, MessageSquare, Languages, Database, Lock, Mail, ArrowRight,
  Monitor, Layers, Zap, PenTool, BarChart3, FileText, Plus, Minus, AlertCircle, Bot
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

// --- DATA STRUCTURES ---

interface WebComponent {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  category: string;
  recommended?: boolean;
}

const CATEGORIES = [
  { id: 'core', name: 'Nền tảng (Core)', icon: Cpu },
  { id: 'design', name: 'Giao diện (UI/UX)', icon: Layout },
  { id: 'features', name: 'Tính năng', icon: Layers },
  { id: 'marketing', name: 'Marketing & SEO', icon: Search },
  { id: 'infrastructure', name: 'Hạ tầng', icon: Server },
];

const AVAILABLE_COMPONENTS: WebComponent[] = [
  // Core
  { id: 'core-landing', category: 'core', name: 'Landing Page', description: 'Trang đơn giới thiệu sản phẩm/sự kiện (Giới hạn 1 trang).', price: 5000000, icon: Monitor },
  { id: 'core-company', category: 'core', name: 'Corporate Website', description: 'Website doanh nghiệp chuyên nghiệp (Mặc định 5 trang).', price: 12000000, icon: Globe, recommended: true },
  { id: 'core-ecommerce', category: 'core', name: 'E-commerce Basic', description: 'Web bán hàng cơ bản, giỏ hàng, thanh toán COD.', price: 18000000, icon: ShoppingCart },
  { id: 'core-ecommerce-pro', category: 'core', name: 'E-commerce Pro', description: 'Hệ thống TMĐT cao cấp, quản lý kho, CRM, thanh toán online.', price: 35000000, icon: Database },

  // Design
  { id: 'design-template', category: 'design', name: 'Giao diện mẫu (Premium)', description: 'Tùy biến dựa trên kho giao diện Premium của Grifow.', price: 2000000, icon: Layout },
  { id: 'design-custom', category: 'design', name: 'Thiết kế độc quyền', description: 'Design riêng theo Brand Identity, UI/UX "may đo" từng pixel.', price: 8000000, icon: PenTool, recommended: true },
  
  // Features
  { id: 'feat-chat', category: 'features', name: 'Live Chat / Zalo', description: 'Tích hợp nút chat nổi, kết nối Messenger/Zalo.', price: 500000, icon: MessageSquare },
  { id: 'feat-ai-assistant', category: 'features', name: 'Trợ lý ảo AI', description: 'Chatbot AI thông minh, tự động trả lời khách hàng 24/7.', price: 2500000, icon: Bot, recommended: true },
  { id: 'feat-multi-lang', category: 'features', name: 'Đa ngôn ngữ (Anh/Việt)', description: 'Hệ thống chuyển đổi ngôn ngữ thông minh.', price: 3000000, icon: Languages },
  { id: 'feat-admin', category: 'features', name: 'Admin Dashboard Pro', description: 'Trang quản trị nâng cao, báo cáo thống kê trực quan.', price: 5000000, icon: Layout },
  { id: 'feat-filter', category: 'features', name: 'Bộ lọc nâng cao', description: 'Tìm kiếm & lọc sản phẩm nhiều tiêu chí (Màu, size, giá...).', price: 2500000, icon: Search },

  // Marketing
  { id: 'mkt-seo-basic', category: 'marketing', name: 'SEO On-page Basic', description: 'Cài đặt cấu trúc chuẩn SEO, sitemap, robots.txt.', price: 1500000, icon: Search },
  { id: 'mkt-seo-pro', category: 'marketing', name: 'SEO Technical Pro', description: 'Tối ưu Schema, Speed 95+, Lazyload, WebP.', price: 4000000, icon: Zap, recommended: true },
  { id: 'mkt-analytics', category: 'marketing', name: 'Analytics & Pixel', description: 'Cài đặt GA4, Facebook Pixel, Google Tag Manager.', price: 1000000, icon: BarChart3 },

  // Infrastructure
  { id: 'infra-domain', category: 'infrastructure', name: 'Tên miền (.com/.net)', description: 'Đăng ký và cấu hình tên miền chính chủ (1 năm).', price: 350000, icon: Globe },
  { id: 'infra-ssl', category: 'infrastructure', name: 'Bảo mật SSL Premium', description: 'Chứng chỉ bảo mật cao cấp, chống tấn công cơ bản.', price: 1000000, icon: Lock },
  { id: 'infra-hosting', category: 'infrastructure', name: 'Cloud Hosting (1 năm)', description: 'Hosting tốc độ cao, backup hàng ngày.', price: 2400000, icon: Server },
  { id: 'infra-mail', category: 'infrastructure', name: 'Email Doanh nghiệp', description: 'Email theo tên miền riêng (5 user).', price: 2000000, icon: Mail },
];

const EXTRA_PAGE_PRICE = 500000; // 500k per extra page

const WebsiteBuilder: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['core-company', 'design-custom']);
  const [activeCategory, setActiveCategory] = useState('core');
  
  // Page count state
  const [pageCount, setPageCount] = useState(5);

  // Check if current selection is Landing Page
  const isLandingPage = useMemo(() => selectedIds.includes('core-landing'), [selectedIds]);

  // Effect to reset/lock page count if Landing Page is selected
  useEffect(() => {
    if (isLandingPage) {
      setPageCount(1);
    } else if (pageCount < 5) {
      setPageCount(5); // Reset to minimum 5 for other types if switching back
    }
  }, [isLandingPage]);

  // Toggle selection logic
  const toggleItem = (id: string) => {
    setSelectedIds(prev => {
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
    return selectedIds.map(id => AVAILABLE_COMPONENTS.find(i => i.id === id)).filter(Boolean) as WebComponent[];
  }, [selectedIds]);

  // Calculate Extra Pages Cost
  const extraPages = Math.max(0, pageCount - 5);
  const extraPagesCost = isLandingPage ? 0 : extraPages * EXTRA_PAGE_PRICE;

  const totalPrice = useMemo(() => {
    const componentTotal = selectedComponents.reduce((sum, item) => sum + item.price, 0);
    return componentTotal + extraPagesCost;
  }, [selectedComponents, extraPagesCost]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const adjustPageCount = (delta: number) => {
    if (isLandingPage) return; // Locked for landing page
    setPageCount(prev => Math.max(5, prev + delta));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        <SectionHeader 
            subtitle="Website Configurator" 
            title="Xây dựng cấu hình Website" 
            description="Chọn các thành phần (linh kiện) bên dưới để xây dựng báo giá sơ bộ cho dự án của bạn."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: INVENTORY (Options) */}
            <div className="lg:col-span-8 space-y-8">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${
                                activeCategory === cat.id 
                                ? 'bg-dark dark:bg-white text-white dark:text-dark shadow-lg' 
                                : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <cat.icon size={16} />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Available Items List - REMOVED layout props to fix stretching */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {AVAILABLE_COMPONENTS.filter(item => item.category === activeCategory).map(item => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => toggleItem(item.id)}
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
                                    
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(item.price)}</span>
                                        {item.recommended && (
                                            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase">Khuyên dùng</span>
                                        )}
                                    </div>

                                    {/* Animation visual cue */}
                                    {isSelected && (
                                        <div 
                                            className="absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT COLUMN: BUILD RECEIPT */}
            <div className="lg:col-span-4 sticky top-24">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="bg-dark dark:bg-slate-950 p-6 text-white border-b border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white">
                                <Cpu size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Cấu hình của bạn</h3>
                                <p className="text-slate-400 text-xs">Grifow Custom Build</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
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
                                                        onClick={() => toggleItem(item.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{item.category}</p>
                                                <div className="text-accent font-bold text-sm">{formatCurrency(item.price)}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Page Count Controller */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className="text-sm font-bold text-dark dark:text-white">Số lượng trang</span>
                                        </div>
                                        {isLandingPage ? (
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Cố định: 1</span>
                                        ) : (
                                            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                                <button 
                                                    onClick={() => adjustPageCount(-1)}
                                                    disabled={pageCount <= 5}
                                                    className={`w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-700 shadow-sm ${pageCount <= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:text-accent'}`}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{pageCount}</span>
                                                <button 
                                                    onClick={() => adjustPageCount(1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-white dark:bg-slate-700 shadow-sm hover:text-accent"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">
                                            {isLandingPage ? 'Landing Page chỉ có 1 trang' : '5 trang đầu miễn phí'}
                                        </span>
                                        {!isLandingPage && extraPages > 0 && (
                                             <span className="text-accent font-bold">+{formatCurrency(extraPagesCost)}</span>
                                        )}
                                    </div>
                                    {!isLandingPage && pageCount > 5 && (
                                        <div className="mt-2 flex items-start gap-2 text-[10px] text-orange-500 bg-orange-50 dark:bg-orange-900/10 p-2 rounded">
                                            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                                            <span>Phí thêm trang: {formatCurrency(EXTRA_PAGE_PRICE)}/trang</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950/50 p-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Tổng ước tính:</span>
                            <motion.span 
                                key={totalPrice}
                                initial={{ scale: 1.2, color: '#00c4b4' }}
                                animate={{ scale: 1, color: 'currentColor' }}
                                className="text-2xl font-black text-dark dark:text-white"
                            >
                                {formatCurrency(totalPrice)}
                            </motion.span>
                        </div>
                        <button className="w-full py-4 bg-accent text-white font-bold rounded-xl shadow-lg shadow-accent/30 hover:bg-accentHover transition-all flex items-center justify-center gap-2">
                             Đặt tư vấn cấu hình này <ArrowRight size={18} />
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-3">
                            *Giá trên là ước tính sơ bộ. Grifow sẽ tư vấn chi tiết để tối ưu chi phí cho bạn.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;