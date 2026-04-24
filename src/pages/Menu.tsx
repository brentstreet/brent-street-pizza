
// import { useState, useEffect, useRef } from 'react';
// import { ShoppingCart, Phone, Plus, Check } from 'lucide-react';
// import { useLocation } from 'react-router-dom';
// import { API_URL } from '../config/api';
// import { useMenu } from '../context/MenuContext';
// import { useCart } from '../context/CartContext';
// import CustomizationModal from '../components/CustomizationModal';
// import { type MenuItem } from '../types/menu';
// import { useSectionContent } from '../context/ContentContext';
// import IceCreamBuilder from '../components/IceCreamBuilder';
// import SpecialIceCreamCard from '../components/SpecialIceCreamCard';

// export default function Menu() {
//   const { menuItems: products, categories, isLoading: menuLoading } = useMenu();
//   const { addToCart, cartTotalItems, setIsCartOpen } = useCart();
//   const { sectionContent: icContent, loading: icLoading } = useSectionContent('icecream');
//   const { sectionContent: menuContent, loading: menuContentLoading } = useSectionContent('menu');
//   const { sectionContent: globalContent } = useSectionContent('global');

//   const [activeCategory, setActiveCategory] = useState<string>('cat-classic-pizza');
//   const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
//   const [justAddedId, setJustAddedId] = useState<string | null>(null);
//   const [preselectedSize, setPreselectedSize] = useState<string | undefined>(undefined);

//   const location = useLocation();
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const getImageUrl = (imagePath?: string) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${API_URL}${imagePath}`;
//   };

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const cat = params.get('cat');
//     if (cat && categories.find(c => c.id === cat)) {
//       setActiveCategory(cat);
//       setTimeout(() => {
//         const navBtn = document.getElementById(`nav-${cat}`);
//         if (navBtn) {
//           navBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
//         }

//         if (cat === 'cat-ice-cream') {
//           const el = document.getElementById('cat-ice-cream');
//           if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         } else {
//           const grid = document.getElementById('menu-products-grid');
//           if (grid) {
//             const yOffset = -150;
//             const y = grid.getBoundingClientRect().top + window.pageYOffset + yOffset;
//             window.scrollTo({ top: y, behavior: 'smooth' });
//           }
//         }
//       }, 300);
//     }
//   }, [location.search, categories]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('visible');
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );
//     const reveals = document.querySelectorAll('.reveal');
//     reveals.forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, [menuLoading, icLoading, menuContentLoading]);

//   if (menuLoading || icLoading || menuContentLoading) {
//     return (
//       <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-[#C8201A] border-t-transparent rounded-full animate-spin" />
//           <p className="font-bebas text-[24px] text-[#1A1A1A] tracking-wider">Loading Menu...</p>
//         </div>
//       </div>
//     );
//   }

//   const handleAddToCart = (item: MenuItem, customization?: any) => {
//     addToCart(item, customization || { price: item.price, quantity: 1 });
//     setJustAddedId(item.id);
//     setTimeout(() => setJustAddedId(null), 2000);
//   };

//   const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (item.sizes && item.sizes.length > 0) {
//       setSelectedItem(item);
//     } else {
//       handleAddToCart(item);
//     }
//   };

//   const openModal = (item: MenuItem, initialSize?: string) => {
//     setSelectedItem(item);
//     setPreselectedSize(initialSize);
//   };

//   const filteredProducts = products.filter(
//     p => activeCategory === 'all' || p.categoryId === activeCategory
//   );

//   return (
//     <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
//       <div className="container-custom">
//         <div className="relative mb-12 text-center md:text-left">
//           <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
//             {menuContent.subtitle || '— Locally Owned & Handcrafted —'}
//           </span>
//           <h1 className="font-bebas text-[72px] md:text-[110px] text-[#1A1A1A] tracking-tight leading-[0.85] mb-6">
//             {menuContent.title_1 || 'The'} <span className="text-[#C8201A] block md:inline">{menuContent.title_2 || 'Menu'}</span>
//           </h1>
//           <p className="font-inter text-[#555555] text-[16px] max-w-xl leading-relaxed mb-8">
//             {menuContent.description || 'From our signature hand-stretched pizzas to artisan ice cream, every item is made with passion using the finest local ingredients.'}
//           </p>
//         </div>

//         <div className="sticky top-[80px] z-30 bg-[#FDF8F2]/95 backdrop-blur-md py-4 -mx-4 px-4 border-b border-[#E8D8C8] mb-12">
//           <div
//             ref={scrollContainerRef}
//             className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
//           >
//             {categories.map(cat => (
//               <button
//                 key={cat.id}
//                 id={`nav-${cat.id}`}
//                 onClick={() => {
//                   setActiveCategory(cat.id);
//                   const navBtn = document.getElementById(`nav-${cat.id}`);
//                   if (navBtn) {
//                     navBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
//                   }

//                   if (cat.id === 'cat-ice-cream') {
//                     const el = document.getElementById('cat-ice-cream');
//                     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                   } else {
//                     const grid = document.getElementById('menu-products-grid');
//                     if (grid) {
//                       const yOffset = -150;
//                       const y = grid.getBoundingClientRect().top + window.pageYOffset + yOffset;
//                       window.scrollTo({ top: y, behavior: 'smooth' });
//                     }
//                   }
//                 }}
//                 className={`flex-shrink-0 px-6 py-2.5 rounded-full font-barlow font-700 text-[13px] uppercase tracking-wider transition-all
//                   ${activeCategory === cat.id
//                     ? 'bg-[#1A1A1A] text-white shadow-lg'
//                     : 'bg-white border border-[#E8D8C8] text-[#555555] hover:border-[#C8201A]'}`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div id="menu-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
//           {filteredProducts.map((item) => {
//             const isJustAdded = justAddedId === item.id;
//             return (
//               <div
//                 key={item.id}
//                 id={item.id}
//                 onClick={() => openModal(item)}
//                 className="group bg-white rounded-2xl border border-[#E8D8C8] overflow-hidden flex flex-col h-full 
//                   hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer"
//               >
//                 <div className="relative h-56 overflow-hidden">
//                   <img
//                     src={getImageUrl(item.image)}
//                     alt={item.name}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//                   {item.isFavorite && (
//                     <div className="absolute top-3 left-3 bg-[#D4952A] text-white font-barlow font-800 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
//                       Popular
//                     </div>
//                   )}

