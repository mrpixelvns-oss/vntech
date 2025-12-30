import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Search, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabaseClient';
import { BlogPost, Category } from '../types';

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // Fetch Posts
      const { data: postData } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published') // Chỉ lấy bài đã xuất bản
        .order('created_at', { ascending: false });
      
      if (postData) setPosts(postData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Header & Featured Post */}
      <section className="relative pt-32 pb-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <SectionHeader 
             subtitle="Grifow Insights" 
             title="Kiến thức & Góc nhìn" 
             description="Cập nhật những xu hướng công nghệ, thiết kế và marketing mới nhất từ đội ngũ chuyên gia của Grifow."
          />

          {/* Featured Post Card */}
          {featuredPost && activeCategory === "All" && !searchTerm && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="mt-12 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 group"
            >
               <Link to={`/blog/${featuredPost.id}`} className="relative h-64 lg:h-auto overflow-hidden block">
                  <img 
                    src={featuredPost.image || "https://images.unsplash.com/photo-1499750310159-52f0f83ad713?auto=format&fit=crop&q=80&w=800"} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-6 left-6 bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full z-10">
                     Featured
                  </div>
               </Link>
               <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                     <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(featuredPost.created_at).toLocaleDateString('vi-VN')}</span>
                     <span className="flex items-center gap-1"><Clock size={14} /> 5 min read</span>
                  </div>
                  <Link to={`/blog/${featuredPost.id}`}>
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-4 hover:text-accent transition-colors cursor-pointer">
                       {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed line-clamp-3">
                     {featuredPost.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-end">
                     <Link to={`/blog/${featuredPost.id}`} className="flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
                        Đọc bài viết <ArrowRight size={18} />
                     </Link>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. Main Content: Sidebar & Grid */}
      <section className="py-20">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
               
               {/* Left: Filter & Search */}
               <div className="lg:w-1/4 space-y-8">
                  {/* Search */}
                  <div className="relative">
                     <input 
                        type="text" 
                        placeholder="Tìm kiếm bài viết..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-accent dark:text-white transition-all"
                     />
                     <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Categories */}
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Chuyên mục</h3>
                     <div className="flex flex-col gap-2">
                        <button 
                              onClick={() => setActiveCategory("All")}
                              className={`text-left px-4 py-3 rounded-lg flex justify-between items-center transition-all ${
                                 activeCategory === "All"
                                 ? 'bg-accent text-white font-bold' 
                                 : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                           >
                              Tất cả
                              {activeCategory === "All" && <ChevronRight size={16} />}
                           </button>
                        {categories.map(cat => (
                           <button 
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.name)}
                              className={`text-left px-4 py-3 rounded-lg flex justify-between items-center transition-all ${
                                 activeCategory === cat.name 
                                 ? 'bg-accent text-white font-bold' 
                                 : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                           >
                              {cat.name}
                              {activeCategory === cat.name && <ChevronRight size={16} />}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Newsletter */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl">
                     <h3 className="font-bold text-lg mb-2">Đăng ký nhận tin</h3>
                     <p className="text-sm text-slate-400 mb-4">Nhận bài viết mới nhất qua email hàng tuần. Không spam.</p>
                     <div className="space-y-3">
                        <input 
                           type="email" 
                           placeholder="Email của bạn" 
                           className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-accent"
                        />
                        <button className="w-full py-2 bg-accent hover:bg-white hover:text-accent text-white font-bold rounded-lg text-sm transition-colors">
                           Đăng ký ngay
                        </button>
                     </div>
                  </div>
               </div>

               {/* Right: Posts Grid */}
               <div className="lg:w-3/4">
                  {regularPosts.length === 0 ? (
                      <div className="text-center py-20 text-slate-500">
                          Không tìm thấy bài viết nào.
                      </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {regularPosts.map((post) => (
                            <motion.div 
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group flex flex-col h-full"
                            >
                            <Link to={`/blog/${post.id}`} className="h-48 overflow-hidden relative block">
                                <img 
                                    src={post.image || "https://images.unsplash.com/photo-1499750310159-52f0f83ad713?auto=format&fit=crop&q=80&w=600"} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> 5 min read</span>
                                </div>
                                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center">
                                    <Link to={`/blog/${post.id}`} className="text-slate-400 hover:text-accent transition-colors">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                            </motion.div>
                        ))}
                    </div>
                  )}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Blog;