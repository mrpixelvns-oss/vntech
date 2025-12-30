
import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details: string[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface BlogPost {
  id: number;
  created_at: string;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  author: string;
  status: string;
  image: string;
  views: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  children?: MenuItem[];
  type?: 'link' | 'button'; // button for CTA like "Contact"
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  html_content?: string;
  css_content?: string;
  gjs_assets?: any; // JSON string or Object
  gjs_components?: any; // JSON string or Object
  gjs_styles?: any; // JSON string or Object
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export enum PageRoutes {
  HOME = '/',
  ABOUT = '/about',
  SERVICES = '/services',
  WEBSITE_DESIGN = '/services/website-design',
  EMAIL_SERVICE = '/services/email-workspace',
  BRANDING = '/services/branding',
  DIGITAL_MARKETING = '/services/digital-marketing',
  TECH_SOLUTIONS = '/services/tech-solutions',
  BLOG = '/blog',
  BLOG_DETAIL = '/blog/:id',
  CONTACT = '/contact'
}
