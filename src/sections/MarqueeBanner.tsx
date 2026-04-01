import React from 'react';
import { useSectionContent } from '../context/ContentContext';

const MarqueeBanner: React.FC = () => {
  const { sectionContent, loading } = useSectionContent('marquee');
  const items = sectionContent.items || ['FRESH PIZZA', '•', 'MADE TO ORDER', '•', 'QUALITY INGREDIENTS', '•', '$5 FLAT DELIVERY', '•', 'ORDER ONLINE OR CALL NOW'];
  const doubled = [...items, ...items];

  if (loading) return <div className="bg-[#1A1A1A] h-[54px]" />;

  return (
    <section className="bg-[#1A1A1A] w-full overflow-hidden py-0 relative" style={{ height: '54px' }}>
      <div className="flex w-[200%] animate-marquee h-full items-center">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-barlow text-[13px] font-700 uppercase tracking-[0.2em] text-white whitespace-nowrap px-6"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
