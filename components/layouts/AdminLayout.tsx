
import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { 
  LayoutDashboard, FileText, Settings, LogOut, MessageSquare, Home, 
  Image, Globe, ChevronRight, Menu, X, Compass, LayoutTemplate
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      ]
    },
    {
      title: "Nội dung & Sản phẩm",
      items: [
        { name: 'Quản lý Trang', path: '/admin/pages', icon: LayoutTemplate },
        { name: 'Bài viết (Blog)', path: '/admin/blog', icon: FileText },
        { name: 'Thư viện Media', path: '/admin/media', icon: Image },
      ]
    },
    {
      title: "Kinh doanh & SEO",
      items: [
        { name: 'Yêu cầu liên hệ', path: '/admin/contacts', icon: MessageSquare },
        { name: 'Quản lý SEO', path: '/admin/seo', icon: Globe },
      ]
    },
    {
      title: "Hệ thống",
      items: [
        { name: 'Quản lý Menu', path: '/admin/navigation', icon: Compass },
        { name: 'Cấu hình chung', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-200">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between z-30">
          <div className="flex items-center gap-2">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-white">
                 <Menu size={24} />
             </button>
             <span className="font-bold text-lg dark:text-white">Grifow Admin</span>
          </div>
          {settings.site_logo && <img src={settings.site_logo} alt="Logo" className="h-8 w-auto dark:brightness-0 dark:invert" />}
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {settings.site_logo ? (
                <div className="w-full">
                    <img 
                        src={settings.site_logo} 
                        alt="Logo" 
                        className="h-10 w-auto object-contain mb-1 dark:brightness-0 dark:invert" 
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block pl-1">Professional Admin</span>
                </div>
                ) : (
                <>
                    <div className="w-8 h-8 bg-dark dark:bg-white text-white dark:text-dark rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0">
                        G
                    </div>
                    <div className="flex flex-col">
                    <span className="font-display font-bold text-lg leading-none text-dark dark:text-white">Grifow Admin</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Professional</span>
                    </div>
                </>
                )}
            </div>
            {/* Close button for mobile */}
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                <X size={24} />
            </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{group.title}</h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)} // Close menu on click (mobile)
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                        location.pathname === item.path
                          ? 'bg-accent text-white shadow-lg shadow-accent/30'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {location.pathname === item.path && <ChevronRight size={14} />}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900">
            <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-accent transition-colors text-xs font-bold uppercase tracking-wider">
                <Home size={16} /> Xem Website
            </Link>
            <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-xs font-bold uppercase tracking-wider"
            >
                <LogOut size={16} /> Đăng xuất
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden pt-20 md:pt-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
