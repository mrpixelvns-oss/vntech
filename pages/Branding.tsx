
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PenTool, Palette, BookOpen, Package, Monitor, Layers, 
  ArrowRight, Sparkles, Target, Eye, Fingerprint, ArrowUpRight,
  RefreshCw, MousePointer2
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';

// --- BRAND STYLES DATA ---
const BRAND_VIBES = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    tagline: 'Less is More',
    desc: 'Tập trung vào sự tinh khiết, khoảng trắng và typography hiện đại. Phù hợp với thương hiệu hướng tới sự rõ ràng, minh bạch.',
    colors: ['bg-slate-900', 'bg-slate-200', 'bg-white'],
    fontTitle: 'font-sans font-black tracking-tighter',
    fontBody: 'font-sans font-normal',
    shape: 'rounded-none',
    button: 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
    bg: 'bg-white',
    text: 'text-slate-900',
    accent: 'bg-slate-900'
  },
  {
    id: 'luxury',
    name: 'Luxury & Elegant',
    tagline: 'Timeless Beauty',
    desc: 'Sử dụng font có chân (Serif), màu sắc trầm ấm (Vàng kim, Đen) tạo cảm giác quyền lực, đẳng cấp và trường tồn.',
    colors: ['bg-[#D4AF37]', 'bg-[#1A1A1A]', 'bg-[#F5F5F5]'], // Gold & Black
    fontTitle: 'font-serif italic font-medium tracking-wide',
    fontBody: 'font-serif',
    shape: 'rounded-sm',
    button: 'bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]',
    bg: 'bg-[#0f0f0f]',
    text: 'text-[#e5e5e5]',
    accent: 'bg-[#D4AF37]'
  },
  {
    id: 'playful',
    name: 'Playful & Pop',
    tagline: 'Joy in Motion',
    desc: 'Màu sắc rực rỡ, độ tương phản cao, các hình khối bo tròn mềm mại. Thể hiện sự năng động, trẻ trung và thân thiện.',
    colors: ['bg-[#FF6B6B]', 'bg-[#4ECDC4]', 'bg-[#FFE66D]'], // Pastel Pop
    fontTitle: 'font-display font-black text-4xl',
    fontBody: 'font-sans font-medium',
    shape: 'rounded-[2rem]',
    button: 'bg-[#FF6B6B] text-white shadow-[4px_4px_0px_0px_#4ECDC4] translate-y-[-2px] hover:translate-y-0 hover:shadow-none transition-all',
    bg: 'bg-[#FFF9F0]',
    text: 'text-[#2D3436]',
    accent: 'bg-[#FF6B6B]'
  },
  {
    id: 'tech',
    name: 'Futuristic Tech',
    tagline: 'Next Gen Core',
    desc: 'Gradient Neon, hiệu ứng kính (Glassmorphism), font chữ kỹ thuật số. Đại diện cho sự đột phá, tốc độ và tương lai.',
    colors: ['bg-cyan-500', 'bg-blue-600', 'bg-purple-600'],
    fontTitle: 'font-mono font-bold tracking-tight uppercase',
    fontBody: 'font-sans text-sm',
    shape: 'rounded-xl',
    button: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    bg: 'bg-[#050B14]',
    text: 'text-white',
    accent: 'bg-cyan-500'
  }
];

