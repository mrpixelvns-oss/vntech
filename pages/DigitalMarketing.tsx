
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Search, MessageCircle, BarChart3, 
  Zap, Target, ArrowRight, Share2, MousePointer2, 
  Smartphone, Globe, ThumbsUp, Filter, Layers, Radio,
  Video, CheckCircle2, Play, Heart, Music, Eye, Star, ShieldCheck, MessageSquare, ShoppingBag, Linkedin, Send
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ConsultationModal from '../components/ConsultationModal';
import { usePageContent } from '../hooks/usePageContent';
import { DEFAULT_CONTENT } from '../lib/defaultContent';

const DigitalMarketing: React.FC = () => {
  const { getSection } = usePageContent('digital_marketing');
  const hero = getSection('hero', DEFAULT_CONTENT.digital_marketing.hero);
  const cta = getSection('cta', DEFAULT_CONTENT.digital_marketing.cta);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. HERO SECTION: PERFORMANCE RADAR (KEPT) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900 text-white">
         {/* Abstract Background */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-[100%] blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
               >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                     <Radio size={14} className="animate-pulse" /> Performance Marketing
                  </div>
                  <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 tracking-tight">
                     Biến Chi phí <br/> thành <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Doanh thu.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                     Chúng tôi không chạy quảng cáo để lấy Like. Chúng tôi xây dựng chiến lược Digital Marketing tổng thể để <strong className="text-white font-bold">tối đa hóa chuyển đổi (Sales)</strong> cho doanh nghiệp của bạn.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                     <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_rgba(37,99,235,0.7)] transition-all flex items-center gap-2"
                     >
                        <Zap size={20} fill="currentColor" /> Bắt đầu chiến dịch
                     </button>
                     <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> High ROI</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Data-Driven</span>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Hero Visual: The "Radar" Scanner */}
            <div className="mt-20 relative h-[300px] md:h-[400px] w-full max-w-5xl mx-auto perspective-1000">
                <motion.div 
                   initial={{ rotateX: 20, opacity: 0 }}
                   animate={{ rotateX: 20, opacity: 1 }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className="absolute inset-0 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden"
                >
                   {/* Grid Lines */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                   
                   {/* Moving Scan Line */}
                   <motion.div 
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-10"
                   />

                   {/* Floating Metrics */}
                   <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[20%] left-[20%] bg-slate-900/80 border border-green-500/30 p-3 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-400"><TrendingUp size={16}/></div>
                      <div>
                         <div className="text-[10px] text-slate-400 uppercase font-bold">Conversion Rate</div>
                         <div className="text-lg font-bold text-white">4.8%</div>
                      </div>
                   </motion.div>

                   <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-[50%] right-[25%] bg-slate-900/80 border border-blue-500/30 p-3 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400"><Users size={16}/></div>
                      <div>
                         <div className="text-[10px] text-slate-400 uppercase font-bold">New Leads</div>
                         <div className="text-lg font-bold text-white">+1,240</div>
                      </div>
                   </motion.div>

                   <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-[30%] left-[40%]">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
                   </motion.div>
                </motion.div>
            </div>
         </div>
      </section>

      {/* 2. FACEBOOK ADS SECTION (KEPT) */}
      <section className="py-24 bg-white dark:bg-slate-950">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
               >
                  <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Core Service</h2>
                  <h3 className="font-display font-bold text-4xl md:text-5xl text-slate-900 dark:text-white mb-6 leading-tight">
                     Facebook Ads <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Chuyển đổi cao.</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                     Chúng tôi không "đốt tiền" của bạn. Mỗi chiến dịch là một phép thử được tính toán kỹ lưỡng dựa trên dữ liệu (Data-driven).
                  </p>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                           <Target size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Targeting Chuyên sâu</h4>
                           <p className="text-slate-600 dark:text-slate-400 text-sm">Vẽ chân dung khách hàng chi tiết (Hành vi, Sở thích, Nhân khẩu học) để quảng cáo hiển thị đúng người cần mua.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 flex-shrink-0">
                           <Layers size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">A/B Testing Liên tục</h4>
                           <p className="text-slate-600 dark:text-slate-400 text-sm">Thử nghiệm hàng chục mẫu Content/Hình ảnh để tìm ra "công thức chiến thắng" (Winning Campaign).</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 flex-shrink-0">
                           <Filter size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Remarketing Đeo bám</h4>
                           <p className="text-slate-600 dark:text-slate-400 text-sm">Không bỏ lỡ khách hàng tiềm năng. Tiếp thị lại những người đã quan tâm nhưng chưa mua hàng.</p>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Facebook Ad Mockup Visual */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative"
               >
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>
                  
                  {/* The Campaign Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                     {/* Header */}
                     <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">G</div>
                        <div className="flex-1">
                           <div className="font-bold text-sm text-slate-900 dark:text-white">Grifow Agency</div>
                           <div className="text-xs text-slate-500">Được tài trợ • <Globe size={10} className="inline"/></div>
                        </div>
                        <div className="text-slate-400"><Share2 size={16}/></div>
                     </div>
                     {/* Content */}
                     <div className="p-4">
                        <p className="text-sm text-slate-800 dark:text-slate-300 mb-3">
                           🚀 Tăng trưởng doanh số 200% với chiến lược Facebook Ads thế hệ mới. Đừng để đối thủ vượt mặt bạn! <span className="text-blue-500">#DigitalMarketing #Grifow</span>
                        </p>
                        <div className="rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                           <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" className="w-full h-48 object-cover" />
                           <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-3">
                              <div className="text-white font-bold text-sm">Miễn phí tư vấn chiến lược</div>
                              <div className="text-white/80 text-xs">GRFOW.COM</div>
                           </div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                           <div className="text-xs font-bold text-slate-500 uppercase">Đăng ký ngay</div>
                           <button className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded">Gửi tin nhắn</button>
                        </div>
                     </div>
                     {/* Stats Overlay (Floating) */}
                     <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-20 -right-6 bg-green-500 text-white p-3 rounded-lg shadow-xl"
                     >
                        <div className="text-[10px] uppercase font-bold opacity-80">ROAS</div>
                        <div className="text-2xl font-black">8.5x</div>
                     </motion.div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* 3. GOOGLE & SEO SECTION (KEPT) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] -z-0 pointer-events-none"></div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Visual */}
                <motion.div 
                   initial={{ opacity: 0, x: -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                   className="relative"
                >
                    <div className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl max-w-md mx-auto">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                            <div className="w-24"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="w-full" /></div>
                            <div className="flex-1 bg-slate-100 h-10 rounded-full px-4 flex items-center text-slate-400 text-sm shadow-inner">
                                <Search size={16} className="mr-2"/> dịch vụ marketing tốt nhất
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Được tài trợ • Grifow Creative</div>
                                <div className="text-xl text-blue-600 font-medium hover:underline cursor-pointer">Dịch vụ Marketing Tổng Thể - Cam kết Doanh số</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Tư vấn chiến lược miễn phí. Đội ngũ chuyên gia 5+ năm kinh nghiệm. Tối ưu chi phí, báo cáo minh bạch hàng ngày.
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs font-bold border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">Bảng giá 2025</span>
                                    <span className="text-xs font-bold border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">Dự án tiêu biểu</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="text-xs text-slate-800 flex items-center gap-1 mb-1"><Globe size={12}/> https://grifow.com › dich-vu</div>
                                <div className="text-xl text-blue-600 font-medium hover:underline cursor-pointer">Grifow - Agency Thiết kế & Marketing hàng đầu</div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Giải pháp Digital Marketing toàn diện cho doanh nghiệp SME. SEO, Facebook Ads, Google Ads...
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Badge */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-6 -right-6 bg-yellow-400 text-slate-900 font-black px-4 py-2 rounded-lg shadow-lg transform rotate-12 border-2 border-slate-900"
                    >
                        TOP #1
                    </motion.div>
                </motion.div>

                {/* Content */}
                <motion.div 
                   initial={{ opacity: 0, x: 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                >
                    <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">Google Ecosystem</h2>
                    <h3 className="font-display font-bold text-4xl md:text-5xl mb-6">
                        Chiếm lĩnh <span className="text-blue-400">Top Tìm kiếm.</span>
                    </h3>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        Tiếp cận khách hàng ngay khi họ có nhu cầu. Kết hợp giữa quảng cáo tìm kiếm (Google Ads) và tối ưu hóa dài hạn (SEO) để bao phủ thị trường.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                                <Search size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Google Ads (SEM)</h4>
                                <p className="text-sm text-slate-400">Đẩy từ khóa lên Top 1 ngay lập tức. Tối ưu điểm chất lượng để giảm giá thầu (CPC).</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">SEO Tổng thể</h4>
                                <p className="text-sm text-slate-400">Lên Top bền vững với hàng nghìn từ khóa. Tăng traffic tự nhiên và uy tín thương hiệu.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 text-yellow-500 flex items-center justify-center flex-shrink-0 mt-1">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Google Shopping</h4>
                                <p className="text-sm text-slate-400">Hiển thị hình ảnh sản phẩm & giá bán ngay trên kết quả tìm kiếm. Tăng tỷ lệ click mua hàng.</p>
                            </div>
                        </li>
                    </ul>
                </motion.div>
            </div>
         </div>
      </section>

      {/* 4. REDESIGNED SEEDING & TRUST SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Content & Strategy */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-green-600 font-bold uppercase tracking-widest text-sm">Trust & Growth</h2>
                    </div>
                    <h3 className="font-display font-bold text-3xl md:text-5xl text-slate-900 dark:text-white mb-6 leading-tight">
                        Xây dựng <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Niềm tin & Cộng đồng.</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                        Khách hàng mua bằng niềm tin. Chúng tôi giúp thương hiệu của bạn không chỉ xuất hiện mà còn được thảo luận sôi nổi và yêu thích trên mạng xã hội.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-slate-100 dark:border-slate-700">
                                <ThumbsUp size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Tăng trưởng Fanpage (Like/Follow)</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Xây dựng profile uy tín với lượng Like/Follow lớn (>10k). Tạo ấn tượng thương hiệu lớn ngay từ cái nhìn đầu tiên.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-400 group-hover:text-yellow-500 group-hover:scale-110 transition-all border border-slate-100 dark:border-slate-700">
                                <Star size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Seeding & Đánh giá 5 sao</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Điều hướng dư luận tích cực. Tăng đánh giá 5 sao thực tế và comment mồi khéo léo để thúc đẩy khách hàng chốt đơn.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-400 group-hover:text-green-500 group-hover:scale-110 transition-all border border-slate-100 dark:border-slate-700">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Quản trị danh tiếng (Reputation)</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Xử lý khủng hoảng truyền thông, phủ lấp comment tiêu cực và xây dựng hình ảnh thương hiệu sạch trên mạng xã hội.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Visual Simulation (High-Performance Fanpage) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-[3rem] -rotate-3 scale-95 opacity-70 blur-xl"></div>
                    
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                       {/* Cover Image */}
                       <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                       </div>
                       
                       <div className="px-6 pb-6 relative">
                          {/* Avatar & Info */}
                          <div className="flex justify-between items-end -mt-10 mb-4">
                             <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-white overflow-hidden shadow-md flex items-center justify-center">
                                {/* Fallback Avatar if img fails */}
                                <div className="font-black text-3xl text-slate-900">G</div>
                             </div>
                             <div className="flex gap-2 mb-1">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors">
                                   <ThumbsUp size={14} /> Like
                                </button>
                                <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                   Nhắn tin
                                </button>
                             </div>
                          </div>

                          {/* Page Name & Verification */}
                          <div className="mb-4">
                             <h3 className="font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-1">
                                Grifow Official <CheckCircle2 size={18} className="text-blue-500 fill-blue-500 text-white" />
                             </h3>
                             <p className="text-xs text-slate-500 font-medium">Agency • Marketing & Advertising</p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6 text-sm mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                             <div className="flex items-center gap-1.5">
                                <div className="bg-blue-600 p-1 rounded-full"><ThumbsUp size={10} className="text-white" /></div>
                                <span className="font-bold text-slate-900 dark:text-white">12,458</span> 
                                <span className="text-slate-500">likes</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">15,200</span>
                                <span className="text-slate-500">followers</span>
                             </div>
                          </div>

                          {/* Reviews Section */}
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-start gap-4 border border-slate-100 dark:border-slate-800/50">
                             <div className="text-3xl font-black text-slate-900 dark:text-white">5.0</div>
                             <div className="flex-1">
                                <div className="flex text-yellow-400 text-xs mb-1">
                                   <Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/>
                                </div>
                                <p className="text-xs text-slate-500">
                                   <span className="font-bold text-slate-700 dark:text-slate-300">Được đề xuất</span> bởi 99% khách hàng. Dựa trên 254 đánh giá.
                                </p>
                             </div>
                          </div>
                       </div>

                       {/* Live Notification Overlay */}
                       <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute top-4 right-4 bg-white dark:bg-slate-800 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 border border-green-200 dark:border-green-900/50 z-10"
                       >
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">+50 Followers vừa xong</span>
                       </motion.div>
                    </div>
                </motion.div>
            </div>
         </div>
      </section>

      {/* 5. MULTI-PLATFORM SECTION (CREATIVE BENTO GRID) */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
         <div className="container mx-auto px-4">
             <div className="text-center mb-16">
                 <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-4">Đa nền tảng - Đa điểm chạm</h2>
                 <p className="text-slate-500 dark:text-slate-400">Khách hàng ở đâu, chúng tôi giúp bạn xuất hiện ấn tượng ở đó.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto auto-rows-[300px]">
                 
                 {/* 1. TIKTOK - Tall Card (Span 1 Col, 2 Rows) */}
                 <div className="md:col-span-1 md:row-span-2 bg-black text-white p-6 rounded-[2rem] relative overflow-hidden group border border-slate-800 hover:border-slate-600 transition-all flex flex-col justify-between">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-[#00f2ea] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                     <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#ff0050] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                     
                     <div className="relative z-10">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                             <Video size={24} />
                         </div>
                         <h3 className="text-3xl font-bold mb-2">TikTok</h3>
                         <p className="text-sm text-slate-400">Kênh Video ngắn & Booking KOC/KOL.</p>
                     </div>
                     
                     <div className="relative z-10 mt-8">
                         <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm mb-2">
                             <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Viral Potential</div>
                             <div className="text-2xl font-black text-[#00f2ea]">High</div>
                         </div>
                         <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                             Xây kênh ngay
                         </button>
                     </div>
                 </div>

                 {/* 2. YOUTUBE - Wide Card (Span 2 Cols, 1 Row) */}
                 <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group hover:border-red-500/50 transition-colors shadow-sm flex flex-col justify-center">
                     <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] group-hover:bg-red-500/20 transition-colors"></div>
                     
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                         <div className="flex-1">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center">
                                    <Play size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Youtube</h3>
                             </div>
                             <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                 Phủ sóng thương hiệu với Video dài chất lượng cao. Tối ưu SEO Video để tiếp cận khách hàng tìm kiếm nội dung chuyên sâu.
                             </p>
                             <div className="flex gap-2">
                                <span className="text-[10px] font-bold px-2 py-1 bg-red-50 text-red-600 rounded border border-red-100">TrueView Ads</span>
                                <span className="text-[10px] font-bold px-2 py-1 bg-red-50 text-red-600 rounded border border-red-100">SEO Video</span>
                             </div>
                         </div>
                         {/* Visual UI Element */}
                         <div className="w-full md:w-48 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 shadow-inner">
                             <div className="aspect-video bg-slate-300 dark:bg-slate-700 rounded-lg mb-2 relative overflow-hidden">
                                 <div className="absolute inset-0 flex items-center justify-center text-white/50"><Play size={24} fill="currentColor"/></div>
                             </div>
                             <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-600 rounded mb-1"></div>
                             <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                         </div>
                     </div>
                 </div>

                 {/* 3. FACEBOOK/META - Box (Span 1 Col, 1 Row) */}
                 <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-[2rem] relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px]"></div>
                     <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                             <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                                 <ThumbsUp size={20} />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Meta (Facebook)</h3>
                             <p className="text-blue-100 text-xs">Mạng xã hội lớn nhất. Nơi xây dựng cộng đồng & chạy Ads hiệu quả.</p>
                         </div>
                         <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-xs font-bold">
                             <span>2.9B Users</span>
                             <ArrowRight size={14} />
                         </div>
                     </div>
                 </div>

                 {/* 4. ZALO OA - Box (Span 1 Col, 1 Row) */}
                 <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 p-6 rounded-[2rem] relative overflow-hidden group hover:border-blue-400 transition-colors">
                     <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50 dark:from-blue-900/10 to-transparent"></div>
                     <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                 <MessageCircle size={20} />
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Zalo OA</h3>
                             <p className="text-slate-500 text-xs">Chăm sóc khách hàng & Gửi tin nhắn ZNS tự động tại Việt Nam.</p>
                         </div>
                         <div className="mt-4 flex gap-2">
                             <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">ZNS</span>
                             <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">CRM</span>
                         </div>
                     </div>
                 </div>

                 {/* 5. LINKEDIN - Box (Span 1 Col, 1 Row) */}
                 <div className="md:col-span-1 bg-[#0077b5] text-white p-6 rounded-[2rem] relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                     <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                             <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                                 <Linkedin size={20} />
                             </div>
                             <h3 className="text-xl font-bold mb-2">LinkedIn</h3>
                             <p className="text-white/80 text-xs">B2B Branding & Tuyển dụng. Tiếp cận đối tác doanh nghiệp.</p>
                         </div>
                         <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">
                             Professional Ads
                         </button>
                     </div>
                 </div>

                 {/* 6. CONTENT HUB - Box (Span 1 Col, 1 Row) - Filler/Summary */}
                 <div className="md:col-span-1 bg-slate-100 dark:bg-slate-800 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                     <div className="relative z-10">
                         <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
                             <Send size={20} />
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Đa kênh</h4>
                         <p className="text-xs text-slate-500 mt-1">Tiếp cận khách hàng tại mọi điểm chạm.</p>
                     </div>
                 </div>

             </div>
         </div>
      </section>

      {/* 7. CTA SECTION (KEPT) */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/30 to-transparent pointer-events-none"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-8 tracking-tight">
               {cta.title}
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
               {cta.description}
            </p>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="inline-flex items-center px-12 py-5 bg-white text-slate-900 rounded-full font-black text-lg hover:bg-blue-50 transition-all hover:scale-105"
            >
               {cta.btn_text} <MousePointer2 className="ml-2" />
            </button>
         </div>
      </section>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DigitalMarketing;
