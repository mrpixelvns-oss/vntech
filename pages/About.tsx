
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Heart, Award, Users, Coffee, Globe, Zap, CheckCircle2, ArrowRight, ShieldCheck, Rocket, Eye, Compass } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import MatrixLoader from '../components/MatrixLoader';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';

const About: React.FC = () => {
  // Fetch dynamic content
  const { getSection } = usePageContent('about');

  // Load defaults
  const hero = getSection('hero', DEFAULT_CONTENT.about.hero);
  const mission = getSection('mission', DEFAULT_CONTENT.about.mission);
  const coreValues = getSection('core_values', DEFAULT_CONTENT.about.core_values);
  const cta = getSection('cta', DEFAULT_CONTENT.about.cta);

  const stats = [
    { label: "Năm kinh nghiệm", value: hero.stat_3, icon: Coffee },
    { label: "Dự án hoàn thành", value: hero.stat_1, icon: CheckCircle2 },
    { label: "Khách hàng hài lòng", value: hero.stat_2, icon: Heart },
    { label: "Chuyên gia nhân sự", value: "15+", icon: Users }, // Static fallback if not in DB
  ];

  const coreValuesList = [
    {
      title: "Chất lượng là Danh dự",
      desc: "Chúng tôi không chấp nhận sự hời hợt. Mọi sản phẩm bàn giao đều phải đạt chuẩn pixel-perfect và hiệu năng tối ưu nhất.",
      icon: Award,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      title: "Sáng tạo Thực chiến",
      desc: "Sáng tạo không phải để vẽ vời, mà để giải quyết vấn đề. Thiết kế đẹp phải đi đôi với trải nghiệm người dùng (UX) tốt và tỷ lệ chuyển đổi cao.",
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Minh bạch Tuyệt đối",
      desc: "Rõ ràng trong báo giá, quy trình và cam kết. Chúng tôi coi khách hàng là đối tác chiến lược, cùng nhau chia sẻ rủi ro và thành công.",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Học hỏi Không ngừng",
      desc: "Công nghệ thay đổi từng giờ. Tại Grifow, văn hóa tự học và cập nhật xu hướng công nghệ mới (AI, Blockchain, Web3) là bắt buộc.",
      icon: Globe,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Hero Section - Redesigned (Split Layout with Matrix Loader) */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-center">
                {/* Left Column: Text Content (Wider: 2/3) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[2px] bg-accent"></div>
                        <span className="text-accent font-bold text-xs uppercase tracking-[0.2em]">{hero.since_text}</span>
                    </div>

                    <h1 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 dark:text-white mb-6 leading-tight tracking-tight [text-wrap:balance]">
                       {hero.title_main} <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-accent">{hero.title_sub}</span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl">
                        {hero.description}
                    </p>

                    <div className="flex gap-10 border-t border-slate-200 dark:border-slate-800 pt-8">
                       <div>
                          <div className="text-3xl font-black text-slate-900 dark:text-white">{hero.stat_1}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-bold">Dự án</div>
                       </div>
                       <div>
                          <div className="text-3xl font-black text-slate-900 dark:text-white">{hero.stat_2}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-bold">Hài lòng</div>
                       </div>
                       <div>
                          <div className="text-3xl font-black text-slate-900 dark:text-white">{hero.stat_3}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-bold">Năm PT</div>
                       </div>
                    </div>
                </motion.div>

                {/* Right Column: Matrix Loader Animation (Smaller: 1/3, Transparent) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-1 relative h-[400px] w-full flex items-center justify-center"
                >
                    <MatrixLoader />
                </motion.div>
            </div>
        </div>
      </section>

      {/* 2. Vision & Mission Section */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* LEFT: Introduction Typography (Adjusted to 4/12 width ~ 1/3) */}
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-4"
                  >
                      <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">{mission.subtitle}</span>
                      <h2 className="font-display font-bold text-4xl text-slate-900 dark:text-white mb-6 leading-tight">
                          {mission.title}
                      </h2>
                      <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-justify">
                          <p>{mission.desc_1}</p>
                          <p>{mission.desc_2}</p>
                      </div>
                  </motion.div>

                  {/* RIGHT: Abstract Cards (Adjusted to 8/12 width ~ 2/3) */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Vision Card */}
                      <motion.div 
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8, delay: 0.2 }}
                         className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden group"
                      >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
                          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                             <Eye size={28} />
                          </div>
                          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">{mission.vision_title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                             {mission.vision_desc}
                          </p>
                      </motion.div>

                      {/* Mission Card */}
                      <motion.div 
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8, delay: 0.4 }}
                         className="bg-dark dark:bg-slate-950 p-8 rounded-3xl shadow-lg border border-slate-800 relative overflow-hidden text-white group"
                      >
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-accent/30 transition-colors"></div>
                          <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-6">
                             <Rocket size={28} />
                          </div>
                          <h3 className="font-display font-bold text-2xl mb-4">{mission.mission_title}</h3>
                          <p className="text-slate-300 leading-relaxed text-justify">
                             {mission.mission_desc}
                          </p>
                      </motion.div>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {stats.map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                      >
                          <div className="w-12 h-12 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center text-white">
                              <stat.icon size={24} />
                          </div>
                          <div className="font-display font-bold text-4xl mb-2">{stat.value}</div>
                          <div className="text-slate-400 font-medium text-sm uppercase tracking-wider">{stat.label}</div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* 5. Core Values */}
      <section className="py-24 bg-white dark:bg-slate-950/50">
          <div className="container mx-auto px-4">
              <SectionHeader 
                  subtitle={coreValues.subtitle} 
                  title={coreValues.title} 
                  description={coreValues.desc}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {coreValuesList.map((item, idx) => (
                      <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group"
                      >
                          <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                              <item.icon size={32} className={item.color} />
                          </div>
                          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">{item.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-justify">
                              {item.desc}
                          </p>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
             <div className="bg-dark dark:bg-accent rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                     <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
                     <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-8">
                        {cta.title}
                    </h2>
                    <p className="text-slate-300 dark:text-white/90 text-xl mb-10 max-w-2xl mx-auto">
                        {cta.description}
                    </p>
                    <Link 
                        to="/contact" 
                        className="inline-flex items-center px-8 py-4 bg-white text-dark font-bold rounded-full text-lg hover:bg-slate-200 transition-colors"
                    >
                        {cta.btn_text} <ArrowRight className="ml-2" />
                    </Link>
                </div>
             </div>
          </div>
      </section>

    </div>
  );
};

export default About;
