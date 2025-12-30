
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  Globe, Search, ExternalLink, Edit, Save, Loader2, XCircle, 
  Smartphone, Monitor, Share2, AlertTriangle, CheckCircle2, Code, Settings,
  Repeat, MapPin, FileJson, Image as ImageIcon, UploadCloud, Check, Plus, Trash2, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../../components/Toast';

// --- TYPES ---
interface SeoData {
  id: number;
  page_path: string;
  title: string;
  description: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical_url?: string;
  schema_json?: string;
  focus_keyword?: string;
  secondary_keywords?: string; // New: Comma separated
  is_cornerstone?: boolean; // New: Cornerstone content
}

interface Redirection {
  id: number;
  source_url: string;
  target_url: string;
  code: 301 | 302 | 410;
  active: boolean;
}

// Defined Routes in App (Hardcoded for Sync)
const APP_ROUTES = [
    '/',
    '/about',
    '/services',
    '/services/website-design',
    '/services/email-workspace',
    '/services/branding',
    '/blog',
    '/contact'
];

// --- SCHEMA TEMPLATES ---
const SCHEMA_TEMPLATES: Record<string, any> = {
    'Article': {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Tiêu đề bài viết",
        "image": "URL_ANH_DAI_DIEN",
        "author": {
            "@type": "Person",
            "name": "Tên Tác Giả"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Grifow Creative",
            "logo": {
                "@type": "ImageObject",
                "url": "URL_LOGO"
            }
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-01"
    },
    'LocalBusiness (GEO)': {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Tên Doanh Nghiệp",
        "image": "URL_LOGO_HOAC_ANH_CTY",
        "telephone": "0912345678",
        "email": "contact@example.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Số nhà, Tên đường",
            "addressLocality": "Quận/Huyện",
            "addressRegion": "Tỉnh/Thành phố",
            "postalCode": "100000",
            "addressCountry": "VN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "21.028511",
            "longitude": "105.804817"
        },
        "url": "https://grifow.com",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "17:30"
            }
        ],
        "priceRange": "$$"
    },
    'Organization': {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Grifow Creative",
        "url": "https://grifow.com",
        "logo": "URL_LOGO",
        "sameAs": [
            "https://www.facebook.com/grifow",
            "https://www.linkedin.com/company/grifow"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "0912345678",
            "contactType": "customer service"
        }
    },
    'BreadcrumbList': {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://grifow.com"
        },{
            "@type": "ListItem",
            "position": 2,
            "name": "Dịch vụ",
            "item": "https://grifow.com/services"
        }]
    },
    'Product': {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Tên Sản Phẩm",
        "image": "URL_ANH_SAN_PHAM",
        "description": "Mô tả ngắn về sản phẩm.",
        "brand": {
            "@type": "Brand",
            "name": "Grifow"
        },
        "offers": {
            "@type": "Offer",
            "url": "https://grifow.com/san-pham",
            "priceCurrency": "VND",
            "price": "1000000",
            "availability": "https://schema.org/InStock"
        }
    },
    'FAQPage': {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Câu hỏi 1?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Câu trả lời cho câu hỏi 1."
            }
        }, {
            "@type": "Question",
            "name": "Câu hỏi 2?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Câu trả lời cho câu hỏi 2."
            }
        }]
    }
};

