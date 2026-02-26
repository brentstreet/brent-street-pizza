import React from 'react';
import { Flame, Leaf, Bell, Heart } from 'lucide-react';

const cards = [
  {
    title: 'OUR OVEN',
    desc: 'Fired by traditional wood, ensuring the perfect crispness on every slice.',
    icon: Flame,
    color: 'bg-brand-red/90 group-hover:bg-brand-red/80',
    img: 'https://images.unsplash.com/photo-1541592391523-5ec983582455?w=500&q=80',
  },
  {
    title: 'OUR INGREDIENTS',
    desc: 'Sourced daily from local farmers for a fresh, authentic Italian taste.',
    icon: Leaf,
    color: 'bg-brand-gold/90 group-hover:bg-brand-gold/80',
    img: 'https://images.unsplash.com/photo-1596662951362-4099cb665892?w=500&q=80',
  },
  {
    title: 'OUR SERVICE',
    desc: 'Fast, friendly, and dedicated to delivering hot food with a smile.',
    icon: Bell,
    color: 'bg-brand-red/90 group-hover:bg-brand-red/80',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
  },
  {
    title: 'OUR PASSION',
    desc: 'Crafting pizzas is what we love. Experience our passion in every single bite.',
    icon: Heart,
    color: 'bg-brand-gold/90 group-hover:bg-brand-gold/80',
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="bg-white py-24 section-padding relative overflow-hidden">

      {/* Decorative leaf top-right */}
      <div className="absolute top-10 right-10 w-24 h-24 text-green-500/10 rotate-45 z-0 pointer-events-none">
        <Leaf className="w-full h-full" />
      </div>

      <div className="container-custom relative z-10">

        <h2 className="font-bangers text-[36px] text-gray-900 text-center uppercase tracking-heading mb-16">
          WHY CHOOSE US
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-72">

              {/* Background Image */}
              <img
                src={card.img}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-700"
              />

              {/* Color Overlay */}
              <div className={`absolute inset-0 ${card.color} transition-colors duration-300 z-10`}></div>

              {/* Content */}
              <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center text-white">
                <card.icon className="w-10 h-10 mb-6 drop-shadow-md" />
                <h3 className="font-oswald text-[16px] font-bold uppercase tracking-wider mb-4 drop-shadow-md">
                  {card.title}
                </h3>
                <p className="font-opensans text-[13px] leading-[1.7] font-light drop-shadow-sm">
                  {card.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