//                   <div className="absolute bottom-3 right-3 flex gap-1.5">
//                     {item.tags?.isSpicy && (
//                       <span className="bg-[#C8201A]/85 backdrop-blur-sm text-[#FFFCF7] font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌶 Hot</span>
//                     )}
//                     {item.tags?.isVegan && (
//                       <span className="bg-emerald-700/85 backdrop-blur-sm text-[#FFFCF7] font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌿 Vegan</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow gap-2.5">
//                   <div className="flex items-start justify-between gap-2">
//                     <h3 className="font-bebas text-[26px] tracking-wide text-[#1A1A1A] leading-none flex-1">
//                       {item.name}
//                     </h3>
//                     <span className="font-bebas text-[24px] text-[#C8201A] leading-none flex-shrink-0 bg-[#C8201A]/10 px-3 py-1 rounded-lg">
//                       ${item.sizes?.[0]?.price ?? item.price}
//                     </span>
//                   </div>

//                   <p className="font-inter text-[12px] text-[#555555] leading-relaxed line-clamp-2 flex-grow">
//                     {item.description}
//                   </p>

//                   {item.sizes && item.sizes.length > 0 && (
//                     <div className="flex gap-1.5 mt-0.5">
//                       {item.sizes.map(size => (
//                         <button
//                           key={size.name}
//                           onClick={(e) => { e.stopPropagation(); openModal(item, size.name); }}
//                           className="flex-1 flex flex-col items-center py-1.5 rounded-lg bg-[#F5F5F5]
//                             hover:bg-[#1A1A1A] hover:text-white
//                             font-inter text-[#555555] transition-all duration-200 group/size"
//                         >
//                           <span className="text-[11px] font-semibold">{size.name[0]}</span>
//                           <span className="text-[12px] font-bold group-hover/size:text-white transition-colors">${size.price}</span>
//                         </button>
//                       ))}
//                     </div>
//                   )}

