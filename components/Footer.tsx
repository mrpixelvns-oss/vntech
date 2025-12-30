
import React from 'react';
import { Facebook, Mail, Phone, MapPin, Globe, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { PageRoutes } from '../types';

// Custom Icons
const ZaloIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40.2 13.6C40.2 13.6 35.8 5.6 24 5.6C12.2 5.6 4.6 14.2 4.6 23.4C4.6 30.6 9.4 37 17.6 39.4C18 39.6 18.2 40 18 40.4L16.8 44.2C16.6 44.8 17.2 45.4 17.8 45.2L24.2 42.6C24.4 42.6 24.6 42.6 24.8 42.6C36.6 42.6 44.2 34 44.2 24.8C44.2 20.4 42.8 16.4 40.2 13.6Z" fill="currentColor"/>
    <path d="M26.4 29.6H17.6C16.8 29.6 16.2 29 16.2 28.2V27.4C16.2 27 16.4 26.6 16.8 26.4L22.2 22.2H17.4C16.6 22.2 16 21.6 16 20.8V19.8C16 19 16.6 18.4 17.4 18.4H25.8C26.6 18.4 27.2 19 27.2 19.8V20.6C27.2 21 27 21.4 26.6 21.6L21.4 25.8H26.4C27.2 25.8 27.8 26.4 27.8 27.2V28.2C27.8 29 27.2 29.6 26.4 29.6Z" fill="white"/>
  </svg>
);

const PinterestIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143 0.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
  </svg>
);

const MediumIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-dark border-t border-slate-800 pt-20 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
             <div className="flex items-center mb-6">
               {settings.site_logo ? (
                  <img src={settings.site_logo} alt="Logo" className="h-12 w-auto object-contain brightness-0 invert" />
               ) : (
                  <>
                    <div className="w-8 h-8 bg-white text-dark rounded flex items-center justify-center font-black text-lg mr-2">
                      G
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-lg leading-none text-white tracking-tight">
                          {settings.site_title || 'Grifow'}
                      </span>
                      <span className="font-sans text-[8px] font-bold text-accent tracking-[0.2em] uppercase">
                          {settings.site_slogan || 'Creative'}
                      </span>
                    </div>
                  </>
               )}
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              {settings.site_description || 'Design Your Brand, Code Your Future. Kiến tạo website đẳng cấp và xây dựng hệ sinh thái số toàn diện cho doanh nghiệp.'}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1877F2] transition-all duration-300" title="Facebook"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0068FF] transition-all duration-300" title="Zalo"><ZaloIcon size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300" title="Youtube"><Youtube size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E60023] transition-all duration-300" title="Pinterest"><PinterestIcon size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black transition-all duration-300" title="Medium"><MediumIcon size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-lg mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li><Link to={PageRoutes.HOME} className="text-slate-400 hover:text-accent transition-colors">Trang chủ</Link></li>
              <li><Link to={PageRoutes.ABOUT} className="text-slate-400 hover:text-accent transition-colors">Về chúng tôi</Link></li>
              <li><Link to={PageRoutes.SERVICES} className="text-slate-400 hover:text-accent transition-colors">Dịch vụ</Link></li>
              <li><Link to={PageRoutes.BLOG} className="text-slate-400 hover:text-accent transition-colors">Blog</Link></li>
              <li><Link to={PageRoutes.CONTACT} className="text-slate-400 hover:text-accent transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-white text-lg mb-6">Hệ sinh thái</h4>
            <ul className="space-y-3">
              <li><Link to={PageRoutes.WEBSITE_DESIGN} className="text-slate-400 hover:text-accent transition-colors">Thiết kế Website</Link></li>
              <li><Link to={PageRoutes.EMAIL_SERVICE} className="text-slate-400 hover:text-accent transition-colors">Email Doanh nghiệp</Link></li>
              <li><Link to={PageRoutes.DIGITAL_MARKETING} className="text-slate-400 hover:text-accent transition-colors">Digital Marketing</Link></li>
              <li><Link to={PageRoutes.BRANDING} className="text-slate-400 hover:text-accent transition-colors">Branding & Identity</Link></li>
              <li><Link to={PageRoutes.TECH_SOLUTIONS} className="text-slate-400 hover:text-accent transition-colors">Giải pháp Công nghệ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-white text-lg mb-6">Thông tin liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-accent mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-slate-400">{settings.site_address || 'Hà Nội, Việt Nam'}</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-accent mr-3 flex-shrink-0" size={18} />
                <a href={`mailto:${settings.site_email}`} className="text-slate-400 hover:text-white transition-colors">{settings.site_email || 'support@grifow.com'}</a>
              </li>
              <li className="flex items-center">
                <Phone className="text-accent mr-3 flex-shrink-0" size={18} />
                <a href={`tel:${settings.site_phone}`} className="text-slate-400 hover:text-white transition-colors">{settings.site_phone || '09xx...'}</a>
              </li>
              <li className="flex items-center">
                <Globe className="text-accent mr-3 flex-shrink-0" size={18} />
                <a href="#" className="text-slate-400 hover:text-white transition-colors">https://grifow.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {settings.site_title || 'Grifow Creative'}. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-slate-500 text-sm font-semibold">
            <span>CÔNG TY TNHH {settings.site_title?.toUpperCase() || 'GRIFOW CREATIVE'}</span>
            {settings.site_tax_code && (
                <>
                    <span className="hidden md:inline">•</span>
                    <span>MST: {settings.site_tax_code}</span>
                </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
