import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { MENU_ITEMS } from '../data/dummyMenuData';

const RATINGS: Record<string, number> = {
  'pizza-1': 4.9,
  'pizza-2': 4.8,
  'pizza-3': 4.9,
  'pizza-4': 4.7,
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? 'fill-[#d4a017] text-[#d4a017]' : 'text-white/20'}`}
      />
    ))}
    <span className="font-barlow text-[13px] font-600 text-white/50 ml-1">{rating}</span>
  </div>
);

const CustomerFavourites: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const favorites = MENU_ITEMS.filter(item => item.tags.isFavorite).slice(0, 4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const reveals = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#1a0a00] py-24 md:py-32 overflow-hidden relative">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />

      {/* Red glow top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C0392B]/8 blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16 reveal">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] mb-4">
            — Community Picks —
          </span>
          <h2 className="font-bebas text-[52px] md:text-[68px] text-white tracking-wider leading-none mb-4">
            Customer Favourites
          </h2>
          <p className="font-inter text-white/40 text-[16px] max-w-md">
            The most-loved pizzas from our menu, ordered again and again.
          </p>
          <div className="divider-gold w-24 mt-6" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {favorites.map((item, idx) => (
            <div
              key={item.id}
              className="reveal group relative rounded-[12px] overflow-hidden bg-[#2b1200] border border-white/5 hover:border-[#C0392B]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(192,57,43,0.3)] flex flex-col"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b1200] via-transparent to-transparent" />

                {/* Price badge */}
                <div className="absolute top-3 left-3 bg-[#C0392B] text-white font-bebas text-[18px] px-3 py-0.5 rounded shadow-lg">
                  ${item.price.toFixed(0)}
                </div>

                {/* Favourite badge */}
                <div className="absolute top-3 right-3 bg-[#d4a017]/90 text-[#1a0a00] font-barlow text-[10px] font-700 uppercase tracking-wider px-2 py-0.5 rounded">
                  #Fave
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-grow gap-3">
                <StarRating rating={RATINGS[item.id] ?? 4.8} />

                <h3 className="font-bebas text-[22px] tracking-widest text-white leading-none">
                  {item.name}
                </h3>

                <p className="font-inter text-white/40 text-[13px] leading-relaxed line-clamp-2 flex-grow">
                  {item.description}
                </p>

                {/* Quick Add button */}
                <Link
                  to="/menu"
                  id={`fav-add-${item.id}`}
                  className="mt-2 flex items-center justify-between bg-white/5 hover:bg-[#C0392B] border border-white/10 hover:border-[#C0392B] text-white font-barlow text-[13px] font-700 uppercase tracking-wider px-4 py-3 rounded-[6px] transition-all duration-300 group/btn"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 opacity-60 group-hover/btn:opacity-100" />
                    Quick Add
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 flex justify-center reveal">
          <Link
            to="/menu"
            id="view-entire-menu"
            className="group flex items-center gap-4 border border-white/10 hover:border-[#d4a017]/50 rounded-full px-8 py-4 transition-all duration-400 hover:bg-[#d4a017]/5"
          >
            <span className="font-barlow text-[15px] font-700 uppercase tracking-[0.15em] text-white/60 group-hover:text-[#d4a017] transition-colors duration-300">
              View The Entire Menu
            </span>
            <div className="w-8 h-[1px] bg-white/20 group-hover:bg-[#d4a017] group-hover:w-14 transition-all duration-400" />
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#d4a017] transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomerFavourites;
