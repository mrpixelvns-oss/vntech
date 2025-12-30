
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Layers, Zap, PenTool, Layout, Box, Globe, Shield, Smartphone, ArrowUpRight, Calendar, User,
  Search, TrendingUp, Heart, MessageSquare, BarChart, CheckCircle2, Code, Palette, MoveRight, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabaseClient';
import { BlogPost, PageRoutes } from '../types';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';

const Home: React.FC = () => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  
  // Fetch dynamic content
  const { getSection } = usePageContent('home');

  // Use centralized defaults
  const heroContent = getSection('hero', DEFAULT_CONTENT.home.hero);
  const servicesContent = getSection('services', DEFAULT_CONTENT.home.services);
  const aboutContent = getSection('about', DEFAULT_CONTENT.home.about);
  const ctaContent = getSection('cta', DEFAULT_CONTENT.home.cta);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) {
        setLatestPosts(data);
      }
    };

    fetchLatestPosts();
  }, []);

  // Animation variants for floating elements
  const floatingVariant = (delay: number) => ({
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: delay,
      },
    },
  });

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section - Animated Ecosystem */}
      <section className="relative min-h-[90vh] flex items-center bg-white dark:bg-slate-950 pt-20 lg:pt-0 transition-colors duration-300 overflow-hidden">
        {/* Background Gradients & Animated Blobs */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 dark:bg-slate-900 -z-10 rounded-bl-[100px] hidden lg:block transition-colors duration-300"></div>
        
        {/* Animated Blob 1 (Top Left) */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0], 
                y: [0, 30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70"
        />

        {/* Animated Blob 2 (Bottom Right) */}
        <motion.div 
            animate={{ 
                scale: [1, 1.5, 1],
                x: [0, -30, 0], 
                y: [0, -50, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-60"
        />

        {/* Animated Blob 3 (Center Right) */}
        <motion.div 
             animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -40, 0], 
                y: [0, 40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute top-1/3 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-50 hidden lg:block"
        />
        
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accentLight dark:bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6 border border-accent/20">
              <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span>
              {heroContent.badge}
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-7xl text-dark dark:text-white leading-[1.1] mb-8">
              {heroContent.title_1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">{heroContent.title_highlight}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              {heroContent.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/contact" className="px-8 py-4 bg-dark dark:bg-white text-white dark:text-dark rounded-full font-bold hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all shadow-lg hover:shadow-accent/30 flex items-center justify-center transform hover:-translate-y-1">
                {heroContent.btn_primary}
              </Link>
              <Link to="/services" className="px-8 py-4 bg-white dark:bg-transparent border border-slate-200 dark:border-slate-700 text-dark dark:text-white rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                {heroContent.btn_secondary} <ArrowUpRight size={18} className="ml-2"/>
              </Link>
            </div>
          </motion.div>

          {/* Animated Illustration - KEEPING THIS AS IS (Visuals) */}
          <div className="relative h-[500px] w-full flex items-center justify-center perspective-1000">
             
             {/* 1. Main Website Interface (Center) */}
             <motion.div
               initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
               animate={{ opacity: 1, scale: 1, rotateX: 0 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="relative z-20 w-[90%] max-w-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
             >
                {/* Browser Header */}
                <div className="bg-slate-100 dark:bg-slate-800 p-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                   </div>
                   <div className="flex-1 mx-4 bg-white dark:bg-slate-900 rounded-md h-5"></div>
                </div>
                {/* Browser Content */}
                <div className="p-4 space-y-4">
                   <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent to-blue-500 animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                         <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                         <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
                      <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
                      <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-lg"></div>
                   </div>
                   <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-accent/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 h-2 w-24 bg-accent/40 rounded"></div>
                   </div>
                </div>
             </motion.div>

             {/* 2. Google Search Element (Top Left) */}
             <motion.div
                variants={floatingVariant(0)}
                animate="animate"
                className="absolute top-[10%] -left-[5%] md:left-0 z-30 bg-white dark:bg-slate-800 p-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 flex items-center gap-3 pr-6"
             >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                   <Search size={16} />
                </div>
                <div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase">Tìm kiếm Google</div>
                   <div className="text-xs font-bold text-slate-800 dark:text-white">"Best Agency Vietnam"</div>
                </div>
             </motion.div>

             {/* 3. Social Media Ad (Top Right) */}
             <motion.div
                variants={floatingVariant(1.5)}
                animate="animate"
                className="absolute top-[15%] -right-[5%] md:right-0 z-40 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 w-40"
             >
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white">
                      <Layout size={12} />
                   </div>
                   <span className="text-[10px] text-slate-500 font-bold">Quảng cáo Instagram</span>
                </div>
                <div className="h-20 bg-slate-100 dark:bg-slate-900 rounded-lg mb-2 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Ad" />
                   <div className="absolute bottom-1 right-1 bg-white/90 p-1 rounded-full text-red-500">
                      <Heart size={10} fill="currentColor" />
                   </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                   <span className="text-slate-800 dark:text-white">24.5k Likes</span>
                   <span className="text-accent">Thành công</span>
                </div>
             </motion.div>

             {/* 4. Business Growth Chart (Bottom Right) */}
             <motion.div
                variants={floatingVariant(2.5)}
                animate="animate"
                className="absolute bottom-[10%] -right-[5%] md:right-4 z-30 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700"
             >
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                      <TrendingUp size={18} />
                   </div>
                   <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Tổng doanh thu</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white">+128%</div>
                   </div>
                </div>
                <div className="flex items-end gap-1 h-12 w-32">
                   {[40, 60, 45, 70, 65, 85, 95].map((h, i) => (
                      <div key={i} style={{height: `${h}%`}} className="flex-1 bg-green-500 rounded-t-sm opacity-80"></div>
                   ))}
                </div>
             </motion.div>

             {/* 5. Code/Tech Element (Bottom Left) */}
             <motion.div
                variants={floatingVariant(3.5)}
                animate="animate"
                className="absolute bottom-[15%] -left-[5%] md:left-4 z-10 bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700 font-mono text-xs hidden sm:block"
             >
                <div className="text-green-400 mb-1">✓ Triển khai thành công</div>
                <div className="flex gap-2 opacity-60">
                   <span>Next.js</span>
                   <span>React</span>
                   <span>Vercel</span>
                </div>
             </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Marquee / Clients */}
      <div className="border-y border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 py-8 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest">Vận hành bởi công nghệ hiện đại</p>
          <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-50 grayscale transition-all duration-500 hover:grayscale-0 dark:text-white">
             <span className="font-bold text-xl flex items-center gap-2"><Zap size={20}/> Next.js</span>
             <span className="font-bold text-xl flex items-center gap-2"><Layout size={20}/> React</span>
             <span className="font-bold text-xl flex items-center gap-2"><Layers size={20}/> WordPress</span>
             <span className="font-bold text-xl flex items-center gap-2"><Globe size={20}/> Vercel</span>
             <span className="font-bold text-xl flex items-center gap-2"><Box size={20}/> Tailwind</span>
             <span className="font-bold text-xl flex items-center gap-2"><Shield size={20}/> Cloudflare</span>
          </div>
        </div>
      </div>

      {/* 3. Services - Bento Grid Style */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <SectionHeader 
            subtitle={servicesContent.subtitle}
            title={servicesContent.title}
            description={servicesContent.description}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Main Service (Large) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-secondary dark:bg-slate-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group border border-transparent dark:border-slate-700"
            >
              {/* Using a grid to separate text content from the background image area to prevent overlap */}
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center h-full">
                <div>
                  <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center text-accent mb-6">
                    <Layout size={32} />
                  </div>
                  <h3 className="font-display font-bold text-3xl mb-4 text-dark dark:text-white">Thiết kế & Phát triển Website</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">Thiết kế giao diện độc quyền (UI/UX), code chuẩn SEO, tốc độ tải trang nhanh. Tối ưu trải nghiệm người dùng.</p>
                  <Link to={PageRoutes.WEBSITE_DESIGN} className="inline-flex items-center font-bold text-dark dark:text-white border-b-2 border-accent pb-1 hover:text-accent transition-colors">
                    Xem chi tiết <ArrowRight size={16} className="ml-2"/>
                  </Link>
                </div>
                {/* Right side is reserved for the image */}
              </div>
              <img 
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800" 
                className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity rounded-tl-[100px] pointer-events-none" 
                alt="Web Dev"
              />
            </motion.div>

            {/* Card 2: Branding */}
            <Link to={PageRoutes.BRANDING} className="block">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-dark dark:bg-slate-950 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden border border-transparent dark:border-slate-800 h-full flex flex-col justify-center cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-accent mb-6 backdrop-blur-md">
                  <PenTool size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">Branding</h3>
                <p className="text-slate-300 text-sm mb-6">Nhận diện thương hiệu nhất quán, chuyên nghiệp từ Logo đến ấn phẩm.</p>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full blur-3xl opacity-20"></div>
              </motion.div>
            </Link>

            {/* Card 3: Marketing */}
            <Link to={PageRoutes.DIGITAL_MARKETING} className="block">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft dark:shadow-none rounded-[2rem] p-8 md:p-10 h-full flex flex-col justify-center cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-500 dark:text-blue-400 mb-6">
                  <Smartphone size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-2 text-dark dark:text-white">Digital Marketing</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Quảng cáo đa kênh (FB, Google) & SEO tổng thể mang lại doanh thu.</p>
              </motion.div>
            </Link>

            {/* Card 4: Tech Solutions */}
            <Link to={PageRoutes.TECH_SOLUTIONS} className="md:col-span-2 block">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-accent to-teal-500 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between cursor-pointer"
              >
                <div className="relative z-10 max-w-lg">
                  <h3 className="font-display font-bold text-3xl mb-4">Giải pháp công nghệ</h3>
                  <p className="text-teal-50 text-lg mb-6">Phát triển Web App, Plugin và các công cụ tự động hóa doanh nghiệp.</p>
                  <span className="px-6 py-3 bg-white text-teal-600 rounded-lg font-bold shadow-lg hover:bg-slate-50 transition-colors inline-block">
                    Tư vấn giải pháp
                  </span>
                </div>
                <Layers size={150} className="text-white opacity-20 absolute -right-10 top-1/2 -translate-y-1/2" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. About - Redesigned Artistic Layout */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Column: Typography & Story */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-6">
                 <span className="w-12 h-[2px] bg-accent"></span>
                 <span className="text-accent font-bold uppercase tracking-[0.2em] text-xs">{aboutContent.subtitle}</span>
              </div>
              
              <h2 className="font-display font-bold text-4xl md:text-6xl text-dark dark:text-white leading-tight mb-8">
                {aboutContent.title_1} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">{aboutContent.title_highlight}</span>
              </h2>

              <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400 mb-10">
                 <p className="leading-relaxed">
                   {aboutContent.desc_1}
                 </p>
                 <p className="leading-relaxed">
                   {aboutContent.desc_2}
                 </p>
              </div>

              {/* Signature Block */}
              <div className="flex items-center gap-6 mt-10 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-800 w-fit">
                  <div className="text-center px-4 border-r border-slate-200 dark:border-slate-700">
                     <span className="block text-3xl font-black text-dark dark:text-white">{aboutContent.stat_1_val}</span>
                     <span className="text-xs text-slate-500 uppercase tracking-wider">Dự án</span>
                  </div>
                  <div className="text-center px-4">
                     <span className="block text-3xl font-black text-accent">{aboutContent.stat_2_val}</span>
                     <span className="text-xs text-slate-500 uppercase tracking-wider">Hài lòng</span>
                  </div>
              </div>

              <div className="mt-10">
                 <Link to="/about" className="group inline-flex items-center font-bold text-dark dark:text-white text-lg hover:text-accent transition-colors">
                    Tìm hiểu văn hóa Grifow <MoveRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
            </motion.div>

            {/* Right Column: Layered Artistic Composition (NOW WITH INTERACTIVE CARDS) */}
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative h-[600px] flex items-center justify-center lg:justify-end"
            >
               {/* Layer 1: Base Stage */}
               <div className="relative z-10 w-[80%] max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group bg-slate-900 flex items-center justify-center">
                  {/* Animated Gradient Background */}
                  <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-10"
                  />
                  
                  {/* Aurora Blurs */}
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[80px] mix-blend-screen animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/30 rounded-full blur-[80px] mix-blend-screen"></div>

                  {/* Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                  {/* INTERACTIVE CARDS */}
                  <div 
                    className="relative flex justify-center items-center group/cards"
                    onMouseEnter={() => setIsCardHovered(true)}
                    onMouseLeave={() => setIsCardHovered(false)}
                  >
                      {/* Card 1: Design (Github Equivalent) */}
                      <div 
                         className="relative w-40 h-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex flex-col justify-center items-center transition-all duration-500 ease-out"
                         style={{ 
                            transform: isCardHovered ? 'rotate(0deg)' : 'rotate(-15deg)',
                            marginLeft: isCardHovered ? '10px' : '-35px',
                            marginRight: isCardHovered ? '10px' : '-35px',
                            zIndex: 1
                         }}
                      >
                         <div className="text-white text-5xl mb-4"><Palette size={48} strokeWidth={1.5} /></div>
                         <div className="absolute bottom-0 w-full h-10 bg-white/5 flex items-center justify-center text-white font-bold tracking-wider text-sm uppercase">Design</div>
                      </div>

                      {/* Card 2: Code (Code Equivalent) */}
                      <div 
                         className="relative w-40 h-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex flex-col justify-center items-center transition-all duration-500 ease-out"
                         style={{ 
                            transform: isCardHovered ? 'rotate(0deg)' : 'rotate(5deg)',
                            marginLeft: isCardHovered ? '10px' : '-35px',
                            marginRight: isCardHovered ? '10px' : '-35px',
                            zIndex: 2
                         }}
                      >
                         <div className="text-white text-5xl mb-4"><Code size={48} strokeWidth={1.5} /></div>
                         <div className="absolute bottom-0 w-full h-10 bg-white/5 flex items-center justify-center text-white font-bold tracking-wider text-sm uppercase">Code</div>
                      </div>

                      {/* Card 3: Growth (Earn Equivalent) */}
                      <div 
                         className="relative w-40 h-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex flex-col justify-center items-center transition-all duration-500 ease-out"
                         style={{ 
                            transform: isCardHovered ? 'rotate(0deg)' : 'rotate(25deg)',
                            marginLeft: isCardHovered ? '10px' : '-35px',
                            marginRight: isCardHovered ? '10px' : '-35px',
                            zIndex: 3
                         }}
                      >
                         <div className="text-white text-5xl mb-4"><TrendingUp size={48} strokeWidth={1.5} /></div>
                         <div className="absolute bottom-0 w-full h-10 bg-white/5 flex items-center justify-center text-white font-bold tracking-wider text-sm uppercase">Growth</div>
                      </div>
                  </div>
               </div>

               {/* Layer 2: Code Snippet (Tech) - Floating */}
               <motion.div 
                  variants={floatingVariant(0)}
                  animate="animate"
                  className="absolute top-10 left-0 lg:-left-10 z-20 bg-slate-900 text-white p-5 rounded-xl shadow-2xl border border-slate-700 font-mono text-xs w-64 rotate-[-6deg]"
               >
                  <div className="flex gap-1.5 mb-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-green-400">const <span className="text-yellow-300">Success</span> = () ={'>'} {'{'}</div>
                  <div className="pl-4 text-purple-300">return <span className="text-blue-300">Grifow.build</span>({'{'}</div>
                  <div className="pl-8 text-slate-300">design: <span className="text-orange-300">'Premium'</span>,</div>
                  <div className="pl-8 text-slate-300">performance: <span className="text-orange-300">100</span></div>
                  <div className="pl-4 text-purple-300">{'}'});</div>
                  <div className="text-green-400">{'}'};</div>
               </motion.div>

               {/* Layer 3: Palette (Design) - Floating */}
               <motion.div 
                  variants={floatingVariant(1.5)}
                  animate="animate"
                  className="absolute bottom-20 -right-4 lg:right-10 z-30 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 w-48 rotate-6"
               >
                  <div className="flex items-center gap-2 mb-3">
                     <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><Palette size={14} /></div>
                     <span className="font-bold text-xs text-dark dark:text-white">Color System</span>
                  </div>
                  <div className="flex gap-2 h-12">
                     <div className="flex-1 bg-accent rounded-lg shadow-sm"></div>
                     <div className="flex-1 bg-dark rounded-lg shadow-sm"></div>
                     <div className="flex-1 bg-purple-500 rounded-lg shadow-sm"></div>
                  </div>
               </motion.div>

               {/* Layer 4: Badge - Floating */}
               <motion.div 
                   variants={floatingVariant(2.5)}
                   animate="animate"
                   className="absolute top-1/2 -right-8 lg:-right-16 z-40 bg-white dark:bg-slate-800 p-4 rounded-full shadow-2xl border border-slate-100 dark:border-slate-700"
               >
                   <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin flex items-center justify-center">
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} className="text-accent fill-current" />
                   </div>
               </motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Latest Insights (Blog) */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
               <SectionHeader 
                  subtitle="Tin tức mới nhất" 
                  title="Kiến thức & Xu hướng" 
                  description="Cập nhật kiến thức mới nhất về Website, Branding và Marketing."
                  align="left"
               />
               <Link to="/blog" className="hidden md:flex items-center font-bold text-slate-900 dark:text-white hover:text-accent transition-colors mb-8">
                  Xem tất cả <ArrowRight className="ml-2" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {latestPosts.map((post) => (
                  <motion.div 
                     key={post.id}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.5 }}
                     className="group cursor-pointer"
                  >
                     <Link to={`/blog/${post.id}`} className="rounded-2xl overflow-hidden mb-6 h-64 relative block">
                        <img 
                          src={post.image || "https://images.unsplash.com/photo-1499750310159-52f0f83ad713?auto=format&fit=crop&q=80&w=600"} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded uppercase tracking-wider text-slate-900">
                           {post.category}
                        </div>
                     </Link>
                     <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                     </div>
                     <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                     </h3>
                     <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold text-slate-400 group-hover:text-accent transition-colors mt-2">
                        Xem thêm <ArrowRight size={14} className="ml-1" />
                     </Link>
                  </motion.div>
               ))}
               {latestPosts.length === 0 && (
                 <div className="col-span-3 text-center text-slate-500 py-10">
                   Chưa có bài viết nào.
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* 6. CTA - Light Mode Grid Background Effect */}
      <section className="relative py-40 w-full overflow-hidden bg-white dark:bg-slate-950 flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-800">
         {/* 1. Grid Background (Pure CSS) */}
         <div className="absolute inset-0 w-full h-full">
             <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
         </div>
         
         {/* 2. Floating Highlights (Animated Boxes) */}
         <motion.div
           animate={{
             opacity: [0, 0.5, 0],
             scale: [0.8, 1.2, 0.8],
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-1/3 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none"
         />
         <motion.div
           animate={{
             opacity: [0, 0.3, 0],
             scale: [1, 1.5, 1],
           }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
         />

         {/* 3. Content */}
         <div className="relative z-20 container mx-auto px-4 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
             <h2 className="font-display font-bold text-4xl md:text-6xl text-slate-900 dark:text-white mb-6 tracking-tight">
               {ctaContent.title}
             </h2>
             <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
               {ctaContent.description}
             </p>
             <Link to="/contact" className="inline-block px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-2xl hover:shadow-accent/20 hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-all transform hover:-translate-y-1">
               {ctaContent.btn_text}
             </Link>
           </motion.div>
         </div>
      </section>
    </div>
  );
};

export default Home;
