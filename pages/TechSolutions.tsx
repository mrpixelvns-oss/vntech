
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Cpu, Database, Workflow, Bot, Code2, Server, 
  ArrowRight, Layers, Zap, Command, Cloud, Lock,
  Users, CheckCircle2, Mail, BarChart3, Globe, Shield, MessageSquare, Monitor, LayoutDashboard, Share2
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';
import ConsultationModal from '../components/ConsultationModal';

const TechSolutions: React.FC = () => {
  const { getSection } = usePageContent('tech_solutions');
  const hero = getSection('hero', DEFAULT_CONTENT.tech_solutions.hero);
  const solutions = getSection('solutions', DEFAULT_CONTENT.tech_solutions.solutions);
  const cta = getSection('cta', DEFAULT_CONTENT.tech_solutions.cta);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Solutions Data for Interactive Tabs
  const solutionItems = [
    {
      id: 'webapp',
      title: 'Web App & SaaS',
      description: 'Hệ thống phần mềm chạy trên nền tảng Web (HRM, ERP, LMS). Truy cập mọi lúc mọi nơi, không cần cài đặt.',
      icon: Code2,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      visual: (
        <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900 p-6 flex flex-col">
           {/* Fake Browser Header */}
           <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-800 rounded py-0.5 mx-4">dashboard.grifow.com</div>
           </div>
           {/* Dashboard Content */}
           <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-3 space-y-2">
                 <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                 <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                 <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                 <div className="mt-4 h-20 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
              </div>
              <div className="col-span-3 grid grid-cols-2 gap-4 content-start">
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between mb-2">
                       <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded flex items-center justify-center text-blue-600"><Users size={14}/></div>
                       <span className="text-xs text-green-500 font-bold">+12%</span>
                    </div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">1,240</div>
                    <div className="text-[10px] text-slate-400">Active Users</div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between mb-2">
                       <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded flex items-center justify-center text-purple-600"><BarChart3 size={14}/></div>
                       <span className="text-xs text-green-500 font-bold">+5%</span>
                    </div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">$42k</div>
                    <div className="text-[10px] text-slate-400">Revenue</div>
                 </div>
                 <div className="col-span-2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm h-32 flex items-end justify-between gap-1">
                    {[40, 60, 45, 70, 50, 80, 65, 90].map((h, i) => (
                       <div key={i} style={{height: `${h}%`}} className="w-full bg-cyan-500 rounded-t-sm opacity-80"></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 'crm',
      title: 'Custom CRM System',
      description: 'Quản lý quan hệ khách hàng (CRM) được "may đo" riêng cho quy trình bán hàng. Tích hợp Call Center & Zalo OA.',
      icon: Database,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      visual: (
        <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900 p-6 flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><LayoutDashboard size={16}/> Pipeline</h4>
              <button className="bg-purple-600 text-white text-xs px-3 py-1 rounded-md">+ Deal</button>
           </div>
           <div className="flex gap-4 overflow-hidden">
              {/* Column 1 */}
              <div className="w-1/3 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                 <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Mới (3)</div>
                 <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm border-l-4 border-blue-500">
                    <div className="text-xs font-bold mb-1">Nguyễn Văn A</div>
                    <div className="text-[10px] text-slate-400">Quan tâm: Web Design</div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm border-l-4 border-blue-500">
                    <div className="text-xs font-bold mb-1">Công ty B</div>
                    <div className="text-[10px] text-slate-400">Quan tâm: CRM</div>
                 </div>
              </div>
              {/* Column 2 */}
              <div className="w-1/3 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                 <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Đang tư vấn (2)</div>
                 <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm border-l-4 border-orange-500">
                    <div className="text-xs font-bold mb-1">Chị Lan</div>
                    <div className="text-[10px] text-slate-400">Hẹn demo: 14h00</div>
                 </div>
              </div>
              {/* Column 3 */}
              <div className="w-1/3 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2 flex flex-col gap-2">
                 <div className="text-[10px] font-bold text-slate-500 uppercase px-1">Chốt đơn (5)</div>
                 <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm border-l-4 border-green-500">
                    <div className="text-xs font-bold mb-1">Tech Corp</div>
                    <div className="text-[10px] text-slate-400">Đã ký HĐ</div>
                 </div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 'automation',
      title: 'Business Automation',
      description: 'Kết nối API các ứng dụng (Website, CRM, Email, Sheet). Tự động hóa quy trình lặp lại, tiết kiệm 80% thời gian.',
      icon: Workflow,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      visual: (
        <div className="relative w-full h-full bg-slate-900 p-6 flex items-center justify-center overflow-hidden">
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           
           {/* Nodes */}
           <div className="relative z-10 w-full max-w-sm">
              <div className="flex justify-between items-center mb-8">
                 <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 text-xs font-bold">
                    <MessageSquare size={14}/> Facebook Lead
                 </div>
                 <div className="h-0.5 flex-1 bg-slate-700 mx-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 animate-slide-right"></div>
                 </div>
                 <div className="bg-yellow-600 text-white p-3 rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 text-xs font-bold">
                    <Database size={14}/> Add to CRM
                 </div>
              </div>
              
              <div className="flex justify-center h-8 relative">
                 <div className="w-0.5 h-full bg-slate-700 absolute right-[3rem] top-[-2rem]"></div>
                 <div className="w-20 h-0.5 bg-slate-700 absolute right-[3rem] bottom-0 rounded-bl-full border-l-2 border-b-2 border-slate-700 border-t-0 border-r-0"></div>
              </div>

              <div className="flex justify-end mt-2">
                 <div className="bg-green-600 text-white p-3 rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-2 text-xs font-bold">
                    <Mail size={14}/> Send Email
                 </div>
              </div>
           </div>
        </div>
      )
    }
  ];

  const [activeTab, setActiveTab] = useState(solutionItems[0].id);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section - Futuristic & Techy (DARK) */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950 text-white">
         {/* Tech Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,196,180,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,196,180,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
               >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 border border-cyan-800 text-xs font-bold uppercase tracking-wider mb-6">
                     <Cpu size={14} /> {hero.badge}
                  </div>
                  <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight">
                     {hero.title_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{hero.title_highlight}</span>
                  </h1>
                  <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                     {hero.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-cyan-500 text-slate-900 rounded-full font-bold hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2"
                     >
                        {hero.btn_primary} <ArrowRight size={18}/>
                     </button>
                     <a href="#solutions" className="px-8 py-4 border border-slate-700 text-slate-300 rounded-full font-bold hover:bg-slate-800 transition-colors">
                        {hero.btn_secondary}
                     </a>
                  </div>
               </motion.div>
            </div>

            {/* Hero Visual: Flowchart Animation */}
            <div className="mt-20 relative h-[400px] w-full max-w-5xl mx-auto border border-slate-800 bg-slate-900/50 rounded-2xl backdrop-blur-sm overflow-hidden shadow-2xl">
               {/* Header Bar */}
               <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs font-mono text-slate-500">workflow_automation.js</div>
               </div>
               
               {/* Diagram */}
               <div className="p-8 relative h-full">
                  {/* Nodes */}
                  <div className="absolute top-1/2 left-10 -translate-y-1/2 p-4 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50 z-10 w-40">
                     <div className="flex items-center gap-2 mb-2"><Users size={16}/> <span className="font-bold text-xs">New Lead</span></div>
                     <div className="h-2 w-full bg-blue-400/30 rounded"></div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-800 border border-cyan-500/50 rounded-xl z-10 w-48 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                     <div className="flex items-center gap-2 mb-2"><Bot size={16} className="text-cyan-400"/> <span className="font-bold text-xs text-cyan-400">AI Processing</span></div>
                     <div className="text-[10px] text-slate-400 font-mono">Analyzing intent...</div>
                  </div>

                  <div className="absolute top-20 right-10 p-4 bg-green-600 rounded-xl shadow-lg shadow-green-900/50 z-10 w-40">
                     <div className="flex items-center gap-2 mb-2"><Database size={16}/> <span className="font-bold text-xs">Save to CRM</span></div>
                     <div className="h-2 w-full bg-green-400/30 rounded"></div>
                  </div>

                  {/* Connecting Lines (Animated) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                     <path d="M 210 180 L 400 180" stroke="#334155" strokeWidth="2" fill="none" />
                     <path d="M 590 180 L 700 120" stroke="#334155" strokeWidth="2" fill="none" />
                     
                     {/* Moving Dots */}
                     <circle r="4" fill="#06b6d4">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 210 180 L 400 180" />
                     </circle>
                     <circle r="4" fill="#06b6d4">
                        <animateMotion dur="2s" begin="1s" repeatCount="indefinite" path="M 590 180 L 700 120" />
                     </circle>
                  </svg>
               </div>
            </div>
         </div>
      </section>

      {/* 2. Solutions - NEW INTERACTIVE TABS LAYOUT */}
      <section id="solutions" className="py-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative">
         <div className="container mx-auto px-4 relative z-10">
            <SectionHeader 
               subtitle={solutions.subtitle}
               title={solutions.title}
               description={solutions.description}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12">
               
               {/* Left Column: List Navigation */}
               <div className="lg:col-span-5 flex flex-col gap-4">
                  {solutionItems.map((item) => (
                     <motion.div
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent group ${
                           activeTab === item.id 
                           ? 'bg-white dark:bg-slate-800 shadow-xl border-l-4 border-l-cyan-500 scale-[1.02]' 
                           : 'bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50'
                        }`}
                        whileHover={{ x: activeTab === item.id ? 0 : 5 }}
                     >
                        <div className="flex items-center gap-4 mb-3">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === item.id ? item.bg : 'bg-slate-100 dark:bg-slate-800'}`}>
                              <item.icon size={20} className={activeTab === item.id ? item.color : 'text-slate-500'} />
                           </div>
                           <h3 className={`font-bold text-lg ${activeTab === item.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                              {item.title}
                           </h3>
                        </div>
                        <p className={`text-sm leading-relaxed pl-[3.5rem] ${activeTab === item.id ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                           {item.description}
                        </p>
                     </motion.div>
                  ))}
               </div>

               {/* Right Column: Visual Preview Area */}
               <div className="lg:col-span-7">
                  <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] bg-slate-200 dark:bg-slate-950 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden">
                     <AnimatePresence mode="wait">
                        {solutionItems.map((item) => (
                           activeTab === item.id && (
                              <motion.div
                                 key={item.id}
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -20 }}
                                 transition={{ duration: 0.4 }}
                                 className="absolute inset-0"
                              >
                                 {item.visual}
                              </motion.div>
                           )
                        ))}
                     </AnimatePresence>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 3. Value Proposition / Quality Commitment */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">
                  Tại sao chọn giải pháp của Grifow?
               </h2>
               <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  Chúng tôi không chỉ viết code. Chúng tôi xây dựng những hệ thống bền vững giúp doanh nghiệp vận hành hiệu quả hơn mỗi ngày.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {/* Card 1: Security */}
               <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Lock size={28} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Bảo mật tuyệt đối</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     Mã hóa dữ liệu đầu cuối, tường lửa chống tấn công và quy trình backup tự động hàng ngày. Dữ liệu của bạn luôn an toàn.
                  </p>
               </div>

               {/* Card 2: Speed */}
               <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Zap size={28} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Hiệu năng cao</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     Hệ thống được tối ưu để xử lý hàng ngàn giao dịch cùng lúc mà không giật lag. Đảm bảo trải nghiệm mượt mà nhất.
                  </p>
               </div>

               {/* Card 3: Usability */}
               <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Users size={28} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Dễ sử dụng</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     Giao diện trực quan, thân thiện (UI/UX). Nhân viên của bạn có thể làm quen và sử dụng thành thạo chỉ sau 15 phút.
                  </p>
               </div>

               {/* Card 4: Scalability */}
               <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Layers size={28} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Dễ dàng mở rộng</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                     Kiến trúc Microservices linh hoạt. Dễ dàng nâng cấp tính năng mới khi doanh nghiệp phát triển mà không cần đập đi xây lại.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
         <div className="container mx-auto px-4 text-center">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-slate-900 dark:text-white mb-6">
               {cta.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
               {cta.description}
            </p>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="inline-flex items-center px-10 py-5 bg-cyan-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:bg-cyan-700 transition-all hover:-translate-y-1"
            >
               {cta.btn_text} <ArrowRight className="ml-2" />
            </button>
         </div>
      </section>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TechSolutions;
