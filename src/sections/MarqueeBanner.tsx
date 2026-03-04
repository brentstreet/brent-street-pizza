import React from 'react';

const ITEMS = ['HOT PIZZA', '★', 'WOOD-FIRED', '·', 'AUTHENTIC ITALIAN', '★', 'FRESHLY MADE', '·', 'ORDER NOW', '★'];

const MarqueeBanner: React.FC = () => {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section className="bg-[#C0392B] w-full overflow-hidden py-0 relative" style={{ height: '54px' }}>
      {/* Marquee row */}
      <div className="flex w-[200%] animate-marquee h-full items-center">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-barlow text-[13px] font-700 uppercase tracking-[0.2em] text-white/90 whitespace-nowrap px-6"
          >
            {item}
          </span>
        ))}
        {doubled.map((item, i) => (
          <span
            key={`b-${i}`}
            className="font-barlow text-[13px] font-700 uppercase tracking-[0.2em] text-white/90 whitespace-nowrap px-6"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