const SeoManager: React.FC = () => {
  // Main State
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'redirections' | 'localseo' | 'robots'>('dashboard');
  const [pages, setPages] = useState<SeoData[]>([]);
  const [redirections, setRedirections] = useState<Redirection[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Editor State
  const [editingPage, setEditingPage] = useState<SeoData | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'general' | 'social' | 'advanced' | 'schema'>('general');
  
  // Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Analysis State
  const [siteHealth, setSiteHealth] = useState(0);
  
  // Memoized current analysis for editor
  const { editorScore, editorAnalysis } = useMemo(() => {
      if (!editingPage) return { editorScore: 0, editorAnalysis: [] };
      const { score, issues } = analyzeSeo(editingPage);
      return { editorScore: score, editorAnalysis: issues };
  }, [editingPage]);

  // Local SEO State (Mocked for now, usually stored in settings table)
  const [localSeoData, setLocalSeoData] = useState({
      name: 'Grifow Creative',
      type: 'Organization',
      address: '',
      phone: '',
      email: '',
      openingHours: 'Mo-Fr 08:00-17:30',
      logo: ''
  });

  // Robots.txt State
  const [robotsContent, setRobotsContent] = useState(`User-agent: *\nDisallow: /admin/\nAllow: /\n\nSitemap: https://grifow.com/sitemap.xml`);

  useEffect(() => {
    fetchData();
  }, []);

  // --- DATA FETCHING & SYNC ---

  const fetchData = async () => {
    setLoading(true);
    await syncRoutes(); // Ensure all routes exist
    
    // Fetch Pages
    const { data: pageData } = await supabase.from('seo_config').select('*').order('page_path');
    if (pageData) {
        // Map & Sanitize
        const mappedPages: SeoData[] = pageData.map((item: any) => ({
            ...item,
            og_title: item.og_title || item.title || '',
            og_description: item.og_description || item.description || '',
            og_image: item.og_image || '',
            noindex: item.noindex || false,
            nofollow: item.nofollow || false,
            canonical_url: item.canonical_url || '',
            schema_json: item.schema_json || '',
            focus_keyword: item.focus_keyword || '',
            secondary_keywords: item.secondary_keywords || '',
            is_cornerstone: item.is_cornerstone || false
        }));
        setPages(mappedPages);
        calculateOverallHealth(mappedPages);
    }

    // Fetch Redirections (Mocking table check if not exists)
    const { data: redirectData, error } = await supabase.from('redirections').select('*');
    if (!error && redirectData) {
        setRedirections(redirectData);
    } else {
        // Fallback or init empty if table doesn't exist
        setRedirections([]); 
    }

    setLoading(false);
  };

  const syncRoutes = async () => {
      // Check existing routes in DB
      const { data: existingData } = await supabase.from('seo_config').select('page_path');
      const existingPaths = existingData?.map((p: any) => p.page_path) || [];

      // Find missing routes
      const missingRoutes = APP_ROUTES.filter(route => !existingPaths.includes(route));

      if (missingRoutes.length > 0) {
          const newEntries = missingRoutes.map(route => ({
              page_path: route,
              title: route === '/' ? 'Trang chủ' : route.replace('/', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: ''
          }));
          await supabase.from('seo_config').insert(newEntries);
          console.log('Synced routes:', missingRoutes);
      }
  };

  // --- SCORING LOGIC (PURE FUNCTION OUTSIDE COMPONENT SCOPE) ---
  // Moved logic to standalone function below component to prevent re-creation
  const calculateOverallHealth = (allPages: SeoData[]) => {
      if (allPages.length === 0) {
          setSiteHealth(0);
          return;
      }
      const totalScore = allPages.reduce((sum, page) => sum + analyzeSeo(page).score, 0);
      setSiteHealth(Math.round(totalScore / allPages.length));
  };

  // --- HANDLERS ---

  const openEditor = (page: SeoData) => {
      setEditingPage(page);
      setActiveEditorTab('general');
  };

  const handleSavePage = async () => {
      if (!editingPage) return;
      const { error } = await supabase.from('seo_config').update({
          title: editingPage.title,
          description: editingPage.description,
          og_title: editingPage.og_title,
          og_description: editingPage.og_description,
          og_image: editingPage.og_image,
          noindex: editingPage.noindex,
          nofollow: editingPage.nofollow,
          canonical_url: editingPage.canonical_url,
          schema_json: editingPage.schema_json,
          focus_keyword: editingPage.focus_keyword,
          secondary_keywords: editingPage.secondary_keywords,
          is_cornerstone: editingPage.is_cornerstone
      }).eq('id', editingPage.id);
      
      if (error) {
          setToast({ message: 'Lỗi: ' + error.message, type: 'error' });
      } else {
          setToast({ message: 'Cập nhật SEO thành công!', type: 'success' });
          setEditingPage(null);
          fetchData(); // Refresh list & score
      }
  };

  // Media Library Logic (Replicated specifically for SEO Manager to be self-contained)
  const openMediaModal = () => {
      setIsMediaModalOpen(true);
      fetchMediaFiles();
  };

  const fetchMediaFiles = async () => {
      setMediaLoading(true);
      const { data } = await supabase.storage.from('media').list('', { limit: 50, sortBy: { column: 'created_at', order: 'desc' }});
      if (data) {
          const files = data
            .filter(f => f.metadata?.mimetype?.includes('image'))
            .map(f => {
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(f.name);
                return { ...f, publicUrl };
            });
          setMediaFiles(files);
      }
      setMediaLoading(false);
  };

  const handleSelectImage = (url: string) => {
      if (editingPage) {
          setEditingPage({ ...editingPage, og_image: url });
      } else {
          setLocalSeoData({ ...localSeoData, logo: url });
      }
      setIsMediaModalOpen(false);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setMediaLoading(true);
      const file = e.target.files[0];
      const fileName = `seo-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
          handleSelectImage(publicUrl);
      } else {
          setToast({ message: 'Upload thất bại', type: 'error' });
      }
      setMediaLoading(false);
  };

  // --- TEMPLATE HANDLER ---
  const applySchemaTemplate = (templateName: string) => {
      if (!editingPage) return;
      const template = SCHEMA_TEMPLATES[templateName];
      if (template) {
          setEditingPage({
              ...editingPage,
              schema_json: JSON.stringify(template, null, 2)
          });
      }
  };

  // --- RENDER HELPERS ---
  const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-500';
      if (score >= 50) return 'text-orange-500';
      return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark dark:text-white flex items-center gap-2">
             SEO Suite <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest shadow-sm">Pro</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Bộ công cụ SEO toàn diện: On-page, Technical, Local & Redirections.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchData} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Sync & Refresh">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800">
          {[
              { id: 'dashboard', label: 'Tổng quan & Pages', icon: Globe },
              { id: 'redirections', label: 'Chuyển hướng (301)', icon: Repeat },
              { id: 'localseo', label: 'Local SEO', icon: MapPin },
              { id: 'robots', label: 'Robots.txt', icon: FileJson },
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as any)}
                className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeMainTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                  <tab.icon size={16} /> {tab.label}
              </button>
          ))}
      </div>

      {/* --- TAB CONTENT: DASHBOARD --- */}
      {activeMainTab === 'dashboard' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* OVERALL STATUS GAUGE (REAL DATA) */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
               <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-6">Sức khỏe Website (Real-time)</h3>
               <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                      {/* SVG Gauge */}
                      <svg className="w-40 h-40 transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                          <circle 
                            cx="80" cy="80" r="70" 
                            stroke="currentColor" 
                            strokeWidth="10" 
                            fill="transparent" 
                            strokeDasharray={440} 
                            strokeDashoffset={440 - (440 * siteHealth) / 100} 
                            className={`transition-all duration-1000 ease-out ${getScoreColor(siteHealth)}`} 
                            strokeLinecap="round"
                          />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className={`text-4xl font-black ${getScoreColor(siteHealth)}`}>
                              {siteHealth >= 80 ? 'Good' : siteHealth >= 50 ? 'Fair' : 'Poor'}
                          </span>
                          <span className="block text-xs text-slate-400 mt-1">{siteHealth}/100</span>
                      </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 text-left">
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                       <span className="block text-2xl font-bold text-dark dark:text-white">{pages.length}</span>
                       <span className="text-xs text-slate-500">Trang đã index</span>
                   </div>
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                       <span className="block text-2xl font-bold text-green-500">{pages.filter(p => analyzeSeo(p).score >= 80).length}</span>
                       <span className="text-xs text-slate-500">Trang đạt chuẩn</span>
                   </div>
               </div>
            </div>
         </div>

         {/* PAGES LIST */}
         <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col">
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                  <h3 className="font-bold text-lg text-dark dark:text-white">Danh sách trang (Sitemap)</h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{pages.length} Pages</div>
               </div>
               
               <div className="flex-1 overflow-y-auto max-h-[600px] p-0">
                   {loading ? (
                       <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-accent" size={32}/></div>
                   ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {pages.map(page => {
                            const { score } = analyzeSeo(page); // Use pure function here
                            return (
                                <div key={page.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start justify-between group">
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Globe size={14} className="text-slate-400"/>
                                            <h4 className="font-bold text-dark dark:text-white text-sm">{page.page_path}</h4>
                                            <a href={`/#${page.page_path}`} target="_blank" className="text-slate-300 hover:text-blue-500"><ExternalLink size={12} /></a>
                                            {page.is_cornerstone && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 rounded border border-yellow-200">Cornerstone</span>}
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600 truncate max-w-lg mb-1 hover:underline cursor-pointer" onClick={() => openEditor(page)}>{page.title || '(Chưa có tiêu đề)'}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-lg">{page.description || '(Chưa có mô tả)'}</div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {/* Score Badge */}
                                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${score >= 80 ? 'border-green-500 text-green-500' : score >= 50 ? 'border-orange-500 text-orange-500' : 'border-red-500 text-red-500'}`}>
                                            {score}
                                        </div>
                                        <button onClick={() => openEditor(page)} className="p-2 text-slate-400 hover:text-white hover:bg-accent rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                                            <Edit size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                   )}
               </div>
            </div>
         </div>
      </div>
      )}

      {/* --- TAB CONTENT: REDIRECTIONS (Mock) --- */}
      {activeMainTab === 'redirections' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Quản lý Chuyển hướng (Redirections)</h3>
                  <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Thêm mới</button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500">
                  <Repeat size={40} className="mx-auto mb-3 opacity-50"/>
                  <p>Chưa có quy tắc chuyển hướng nào.</p>
                  <p className="text-xs mt-2">Sử dụng tính năng này để sửa lỗi 404 hoặc chuyển hướng trang cũ sang trang mới.</p>
              </div>
          </div>
      )}

      {/* --- TAB CONTENT: LOCAL SEO (Mock) --- */}
      {activeMainTab === 'localseo' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin size={20}/> Local SEO (Organization Schema)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold mb-2">Tên Doanh nghiệp</label>
                          <input className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.name} onChange={e => setLocalSeoData({...localSeoData, name: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Loại hình</label>
                          <select className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.type} onChange={e => setLocalSeoData({...localSeoData, type: e.target.value})}>
                              <option value="Organization">Organization</option>
                              <option value="LocalBusiness">LocalBusiness</option>
                              <option value="Corporation">Corporation</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Logo URL</label>
                          <div className="flex gap-2">
                              <input className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.logo} onChange={e => setLocalSeoData({...localSeoData, logo: e.target.value})} />
                              <button onClick={() => { setEditingPage(null); openMediaModal(); }} className="px-3 bg-slate-100 dark:bg-slate-700 rounded-lg"><ImageIcon size={18}/></button>
                          </div>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold mb-2">Địa chỉ</label>
                          <input className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.address} onChange={e => setLocalSeoData({...localSeoData, address: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold mb-2">Hotline</label>
                              <input className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.phone} onChange={e => setLocalSeoData({...localSeoData, phone: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-sm font-bold mb-2">Email</label>
                              <input className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.email} onChange={e => setLocalSeoData({...localSeoData, email: e.target.value})} />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Giờ mở cửa</label>
                          <input className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700" value={localSeoData.openingHours} onChange={e => setLocalSeoData({...localSeoData, openingHours: e.target.value})} placeholder="Mo-Fr 09:00-17:00" />
                      </div>
                  </div>
              </div>
              <div className="mt-6 flex justify-end">
                  <button className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover">Lưu cấu hình Local</button>
              </div>
          </div>
      )}

      {/* --- TAB CONTENT: ROBOTS --- */}
      {activeMainTab === 'robots' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileJson size={20}/> Robots.txt Editor</h3>
              <p className="text-sm text-slate-500 mb-4">Chỉnh sửa file robots.txt ảo của website. Cẩn thận, cấu hình sai có thể chặn Google index toàn bộ web.</p>
              <textarea 
                  className="w-full h-64 bg-slate-900 text-green-400 font-mono p-4 rounded-xl text-sm focus:outline-none"
                  value={robotsContent}
                  onChange={(e) => setRobotsContent(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                  <button className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover">Lưu Robots.txt</button>
              </div>
          </div>
      )}

      {/* --- PROFESSIONAL SEO EDITOR MODAL (POPUP) --- */}
      <AnimatePresence>
      {editingPage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                  {/* Modal Header */}
                  <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-950">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                              <Search size={20} />
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-dark dark:text-white">SEO Manager</h3>
                              <p className="text-xs text-slate-500 font-mono">{editingPage.page_path}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <button onClick={() => setEditingPage(null)} className="px-4 py-2 text-slate-500 hover:text-dark dark:hover:text-white font-bold text-sm">Hủy</button>
                          <button onClick={handleSavePage} className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accentHover shadow-lg shadow-accent/20 flex items-center gap-2">
                              <Save size={18} /> Lưu cấu hình
                          </button>
                      </div>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 flex overflow-hidden">
                      {/* Left: Sidebar Tabs */}
                      <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 space-y-1">
                          <button onClick={() => setActiveEditorTab('general')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-all ${activeEditorTab === 'general' ? 'bg-white dark:bg-slate-800 text-accent shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                              <Search size={16}/> Tổng quan (SERP)
                          </button>
                          <button onClick={() => setActiveEditorTab('social')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-all ${activeEditorTab === 'social' ? 'bg-white dark:bg-slate-800 text-accent shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                              <Share2 size={16}/> Mạng xã hội
                          </button>
                          <button onClick={() => setActiveEditorTab('advanced')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-all ${activeEditorTab === 'advanced' ? 'bg-white dark:bg-slate-800 text-accent shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                              <Settings size={16}/> Nâng cao (RankMath)
                          </button>
                          <button onClick={() => setActiveEditorTab('schema')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-bold transition-all ${activeEditorTab === 'schema' ? 'bg-white dark:bg-slate-800 text-accent shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                              <Code size={16}/> Schema Markup
                          </button>

                          {/* Live Score Widget */}
                          <div className="mt-8 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-bold text-slate-500 uppercase">Page Score</span>
                                  <span className={`text-xl font-black ${getScoreColor(editorScore)}`}>{editorScore}/100</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all duration-500 ${editorScore >= 80 ? 'bg-green-500' : editorScore >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{width: `${editorScore}%`}}></div>
                              </div>
                              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                  {editorAnalysis.length === 0 && <div className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={12}/> Tối ưu tốt!</div>}
                                  {editorAnalysis.map((issue, idx) => (
                                      <div key={idx} className="text-[10px] text-red-500 flex items-start gap-1">
                                          <AlertTriangle size={10} className="mt-0.5 flex-shrink-0"/> {issue}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* Right: Content Forms */}
                      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
                          
                          {/* TAB 1: GENERAL (SERP) */}
                          {activeEditorTab === 'general' && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                  {/* Focus Keyword Section */}
                                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                      <div className="flex items-center gap-2 mb-4">
                                          <Search className="text-accent" size={20}/>
                                          <h4 className="font-bold text-lg">Từ khóa (RankMath)</h4>
                                      </div>
                                      <div className="space-y-4">
                                          <div>
                                              <label className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                                  Focus Keyword (Từ khóa chính) <span className="text-red-500">*</span>
                                              </label>
                                              <input 
                                                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none font-bold"
                                                  value={editingPage.focus_keyword || ''}
                                                  onChange={e => setEditingPage({...editingPage, focus_keyword: e.target.value})}
                                                  placeholder="VD: Thiết kế website"
                                              />
                                          </div>
                                          <div>
                                              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Secondary Keywords (Phụ)</label>
                                              <input 
                                                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none text-sm"
                                                  value={editingPage.secondary_keywords || ''}
                                                  onChange={e => setEditingPage({...editingPage, secondary_keywords: e.target.value})}
                                                  placeholder="VD: làm web giá rẻ, công ty thiết kế web..."
                                              />
                                              <p className="text-xs text-slate-500 mt-1">Phân cách bằng dấu phẩy.</p>
                                          </div>
                                          <div className="flex items-center gap-2 mt-2">
                                              <input 
                                                type="checkbox" 
                                                checked={editingPage.is_cornerstone} 
                                                onChange={e => setEditingPage({...editingPage, is_cornerstone: e.target.checked})}
                                                className="w-4 h-4 text-accent rounded focus:ring-accent"
                                              />
                                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nội dung trụ cột (Cornerstone Content)</span>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="space-y-4">
                                      <div>
                                          <label className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                              Meta Title
                                              <span className={`text-xs ${editingPage.title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{editingPage.title.length}/60</span>
                                          </label>
                                          <input 
                                              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none"
                                              value={editingPage.title}
                                              onChange={e => setEditingPage({...editingPage, title: e.target.value})}
                                          />
                                      </div>
                                      <div>
                                          <label className="flex justify-between text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                                              Meta Description
                                              <span className={`text-xs ${editingPage.description.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{editingPage.description.length}/160</span>
                                          </label>
                                          <textarea 
                                              rows={3}
                                              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none resize-none"
                                              value={editingPage.description}
                                              onChange={e => setEditingPage({...editingPage, description: e.target.value})}
                                          />
                                      </div>
                                  </div>

                                  {/* Google Preview */}
                                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Globe size={14}/> Google Search Preview</h4>
                                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                                          <div className="flex items-center gap-2 mb-1">
                                              <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px]">G</div>
                                              <div className="text-xs text-slate-700">Grifow Creative</div>
                                              <div className="text-xs text-slate-400">grifow.com › {editingPage.page_path.replace(/^\//, '')}</div>
                                          </div>
                                          <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate">
                                              {editingPage.title || 'Tiêu đề trang chưa có...'}
                                          </h3>
                                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                              {editingPage.description || 'Vui lòng nhập mô tả meta description để hiển thị ở đây...'}
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* TAB 2: SOCIAL */}
                          {activeEditorTab === 'social' && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">OG Image URL</label>
                                              <div className="flex gap-2">
                                                  <input 
                                                      className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none"
                                                      value={editingPage.og_image || ''}
                                                      placeholder="https://..."
                                                      onChange={e => setEditingPage({...editingPage, og_image: e.target.value})}
                                                  />
                                                  <button onClick={openMediaModal} className="px-3 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 transition-colors">
                                                      <ImageIcon size={18}/>
                                                  </button>
                                              </div>
                                              <div className="mt-2">
                                                  <input 
                                                    type="file" 
                                                    id="upload-og" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={handleUploadImage}
                                                  />
                                                  <label htmlFor="upload-og" className="text-xs text-accent font-bold cursor-pointer flex items-center gap-1 hover:underline">
                                                      <UploadCloud size={12}/> Tải ảnh mới lên
                                                  </label>
                                              </div>
                                          </div>
                                          <div>
                                              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">OG Title (Facebook)</label>
                                              <input 
                                                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none"
                                                  value={editingPage.og_title || ''}
                                                  placeholder="Mặc định lấy Meta Title"
                                                  onChange={e => setEditingPage({...editingPage, og_title: e.target.value})}
                                              />
                                          </div>
                                          <div>
                                              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">OG Description</label>
                                              <textarea 
                                                  rows={3}
                                                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none resize-none"
                                                  value={editingPage.og_description || ''}
                                                  placeholder="Mặc định lấy Meta Description"
                                                  onChange={e => setEditingPage({...editingPage, og_description: e.target.value})}
                                              />
                                          </div>
                                      </div>

                                      {/* Facebook Preview */}
                                      <div>
                                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Share2 size={14}/> Facebook Preview</h4>
                                          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-w-sm">
                                              <div className="bg-slate-100 aspect-[1.91/1] flex items-center justify-center overflow-hidden">
                                                  {editingPage.og_image ? (
                                                      <img src={editingPage.og_image} className="w-full h-full object-cover" />
                                                  ) : (
                                                      <span className="text-slate-400 text-xs font-bold uppercase">1200 x 630px</span>
                                                  )}
                                              </div>
                                              <div className="p-3 bg-[#f0f2f5] border-t border-slate-200">
                                                  <div className="text-[10px] text-slate-500 uppercase mb-1">GRIFOW.COM</div>
                                                  <div className="font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{editingPage.og_title || editingPage.title || 'Chưa có tiêu đề'}</div>
                                                  <div className="text-xs text-slate-600 line-clamp-1">{editingPage.og_description || editingPage.description || 'Chưa có mô tả'}</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* TAB 3: ADVANCED */}
                          {activeEditorTab === 'advanced' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 mb-6 flex items-start gap-3">
                                      <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={20}/>
                                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                          Các thiết lập này ảnh hưởng trực tiếp đến việc Google thu thập dữ liệu (Crawl) trang web của bạn. Chỉ thay đổi nếu bạn hiểu rõ.
                                      </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                          <label className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-accent transition-colors">
                                              <div>
                                                  <div className="font-bold text-slate-900 dark:text-white">No Index</div>
                                                  <div className="text-xs text-slate-500">Chặn Google index trang này</div>
                                              </div>
                                              <input type="checkbox" checked={editingPage.noindex} onChange={e => setEditingPage({...editingPage, noindex: e.target.checked})} className="w-5 h-5 accent-accent" />
                                          </label>
                                          <label className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-accent transition-colors">
                                              <div>
                                                  <div className="font-bold text-slate-900 dark:text-white">No Follow</div>
                                                  <div className="text-xs text-slate-500">Không theo các liên kết trên trang</div>
                                              </div>
                                              <input type="checkbox" checked={editingPage.nofollow} onChange={e => setEditingPage({...editingPage, nofollow: e.target.checked})} className="w-5 h-5 accent-accent" />
                                          </label>
                                      </div>
                                      <div>
                                          <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Canonical URL</label>
                                          <input 
                                              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-accent outline-none"
                                              value={editingPage.canonical_url || ''}
                                              placeholder="https://grifow.com/..."
                                              onChange={e => setEditingPage({...editingPage, canonical_url: e.target.value})}
                                          />
                                          <p className="text-xs text-slate-500 mt-2">Dùng khi trang này bị trùng lặp nội dung với một trang khác.</p>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* TAB 4: SCHEMA */}
                          {activeEditorTab === 'schema' && (
                              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                  <div className="flex justify-between items-center">
                                      <h4 className="font-bold text-slate-700 dark:text-slate-300">JSON-LD Schema</h4>
                                      <div className="flex gap-2">
                                          {/* Template Selector */}
                                          <select 
                                            className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 outline-none focus:border-accent dark:text-white"
                                            onChange={(e) => applySchemaTemplate(e.target.value)}
                                            defaultValue=""
                                          >
                                              <option value="" disabled>Chọn mẫu Schema...</option>
                                              {Object.keys(SCHEMA_TEMPLATES).map(key => (
                                                  <option key={key} value={key}>{key}</option>
                                              ))}
                                          </select>
                                          <a href="https://validator.schema.org/" target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1">Check <ExternalLink size={10}/></a>
                                      </div>
                                  </div>
                                  <textarea 
                                      className="flex-1 w-full p-4 rounded-xl bg-slate-900 text-green-400 font-mono text-xs focus:outline-none resize-none"
                                      value={editingPage.schema_json || ''}
                                      onChange={e => setEditingPage({...editingPage, schema_json: e.target.value})}
                                      placeholder={`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  ...\n}\n</script>`}
                                  ></textarea>
                                  <p className="text-xs text-slate-500">Copy & Paste mã JSON-LD vào đây. Mã này sẽ được chèn vào thẻ &lt;head&gt; của trang.</p>
                              </div>
                          )}

                      </div>
                  </div>
              </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* --- MEDIA SELECTION MODAL --- */}
      {isMediaModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                      <h3 className="font-bold text-lg text-dark dark:text-white">Chọn ảnh OG Image</h3>
                      <button onClick={() => setIsMediaModalOpen(false)} className="text-slate-500 hover:text-dark dark:hover:text-white"><XCircle/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-900/50">
                      {mediaLoading ? (
                          <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>
                      ) : mediaFiles.length === 0 ? (
                          <div className="flex h-full items-center justify-center text-slate-500">Thư viện trống.</div>
                      ) : (
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {mediaFiles.map((file, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => handleSelectImage(file.publicUrl)}
                                    className="aspect-square bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-accent hover:shadow-lg transition-all relative group overflow-hidden"
                                  >
                                      <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <Check className="text-white bg-accent rounded-full p-1" size={24} />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

// --- PURE HELPER FUNCTIONS ---
const analyzeSeo = (data: SeoData) => {
    let score = 0;
    const issues: string[] = [];
    const keyword = data.focus_keyword?.toLowerCase() || '';

    // 1. Basic Metadata (40 pts)
    if (data.title) {
        if (data.title.length >= 30 && data.title.length <= 60) score += 20;
        else if (data.title.length > 60) { score += 10; issues.push("Tiêu đề quá dài (>60 ký tự)."); }
        else { score += 10; issues.push("Tiêu đề quá ngắn (<30 ký tự)."); }
    } else issues.push("Thiếu thẻ Title.");

    if (data.description) {
        if (data.description.length >= 120 && data.description.length <= 160) score += 20;
        else if (data.description.length > 160) { score += 10; issues.push("Mô tả quá dài (>160 ký tự)."); }
        else { score += 5; issues.push("Mô tả quá ngắn (<120 ký tự)."); }
    } else issues.push("Thiếu thẻ Meta Description.");

    // 2. Keyword Focus (20 pts)
    if (keyword) {
        score += 5;
        if (data.title?.toLowerCase().includes(keyword)) score += 10;
        else issues.push("Tiêu đề chưa chứa từ khóa chính.");
        
        if (data.description?.toLowerCase().includes(keyword)) score += 5;
        else issues.push("Mô tả chưa chứa từ khóa chính.");
    } else issues.push("Chưa xác định từ khóa chính.");

    // 3. Social & Technical (40 pts)
    if (data.og_image) score += 20; else issues.push("Thiếu ảnh đại diện mạng xã hội (OG Image).");
    if (!data.noindex) score += 10; // Indexed is good usually
    if (data.canonical_url) score += 5;
    if (data.is_cornerstone) score += 5;

    return { score: Math.min(100, score), issues };
};

export default SeoManager;