const Branding: React.FC = () => {
  const [activeVibe, setActiveVibe] = useState(BRAND_VIBES[0]);

  // Dynamic Content
  const { getSection } = usePageContent('branding');
  const hero = getSection('hero', DEFAULT_CONTENT.branding.hero);
  const philosophy = getSection('philosophy', DEFAULT_CONTENT.branding.philosophy);
  const servicesList = getSection('services_list', DEFAULT_CONTENT.branding.services_list);
  const simulator = getSection('simulator', DEFAULT_CONTENT.branding.simulator);
  const process = getSection('process', DEFAULT_CONTENT.branding.process);
  const cta = getSection('cta', DEFAULT_CONTENT.branding.cta);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section - Artistic & Bold */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
             <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 mx-auto bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl rotate-12 mb-8 shadow-2xl shadow-purple-500/30 flex items-center justify-center text-white"
             >
               <Fingerprint size={40} />
             </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-bold text-5xl md:text-7xl text-slate-900 dark:text-white leading-[1.1] mb-8"
            >
              {hero.title_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">{hero.title_highlight}</span> {hero.title_2}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-600 dark:text-slate-300 text-xl md:text-2xl leading-relaxed mb-10 font-light"
            >
              {hero.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/contact" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center">
                {hero.btn_primary}
              </Link>
              <a href="#simulator" className="px-8 py-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {hero.btn_secondary}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200 dark:bg-purple-900/30 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-200 dark:bg-pink-900/30 rounded-full blur-[100px]"></div>
        </div>
      </section>

      {/* 2. Philosophy - "0.05s rule" */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-6">
                     {philosophy.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                     {philosophy.description}
                  </p>
                  <ul className="space-y-4">
                     {[
                        "Tăng 300% khả năng được ghi nhớ.",
                        "Tạo niềm tin ngay lập tức với đối tác & khách hàng.",
                        "Định giá sản phẩm cao hơn đối thủ.",
                        "Tiết kiệm chi phí marketing dài hạn."
                     ].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                           <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mr-3 mt-0.5"><CheckIcon size={14}/></div>
                           <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-4 translate-y-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-soft">
                           <Target className="text-purple-500 mb-4" size={32} />
                           <h4 className="font-bold text-lg dark:text-white">Nhất quán</h4>
                           <p className="text-sm text-slate-500">Đồng bộ trên mọi điểm chạm.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-soft">
                           <Eye className="text-pink-500 mb-4" size={32} />
                           <h4 className="font-bold text-lg dark:text-white">Khác biệt</h4>
                           <p className="text-sm text-slate-500">Nổi bật giữa đám đông.</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-soft">
                           <Sparkles className="text-yellow-500 mb-4" size={32} />
                           <h4 className="font-bold text-lg dark:text-white">Cảm xúc</h4>
                           <p className="text-sm text-slate-500">Chạm đến trái tim khách hàng.</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl shadow-soft text-white">
                           <h4 className="font-bold text-4xl mb-2">TOP 1</h4>
                           <p className="text-sm opacity-90">Mục tiêu định vị thương hiệu của bạn.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Detailed Services Grid */}
      <section id="services" className="py-24 bg-white dark:bg-slate-950">
         <div className="container mx-auto px-4">
            <SectionHeader 
               subtitle={servicesList.subtitle}
               title={servicesList.title}
               description={servicesList.description}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* 1. Logo */}
               <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <PenTool size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Thiết kế Logo</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                     Biểu tượng tinh gọn, dễ nhớ và chứa đựng câu chuyện thương hiệu. Bao gồm Logo chính, Logo phụ, Icon và các biến thể màu sắc.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li className="flex gap-2"><span className="text-purple-500">•</span> Phác thảo ý tưởng (Sketch)</li>
                     <li className="flex gap-2"><span className="text-purple-500">•</span> Quy chuẩn tỷ lệ vàng</li>
                     <li className="flex gap-2"><span className="text-purple-500">•</span> File Vector gốc (AI, EPS, SVG)</li>
                  </ul>
               </div>

               {/* 2. Brand Identity */}
               <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/20 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Palette size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Bộ nhận diện Văn phòng</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                     Đồng bộ hóa hình ảnh chuyên nghiệp trong mọi giao dịch. Tạo ấn tượng tin cậy với đối tác ngay từ danh thiếp.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li className="flex gap-2"><span className="text-pink-500">•</span> Danh thiếp (Namecard)</li>
                     <li className="flex gap-2"><span className="text-pink-500">•</span> Phong bì thư, Tiêu đề thư</li>
                     <li className="flex gap-2"><span className="text-pink-500">•</span> Folder kẹp tài liệu, Hóa đơn</li>
                  </ul>
               </div>

               {/* 3. Brand Guideline */}
               <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <BookOpen size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Brand Guideline</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                     Cẩm nang hướng dẫn sử dụng thương hiệu. Đảm bảo tính nhất quán tuyệt đối khi thương hiệu được sử dụng bởi bất kỳ ai.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li className="flex gap-2"><span className="text-blue-500">•</span> Quy định màu sắc (CMYK, RGB, Hex)</li>
                     <li className="flex gap-2"><span className="text-blue-500">•</span> Quy định Typography (Font chữ)</li>
                     <li className="flex gap-2"><span className="text-blue-500">•</span> Quy định vùng an toàn Logo</li>
                  </ul>
               </div>

               {/* 4. Packaging */}
               <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Package size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Bao bì & Nhãn mác</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                     Thiết kế bao bì kích thích thị giác, thúc đẩy quyết định mua hàng ngay tại điểm bán (POS).
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li className="flex gap-2"><span className="text-orange-500">•</span> Hộp sản phẩm, Túi giấy</li>
                     <li className="flex gap-2"><span className="text-orange-500">•</span> Tem nhãn, Tag mác</li>
                     <li className="flex gap-2"><span className="text-orange-500">•</span> Mockup 3D thực tế</li>
                  </ul>
               </div>

                {/* 5. Marketing Materials */}
               <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Layers size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Ấn phẩm Marketing</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                     Bộ công cụ bán hàng (Sales Kit) và tài liệu quảng cáo giúp đội ngũ kinh doanh chốt đơn hiệu quả.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li className="flex gap-2"><span className="text-green-500">•</span> Hồ sơ năng lực (Profile)</li>
                     <li className="flex gap-2"><span className="text-green-500">•</span> Catalogue, Brochure, Leaflet</li>
                     <li className="flex gap-2"><span className="text-green-500">•</span> Standee, Backdrop sự kiện</li>
                  </ul>
               </div>

                {/* 6. Digital Branding */}
               <div className="group bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Monitor size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">Digital Branding</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                     Đồng bộ hình ảnh trên môi trường số. Giúp thương hiệu chuyên nghiệp trên Website và Mạng xã hội.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                     <li className="flex gap-2"><span className="text-teal-500">•</span> Social Media Template</li>
                     <li className="flex gap-2"><span className="text-teal-500">•</span> Banner Website/Ads</li>
                     <li className="flex gap-2"><span className="text-teal-500">•</span> Email Signature</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 3.5. NEW INTERACTIVE SECTION: Brand Vibe Simulator */}
      <section id="simulator" className="py-24 bg-slate-100 dark:bg-slate-900 transition-colors duration-300 overflow-hidden relative">
         <div className="container mx-auto px-4 relative z-10">
            <SectionHeader 
               subtitle={simulator.subtitle}
               title={simulator.title}
               description={simulator.description}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-12">
               
               {/* Controls / Options */}
               <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                     <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <RefreshCw size={20} className="text-slate-400" /> Chọn Vibe của bạn
                     </h3>
                     <div className="space-y-3">
                        {BRAND_VIBES.map((vibe) => (
                           <button
                              key={vibe.id}
                              onClick={() => setActiveVibe(vibe)}
                              className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                                 activeVibe.id === vibe.id 
                                 ? 'bg-slate-900 text-white shadow-lg scale-[1.02]' 
                                 : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                           >
                              <div>
                                 <span className="font-bold block text-sm">{vibe.name}</span>
                                 <span className="text-xs opacity-70 block mt-1">{vibe.tagline}</span>
                              </div>
                              {activeVibe.id === vibe.id && (
                                 <motion.div layoutId="active-indicator" className="w-2 h-2 rounded-full bg-white"></motion.div>
                              )}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                     <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-3">Phân tích</h4>
                     <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {activeVibe.desc}
                     </p>
                  </div>
               </div>

               {/* Visual Preview Area */}
               <div className="lg:col-span-8 perspective-1000">
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={activeVibe.id}
                        initial={{ opacity: 0, rotateY: 10, x: 20 }}
                        animate={{ opacity: 1, rotateY: 0, x: 0 }}
                        exit={{ opacity: 0, rotateY: -10, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className={`w-full aspect-[4/3] md:aspect-[16/9] ${activeVibe.bg} rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 transition-colors duration-500`}
                     >
                        {/* Decorative Background Elements based on Vibe */}
                        {activeVibe.id === 'minimalist' && (
                           <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
                        )}
                        {activeVibe.id === 'luxury' && (
                           <div className="absolute inset-0 border-[20px] border-[#1A1A1A] opacity-100 pointer-events-none"></div>
                        )}
                        {activeVibe.id === 'playful' && (
                           <>
                              <div className="absolute top-10 left-10 w-32 h-32 bg-[#4ECDC4] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
                              <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FFE66D] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                           </>
                        )}
                        {activeVibe.id === 'tech' && (
                           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
                        )}

                        {/* Card Content */}
                        <div className={`relative z-10 text-center max-w-lg`}>
                           <div className={`inline-block mb-6 ${activeVibe.accent} text-white px-3 py-1 text-xs font-bold uppercase tracking-wider ${activeVibe.shape}`}>
                              Brand Identity
                           </div>
                           <h2 className={`${activeVibe.fontTitle} ${activeVibe.text} text-4xl md:text-6xl mb-6 leading-tight`}>
                              Your Brand <br/> Reimagined.
                           </h2>
                           <p className={`${activeVibe.fontBody} ${activeVibe.text} opacity-80 text-lg mb-8`}>
                              Khám phá sức mạnh của thiết kế khi được đặt đúng ngữ cảnh. Phong cách này kể câu chuyện gì về bạn?
                           </p>
                           <button className={`px-8 py-3 font-bold text-sm ${activeVibe.shape} ${activeVibe.button} inline-flex items-center gap-2`}>
                              Bắt đầu ngay <ArrowRight size={16} />
                           </button>
                        </div>

                        {/* Floating Palette */}
                        <div className={`absolute bottom-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full flex gap-2 shadow-lg border border-white/20`}>
                           {activeVibe.colors.map((color, i) => (
                              <div key={i} className={`w-6 h-6 rounded-full ${color} shadow-sm border border-black/5`}></div>
                           ))}
                        </div>

                     </motion.div>
                  </AnimatePresence>
               </div>

            </div>
         </div>
      </section>

      {/* 4. Process - How we work */}
      <section className="py-24 bg-slate-900 text-white">
         <div className="container mx-auto px-4">
            <SectionHeader 
               subtitle={process.subtitle}
               title={process.title}
               description={process.description}
               lightText={true}
            />

            <div className="relative mt-16">
               {/* Connecting Line (Desktop) */}
               <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                  {[
                     { step: "01", title: "Nghiên cứu", desc: "Phân tích thị trường, đối thủ và chân dung khách hàng." },
                     { step: "02", title: "Chiến lược", desc: "Xác định tính cách, định vị và thông điệp cốt lõi." },
                     { step: "03", title: "Phác thảo", desc: "Brainstorming và vẽ phác thảo các ý tưởng Logo." },
                     { step: "04", title: "Thiết kế", desc: "Số hóa ý tưởng, phối màu và hoàn thiện chi tiết." },
                     { step: "05", title: "Bàn giao", desc: "Đóng gói file gốc, cẩm nang hướng dẫn sử dụng." }
                  ].map((item, idx) => (
                     <div key={idx} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-colors group">
                        <div className="text-4xl font-black text-slate-700 group-hover:text-purple-500 mb-4 transition-colors">{item.step}</div>
                        <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 5. CTA */}
      <section className="py-24 bg-white dark:bg-slate-950">
         <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
               <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white mb-6">
                  {cta.title} <span className="text-purple-600">{cta.title_highlight}</span>?
               </h2>
               <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
                  {cta.description}
               </p>
               <Link to="/contact" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all">
                  {cta.btn_text} <ArrowRight className="ml-2" />
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
};

// Helper CheckIcon
const CheckIcon = ({ size }: { size: number }) => (
   <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
   >
      <polyline points="20 6 9 17 4 12"></polyline>
   </svg>
);

export default Branding;
