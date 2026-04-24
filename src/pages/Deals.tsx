// import React from 'react';
// import { Tag, Clock, ArrowRight, Star, Flame, Zap } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useSectionContent } from '../context/ContentContext';

// const ICON_MAP: Record<string, any> = {
//   Flame: <Flame className="w-5 h-5" />,
//   Star: <Star className="w-5 h-5" />,
//   Zap: <Zap className="w-5 h-5" />,
//   Clock: <Clock className="w-5 h-5" />,
// };

// const Deals: React.FC = () => {
//   const { sectionContent, loading } = useSectionContent('deals');

//   if (loading) return <div className="min-h-screen bg-[#FDF8F2]" />;

//   const deals = sectionContent.deals_list || [];
//   return (
//     <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
//       <div className="container-custom">
//         {/* Header */}
//         <div className="text-center mb-20">
//           <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
//             {sectionContent.subtitle || '— Exclusive Offers —'}
//           </span>
//           <h1 className="font-bebas text-[64px] md:text-[90px] text-[#1A1A1A] tracking-wider leading-none mb-6 text-center">
//             {sectionContent.title_1 || 'Hot'} <span className="text-[#C8201A]">{sectionContent.title_2 || 'Deals'}</span>
//           </h1>
//           <p className="font-inter text-[#555555] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
//             {sectionContent.description || 'Grab our famous combo packs and save big. Freshly made, delivered hot, and always delicious.'}
//           </p>
//         </div>

//         {/* Deals Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
//           {deals.map((deal: any) => (
//             <div
//               key={deal.id}
//               className="group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden hover:border-[#E8D8C8] transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
//             >
//               <div className="p-8 md:p-10 flex flex-col h-full">
//                 {/* Badge */}
//                 <div 
//                   className="absolute top-6 right-6 px-4 py-1.5 rounded-full font-barlow font-800 text-[11px] tracking-widest uppercase flex items-center gap-2"
//                   style={{ backgroundColor: `${deal.color}20`, color: deal.color, border: `1px solid ${deal.color}40` }}
//                 >
//                   {ICON_MAP[deal.icon] || <Tag className="w-5 h-5" />}
//                   {deal.tag}
//                 </div>

//                 <h3 className="font-bebas text-[36px] md:text-[42px] text-[#1A1A1A] tracking-wider mb-2 group-hover:text-[#D4952A] transition-colors">
//                   {deal.title}
//                 </h3>
                
//                 <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-8 flex-grow">
//                   {deal.description}
//                 </p>

//                 <div className="flex items-end justify-between mt-auto">
//                   <Link
//                     to="/contact"
//                     className="font-barlow font-700 text-[13px] uppercase tracking-wider text-[#C8201A] hover:text-[#D4952A] transition-colors"
//                   >
//                     📞 Call for pricing
//                   </Link>

//                   <Link
//                     to="/menu"
//                     className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1A1A1A]/5 hover:bg-[#C8201A] text-[#1A1A1A] hover:text-white transition-all duration-300 group-hover:scale-110"
//                   >
//                     <ArrowRight className="w-6 h-6" />
//                   </Link>
//                 </div>
//               </div>

