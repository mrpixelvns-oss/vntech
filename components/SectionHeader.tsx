import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  lightText?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ subtitle, title, description, align = 'center', lightText = false }) => {
  const textColor = lightText ? 'text-white' : 'text-dark dark:text-white';
  const subColor = lightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400';

  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-3 justify-center md:justify-start"
      >
         {align !== 'center' && <span className="w-8 h-[2px] bg-accent inline-block"></span>}
         <span className={`text-accent font-bold tracking-widest uppercase text-xs ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </span>
         {align === 'center' && <span className="w-8 h-[2px] bg-accent inline-block"></span>}
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`font-display font-bold text-3xl md:text-5xl ${textColor} mb-6 tracking-tight leading-tight`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${subColor} text-lg max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeader;