
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const DynamicPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPage = async () => {
            const { data, error } = await supabase
                .from('dynamic_pages')
                .select('*')
                .eq('slug', slug)
                .eq('published', true) // Only show published
                .single();

            if (error || !data) {
                setError(true);
            } else {
                setPage(data);
                // Basic Title Update without Helmet
                document.title = data.title;
            }
            setLoading(false);
        };

        fetchPage();
        
        // Cleanup title on unmount if needed, though usually not critical for simple SPAs
        return () => {
            // document.title = 'Grifow Creative'; 
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">404</h1>
                <p className="text-slate-500">Trang không tồn tại hoặc đã bị gỡ bỏ.</p>
            </div>
        );
    }

    return (
        <>
            <style>
                {page.css_content || ''}
            </style>
            <div dangerouslySetInnerHTML={{ __html: page.html_content || '' }} />
        </>
    );
};

export default DynamicPage;