//                   <button
//                     onClick={(e) => handleQuickAdd(item, e)}
//                     className={`mt-2 flex items-center justify-center gap-2 font-barlow font-800 text-[14px] uppercase tracking-widest
//                       px-4 py-3 rounded-xl transition-all duration-300
//                       ${isJustAdded
//                         ? 'bg-emerald-600 text-white scale-95'
//                         : 'bg-[#1A1A1A] text-white hover:bg-[#C8201A] hover:shadow-[0_8px_20px_rgba(200,32,26,0.4)] hover:-translate-y-0.5'
//                       }`}
//                   >
//                     {isJustAdded ? (
//                       <><Check className="w-4 h-4" /> Added</>
//                     ) : (
//                       <><Plus className="w-4 h-4" /> Quick Add</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div id="cat-ice-cream" className="mt-28 reveal pt-12 border-t border-[#E8D8C8]">
//           <div className="text-center mb-16">
//             <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">— Artisan Treats —</span>
//             <h2 className="font-bebas text-[64px] md:text-[80px] text-[#1A1A1A] tracking-wider mb-2">
//               The <span className="text-[#C8201A]">Gelato Bar</span>
//             </h2>
//             <p className="font-inter text-[#555555] text-[16px] max-w-xl mx-auto leading-relaxed">
//               Explore our premium artisan ice cream, locally made and served fresh. Build your own perfect bowl or try our signatures.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//             <div className="lg:col-span-1">
//               <IceCreamBuilder
//                 scoops={icContent.scoops}
//                 flavours={icContent.flavours}
//                 toppings={icContent.toppings}
//                 sauces={icContent.sauces}
//                 onAddToCart={(customs) => {
//                   const item = products.find(p => p.name === 'Custom Ice Cream');
//                   if (item) {
//                     const extras = [];
//                     if (customs.scoops) extras.push({ name: `${customs.scoops}: ${customs.flavours.join(', ')}`, price: 0 });
//                     if (customs.toppings?.length) extras.push({ name: `Toppings: ${customs.toppings.join(', ')}`, price: 0 });
//                     if (customs.sauce) extras.push({ name: `Sauce: ${customs.sauce}`, price: 0 });
//                     handleAddToCart(item, { price: customs.price, addedExtras: extras, quantity: 1 });
//                   }
//                 }}
//               />
//             </div>

//             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
//               {(icContent.specials || []).map((item: any) => (
//                 <SpecialIceCreamCard
//                   key={item.id}
//                   item={item}
//                   onAddToCart={(it) => {
//                     const p = products.find(prod => prod.name === it.name)
//                       || products.find(prod => prod.id.includes(it.id))
//                       || {
//                         ...it,
//                         id: `ice-cream-${it.id}`,
//                         categoryId: 'cat-ice-cream',
//                         price: Number(String(it.price).replace(/[^0-9.]/g, '')) || it.price,
//                       };
//                     handleAddToCart(p as MenuItem, {
//                       price: Number(String(p.price).replace(/[^0-9.]/g, '')) || Number(p.price),
//                       quantity: 1
//                     });
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="relative mt-24 bg-[#FFFCF7] rounded-3xl border border-[#E8D8C8] p-10 md:p-14 text-center overflow-hidden">
//           <div className="absolute inset-0 opacity-4 grayscale pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
//           <div className="relative z-10">
//             <h3 className="font-bebas text-[38px] md:text-[52px] text-[#1A1A1A] tracking-wider mb-3">
//               Large Order or Special Request?
//             </h3>
//             <p className="font-inter text-[#555555] text-[14px] mb-8 max-w-lg mx-auto leading-relaxed">
//               Call us directly — we'll handle custom orders, dietary requirements, and catering personally.
//             </p>
//             <a href={`tel:${globalContent.phone || '0362724004'}`} className="inline-flex items-center gap-3 text-[#C8201A] hover:text-[#D4952A] transition-colors font-bebas text-[38px] md:text-[50px] tracking-wider group">
//               <Phone className="w-8 h-8 group-hover:scale-110 transition-transform" />
//               {globalContent.phone_display || '03 6272 4004'}
//             </a>
//           </div>
//         </div>
//       </div>

