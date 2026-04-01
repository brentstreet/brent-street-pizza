import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Tag, CakeSlice } from 'lucide-react';
import { useSectionContent } from '../context/ContentContext';

const ICON_MAP: Record<string, any> = {
  Pizza: <Pizza className="w-12 h-12 stroke-[1.5]" />,
  Tag: <Tag className="w-12 h-12 stroke-[1.5]" />,
  CakeSlice: <CakeSlice className="w-12 h-12 stroke-[1.5]" />,
};

const QuickLinks: React.FC = () => {
  const { sectionContent, loading } = useSectionContent('home');

  if (loading || !sectionContent.quick_links) return null;

  return (
    <section className="bg-[#FDF8F2] py-8 relative w-full border-b border-[#E8D8C8]">
      {/* Light texture overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-paper.png')` }} 
      />
      
      <div className="container-custom relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-0">
          
          {(sectionContent.quick_links || []).map((link: any, idx: number) => (
            <Link 
              key={link.title}
              to={link.path} 
              className={`flex flex-col items-center justify-center py-4 px-2 hover:bg-black/5 transition-colors ${idx < 2 ? 'border-r border-[#E8D8C8]' : ''}`}
            >
              <div className="mb-2 flex items-center justify-center pb-2 border-b-2 border-transparent w-full relative" style={{ color: link.color }}>
                {ICON_MAP[link.icon] || link.icon}
                {link.icon === 'Tag' && (
                  <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 rotate-12">
                    <span className="text-red-600 font-900 text-[16px] leading-none tracking-tighter">$$</span>
                  </div>
                )}
              </div>
              <h3 className="font-bebas text-black text-[22px] md:text-[28px] leading-none mb-1 tracking-wide">
                {link.title}
              </h3>
              <p className="font-barlow text-black/70 text-[11px] md:text-[13px] font-600 uppercase tracking-wide text-center">
                {link.subtitle}
              </p>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
