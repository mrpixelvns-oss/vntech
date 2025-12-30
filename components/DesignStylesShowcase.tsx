
import React from 'react';
import { 
  ArrowRight, User, Bell, Search, Star, CreditCard, Send, Plus, 
  MapPin, Sun, Music, Play, Activity, TrendingUp, Check, Menu, Heart, Share2, MessageCircle,
  Layout, MousePointer2, ShoppingBag, Globe, Hexagon, Shield, Settings, Sparkles
} from 'lucide-react';

const DesignStylesShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
         {/* Decoration */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="mb-16 text-center">
              <div className="flex items-center gap-2 mb-3 justify-center">
                 <span className="w-8 h-[2px] bg-accent inline-block"></span>
                 <span className="text-accent font-bold tracking-widest uppercase text-xs mx-auto">Phong cách thiết kế</span>
                 <span className="w-8 h-[2px] bg-accent inline-block"></span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-dark dark:text-white mb-6 tracking-tight leading-tight">
                Đa dạng ngôn ngữ thiết kế
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed mx-auto">
                Khám phá các phong cách thiết kế UI/UX đang thịnh hành và phù hợp với từng lĩnh vực cụ thể.
              </p>
            </div>

            <div className="space-y-16">
                {/* GROUP 1: TRENDING UI/UX */}
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       
                       {/* 1. Minimalism - SCROLLABLE WEB */}
                       <BrowserWindow title="Minimalism" url="minimalism.design" color="bg-white">
                          <div className="p-8 min-h-[1000px] flex flex-col font-sans text-slate-800">
                              {/* Web Nav */}
                              <div className="flex justify-between items-center mb-16 sticky top-0 bg-white/90 backdrop-blur py-4 z-10 border-b border-transparent hover:border-slate-100 transition-colors">
                                  <div className="font-serif font-bold text-2xl tracking-tighter">M/D</div>
                                  <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest text-slate-500">
                                      <span className="cursor-pointer hover:text-black">Projects</span>
                                      <span className="cursor-pointer hover:text-black">Studio</span>
                                      <span className="cursor-pointer hover:text-black">Journal</span>
                                  </div>
                                  <div className="text-xs font-bold border-b border-black pb-0.5 cursor-pointer">Get in touch</div>
                              </div>
                              
                              {/* Hero Section */}
                              <div className="mb-24">
                                  <h1 className="text-5xl md:text-6xl font-light leading-[1.1] mb-8">Less noise.<br/>More signal.</h1>
                                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
                                      We strip away the unnecessary to reveal the essence of your brand. Focusing on typography, whitespace, and purpose.
                                  </p>
                                  <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center animate-bounce cursor-pointer">
                                      <ArrowRight className="rotate-90 text-slate-400" size={16}/>
                                  </div>
                              </div>

                              {/* Featured Image (Parallax feel) */}
                              <div className="w-full aspect-[16/9] bg-slate-50 mb-20 relative overflow-hidden group cursor-pointer">
                                  <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-1000" alt="Minimal" />
                                  <div className="absolute bottom-6 left-6 text-white mix-blend-difference">
                                      <div className="text-xs uppercase tracking-widest mb-1">Architecture</div>
                                      <div className="text-2xl font-serif">The Concrete House</div>
                                  </div>
                              </div>

                              {/* Content Grid */}
                              <div className="grid grid-cols-1 gap-16 mb-24">
                                  <div className="flex gap-8 items-start group">
                                      <span className="text-xs font-bold text-slate-300 mt-1">01</span>
                                      <div>
                                          <h3 className="text-xl font-normal mb-4 group-hover:underline decoration-1 underline-offset-4">Philosophy</h3>
                                          <p className="text-sm text-slate-500 leading-relaxed font-light max-w-xs">
                                              Minimalism is not about lack of content. It's about the perfect emphasis on content. Every pixel serves a purpose.
                                          </p>
                                      </div>
                                  </div>
                                  <div className="flex gap-8 items-start group">
                                      <span className="text-xs font-bold text-slate-300 mt-1">02</span>
                                      <div>
                                          <h3 className="text-xl font-normal mb-4 group-hover:underline decoration-1 underline-offset-4">Typography</h3>
                                          <p className="text-sm text-slate-500 leading-relaxed font-light max-w-xs">
                                              We use typography as the primary visual element, creating structure and rhythm without clutter.
                                          </p>
                                      </div>
                                  </div>
                              </div>

                              {/* Footer */}
                              <div className="mt-auto pt-16 border-t border-slate-100 flex flex-col gap-6 text-center">
                                  <div className="text-3xl font-serif italic">Let's create together.</div>
                                  <button className="text-xs bg-black text-white px-8 py-3 rounded-full w-fit mx-auto hover:bg-slate-800 transition-colors">Start Project</button>
                                  <div className="text-[10px] text-slate-300 uppercase tracking-widest mt-8">© 2025 Minimalism Studio</div>
                              </div>
                          </div>
                       </BrowserWindow>

                       {/* 2. Bento Grid - SCROLLABLE WEB PORTFOLIO */}
                       <BrowserWindow title="Bento Grid" url="alex.design" color="bg-slate-50">
                          <div className="p-4 min-h-[1100px] flex flex-col">
                              {/* Web Header */}
                              <div className="flex justify-between items-center mb-8 px-2 pt-2">
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                                      <span className="font-bold text-slate-800 text-sm">Alex Designer</span>
                                  </div>
                                  <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors">Contact Me</button>
                              </div>
                              
                              {/* Bento Grid Layout */}
                              <div className="grid grid-cols-4 gap-3 auto-rows-[minmax(100px,auto)]">
                                  
                                  {/* Hero Widget */}
                                  <div className="col-span-4 row-span-2 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start text-left relative overflow-hidden">
                                      <div className="relative z-10 max-w-[80%]">
                                          <h1 className="text-3xl font-bold text-slate-800 mb-2 leading-tight">Product Designer based in Vietnam.</h1>
                                          <p className="text-sm text-slate-500">I craft digital experiences that people love.</p>
                                      </div>
                                      <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-blue-50 rounded-full blur-2xl"></div>
                                  </div>

                                  {/* Map Widget */}
                                  <div className="col-span-2 row-span-2 bg-slate-900 rounded-3xl p-4 shadow-sm relative overflow-hidden group text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
                                      <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Hanoi&zoom=12&size=400x400&sensor=false')] opacity-30 bg-cover grayscale"></div>
                                      <div className="relative z-10 flex justify-between items-start">
                                          <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"><MapPin size={14}/></div>
                                          <div className="px-2 py-1 bg-green-500 rounded-full text-[10px] font-bold">Open for work</div>
                                      </div>
                                      <div className="relative z-10">
                                          <div className="text-xs opacity-70">Based in</div>
                                          <div className="font-bold">Hanoi, VN</div>
                                      </div>
                                  </div>

                                  {/* Social Links */}
                                  <div className="col-span-1 row-span-1 bg-[#1DA1F2] rounded-[1.5rem] flex items-center justify-center text-white shadow-sm hover:opacity-90 cursor-pointer">
                                      <Share2 size={20} />
                                  </div>
                                  <div className="col-span-1 row-span-1 bg-[#ea4c89] rounded-[1.5rem] flex items-center justify-center text-white shadow-sm hover:opacity-90 cursor-pointer">
                                      <Globe size={20} />
                                  </div>

                                  {/* Project 1 */}
                                  <div className="col-span-2 row-span-2 bg-white rounded-3xl p-1 shadow-sm group cursor-pointer">
                                      <div className="w-full h-full bg-slate-100 rounded-[1.2rem] overflow-hidden relative">
                                          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Project 1" />
                                          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">Mobile App</div>
                                      </div>
                                  </div>

                                  {/* Stack/Skills */}
                                  <div className="col-span-4 bg-white rounded-3xl p-5 shadow-sm">
                                      <div className="text-xs font-bold text-slate-400 uppercase mb-3">My Stack</div>
                                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                          {['Figma', 'React', 'Next.js', 'Tailwind', 'Framer'].map(tech => (
                                              <div key={tech} className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 border border-slate-100">
                                                  <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                                                  <span className="text-[8px] font-bold text-slate-600">{tech}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Project 2 */}
                                  <div className="col-span-2 row-span-2 bg-yellow-400 rounded-3xl p-4 shadow-sm flex flex-col justify-between text-slate-900 group hover:scale-[1.02] transition-transform cursor-pointer">
                                      <div className="text-xs font-bold opacity-70">Case Study</div>
                                      <div className="text-2xl font-black leading-none">Fintech<br/>Dashboard</div>
                                      <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center self-end"><ArrowRight size={14}/></div>
                                  </div>

                                  {/* Newsletter */}
                                  <div className="col-span-2 row-span-2 bg-white rounded-3xl p-4 shadow-sm flex flex-col justify-center gap-2">
                                      <div className="text-xs font-bold text-slate-500">Newsletter</div>
                                      <input type="email" placeholder="Email..." className="w-full bg-slate-50 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 ring-blue-500" />
                                      <button className="w-full bg-slate-900 text-white rounded-lg py-2 text-xs font-bold">Subscribe</button>
                                  </div>
                              </div>
                          </div>
                       </BrowserWindow>

                       {/* 3. Glassmorphism - SCROLLABLE WEB LANDING */}
                       <BrowserWindow title="Glassmorphism" url="glass.ui" color="bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
                          <div className="relative min-h-[1000px] p-6 overflow-hidden">
                              {/* Background elements */}
                              <div className="absolute top-20 left-10 w-64 h-64 bg-white/30 rounded-full blur-[100px] animate-pulse"></div>
                              <div className="absolute top-[400px] right-[-50px] w-80 h-80 bg-purple-400/30 rounded-full blur-[120px]"></div>

                              {/* Navbar */}
                              <nav className="relative z-10 flex justify-between items-center mb-16 bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-2xl shadow-lg sticky top-4">
                                  <div className="font-bold text-white tracking-wide text-lg flex items-center gap-2"><Hexagon size={20} fill="white" /> GLASS.UI</div>
                                  <div className="hidden md:flex gap-6 text-sm font-bold text-white/80">
                                      <span className="hover:text-white cursor-pointer">Features</span>
                                      <span className="hover:text-white cursor-pointer">Pricing</span>
                                      <span className="hover:text-white cursor-pointer">Download</span>
                                  </div>
                                  <button className="bg-white text-blue-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all shadow-md">Sign Up</button>
                              </nav>

                              {/* Hero Section */}
                              <div className="relative z-10 text-center mb-16">
                                  <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight">
                                      Crystal Clear <br/> Vision.
                                  </h1>
                                  <p className="text-white/90 text-sm md:text-base max-w-md mx-auto mb-8 font-medium">
                                      Experience the depth of interface design. Multi-layered transparency for modern web applications.
                                  </p>
                                  
                                  {/* Glass Card Hero */}
                                  <div className="bg-white/20 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl max-w-sm mx-auto text-left relative overflow-hidden group hover:bg-white/25 transition-all">
                                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                                      <div className="flex items-center gap-4 mb-4 relative z-10">
                                          <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center text-white shadow-inner"><CreditCard size={20}/></div>
                                          <div>
                                              <div className="text-xs text-white/70 uppercase font-bold">Balance</div>
                                              <div className="text-2xl font-bold text-white">$24,500.00</div>
                                          </div>
                                      </div>
                                      <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden relative z-10">
                                          <div className="h-full w-2/3 bg-white shadow-[0_0_10px_white]"></div>
                                      </div>
                                  </div>
                              </div>

                              {/* Features Grid */}
                              <div className="relative z-10 grid grid-cols-1 gap-4">
                                  {[1, 2, 3].map((i) => (
                                      <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group">
                                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                              {i === 1 ? <Activity size={18}/> : i === 2 ? <Globe size={18}/> : <Shield size={18}/>}
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="text-white font-bold text-sm">Glass Feature {i}</h4>
                                              <p className="text-white/60 text-xs">Seamless background blur integration.</p>
                                          </div>
                                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                              <ArrowRight size={14}/>
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              {/* Footer Area */}
                              <div className="mt-16 text-center text-white/50 text-xs font-bold uppercase tracking-widest relative z-10">
                                  Designed for the Future
                              </div>
                          </div>
                       </BrowserWindow>
                    </div>
                </div>

                {/* GROUP 2: FUTURE / FUTURISTIC */}
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       
                       {/* 4. Dark UI - SCROLLABLE ADMIN DASHBOARD */}
                       <BrowserWindow title="Dark Mode UI" url="admin.console" color="bg-[#0F172A]">
                          <div className="flex h-full min-h-[1000px] text-slate-300 font-sans">
                              {/* Sidebar */}
                              <div className="w-16 md:w-20 border-r border-slate-800 bg-[#0F172A] flex flex-col items-center py-6 gap-6 sticky top-0 h-screen max-h-[500px]">
                                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mb-4">G</div>
                                  <div className="p-2 bg-slate-800 rounded-lg text-white"><Layout size={18}/></div>
                                  <div className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"><User size={18}/></div>
                                  <div className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"><MessageCircle size={18}/></div>
                                  <div className="mt-auto p-2 hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"><Settings size={18}/></div>
                              </div>

                              {/* Main Content */}
                              <div className="flex-1 p-6 md:p-8 bg-[#0F172A]">
                                  {/* Topbar */}
                                  <div className="flex justify-between items-center mb-10">
                                      <div>
                                          <h2 className="text-white font-bold text-xl">Dashboard</h2>
                                          <p className="text-xs text-slate-500">Welcome back, Admin</p>
                                      </div>
                                      <div className="flex gap-3">
                                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><Bell size={14}/></div>
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                      </div>
                                  </div>

                                  {/* Stats Cards */}
                                  <div className="grid grid-cols-2 gap-4 mb-8">
                                      <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700/50">
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Revenue</span>
                                              <TrendingUp size={14} className="text-green-500"/>
                                          </div>
                                          <div className="text-2xl font-bold text-white">$128K</div>
                                          <div className="text-[10px] text-green-500 mt-1">+24% this month</div>
                                      </div>
                                      <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-700/50">
                                          <div className="flex justify-between items-start mb-2">
                                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Users</span>
                                              <User size={14} className="text-blue-500"/>
                                          </div>
                                          <div className="text-2xl font-bold text-white">4.2K</div>
                                          <div className="text-[10px] text-blue-500 mt-1">+12% new users</div>
                                      </div>
                                  </div>

                                  {/* Main Chart Placeholder */}
                                  <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 mb-8">
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="font-bold text-white text-sm">Analytics</h3>
                                          <select className="bg-slate-800 border-none text-xs text-white rounded px-2 py-1 outline-none">
                                              <option>Last 7 days</option>
                                          </select>
                                      </div>
                                      <div className="h-40 flex items-end justify-between gap-2">
                                          {[30, 50, 40, 70, 55, 80, 65, 85, 95, 75].map((h, i) => (
                                              <div key={i} className="flex-1 bg-slate-800 rounded-t-sm relative group hover:bg-slate-700 transition-colors">
                                                  <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm group-hover:bg-blue-500"></div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>

                                  {/* Recent Orders */}
                                  <div className="space-y-4">
                                      <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
                                      {[1, 2, 3, 4].map(i => (
                                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1E293B]/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                                      <Check size={14}/>
                                                  </div>
                                                  <div>
                                                      <div className="text-xs text-white font-bold">Payment from #User{i}</div>
                                                      <div className="text-[10px] text-slate-500">2 min ago</div>
                                                  </div>
                                              </div>
                                              <div className="text-xs font-bold text-white">$120.00</div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                       </BrowserWindow>

                       {/* 5. Neo-Brutalism - SCROLLABLE WEB LANDING */}
                       <BrowserWindow title="Neo-Brutalism" url="bold.web" color="bg-[#FFDE59]">
                          <div className="min-h-[1100px] border-l-4 border-r-4 border-black p-4 relative font-sans bg-[#FFDE59] text-black">
                              {/* Navbar */}
                              <div className="flex justify-between items-center border-4 border-black bg-white p-3 mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-4 z-10">
                                  <div className="font-black text-xl tracking-tighter">BOLD.</div>
                                  <div className="w-8 h-8 bg-black rounded-full"></div>
                              </div>

                              {/* Hero */}
                              <div className="mb-16 relative">
                                  <div className="absolute top-0 right-0 bg-[#FF5757] text-white text-[12px] font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 z-10 animate-pulse">
                                      NEW DROP!
                                  </div>
                                  <h1 className="text-6xl font-black uppercase leading-[0.85] mb-6 tracking-tighter">
                                      Make<br/>It<br/><span className="text-white text-stroke-black">Loud!</span>
                                  </h1>
                                  <p className="font-bold text-sm max-w-[200px] mb-6 border-l-4 border-black pl-4">
                                      We build websites that scream. No subtle gradients. No soft shadows. Just raw power.
                                  </p>
                                  <button className="bg-[#5CE1E6] border-2 border-black px-6 py-3 font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[6px] active:translate-y-[6px] active:shadow-none flex items-center gap-2">
                                      GET IT <ArrowRight strokeWidth={4} size={20} />
                                  </button>
                              </div>

                              {/* Marquee Banner */}
                              <div className="bg-black text-[#FFDE59] py-3 border-y-4 border-white overflow-hidden whitespace-nowrap mb-12 -mx-4 rotate-[-2deg]">
                                  <span className="text-xl font-mono font-black"> /// WEB DESIGN 2025 /// BRUTALISM /// NO COMPROMISE /// RAW /// </span>
                              </div>

                              {/* Features Stack */}
                              <div className="space-y-6 mb-12">
                                  <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group hover:bg-black hover:text-white transition-colors cursor-pointer">
                                      <div className="absolute -top-3 -left-3 bg-black text-white group-hover:bg-white group-hover:text-black px-2 py-1 text-[10px] font-bold border-2 border-transparent group-hover:border-black transition-colors">01</div>
                                      <h3 className="font-black text-2xl mb-2">HIGH CONTRAST</h3>
                                      <p className="text-xs font-bold leading-relaxed">Black and white. Neon highlights. Maximum visibility.</p>
                                  </div>
                                  
                                  <div className="bg-[#CB9DF0] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-center">
                                      <div className="w-12 h-12 bg-black rounded-none border-2 border-white flex items-center justify-center text-white font-black text-xl">?</div>
                                      <div className="flex-1">
                                          <div className="font-black text-lg">WHY SO SERIOUS?</div>
                                          <div className="text-xs font-bold">Have fun with the grid. Break the rules.</div>
                                      </div>
                                  </div>
                              </div>

                              {/* Footer */}
                              <div className="border-t-4 border-black pt-6 flex justify-between items-end">
                                  <div className="font-black text-4xl">END.</div>
                                  <div className="text-[10px] font-bold">© 2025</div>
                              </div>
                          </div>
                       </BrowserWindow>

                       {/* 6. AI & Surrealism - SCROLLABLE WEB LANDING */}
                       <BrowserWindow title="Generative UI" url="dream.ai" color="bg-[#050505]">
                          <div className="min-h-[1100px] relative overflow-hidden flex flex-col items-center pt-12 font-sans">
                              {/* Navbar */}
                              <nav className="relative z-10 w-full px-6 mb-16 flex justify-between items-center">
                                  <div className="text-white font-thin tracking-[0.2em] text-lg">AIVISION</div>
                                  <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur"></div>
                              </nav>

                              {/* Hero */}
                              <div className="relative z-10 text-center mb-16 px-6">
                                  {/* Glowing Orb */}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-40 animate-pulse -z-10"></div>
                                  
                                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-[9px] text-cyan-300 font-mono mb-6">
                                      <Sparkles size={10} /> GENERATIVE INTERFACE
                                  </div>
                                  <h1 className="text-5xl md:text-6xl font-thin text-white tracking-wide mb-6">
                                      Dream <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Beyond</span> <br/> Reality
                                  </h1>
                                  <p className="text-xs text-white/60 font-light tracking-wide max-w-xs mx-auto leading-relaxed mb-8">
                                      Where human imagination meets algorithmic precision. Create worlds that never existed.
                                  </p>
                                  
                                  {/* Prompt Bar */}
                                  <div className="w-full max-w-xs mx-auto h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center px-4 gap-3 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-cyan-500/30 transition-colors group cursor-text">
                                      <div className="p-1.5 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg">
                                          <Plus size={12} className="text-white" />
                                      </div>
                                      <span className="text-xs text-white/40 font-mono typing-effect">Imagine a digital oasis...</span>
                                  </div>
                              </div>

                              {/* Gallery Grid */}
                              <div className="w-full px-4 grid grid-cols-2 gap-4 relative z-10 mb-16">
                                  <div className="aspect-[3/4] rounded-2xl bg-slate-900 border border-white/10 relative overflow-hidden group">
                                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
                                      {/* Abstract Shape */}
                                      <div className="absolute top-10 left-[-20px] w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-60"></div>
                                      <div className="absolute bottom-4 left-4 z-20">
                                          <div className="text-white text-sm font-bold">Neon Zen</div>
                                          <div className="text-[8px] text-white/60 font-mono">v 4.2</div>
                                      </div>
                                  </div>
                                  <div className="space-y-4 pt-8">
                                      <div className="aspect-square rounded-2xl bg-slate-900 border border-white/10 relative overflow-hidden group">
                                           <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-black"></div>
                                           <div className="absolute center w-20 h-20 bg-pink-500 rounded-full blur-[40px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                      </div>
                                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur font-mono text-[8px] text-green-400">
                                          <div className="mb-1">{'>'} processing_tensor...</div>
                                          <div className="mb-1 pl-2 text-blue-400">optimizing_latent_space</div>
                                          <div className="pl-2 text-purple-400">render_complete [OK]</div>
                                      </div>
                                  </div>
                              </div>

                              {/* Footer */}
                              <div className="mt-auto w-full border-t border-white/10 py-8 text-center">
                                  <div className="text-[10px] text-white/30 uppercase tracking-[0.3em]">AI Powered Experience</div>
                              </div>
                          </div>
                       </BrowserWindow>
                    </div>
                </div>

                {/* GROUP 3: RETRO / NOSTALGIC */}
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       
                       {/* 7. Retro Web (Brutalist/Cyber) - SCROLLABLE WEB */}
                       <BrowserWindow title="Y2K Aesthetic" url="cyber.shop" color="bg-black" headerColor="bg-[#111] border-b border-[#333] text-green-500">
                          <div className="min-h-[1100px] bg-black p-4 font-mono text-[#00FF00] relative selection:bg-[#00FF00] selection:text-black">
                              {/* Scanlines Effect */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20"></div>
                              
                              {/* Header */}
                              <div className="border-b-2 border-[#00FF00] pb-4 mb-8 flex justify-between items-end">
                                  <div>
                                      <div className="text-xs opacity-70">EST. 1999</div>
                                      <h1 className="text-2xl md:text-3xl font-bold tracking-widest glitch-text">CYBER_STORE</h1>
                                  </div>
                                  <div className="text-xs animate-pulse">[ONLINE]</div>
                              </div>

                              {/* Marquee */}
                              <div className="border border-[#00FF00] p-2 mb-8 overflow-hidden">
                                  <div className="whitespace-nowrap animate-marquee text-xs font-bold">
                                      *** NEW ARRIVALS *** SYSTEM UPDATE V.2.0 *** FREE SHIPPING ON ORDERS OVER 50 CREDITS ***
                                  </div>
                              </div>

                              {/* Nav Grid */}
                              <div className="grid grid-cols-3 gap-0 border border-[#00FF00] mb-12">
                                  {['HOME', 'SHOP', 'FORUM'].map((item, i) => (
                                      <div key={item} className={`p-2 text-center text-xs font-bold hover:bg-[#00FF00] hover:text-black cursor-pointer transition-colors ${i !== 2 ? 'border-r border-[#00FF00]' : ''}`}>
                                          {item}
                                      </div>
                                  ))}
                              </div>

                              {/* Hero Product */}
                              <div className="flex flex-col md:flex-row gap-6 mb-12 border border-[#00FF00] p-4 relative">
                                  <div className="absolute top-0 left-0 bg-[#00FF00] text-black text-[10px] px-2 font-bold">FEATURED_ITEM</div>
                                  <div className="w-full md:w-1/2 aspect-square bg-[#111] flex items-center justify-center border border-[#00FF00] border-dashed">
                                      <div className="text-4xl">💾</div>
                                  </div>
                                  <div className="flex-1 flex flex-col justify-center">
                                      <h2 className="text-xl font-bold mb-2">DATA_DISK_500</h2>
                                      <p className="text-xs mb-4 opacity-80 leading-relaxed">High capacity storage for your digital soul. Compatible with all neural interfaces.</p>
                                      <div className="text-lg font-bold mb-4">50.00 CR</div>
                                      <button className="bg-[#00FF00] text-black font-bold py-2 hover:bg-white transition-colors text-sm uppercase">
                                          [ ADD TO CART ]
                                      </button>
                                  </div>
                              </div>

                              {/* Product Grid */}
                              <div className="grid grid-cols-2 gap-4 mb-12">
                                  {[1, 2].map(i => (
                                      <div key={i} className="border border-[#00FF00] p-2 hover:bg-[#001100] cursor-pointer">
                                          <div className="bg-[#111] h-24 mb-2 flex items-center justify-center border-b border-[#00FF00] border-dotted">
                                              <span>ITEM_0{i}</span>
                                          </div>
                                          <div className="flex justify-between text-xs">
                                              <span>MODULE_X</span>
                                              <span>25 CR</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              {/* Footer */}
                              <div className="text-center text-[10px] border-t border-[#00FF00] pt-4 opacity-70">
                                  <p>POWERED BY HTML 4.01</p>
                                  <p className="mt-1">VISITORS: 004829</p>
                              </div>
                          </div>
                       </BrowserWindow>

                       {/* 8. Editorial - SCROLLABLE WEB MAGAZINE */}
                       <BrowserWindow title="Editorial Design" url="vogue.lite" color="bg-[#F5F5F0]">
                          <div className="min-h-[1100px] p-8 flex flex-col font-serif text-[#1a1a1a]">
                              {/* Masthead */}
                              <div className="border-b-2 border-black pb-6 mb-8 text-center sticky top-0 bg-[#F5F5F0] z-10 pt-2">
                                  <div className="text-[10px] font-sans uppercase tracking-[0.3em] mb-3 text-slate-500">The Weekly Issue</div>
                                  <h1 className="text-5xl font-black italic tracking-tighter mb-2">VOGUELITE</h1>
                                  <div className="flex justify-between text-[9px] font-sans uppercase font-bold border-t border-black pt-2 mt-2">
                                      <span>Vol. 24</span>
                                      <span>October 2025</span>
                                      <span>$12.00</span>
                                  </div>
                              </div>
                              
                              {/* Hero Article */}
                              <div className="mb-12 group cursor-pointer">
                                  <div className="w-full h-64 bg-slate-300 mb-6 overflow-hidden grayscale contrast-125 relative">
                                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Editorial" />
                                      <div className="absolute bottom-0 left-0 bg-white px-3 py-1 text-[10px] font-sans font-bold uppercase">Cover Story</div>
                                  </div>
                                  <h2 className="text-3xl font-bold leading-[1.1] mb-3 group-hover:underline decoration-1 underline-offset-4">The Future of <br/>Digital Typography</h2>
                                  <div className="flex gap-4 text-[10px] font-sans uppercase tracking-wider border-b border-black/10 pb-3 mb-4 text-slate-500">
                                      <span>By Anne Wintour</span>
                                      <span>&bull;</span>
                                      <span>5 min read</span>
                                  </div>
                                  <p className="text-sm leading-relaxed text-justify indent-8 font-medium text-slate-800">
                                      <span className="text-4xl float-left mr-2 font-black leading-[0.8] mt-[-2px]">W</span>
                                      e are witnessing a renaissance in digital type. Serif fonts are making a huge comeback, bringing elegance and readability back to the web. It's not just about reading; it's about feeling the words.
                                  </p>
                              </div>

                              {/* Secondary Articles Grid */}
                              <div className="grid grid-cols-1 gap-8 pt-6 border-t-2 border-black">
                                  <div className="flex gap-4 items-start group cursor-pointer">
                                      <div className="w-20 h-24 bg-slate-200 flex-shrink-0 grayscale overflow-hidden">
                                          <img src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                          <div className="text-[9px] font-sans font-bold uppercase mb-1 bg-black text-white w-fit px-1.5 py-0.5">Fashion</div>
                                          <h3 className="text-lg font-bold leading-tight mb-2 group-hover:italic">Minimalism is dead?</h3>
                                          <p className="text-[10px] text-slate-500 font-sans line-clamp-2">Why designers are moving towards maximalism and chaos.</p>
                                      </div>
                                  </div>
                                  <div className="flex gap-4 items-start group cursor-pointer">
                                      <div className="w-20 h-24 bg-slate-200 flex-shrink-0 grayscale overflow-hidden">
                                          <img src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                          <div className="text-[9px] font-sans font-bold uppercase mb-1 bg-black text-white w-fit px-1.5 py-0.5">Tech</div>
                                          <h3 className="text-lg font-bold leading-tight mb-2 group-hover:italic">AI in Art.</h3>
                                          <p className="text-[10px] text-slate-500 font-sans line-clamp-2">Exploring the boundaries between human creativity and machine generation.</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                       </BrowserWindow>

                       {/* 9. Claymorphism - SCROLLABLE SAAS LANDING */}
                       <BrowserWindow title="Claymorphism" url="soft.io" color="bg-[#f0f4f8]">
                          <div className="min-h-[1100px] p-6 flex flex-col font-sans text-slate-600 bg-[#f0f4f8]">
                              {/* Navbar */}
                              <div className="flex justify-between items-center mb-16 bg-[#f0f4f8]/90 backdrop-blur py-2 sticky top-2 z-10 rounded-full px-4 shadow-[inset_4px_4px_8px_#ced2d6,inset_-4px_-4px_8px_#ffffff]">
                                  <div className="font-black text-blue-500 text-lg ml-2">Soft.io</div>
                                  <button className="bg-[#f0f4f8] px-4 py-2 rounded-full text-xs font-bold text-blue-500 shadow-[6px_6px_12px_#ced2d6,-6px_-6px_12px_#ffffff] hover:scale-95 transition-transform">Get Started</button>
                              </div>

                              {/* Hero */}
                              <div className="text-center mb-16">
                                  <h2 className="text-4xl font-black text-slate-700 mb-6 leading-tight">
                                      Manage tasks <br/> with <span className="text-blue-400">Softness.</span>
                                  </h2>
                                  <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8">
                                      A project management tool that feels good to use. Tactile, friendly, and powerful.
                                  </p>
                                  
                                  {/* Hero Graphic (Clay Card) */}
                                  <div className="bg-[#f0f4f8] rounded-[2rem] p-8 shadow-[12px_12px_24px_#ced2d6,-12px_-12px_24px_#ffffff] max-w-sm mx-auto relative overflow-hidden group">
                                      <div className="flex justify-between items-center mb-6">
                                          <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center text-blue-400 shadow-[inset_4px_4px_8px_#ced2d6,inset_-4px_-4px_8px_#ffffff]">
                                              <User size={20} />
                                          </div>
                                          <div className="text-xs font-bold text-slate-400 uppercase">Pro Plan</div>
                                      </div>
                                      <div className="space-y-4">
                                          <div className="h-4 w-3/4 bg-[#e6e9ef] rounded-full shadow-[inset_2px_2px_5px_#ced2d6,inset_-2px_-2px_5px_#ffffff]"></div>
                                          <div className="h-4 w-1/2 bg-[#e6e9ef] rounded-full shadow-[inset_2px_2px_5px_#ced2d6,inset_-2px_-2px_5px_#ffffff]"></div>
                                      </div>
                                      <button className="mt-8 w-full py-3 rounded-xl bg-blue-400 text-white font-bold shadow-[6px_6px_12px_#9ca0a3,-6px_-6px_12px_#ffffff] hover:scale-[1.02] transition-transform">
                                          Upgrade Now
                                      </button>
                                  </div>
                              </div>

                              {/* Features Grid */}
                              <div className="grid grid-cols-2 gap-6 mb-16">
                                  <div className="aspect-square rounded-[2rem] bg-[#f0f4f8] shadow-[10px_10px_20px_#ced2d6,-10px_-10px_20px_#ffffff] flex flex-col items-center justify-center p-4 hover:shadow-[inset_6px_6px_12px_#ced2d6,inset_-6px_-6px_12px_#ffffff] transition-all cursor-pointer group">
                                      <div className="w-14 h-14 rounded-full bg-pink-400 text-white flex items-center justify-center mb-4 shadow-[5px_5px_10px_#b8b9be] group-hover:scale-110 transition-transform">
                                          <Send size={24} />
                                      </div>
                                      <span className="text-sm font-bold text-slate-500">Fast</span>
                                  </div>
                                  <div className="aspect-square rounded-[2rem] bg-[#f0f4f8] shadow-[10px_10px_20px_#ced2d6,-10px_-10px_20px_#ffffff] flex flex-col items-center justify-center p-4 hover:shadow-[inset_6px_6px_12px_#ced2d6,inset_-6px_-6px_12px_#ffffff] transition-all cursor-pointer group">
                                      <div className="w-14 h-14 rounded-full bg-teal-400 text-white flex items-center justify-center mb-4 shadow-[5px_5px_10px_#b8b9be] group-hover:scale-110 transition-transform">
                                          <Plus size={28} />
                                      </div>
                                      <span className="text-sm font-bold text-slate-500">Add</span>
                                  </div>
                              </div>

                              {/* Footer */}
                              <div className="mt-auto text-center text-slate-400 text-xs font-bold">
                                  © 2025 Soft Inc.
                              </div>
                          </div>
                       </BrowserWindow>
                    </div>
                </div>
            </div>
         </div>
    </section>
  );
};

// Helper Component for Browser Window
const BrowserWindow = ({ title, url, color, children, height, headerColor }: { title?: string, url: string, color?: string, children?: React.ReactNode, height?: string, headerColor?: string }) => {
    return (
        <div className={`group rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:scale-[1.01] transition-transform duration-500 ${height || 'h-[350px]'} flex flex-col`}>
            {/* Header */}
            <div className={`${headerColor || 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'} p-3 border-b flex items-center gap-3 z-20 relative flex-shrink-0`}>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-right">
                    <span className="text-[10px] opacity-50 font-mono">{url}</span>
                </div>
            </div>
            {/* Content Body (Scrollable) */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar relative ${color || ''}`}>
                {children}
            </div>
            {/* Footer Label (Optional) */}
            {title && (
                <div className="bg-white dark:bg-slate-900 p-3 border-t border-slate-100 dark:border-slate-800 text-center relative z-20 flex-shrink-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
                </div>
            )}
        </div>
    )
}

export default DesignStylesShowcase;