//               {/* Decorative line */}
//               <div 
//                 className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
//                 style={{ backgroundColor: deal.color }}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Footer CTA */}
//         <div className="mt-20 text-center bg-[#F5EDE0]/40 border border-[#E8D8C8] rounded-[24px] p-12 max-w-4xl mx-auto backdrop-blur-sm">
//           <Tag className="w-10 h-10 text-[#D4952A] mx-auto mb-6" />
//           <h2 className="font-bebas text-[32px] md:text-[40px] text-[#1A1A1A] tracking-wider mb-4">
//             Got a large group?
//           </h2>
//           <p className="font-inter text-[#555555] text-[15px] mb-8 max-w-md mx-auto">
//             We provide specialized catering for events, parties, and offices. Contact us for a custom quote.
//           </p>
//           <Link
//             to="/contact"
//             className="inline-flex items-center gap-2 font-barlow font-800 text-[14px] uppercase tracking-widest text-[#D4952A] hover:text-[#1A1A1A] transition-colors"
//           >
//             Inquire About Catering <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Deals;
import React, { useEffect, useState } from 'react';
import { Tag, Clock, ArrowRight, Star, Flame, Zap, ShoppingCart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSectionContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config/api';

const ICON_MAP: Record<string, any> = {
  Flame: <Flame className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
};

const Deals: React.FC = () => {
  const { sectionContent, loading } = useSectionContent('deals');
  const { addToCart, setIsCartOpen } = useCart();
  
  const [deals, setDeals] = useState<any[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live deals from the backend
    fetch(`${API_URL}/api/catalog/deals`)
      .then(res => res.json())
      .then(data => {
        if (data.deals) setDeals(data.deals);
      })
      .catch(console.error);
  }, []);

  const handleAddDeal = (deal: any) => {
    // Treat the Deal as a standard cart item
    const dealMenuItem = {
      id: `deal_${deal.id}`,
      name: deal.title,
      description: deal.description,
      price: deal.price,
      categoryId: 'deals',
    };

    addToCart(dealMenuItem as any, { price: deal.price, quantity: 1 });
    
    setAddingId(deal.id);
    setIsCartOpen(true);
    setTimeout(() => setAddingId(null), 2000);
  };

  if (loading) return <div className="min-h-screen bg-[#FDF8F2]" />;

  return (
    <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
            {sectionContent.subtitle || '— Exclusive Offers —'}
          </span>
          <h1 className="font-bebas text-[64px] md:text-[90px] text-[#1A1A1A] tracking-wider leading-none mb-6 text-center">
            {sectionContent.title_1 || 'Hot'} <span className="text-[#C8201A]">{sectionContent.title_2 || 'Deals'}</span>
          </h1>
          <p className="font-inter text-[#555555] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            {sectionContent.description || 'Grab our famous combo packs and save big. Freshly made, delivered hot, and always delicious.'}
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {deals.length === 0 ? (
            <p className="text-center text-[#555] col-span-full">No active deals at the moment. Check back soon!</p>
          ) : deals.map((deal: any) => (
            <div
              key={deal.id}
              className="group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden hover:border-[#E8D8C8] transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
            >
              <div className="p-8 md:p-10 flex flex-col h-full">
                {/* Badge */}
                <div 
                  className="absolute top-6 right-6 px-4 py-1.5 rounded-full font-barlow font-800 text-[11px] tracking-widest uppercase flex items-center gap-2"
                  style={{ backgroundColor: `${deal.color || '#C8201A'}20`, color: deal.color || '#C8201A', border: `1px solid ${deal.color || '#C8201A'}40` }}
                >
                  {ICON_MAP[deal.icon] || <Tag className="w-5 h-5" />}
                  {deal.tag || 'Special'}
                </div>

                <h3 className="font-bebas text-[36px] md:text-[42px] text-[#1A1A1A] tracking-wider mb-2 group-hover:text-[#D4952A] transition-colors mt-4">
                  {deal.title}
                </h3>
                
                <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-8 flex-grow">
                  {deal.description}
                </p>

                <div className="flex items-end justify-between mt-auto border-t border-[#E8D8C8] pt-6">
                  <div className="flex flex-col">
                    <span className="font-barlow font-700 text-[12px] uppercase tracking-wider text-[#888]">Combo Price</span>
                    <span className="font-bebas text-[32px] text-[#C8201A] leading-none">${Number(deal.price).toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleAddDeal(deal)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#C8201A] text-white font-barlow font-800 text-[13px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1"
                  >
                    {addingId === deal.id ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add Deal</>}
                  </button>
                </div>
              </div>

              {/* Decorative line */}
              <div 
                className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
                style={{ backgroundColor: deal.color || '#C8201A' }}
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
