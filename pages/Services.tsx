
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, PenTool, BarChart3, Settings, ArrowRight, Mail, 
  Layout, Monitor, Smartphone, Globe, Layers, Zap, 
  Search, Database, ShoppingBag, CheckCircle2, TrendingUp,
  Cpu, Command, Share2, MousePointer2, Terminal, Megaphone, Target, Palette, Grid, Sparkles, CreditCard, Activity, Lock,
  FileText, Video, Cloud, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageRoutes } from '../types';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';

// Helper Component for Typing Effect
const TypingTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    // Rút gọn nội dung để không bị tràn layout
    const sequence = [
      { text: "> init system...", delay: 500 },
      { text: "✔ core_modules [OK]", delay: 1500 },
      { text: "✔ security_patch [OK]", delay: 2500 },
      { text: "> deploy prod", delay: 3500 },
      { text: "🚀 LIVE (12ms)", delay: 5000, color: "text-green-400 font-bold" },
    ];

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const runSequence = () => {
      setLines([]);
      sequence.forEach(({ text, delay, color }, index) => {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, color ? `<span class="${color}">${text}</span>` : text]);
        }, delay);
        timeouts.push(timeout);
      });
    };

    runSequence();
    const interval = setInterval(runSequence, 7000); // Loop nhanh hơn

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="font-mono text-xs space-y-3 leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
      ))}
      <div className="animate-pulse w-2 h-4 bg-green-500 inline-block align-middle"></div>
    </div>
  );
};

