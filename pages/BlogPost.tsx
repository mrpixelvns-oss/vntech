import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Tag, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { BlogPost as BlogPostType } from '../types';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      if (!id) return;

      // Fetch current post
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setPost(data);
        // Increment views (optional - fire and forget)
        supabase.rpc('increment_view', { row_id: id }); 

        // Fetch related posts (same category, exclude current)
        const { data: related } = await supabase
            .from('posts')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(3);
        
        if (related) setRelatedPosts(related);
      }
      setLoading(false);
    };

    fetchPost();
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      );
  }

  if (!post) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Không tìm thấy bài viết</h2>
           <Link to="/blog" className="text-accent hover:underline">Quay lại Blog</Link>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      {/* 1. Progress Bar (Optional - conceptual) */}
      <motion.div className="fixed top-0 left-0 h-1 bg-accent z-50 origin-left" style={{ scaleX: 1 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }} />

      {/* 2. Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <img 
          src={post.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"} 
          alt={post.title} 
          className="w-full h-full object-cover absolute inset-0 z-0" 
        />
        
        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-end pb-16">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="max-w-4xl mx-auto w-full text-white"
           >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-6">
                <Link to="/blog" className="hover:text-accent transition-colors">Blog</Link>
                <ChevronRight size={14} />
                <span className="bg-accent px-2 py-0.5 rounded text-white text-xs uppercase tracking-wider font-bold">{post.category}</span>
              </div>

              <h1 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl leading-tight mb-8">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
                 <div className="flex items-center gap-2">
                    <Calendar size={16} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                 </div>
                 <div className="w-px h-4 bg-white/30 hidden sm:block"></div>
                 <div className="flex items-center gap-2">
                    <Clock size={16} /> 5 min read
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* 3. Article Content */}
      <div className="container mx-auto px-4 py-16">
         <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left Sidebar (Share) */}
            <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit w-12 items-center">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest writing-vertical-rl mb-4">Share</span>
               <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
                  <Facebook size={18} />
               </button>
               <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors">
                  <Twitter size={18} />
               </button>
               <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors">
                  <Linkedin size={18} />
               </button>
               <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors">
                  <Share2 size={18} />
               </button>
            </div>

            {/* Main Content */}
            <motion.article 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="flex-1 max-w-3xl"
            >
               {/* Content Body - Simplified classes, relying on tailwind.config */}
               <div 
                  className="prose prose-lg dark:prose-invert max-w-none text-left"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
               />

               {/* Tags */}
               <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap gap-2">
                     <span className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-full">
                        <Tag size={12} /> {post.category}
                     </span>
                  </div>
               </div>
            </motion.article>

            {/* Right Sidebar (Related or ToC) */}
            <div className="hidden xl:block w-72 flex-shrink-0">
               <div className="sticky top-32">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest border-l-2 border-accent pl-3">Bài viết liên quan</h4>
                  <div className="space-y-6">
                     {relatedPosts.map(related => (
                        <Link to={`/blog/${related.id}`} key={related.id} className="group block">
                           <div className="aspect-video rounded-lg bg-slate-200 overflow-hidden mb-3">
                              <img src={related.image || "https://images.unsplash.com/photo-1499750310159-52f0f83ad713?auto=format&fit=crop&q=80&w=400"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="thumb" />
                           </div>
                           <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-accent transition-colors line-clamp-2">
                              {related.title}
                           </h5>
                           <div className="text-xs text-slate-400 mt-1">{new Date(related.created_at).toLocaleDateString('vi-VN')}</div>
                        </Link>
                     ))}
                     {relatedPosts.length === 0 && <p className="text-sm text-slate-500">Chưa có bài viết liên quan.</p>}
                  </div>
                  
                  {/* Banner Ad / CTA */}
                  <div className="mt-12 bg-dark dark:bg-slate-800 p-6 rounded-2xl text-center">
                     <h4 className="text-white font-bold text-lg mb-2">Cần Website Mới?</h4>
                     <p className="text-slate-400 text-sm mb-4">Nhận tư vấn miễn phí từ chuyên gia Grifow.</p>
                     <Link to="/contact" className="inline-block w-full py-3 bg-accent text-white font-bold rounded-lg text-sm hover:bg-white hover:text-accent transition-colors">
                        Liên hệ ngay
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 4. Bottom Navigation */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-12">
         <div className="container mx-auto px-4 flex justify-between">
            <Link to="/blog" className="flex items-center gap-2 text-slate-500 font-bold hover:text-accent transition-colors">
               <ArrowLeft size={20} /> Quay lại Blog
            </Link>
         </div>
      </div>

    </div>
  );
};

export default BlogPost;