//       <CustomizationModal
//         item={selectedItem}
//         isOpen={!!selectedItem}
//         preselectedSize={preselectedSize}
//         onClose={() => {
//           setSelectedItem(null);
//           setPreselectedSize(undefined);
//         }}
//         onAddToCart={handleAddToCart}
//       />

//       <button
//         onClick={() => setIsCartOpen(true)}
//         className="fixed bottom-10 right-8 w-14 h-14 bg-[#1A1A1A] rounded-full shadow-2xl flex items-center justify-center z-40
//           hover:scale-110 hover:bg-[#C8201A] transition-all text-white border-2 border-white/20 group hidden sm:flex"
//       >
//         <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
//         {cartTotalItems > 0 && (
//           <span className="absolute -top-1.5 -right-1.5 bg-[#C8201A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
//             {cartTotalItems}
//           </span>
//         )}
//       </button>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Phone, Plus, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config/api';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import CustomizationModal from '../components/CustomizationModal';
import { type MenuItem } from '../types/menu';
import { useSectionContent } from '../context/ContentContext';
import IceCreamBuilder from '../components/IceCreamBuilder';
import SpecialIceCreamCard from '../components/SpecialIceCreamCard';

export default function Menu() {
  const { menuItems: products, categories, isLoading: menuLoading } = useMenu();
  const { addToCart, cartTotalItems, setIsCartOpen } = useCart();
  const { sectionContent: icContent, loading: icLoading } = useSectionContent('icecream');
  const { sectionContent: menuContent, loading: menuContentLoading } = useSectionContent('menu');
  const { sectionContent: globalContent } = useSectionContent('global');

  const [activeCategory, setActiveCategory] = useState<string>('cat-classic-pizza');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [preselectedSize, setPreselectedSize] = useState<string | undefined>(undefined);

  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track whether we've already performed the initial URL-based scroll
  // so it only fires once per navigation, not on every state change
  const hasScrolledRef = useRef(false);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  // Reset the scroll guard whenever the URL search params change (new navigation)
  useEffect(() => {
    hasScrolledRef.current = false;
  }, [location.search]);

  // ─── Auto-scroll to category from URL param ───────────────────
  // Only fires once all data is loaded AND we haven't scrolled yet for this URL
  useEffect(() => {
    if (menuLoading || icLoading || menuContentLoading) return;
    if (hasScrolledRef.current) return;

    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');

    if (cat && categories.find(c => c.id === cat)) {
      hasScrolledRef.current = true; // Mark done immediately to prevent double-fire
      setActiveCategory(cat);

      setTimeout(() => {
        const navBtn = document.getElementById(`nav-${cat}`);
        if (navBtn) {
          navBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        if (cat === 'cat-ice-cream') {
          const el = document.getElementById('cat-ice-cream');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          const grid = document.getElementById('menu-products-grid');
          if (grid) {
            const yOffset = -150;
            const y = grid.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 50);
    }
  }, [location.search, categories, menuLoading, icLoading, menuContentLoading]);
  // ──────────────────────────────────────────────────────────────

  // ─── Intersection Observer for .reveal animations ─────────────
  useEffect(() => {
    if (menuLoading || icLoading || menuContentLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menuLoading, icLoading, menuContentLoading]);
  // ──────────────────────────────────────────────────────────────

  if (menuLoading || icLoading || menuContentLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C8201A] border-t-transparent rounded-full animate-spin" />
          <p className="font-bebas text-[24px] text-[#1A1A1A] tracking-wider">Loading Menu...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: MenuItem, customization?: any) => {
    addToCart(item, customization || { price: item.price, quantity: 1 });
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.sizes && item.sizes.length > 0) {
      setSelectedItem(item);
    } else {
      handleAddToCart(item);
    }
  };

  const openModal = (item: MenuItem, initialSize?: string) => {
    setSelectedItem(item);
    setPreselectedSize(initialSize);
  };

  const filteredProducts = products.filter(
    p => activeCategory === 'all' || p.categoryId === activeCategory
  );

  return (
    <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
      <div className="container-custom">

        {/* ── Header ── */}
        <div className="relative mb-12 text-center md:text-left">
          <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
            {menuContent.subtitle || '— Locally Owned & Handcrafted —'}
          </span>
          <h1 className="font-bebas text-[72px] md:text-[110px] text-[#1A1A1A] tracking-tight leading-[0.85] mb-6">
            {menuContent.title_1 || 'The'}{' '}
            <span className="text-[#C8201A] block md:inline">{menuContent.title_2 || 'Menu'}</span>
          </h1>
          <p className="font-inter text-[#555555] text-[16px] max-w-xl leading-relaxed mb-8">
            {menuContent.description || 'From our signature hand-stretched pizzas to artisan ice cream, every item is made with passion using the finest local ingredients.'}
          </p>
        </div>

        {/* ── Sticky Category Nav ── */}
        <div className="sticky top-[80px] z-30 bg-[#FDF8F2]/95 backdrop-blur-md py-4 -mx-4 px-4 border-b border-[#E8D8C8] mb-12">
          <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`nav-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const navBtn = document.getElementById(`nav-${cat.id}`);
                  if (navBtn) navBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

                  if (cat.id === 'cat-ice-cream') {
                    const el = document.getElementById('cat-ice-cream');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    const grid = document.getElementById('menu-products-grid');
                    if (grid) {
                      const y = grid.getBoundingClientRect().top + window.scrollY - 150;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }
                }}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full font-barlow font-700 text-[13px] uppercase tracking-wider transition-all
                  ${activeCategory === cat.id
                    ? 'bg-[#1A1A1A] text-white shadow-lg'
                    : 'bg-white border border-[#E8D8C8] text-[#555555] hover:border-[#C8201A]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Products Grid ── */}
        <div id="menu-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((item) => {
            const isJustAdded = justAddedId === item.id;
            return (
              <div
                key={item.id}
                id={item.id}
                onClick={() => openModal(item)}
                className="group bg-white rounded-2xl border border-[#E8D8C8] overflow-hidden flex flex-col h-full
                  hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden bg-[#F5EFE7]">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {item.isFavorite && (
                    <div className="absolute top-3 left-3 bg-[#D4952A] text-white font-barlow font-800 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      Popular
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {item.tags?.isSpicy && (
                      <span className="bg-[#C8201A]/85 backdrop-blur-sm text-[#FFFCF7] font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌶 Hot</span>
                    )}
                    {item.tags?.isVegan && (
                      <span className="bg-emerald-700/85 backdrop-blur-sm text-[#FFFCF7] font-barlow text-[9px] font-700 uppercase tracking-wider px-2 py-0.5 rounded-full">🌿 Vegan</span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bebas text-[26px] tracking-wide text-[#1A1A1A] leading-none flex-1">
                      {item.name}
                    </h3>
                    <span className="font-bebas text-[24px] text-[#C8201A] leading-none flex-shrink-0 bg-[#C8201A]/10 px-3 py-1 rounded-lg">
                      ${item.sizes?.[0]?.price ?? item.price}
                    </span>
                  </div>

                  <p className="font-inter text-[12px] text-[#555555] leading-relaxed line-clamp-2 flex-grow">
                    {item.description}
                  </p>

                  {item.sizes && item.sizes.length > 0 && (
                    <div className="flex gap-1.5 mt-0.5">
                      {item.sizes.map(size => (
                        <button
                          key={size.name}
                          onClick={(e) => { e.stopPropagation(); openModal(item, size.name); }}
                          className="flex-1 flex flex-col items-center py-1.5 rounded-lg bg-[#F5F5F5]
                            hover:bg-[#1A1A1A] hover:text-white
                            font-inter text-[#555555] transition-all duration-200 group/size"
                        >
                          <span className="text-[11px] font-semibold">{size.name[0]}</span>
                          <span className="text-[12px] font-bold group-hover/size:text-white transition-colors">${size.price}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={(e) => handleQuickAdd(item, e)}
                    className={`mt-2 flex items-center justify-center gap-2 font-barlow font-800 text-[14px] uppercase tracking-widest
                      px-4 py-3 rounded-xl transition-all duration-300
                      ${isJustAdded
                        ? 'bg-emerald-600 text-white scale-95'
                        : 'bg-[#1A1A1A] text-white hover:bg-[#C8201A] hover:shadow-[0_8px_20px_rgba(200,32,26,0.4)] hover:-translate-y-0.5'
                      }`}
                  >
                    {isJustAdded
                      ? <><Check className="w-4 h-4" /> Added</>
                      : <><Plus className="w-4 h-4" /> Quick Add</>
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Ice Cream Section ── */}
        <div id="cat-ice-cream" className="mt-28 reveal pt-12 border-t border-[#E8D8C8]">
          <div className="text-center mb-16">
            <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">— Artisan Treats —</span>
            <h2 className="font-bebas text-[64px] md:text-[80px] text-[#1A1A1A] tracking-wider mb-2">
              The <span className="text-[#C8201A]">Gelato Bar</span>
            </h2>
            <p className="font-inter text-[#555555] text-[16px] max-w-xl mx-auto leading-relaxed">
              Explore our premium artisan ice cream, locally made and served fresh. Build your own perfect bowl or try our signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* WRAPPED IceCreamBuilder to catch and prevent bubbled form submissions */}
            <div 
              className="lg:col-span-1"
              onSubmit={(e) => e.preventDefault()} // Intercept rogue form submissions here!
            >
              <IceCreamBuilder
                scoops={icContent.scoops}
                flavours={icContent.flavours}
                toppings={icContent.toppings}
                sauces={icContent.sauces}
                onAddToCart={(customs) => {
                  const item = products.find(p => p.name === 'Custom Ice Cream');
                  if (item) {
                    const extras = [];
                    if (customs.scoops) extras.push({ name: `${customs.scoops}: ${customs.flavours.join(', ')}`, price: 0 });
                    if (customs.toppings?.length) extras.push({ name: `Toppings: ${customs.toppings.join(', ')}`, price: 0 });
                    if (customs.sauce) extras.push({ name: `Sauce: ${customs.sauce}`, price: 0 });
                    handleAddToCart(item, { price: customs.price, addedExtras: extras, quantity: 1 });
                  }
                }}
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {(icContent.specials || []).map((item: any) => (
                <SpecialIceCreamCard
                  key={item.id}
                  item={item}
                  onAddToCart={(it) => {
                    const p = products.find(prod => prod.name === it.name)
                      || products.find(prod => prod.id.includes(it.id))
                      || {
                          ...it,
                          id: `ice-cream-${it.id}`,
                          categoryId: 'cat-ice-cream',
                          price: Number(String(it.price).replace(/[^0-9.]/g, '')) || it.price,
                        };
                    handleAddToCart(p as MenuItem, {
                      price: Number(String(p.price).replace(/[^0-9.]/g, '')) || Number(p.price),
                      quantity: 1
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="relative mt-24 bg-[#FFFCF7] rounded-3xl border border-[#E8D8C8] p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-4 grayscale pointer-events-none"
            style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />
          <div className="relative z-10">
            <h3 className="font-bebas text-[38px] md:text-[52px] text-[#1A1A1A] tracking-wider mb-3">
              Large Order or Special Request?
            </h3>
            <p className="font-inter text-[#555555] text-[14px] mb-8 max-w-lg mx-auto leading-relaxed">
              Call us directly — we'll handle custom orders, dietary requirements, and catering personally.
            </p>
            <a
              href={`tel:${globalContent.phone || '0362724004'}`}
              className="inline-flex items-center gap-3 text-[#C8201A] hover:text-[#D4952A] transition-colors font-bebas text-[38px] md:text-[50px] tracking-wider group"
            >
              <Phone className="w-8 h-8 group-hover:scale-110 transition-transform" />
              {globalContent.phone_display || '03 6272 4004'}
            </a>
          </div>
        </div>
      </div>

      {/* ── Modals & Floating Button ── */}
      <CustomizationModal
        item={selectedItem}
        isOpen={!!selectedItem}
        preselectedSize={preselectedSize}
        onClose={() => {
          setSelectedItem(null);
          setPreselectedSize(undefined);
        }}
        onAddToCart={handleAddToCart}
      />

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-10 right-8 w-14 h-14 bg-[#1A1A1A] rounded-full shadow-2xl flex items-center justify-center z-40
          hover:scale-110 hover:bg-[#C8201A] transition-all text-white border-2 border-white/20 group hidden sm:flex"
      >
        <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {cartTotalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-[#C8201A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            {cartTotalItems}
          </span>
        )}
      </button>
    </div>
  );
}
