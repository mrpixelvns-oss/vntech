
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const usePageContent = (pageSlug: string) => {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('section_key, content')
          .eq('page_slug', pageSlug);

        if (error) {
          console.error('Error fetching page content:', error);
          return;
        }

        if (data) {
          // Convert array [{section_key: 'hero', content: {...}}] 
          // to object { hero: {...}, about: {...} }
          const contentMap = data.reduce((acc: any, curr) => {
            acc[curr.section_key] = curr.content;
            return acc;
          }, {});
          setContent(contentMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageSlug]);

  // Helper to get content with fallback
  const getSection = (sectionKey: string, defaultValues: any) => {
    return { ...defaultValues, ...(content[sectionKey] || {}) };
  };

  return { content, loading, getSection };
};
