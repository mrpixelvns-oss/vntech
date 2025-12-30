
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PageRoutes, MenuItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import ConsultationModal from './ConsultationModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  
  const [expandedLinks, setExpandedLinks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use Dynamic Menu from Settings or Fallback to Default
  const defaultNavLinks: MenuItem[] = [
    { id: 'home', name: 'Trang chủ', path: PageRoutes.HOME },
    { id: 'about', name: 'Về chúng tôi', path: PageRoutes.ABOUT },
    { 
      id: 'services',
      name: 'Dịch vụ', 
      path: PageRoutes.SERVICES,
      children: [
        { id: 'web', name: 'Thiết kế Website', path: PageRoutes.WEBSITE_DESIGN },
        { id: 'email', name: 'Email Doanh nghiệp', path: PageRoutes.EMAIL_SERVICE },
        { id: 'brand', name: 'Nhận diện Thương hiệu', path: PageRoutes.BRANDING },
        { id: 'marketing', name: 'Digital Marketing', path: PageRoutes.DIGITAL_MARKETING },
        { id: 'tech', name: 'Giải pháp Công nghệ', path: PageRoutes.TECH_SOLUTIONS },
      ]
    },
    { id: 'blog', name: 'Blog', path: PageRoutes.BLOG },
    { id: 'contact', name: 'Liên hệ', path: PageRoutes.CONTACT },
  ];

  const navLinks = (settings.main_menu && settings.main_menu.length > 0) ? settings.main_menu : defaultNavLinks;

  const isActive = (path: string) => location.pathname === path;
  
  const toggleSubMenu = (id: string) => {
    setExpandedLinks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={PageRoutes.HOME} className="flex-shrink-0 flex items-center group">
              <div className="flex items-center">
                 {settings.site_logo ? (
                    <img 
                      src={settings.site_logo} 
                      alt={settings.site_title || "Grifow Creative"} 
                      className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
                    />
                 ) : (
                    <>
                      <div className="w-10 h-10 bg-dark dark:bg-white text-white dark:text-dark rounded-lg flex items-center justify-center font-black text-xl mr-2 group-hover:bg-accent transition-colors duration-300">
                        G
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-xl leading-none text-dark dark:text-white tracking-tight">
                            {settings.site_title || 'Grifow'}
                        </span>
                        <span className="font-sans text-[10px] font-bold text-accent tracking-[0.2em] uppercase">
                            {settings.site_slogan || 'Creative'}
                        </span>
                      </div>
                    </>
                 )}
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex space-x-1 items-center bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                {navLinks.map((link) => (
                  <div key={link.id} className="relative group">
                    <Link
                      to={link.path}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${
                        isActive(link.path) || (link.children && link.children.some(c => isActive(c.path)))
                          ? 'bg-white dark:bg-slate-700 text-dark dark:text-white shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-dark dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {link.name}
                      {link.children && link.children.length > 0 && <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />}
                    </Link>

                    {/* Desktop Dropdown */}
                    {link.children && link.children.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100 z-50">
                         <div className="py-2">
                           {link.children.map(child => (
                             <Link
                               key={child.id}
                               to={child.path}
                               className={`block px-5 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                 isActive(child.path) ? 'text-accent bg-slate-50 dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300'
                               }`}
                             >
                               {child.name}
                             </Link>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

               <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-dark dark:bg-white text-white dark:text-dark font-bold text-sm hover:bg-accent dark:hover:bg-accent dark:hover:text-white transition-colors shadow-lg shadow-slate-200 dark:shadow-none"
              >
                Nhận tư vấn
              </button>
            </div>

            {/* Mobile Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="text-dark dark:text-white hover:text-accent focus:outline-none"
              >
                 {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-dark dark:text-white hover:text-accent focus:outline-none p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 py-6 space-y-4 flex flex-col overflow-y-auto max-h-[30rem]">
            {navLinks.map((link) => (
              <div key={link.id}>
                <div className="flex items-center justify-between">
                  <Link
                    to={link.path}
                    onClick={() => (!link.children || link.children.length === 0) && setIsOpen(false)}
                    className={`block text-lg font-bold flex-grow ${
                      isActive(link.path)
                        ? 'text-accent'
                        : 'text-dark dark:text-white hover:text-accent'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {link.children && link.children.length > 0 && (
                    <button 
                      onClick={() => toggleSubMenu(link.id)}
                      className="p-2 text-slate-500 dark:text-slate-400"
                    >
                      <ChevronDown size={20} className={`transition-transform duration-300 ${expandedLinks[link.id] ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                
                {/* Mobile Submenu */}
                {link.children && link.children.length > 0 && (
                  <div className={`pl-4 mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 ${expandedLinks[link.id] ? 'max-h-40 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                    {link.children.map(child => (
                       <Link
                         key={child.id}
                         to={child.path}
                         onClick={() => setIsOpen(false)}
                         className={`block text-base font-medium py-1 ${
                           isActive(child.path) ? 'text-accent' : 'text-slate-600 dark:text-slate-400'
                         }`}
                       >
                         {child.name}
                       </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
               onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
               className="block w-full text-center py-3 bg-dark dark:bg-accent text-white font-bold rounded-lg mt-4"
            >
              Nhận tư vấn ngay
            </button>
          </div>
        </div>
      </nav>

      {/* Register Consultation Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;
