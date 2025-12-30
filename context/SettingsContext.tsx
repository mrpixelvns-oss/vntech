
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MenuItem } from '../types';

interface SettingsState {
  site_title?: string;
  site_description?: string;
  site_logo?: string;
  site_favicon?: string;
  site_email?: string;
  site_phone?: string;
  site_address?: string;
  site_tax_code?: string;
  site_slogan?: string;
  active_loader?: string;
  show_loader_text?: boolean; // Add type definition
  // Menu
  main_menu?: MenuItem[];
  // EmailJS Config
  emailjs_service_id?: string;
  emailjs_template_id?: string;
  emailjs_public_key?: string;
  [key: string]: any;
}

interface SettingsContextType {
  settings: SettingsState;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    // 1. Khởi tạo từ LocalStorage nếu có (để tránh flicker khi F5)
    if (typeof window !== 'undefined') {
        try {
            const cached = localStorage.getItem('site_settings_cache');
            return cached ? JSON.parse(cached) : {};
        } catch (e) {
            return {};
        }
    }
    return {};
  });
  
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      
      if (data) {
        // Convert array [{key: 'a', value: 'b'}] to object {a: 'b'}
        const settingsObj = data.reduce((acc: any, curr: any) => {
            if (curr.key === 'main_menu') {
                try {
                    acc[curr.key] = JSON.parse(curr.value);
                } catch (e) {
                    acc[curr.key] = [];
                }
            } else if (curr.value === 'true') {
                acc[curr.key] = true;
            } else if (curr.value === 'false') {
                acc[curr.key] = false;
            } else {
                acc[curr.key] = curr.value;
            }
            return acc;
        }, {});
        
        setSettings(settingsObj);
        // 2. Lưu vào LocalStorage để lần sau load nhanh hơn
        localStorage.setItem('site_settings_cache', JSON.stringify(settingsObj));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Effect to update Document Head (Favicon & Title) based on settings
  useEffect(() => {
    if (settings.site_favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.type = 'image/x-icon';
      link.href = settings.site_favicon;
    }

    if (settings.site_title) {
        document.title = settings.site_title;
    }
  }, [settings.site_favicon, settings.site_title]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
