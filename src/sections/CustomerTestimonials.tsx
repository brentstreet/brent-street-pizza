import React, { useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah M.',
    date: 'January 2025',
    text: 'Best pizza I\'ve had in years. The crust is perfect! Perfectly crunchy on the outside, incredibly soft inside. Genuinely rivals my favourite Italian restaurant.',
    avatar: 'S',
    color: '#C0392B',
  },
  {
    name: 'John D.',
    date: 'December 2024',
    text: 'Delivery was fast and the food was still steaming hot. The cheese pull was unbelievable. My new favourite pizza spot — we order at least twice a week now!',
    avatar: 'J',
    color: '#d4a017',
  },
  {
    name: 'Emily R.',
    date: 'November 2024',
    text: 'Amazing quality and great value for money. The Margherita is a classic done right. Thin and crispy base, fresh San Marzano tomatoes. Absolutely perfect.',
    avatar: 'E',
    color: '#C0392B',
  },
  {
    name: 'Michael T.',
    date: 'October 2024',
    text: 'The gelato here is absolutely divine. Creamy, rich, and authentic. Combined with the pizza, this is hands down the best Italian food in the area.',
    avatar: 'M',
    color: '#d4a017',
  },
];

const StarRow: React.FC = () => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className="w-4 h-4 fill-[#d4a017] text-[#d4a017]" />
    ))}
  </div>
);

const CustomerTestimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, reviews.length - 1));
    setActiveIdx(clamped);
    const card = scrollRef.current?.children[clamped] as HTMLElement;
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <section ref={sectionRef} className="bg-[#2b1200] py-24 md:py-32 overflow-hidden relative">
      {/* Gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full bg-[#d4a017]/6 blur-[80px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 reveal">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] mb-4">
            — What People Say —
          </span>
          <h2 className="font-bebas text-[52px] md:text-[68px] text-white tracking-wider leading-none">
            Customer Reviews
          </h2>

          {/* Overall rating */}
          <div className="flex items-center gap-3 mt-6">
            <StarRow />
            <span className="font-bebas text-[28px] text-white leading-none">5.0</span>
            <span className="font-inter text-white/40 text-[14px]">Based on 20+ reviews</span>
          </div>
          <div className="divider-gold w-24 mt-6" />
        </div>

        {/* Large quote highlight */}
        <div className="relative mb-12 reveal">
          <div className="absolute -top-4 -left-2 opacity-10">
            <Quote className="w-20 h-20 text-[#d4a017]" />
          </div>
          <blockquote className="relative z-10 max-w-3xl mx-auto text-center font-inter text-white/70 text-[18px] md:text-[22px] italic leading-relaxed font-light">
            "{reviews[activeIdx].text}"
          </blockquote>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bebas text-[18px] text-white shadow-lg"
              style={{ background: reviews[activeIdx].color }}
            >
              {reviews[activeIdx].avatar}
            </div>
            <div>
              <p className="font-barlow font-700 text-[16px] uppercase tracking-wider text-white">{reviews[activeIdx].name}</p>
              <p className="font-inter text-[12px] text-white/30">{reviews[activeIdx].date}</p>
            </div>
          </div>
        </div>

        {/* Cards carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scroll pb-4 snap-x snap-mandatory"
        >
          {reviews.map((rev, i) => (
            <div
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`min-w-[280px] sm:min-w-[320px] flex-shrink-0 snap-start rounded-[12px] border p-6 cursor-pointer transition-all duration-400 ${activeIdx === i
                  ? 'border-[#d4a017]/50 bg-[#d4a017]/5 shadow-[0_0_30px_rgba(212,160,23,0.1)]'
                  : 'border-white/5 bg-white/3 hover:border-white/15'
                }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bebas text-[18px] text-white"
                  style={{ background: rev.color }}
                >
                  {rev.avatar}
                </div>
                <div>
                  <p className="font-barlow font-700 text-[14px] uppercase tracking-wider text-white">{rev.name}</p>
                  <p className="font-inter text-[11px] text-white/30">{rev.date}</p>
                </div>
                <div className="ml-auto">
                  <StarRow />
                </div>
              </div>
              <p className="font-inter text-[13px] text-white/50 leading-relaxed line-clamp-3">{rev.text}</p>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mt-8 reveal">
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`rounded-full transition-all duration-300 ${activeIdx === i ? 'w-6 h-2 bg-[#d4a017]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scrollTo(activeIdx - 1)}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-[#d4a017]/50 hover:bg-[#d4a017]/10 flex items-center justify-center text-white/50 hover:text-[#d4a017] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTo(activeIdx + 1)}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-[#d4a017]/50 hover:bg-[#d4a017]/10 flex items-center justify-center text-white/50 hover:text-[#d4a017] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
