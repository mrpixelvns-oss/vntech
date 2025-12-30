
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface PageRendererProps {
    slug: string;
    defaultComponent: React.ReactNode;
}

const PageRenderer: React.FC<PageRendererProps> = ({ slug, defaultComponent }) => {
    const [useDynamic, setUseDynamic] = useState<boolean | null>(null);

    useEffect(() => {
        const checkDynamicPage = async () => {
            const { data } = await supabase
                .from('dynamic_pages')
                .select('id')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            setUseDynamic(!!data);
        };

        checkDynamicPage();
    }, [slug]);

    if (useDynamic === null) {
        return <div className="min-h-screen bg-white dark:bg-slate-950"></div>; // Silent loading
    }

    if (useDynamic) {
        return <DynamicPageBySlug slug={slug} />;
    }

    return <>{defaultComponent}</>;
};

export const DynamicPageBySlug: React.FC<{ slug: string }> = ({ slug }) => {
    const [page, setPage] = useState<any>(null);
    
    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('dynamic_pages').select('*').eq('slug', slug).single();
            setPage(data);
        };
        fetch();
    }, [slug]);

    if (!page) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950"><Loader2 className="animate-spin text-accent"/></div>;

    return (
        <div className="dynamic-content-wrapper">
            <style>{page.css_content || ''}</style>
            <div dangerouslySetInnerHTML={{ __html: page.html_content || '' }} />
        </div>
    );
}

export default PageRenderer;
