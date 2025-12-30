
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import WebsiteDesign from './pages/WebsiteDesign';
import EmailService from './pages/EmailService';
import Branding from './pages/Branding';
import DigitalMarketing from './pages/DigitalMarketing';
import TechSolutions from './pages/TechSolutions';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import BlogManager from './pages/admin/BlogManager';
import ContactManager from './pages/admin/ContactManager';
import Settings from './pages/admin/Settings';
import MediaLibrary from './pages/admin/MediaLibrary';
import SeoManager from './pages/admin/SeoManager';
import NavigationManager from './pages/admin/NavigationManager';
import ContentManager from './pages/admin/ContentManager'; // New CMS

import { PageRoutes } from './types';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Separate component to consume Contexts
const AppContent: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      
      <Routes>
        {/* PUBLIC ROUTES (With Navbar & Footer) */}
        <Route element={<PublicLayout />}>
          <Route path={PageRoutes.HOME} element={<Home />} />
          <Route path={PageRoutes.ABOUT} element={<About />} />
          <Route path={PageRoutes.SERVICES} element={<Services />} />
          <Route path={PageRoutes.WEBSITE_DESIGN} element={<WebsiteDesign />} />
          <Route path={PageRoutes.EMAIL_SERVICE} element={<EmailService />} />
          <Route path={PageRoutes.BRANDING} element={<Branding />} />
          <Route path={PageRoutes.DIGITAL_MARKETING} element={<DigitalMarketing />} />
          <Route path={PageRoutes.TECH_SOLUTIONS} element={<TechSolutions />} />
          <Route path={PageRoutes.BLOG} element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path={PageRoutes.CONTACT} element={<Contact />} />
        </Route>

        {/* ADMIN ROUTES (Protected, No Public Navbar) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="contacts" element={<ContactManager />} />
          <Route path="seo" element={<SeoManager />} />
          <Route path="navigation" element={<NavigationManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="pages" element={<ContentManager />} /> {/* Replaced PageList with ContentManager */}
        </Route>
        
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
