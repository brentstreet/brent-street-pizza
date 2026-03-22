import React from 'react';
import { Tag, Clock, ArrowRight, Star, Flame, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEALS = [
  {
    id: 'quick-deal',
    title: 'Quick Deal',
    price: '',
    description: '1 Large Pizza + Garlic Bread + 375ml Drink.',
    tag: 'DEAL 1',
    icon: <Flame className="w-5 h-5" />,
    color: '#C8201A',
  },
  {
    id: 'double-deal',
    title: 'Double Deal',
    price: '',
    description: '2 Large Pizzas + Garlic Bread + 1.25L Drink.',
    tag: 'DEAL 2',
    icon: <Star className="w-5 h-5" />,
    color: '#C8201A',
  },
  {
    id: 'family-deal',
    title: 'Family Deal',
    price: '',
    description: '3 Large Pizzas + 2 Garlic Breads + 2 x 1.25L Drinks.',
    tag: 'DEAL 3',
    icon: <Star className="w-5 h-5" />,
    color: '#D4952A',
  },
  {
    id: 'party-deal',
    title: 'Party Deal',
    price: '',
    description: '5 Large Pizzas + 2 Sides + 2 x 1.25L Drinks.',
    tag: 'DEAL 4',
    icon: <Zap className="w-5 h-5" />,
    color: '#C8201A',
  },
  {
    id: 'lunch-special',
    title: 'Lunch Special',
    price: '',
    description: 'Any Small Pizza + Can of Drink. Available daily until 4 PM. (Pick up only)',
    tag: 'DEAL 5',
    icon: <Clock className="w-5 h-5" />,
    color: '#C8201A',
  },
];

const Deals: React.FC = () => {
  return (
    <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
            — Exclusive Offers —
          </span>
          <h1 className="font-bebas text-[64px] md:text-[90px] text-[#1A1A1A] tracking-wider leading-none mb-6">
            Hot <span className="text-[#C8201A]">Deals</span>
          </h1>
          <p className="font-inter text-[#555555] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Grab our famous combo packs and save big. Freshly made, delivered hot, and always delicious.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {DEALS.map((deal) => (
            <div
              key={deal.id}
              className="group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden hover:border-[#E8D8C8] transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Badge */}
                <div 
                  className="absolute top-6 right-6 px-4 py-1.5 rounded-full font-barlow font-800 text-[11px] tracking-widest uppercase flex items-center gap-2"
                  style={{ backgroundColor: `${deal.color}20`, color: deal.color, border: `1px solid ${deal.color}40` }}
                >
                  {deal.icon}
                  {deal.tag}
                </div>

                <h3 className="font-bebas text-[36px] md:text-[42px] text-[#1A1A1A] tracking-wider mb-2 group-hover:text-[#D4952A] transition-colors">
                  {deal.title}
                </h3>
                
                <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-8 flex-grow">
                  {deal.description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <Link
                    to="/contact"
                    className="font-barlow font-700 text-[13px] uppercase tracking-wider text-[#C8201A] hover:text-[#D4952A] transition-colors"
                  >
                    📞 Call for pricing
                  </Link>

                  <Link
                    to="/menu"
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1A1A1A]/5 hover:bg-[#C8201A] text-[#1A1A1A] hover:text-white transition-all duration-300 group-hover:scale-110"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>

              {/* Decorative line */}
              <div 
                className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
                style={{ backgroundColor: deal.color }}
              />
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 text-center bg-[#F5EDE0]/40 border border-[#E8D8C8] rounded-[24px] p-12 max-w-4xl mx-auto backdrop-blur-sm">
          <Tag className="w-10 h-10 text-[#D4952A] mx-auto mb-6" />
          <h2 className="font-bebas text-[32px] md:text-[40px] text-[#1A1A1A] tracking-wider mb-4">
            Got a large group?
          </h2>
          <p className="font-inter text-[#555555] text-[15px] mb-8 max-w-md mx-auto">
            We provide specialized catering for events, parties, and offices. Contact us for a custom quote.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-barlow font-800 text-[14px] uppercase tracking-widest text-[#D4952A] hover:text-[#1A1A1A] transition-colors"
          >
            Inquire About Catering <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Deals;
