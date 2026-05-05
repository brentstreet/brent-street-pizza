// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Pizza, IceCream, CakeSlice, ArrowRight } from 'lucide-react';
// import { useSectionContent } from '../context/ContentContext';

// const ICON_MAP: Record<string, any> = {
//   Pizza: Pizza,
//   IceCream: IceCream,
//   CakeSlice: CakeSlice,
// };

// const CategorySection: React.FC = () => {
//   const { sectionContent, loading } = useSectionContent('home');

//   if (loading || !sectionContent.category_cards) return null;

//   return (
//     <section className="bg-[#F5EDE0] py-0">
//       <div className="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[320px]">
//         {(sectionContent.category_cards || []).map((cat: any, idx: number) => {
//           if (!cat) return null;
//           const IconComponent = ICON_MAP[cat.icon] || Pizza;
//           return (
//             <Link
//               key={cat.id}
//               to={cat.link}
//               className="group relative overflow-hidden flex items-end justify-start h-[220px] md:h-full cursor-pointer"
//               style={{ borderRight: idx < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
//             >
//               {/* Background image */}
//               <img
//                 src={cat.img}
//                 alt={cat.name}
//                 loading="lazy"
//                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//               />

//               {/* Dark overlay — keeps image visible */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//               {/* Color glow on hover */}
//               <div
//                 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                 style={{ background: `radial-gradient(ellipse at bottom left, ${cat.color}30, transparent 70%)` }}
//               />

//               {/* Content */}
//               <div className="relative z-10 p-8 flex flex-col gap-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div
//                     className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30"
//                   >
//                     <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
//                   </div>
//                 </div>
//                 <h3 className="font-bebas text-[40px] md:text-[48px] leading-none text-white tracking-wider group-hover:translate-x-1 transition-transform duration-300">
//                   {cat.name}
//                 </h3>
//                 {/* Explore arrow */}
//                 <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
//                   <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.15em]" style={{ color: cat.color }}>
//                     Explore
//                   </span>
//                   <ArrowRight className="w-4 h-4" style={{ color: cat.color }} />
//                 </div>
//               </div>

//               {/* Bottom accent line */}
//               <div
//                 className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"
//                 style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
//               />
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default CategorySection;
import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, IceCream, CakeSlice, ArrowRight } from 'lucide-react';
import { useSectionContent } from '../context/ContentContext';
import { useMenu } from '../context/MenuContext';

const ICON_MAP: Record<string, any> = {
  Pizza: Pizza,
  IceCream: IceCream,
  CakeSlice: CakeSlice,
};

const CategorySection: React.FC = () => {
  const { sectionContent, loading } = useSectionContent('home');
  const { categories, isLoading: menuLoading } = useMenu();

  // Wait for both CMS content and menu categories to load to prevent flicker
  if (loading || menuLoading || !sectionContent.category_cards) return null;

  // Check if Ice Cream category actually exists in the backend data
  const hasIceCreamCategory = categories.some(
    (cat) => cat.id === 'cat-ice-cream' || cat.name.toLowerCase() === 'ice cream'
  );

  // Filter out the ice cream card if the backend category is missing
  const visibleCards = (sectionContent.category_cards || []).filter((cat: any) => {
    if (!cat) return false;
    
    // Identify if this CMS card is meant for Ice Cream
    const isIceCreamCard = 
      cat.link?.includes('cat-ice-cream') || 
      cat.name?.toLowerCase().includes('ice cream') || 
      cat.icon === 'IceCream';

    // Hide it if the backend doesn't have the category
    if (isIceCreamCard && !hasIceCreamCategory) {
      return false;
    }
    
    return true;
  });

  // Dynamically adjust grid columns based on how many cards are visible
  const gridColsClass = 
    visibleCards.length === 1 ? 'md:grid-cols-1' :
    visibleCards.length === 2 ? 'md:grid-cols-2' :
    visibleCards.length === 4 ? 'md:grid-cols-4' :
    'md:grid-cols-3';

  return (
    <section className="bg-[#F5EDE0] py-0">
      <div className={`grid grid-cols-1 ${gridColsClass} h-auto md:h-[320px]`}>
        {visibleCards.map((cat: any, idx: number) => {
          const IconComponent = ICON_MAP[cat.icon] || Pizza;
          return (
            <Link
              key={cat.id || idx}
              to={cat.link}
              className="group relative overflow-hidden flex items-end justify-start h-[220px] md:h-full cursor-pointer"
              style={{ borderRight: idx < visibleCards.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            >
              {/* Background image */}
              <img
                src={cat.img}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dark overlay — keeps image visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Color glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at bottom left, ${cat.color}30, transparent 70%)` }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col gap-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30"
                  >
                    <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bebas text-[40px] md:text-[48px] leading-none text-white tracking-wider group-hover:translate-x-1 transition-transform duration-300">
                  {cat.name}
                </h3>
                {/* Explore arrow */}
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                  <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.15em]" style={{ color: cat.color }}>
                    Explore
                  </span>
                  <ArrowRight className="w-4 h-4" style={{ color: cat.color }} />
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