const Services: React.FC = () => {
  // Fetch dynamic content
  const { getSection } = usePageContent('services');
  const hero = getSection('hero', DEFAULT_CONTENT.services.hero);
  const cta = getSection('cta', DEFAULT_CONTENT.services.cta);

  return (
    <div className="flex flex-col w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* 1. Header Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-white dark:bg-slate-900 rounded-b-[3rem] shadow-sm z-10">
         <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-b-[3rem]">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
         </div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block py-1 px-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-accent uppercase tracking-widest mb-4 shadow-sm"
            >
              {hero.badge}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-5xl md:text-7xl text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              {hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{hero.title_highlight}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              {hero.description}
            </motion.p>
         </div>
      </section>

      {/* 2. Bento Grid Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* BLOCK 1: WEB DESIGN */}
              <div className="lg:col-span-2 group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
                 {/* Vibrant Background Glow */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                 
                 <div className="relative z-10 p-8 md:p-12 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-10">
                       <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                             <Sparkles size={12} /> Best Seller
                          </div>
                          <h3 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-3">Thiết kế & Phát triển Website</h3>
                          <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg">Đỉnh cao trải nghiệm số. Tốc độ, thẩm mỹ và hiệu quả chuyển đổi được tối ưu hóa tuyệt đối.</p>
                          
                          {/* Mobile Link */}
                          <Link to={PageRoutes.WEBSITE_DESIGN} className="md:hidden inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 mt-4">
                             Xem chi tiết <ArrowRight size={16} />
                          </Link>
                       </div>
                       <Link to={PageRoutes.WEBSITE_DESIGN} className="hidden md:flex w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 border border-slate-200 dark:border-white/10 items-center justify-center text-slate-500 dark:text-white transition-all">
                          <ArrowRight size={20} />
                       </Link>
                    </div>

                    {/* Interactive Graphic: The "Command Center" Look */}
                    <div className="mt-auto relative h-[350px] w-full flex items-end justify-center perspective-1000">
                       
                       {/* Main Browser Window (Floating & Tilted) */}
                       <motion.div 
                          className="relative z-20 w-[85%] h-[280px] bg-slate-50 dark:bg-[#0f172a] rounded-t-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden origin-bottom"
                          whileHover={{ scale: 1.02, y: -10 }}
                          transition={{ duration: 0.4 }}
                       >
                          {/* Browser Header */}
                          <div className="h-9 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                             <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                             </div>
                             <div className="flex-1 flex justify-center">
                                <div className="w-40 h-5 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                   <Lock size={8} /> grifow.com
                                </div>
                             </div>
                          </div>

                          {/* Website Content (Mockup) */}
                          <div className="p-6 relative overflow-hidden h-full">
                             {/* Hero Section of Mockup */}
                             <div className="flex justify-between items-center mb-8">
                                <div className="space-y-3">
                                   <div className="h-2 w-12 bg-blue-500 rounded-full"></div>
                                   <div className="h-6 w-48 bg-slate-200 dark:bg-white rounded-lg"></div>
                                   <div className="h-6 w-32 bg-slate-200 dark:bg-white rounded-lg"></div>
                                   <div className="h-3 w-40 bg-slate-200 dark:bg-slate-600 rounded mt-2"></div>
                                </div>
                                {/* Hero Image Mockup */}
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 blur-xl opacity-50 absolute right-10 top-10"></div>
                                <div className="w-32 h-20 bg-white/50 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-600 rounded-xl relative z-10 flex items-center justify-center shadow-sm">
                                   <Activity className="text-blue-500 dark:text-blue-400" />
                                </div>
                             </div>

                             {/* Floating Cards inside Mockup */}
                             <div className="grid grid-cols-3 gap-3">
                                <div className="h-24 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                                   <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center mb-2"><Zap size={14} /></div>
                                   <div className="h-2 w-12 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                </div>
                                <div className="h-24 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                                   <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 flex items-center justify-center mb-2"><CreditCard size={14} /></div>
                                   <div className="h-2 w-12 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                </div>
                                <div className="h-24 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm">
                                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 flex items-center justify-center mb-2"><Globe size={14} /></div>
                                   <div className="h-2 w-12 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                </div>
                             </div>
                          </div>
                       </motion.div>

                       {/* Floating Element 1: SEO Badge */}
                       <motion.div 
                          className="absolute top-[20%] left-[5%] z-30 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700"
                          animate={{ y: [0, -15, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       >
                          <div className="relative w-8 h-8 flex items-center justify-center">
                             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className="text-green-500" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                             </svg>
                             <span className="absolute text-[10px] font-black">100</span>
                          </div>
                          <div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase">SEO Score</div>
                             <div className="text-xs font-bold">Perfect</div>
                          </div>
                       </motion.div>

                       {/* Floating Element 2: Code Snippet */}
                       <motion.div 
                          className="absolute bottom-[20%] right-[5%] z-30 bg-slate-900 dark:bg-black/90 backdrop-blur text-white p-3 rounded-xl shadow-2xl border border-slate-700 font-mono text-[10px]"
                          animate={{ y: [0, 15, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                       >
                          <div className="text-purple-400">const <span className="text-blue-400">Growth</span> = () ={'>'}</div>
                          <div className="pl-2 text-green-400">return <span className="text-yellow-300">"Success"</span>;</div>
                       </motion.div>

                    </div>
                 </div>
              </div>

              {/* BLOCK 2: BRANDING */}
              <div className="lg:col-span-1 group relative bg-slate-900 text-white rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-800">
                 {/* Animated Background */}
                 <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/30 rounded-full blur-[60px] group-hover:bg-purple-600/50 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                    {/* Golden Ratio Grid Overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 </div>

                 <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className="mb-6">
                       <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
                          <Palette size={24} className="text-purple-400" />
                       </div>
                       <h3 className="font-display font-bold text-2xl mb-2">Branding</h3>
                       <p className="text-slate-400 text-sm">Thổi hồn vào thương hiệu với bộ nhận diện nhất quán và cảm xúc.</p>
                    </div>

                    {/* Brand Composition */}
                    <div className="flex-1 relative min-h-[250px] w-full flex items-center justify-center">
                        
                        {/* 1. Guideline Book (Center) */}
                        <motion.div 
                           className="relative z-20 w-32 h-44 bg-[#1a1a1a] border border-[#333] rounded-r-lg rounded-l-sm shadow-2xl flex flex-col items-center justify-center group-hover:rotate-0 rotate-[-5deg] transition-transform duration-500 origin-bottom-left"
                        >
                           <div className="absolute top-0 left-0 w-3 h-full bg-[#000] rounded-l-sm"></div>
                           <div className="ml-3 flex flex-col items-center">
                              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-4 relative">
                                 <div className="absolute inset-0 border border-white/10 rounded-full scale-150"></div>
                                 <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full"></div>
                              </div>
                              <div className="text-[8px] font-bold tracking-[0.3em] text-white/50 uppercase mt-2">Guideline</div>
                           </div>
                        </motion.div>

                        {/* 2. Modern Pantone Card (Right) */}
                        <motion.div 
                           animate={{ y: [0, -10, 0], rotate: [5, 10, 5] }}
                           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                           className="absolute top-10 right-4 z-30 w-24 bg-white text-black p-2 pb-6 rounded-lg shadow-lg transform rotate-6"
                        >
                           <div className="h-20 w-full bg-gradient-to-b from-[#FF9A9E] to-[#FECFEF] rounded-md mb-2"></div>
                           <div className="space-y-1">
                              <div className="h-1 w-10 bg-slate-200 rounded"></div>
                              <div className="h-1 w-6 bg-slate-200 rounded"></div>
                           </div>
                           <div className="absolute bottom-2 right-2 text-[6px] font-mono opacity-50">PANTONE</div>
                        </motion.div>

                        {/* 3. Typography Card (Left) */}
                        <motion.div 
                           animate={{ y: [0, 10, 0], rotate: [-5, -10, -5] }}
                           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                           className="absolute bottom-10 left-4 z-10 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center transform -rotate-6"
                        >
                           <span className="font-serif font-black text-5xl text-white opacity-80">Aa</span>
                        </motion.div>

                    </div>
                    
                    <Link to={PageRoutes.BRANDING} className="mt-4 flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                       <span className="font-bold text-sm">Tư vấn nhận diện</span>
                       <ArrowRight size={16} />
                    </Link>
                 </div>
              </div>

              {/* BLOCK 3: MARKETING */}
              <div className="lg:col-span-1 group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                 
                 <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center">
                           <Megaphone size={24} />
                        </div>
                        <div className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase rounded-md border border-green-100 dark:border-green-800">
                           ROI Focus
                        </div>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2">Digital Marketing</h3>
                    <p className="text-slate-500 text-sm mb-4">Chiến lược đa kênh (Ads, SEO, Social) biến traffic thành doanh thu thực tế.</p>
                    
                    <Link to={PageRoutes.DIGITAL_MARKETING} className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-500 transition-colors mb-6">
                        Chiến lược Marketing <ArrowRight size={16} />
                    </Link>

                    {/* Animated Multi-channel Visual */}
                    <div className="mt-auto relative h-40 flex items-center justify-center">
                        <div className="absolute bottom-0 w-full h-24 flex items-end justify-between px-4 z-10">
                           <motion.div initial={{ height: '20%' }} whileInView={{ height: '40%' }} transition={{ duration: 1 }} className="w-1/5 bg-slate-100 dark:bg-slate-800 rounded-t-sm"></motion.div>
                           <motion.div initial={{ height: '30%' }} whileInView={{ height: '60%' }} transition={{ duration: 1, delay: 0.2 }} className="w-1/5 bg-slate-200 dark:bg-slate-700 rounded-t-sm"></motion.div>
                           <motion.div initial={{ height: '40%' }} whileInView={{ height: '80%' }} transition={{ duration: 1, delay: 0.4 }} className="w-1/5 bg-green-200 dark:bg-green-900/40 rounded-t-sm"></motion.div>
                           <motion.div initial={{ height: '50%' }} whileInView={{ height: '100%' }} transition={{ duration: 1, delay: 0.6 }} className="w-1/5 bg-green-500 rounded-t-sm shadow-[0_0_15px_rgba(34,197,94,0.5)]"></motion.div>
                        </div>

                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-4 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 z-20">
                           <Search size={16} className="text-blue-500" />
                        </motion.div>
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-4 right-8 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 z-20">
                           <Share2 size={16} className="text-purple-500" />
                        </motion.div>
                    </div>
                 </div>
              </div>

              {/* BLOCK 4: EMAIL/WORKSPACE */}
              <div className="lg:col-span-1 group relative bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all">
                 {/* Background Noise/Texture */}
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                 <div className="relative z-10 p-8 h-full flex flex-col items-center text-center">
                    <div className="relative mb-8 mt-6">
                       {/* Center Icon */}
                       <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] z-20 relative border border-white/20">
                          <Mail size={40} className="text-white drop-shadow-md" />
                       </div>

                       {/* Orbit Rings */}
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full"></div>
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full"></div>

                       {/* FLOATING ELEMENTS */}
                       <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 z-10"
                       >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg font-black text-sm">G</div>
                       </motion.div>

                       <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                          className="absolute -top-4 -left-12 bg-white/10 backdrop-blur p-2 rounded-lg border border-white/10"
                       >
                          <FileText size={18} className="text-blue-200" />
                       </motion.div>

                       <motion.div
                          animate={{ y: [0, 10, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                          className="absolute -top-8 -right-10 bg-white/10 backdrop-blur p-2 rounded-lg border border-white/10"
                       >
                          <Video size={18} className="text-blue-200" />
                       </motion.div>

                       <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                          className="absolute bottom-0 -left-14 bg-white/10 backdrop-blur p-2 rounded-lg border border-white/10"
                       >
                          <Cloud size={18} className="text-blue-200" />
                       </motion.div>

                       <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                          className="absolute -bottom-4 -right-8 bg-white/10 backdrop-blur p-2 rounded-lg border border-white/10"
                       >
                          <Calendar size={18} className="text-blue-200" />
                       </motion.div>

                    </div>

                    <h3 className="font-display font-bold text-2xl mb-2 relative z-10">Google Workspace</h3>
                    <p className="text-indigo-100 text-sm mb-6 relative z-10">Email tên miền riêng & bộ công cụ làm việc số 1 thế giới.</p>

                    <Link to={PageRoutes.EMAIL_SERVICE} className="mt-auto px-6 py-2 bg-white text-indigo-700 font-bold rounded-full text-sm hover:bg-indigo-50 transition-colors relative z-10">
                       Bảng giá
                    </Link>
                 </div>
              </div>

              {/* BLOCK 5: TECH/SOLUTIONS */}
              <Link to={PageRoutes.TECH_SOLUTIONS} className="lg:col-span-1 group relative bg-slate-950 text-green-400 rounded-[2.5rem] border border-slate-800 overflow-hidden hover:border-green-500/50 transition-colors flex flex-col cursor-pointer">
                 <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center gap-2 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-auto text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Terminal size={10} /> bash
                    </div>
                 </div>

                 <div className="p-6 flex flex-col h-full">
                    <div className="flex-1 opacity-90 h-[140px] overflow-hidden">
                        <TypingTerminal />
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-800 group-hover:border-green-900 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                           <Settings size={20} className="text-green-400 group-hover:rotate-90 transition-transform duration-700" />
                           <h3 className="font-bold text-xl text-white">Giải pháp Công nghệ</h3>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed group-hover:text-green-200 transition-colors">
                           Phát triển Web App, Plugin & Automation giúp tự động hóa quy trình doanh nghiệp.
                        </p>
                    </div>
                 </div>
              </Link>

           </div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
         <div className="container mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 dark:text-white mb-8">
               {cta.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10 text-lg">
               {cta.description}
            </p>
            <Link to={PageRoutes.CONTACT} className="inline-flex items-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
               {cta.btn_text} <ArrowRight className="ml-2" size={18} />
            </Link>
         </div>
      </section>

    </div>
  );
};

export default Services;
