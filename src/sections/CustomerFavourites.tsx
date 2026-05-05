// import React, { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Star, ShoppingBag, ArrowRight, Check } from 'lucide-react';
// import { useSectionContent } from '../context/ContentContext';
// import { useCart } from '../context/CartContext';
// import { API_URL } from '../config/api';
// import { type MenuItem } from '../types/menu';

// // We now fetch ratings from the database field `rating`

// const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
//   <div className="flex items-center gap-1">
//     {[1, 2, 3, 4, 5].map((star) => (
//       <Star
//         key={star}
//         className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? 'fill-[#D4952A] text-[#D4952A]' : 'text-[#555555]'}`}
//       />
//     ))}
//     <span className="font-barlow text-[13px] font-600 text-[#555555] ml-1">{rating}</span>
//   </div>
// );

// const CustomerFavourites: React.FC = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const { sectionContent, loading: contentLoading } = useSectionContent('favourites');
//   const { addToCart } = useCart(); // Access cart context
//   const [favorites, setFavorites] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [justAddedId, setJustAddedId] = useState<string | null>(null);

//   // Helper to construct full image URLs
//   const getImageUrl = (imagePath?: string) => {
//     if (!imagePath) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80'; // Fallback
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${API_URL}${imagePath}`;
//   };

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/catalog/products?isFavorite=true`);
//         if (res.ok) {
//           const data = await res.json();
//           if (data && Array.isArray(data.products)) {
//             setFavorites(data.products.slice(0, 4));
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching favorites:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFavorites();
//   }, []);

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
//     const reveals = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
//     reveals?.forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, [loading, contentLoading]);

//   // Handler to add item directly to cart
//   const handleQuickAdd = (item: any) => {
//     // Determine the base price (use the first size price if available, otherwise base price)
//     const basePrice = item.sizes?.length > 0 ? Number(item.sizes[0].price) : Number(item.price);
    
//     addToCart(item as MenuItem, {
//       price: basePrice,
//       quantity: 1,
//       size: item.sizes?.length > 0 ? item.sizes[0].name : undefined
//     });

//     // Show temporary "Added" feedback
//     setJustAddedId(item.id);
//     setTimeout(() => setJustAddedId(null), 2000);
//   };

//   if (loading || contentLoading) return <div className="min-h-[400px] bg-[#FDF8F2]" />;

//   return (
//     <section ref={sectionRef} className="bg-[#FDF8F2] py-24 md:py-32 overflow-hidden relative">
//       {/* Background texture */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none"
//         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />

//       {/* Red glow top-right */}
//       <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C8201A]/8 blur-[100px] pointer-events-none" />

//       <div className="container-custom relative z-10">
//         {/* Section header */}
//         <div className="flex flex-col items-center text-center mb-16 reveal">
//           <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#D4952A] mb-4">
//             {sectionContent.subtitle || '— Community Picks —'}
//           </span>
//           <h2 className="font-bebas text-[52px] md:text-[68px] text-[#1A1A1A] tracking-wider leading-none mb-4">
//             {sectionContent.title || 'Customer Favourites'}
//           </h2>
//           <p className="font-inter text-[#555555] text-[16px] max-w-md">
//             {sectionContent.description || 'The most-loved pizzas from our menu, ordered again and again.'}
//           </p>
//           <div className="divider-gold w-24 mt-6" />
//         </div>

//         {/* Cards Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {favorites.map((item, idx) => {
//             const isJustAdded = justAddedId === item.id;
            
//             return (
//               <div
//                 key={item.id}
//                 className="reveal group relative bg-white rounded-2xl border border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col cursor-pointer
//                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-[#1A1A1A]/10 hover:-translate-y-1.5 transition-all duration-500"
//                 style={{ transitionDelay: `${idx * 80}ms` }}
//               >
//                 {/* Image */}
//                 <div className="relative overflow-hidden aspect-square">
//                   <img
//                     src={getImageUrl(item.image)}
//                     alt={item.name}
//                     loading="lazy"
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white font-bebas text-[18px] px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
//                     ${item.sizes?.length ? item.sizes[0].price : item.price}
//                   </div>

//                   {/* Favourite badge */}
//                   <div className="absolute top-4 right-4 bg-[#D4952A] text-white font-barlow text-[10px] font-800 uppercase tracking-[0.2em] px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
//                     #Fave
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="p-5 flex flex-col flex-grow gap-3">
//                   <StarRating rating={Number(item.rating) || 4.8} />

//                   <h3 className="font-bebas text-[22px] tracking-widest text-[#1A1A1A] leading-none">
//                     {item.name}
//                   </h3>

//                   <p className="font-inter text-[#555555] text-[13px] leading-relaxed line-clamp-2 flex-grow">
//                     {item.description}
//                   </p>

//                   {/* Quick Add button */}
//                   <button
//                     onClick={() => handleQuickAdd(item)}
//                     id={`fav-add-${item.id}`}
//                     className={`mt-4 flex items-center justify-center gap-2 font-barlow text-[14px] font-800 uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300 
//                       ${isJustAdded 
//                         ? 'bg-emerald-600 text-white shadow-lg' 
//                         : 'bg-[#F5F5F5] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white'}`}
//                   >
//                     {isJustAdded ? (
//                       <>
//                         <Check className="w-4 h-4" /> Added
//                       </>
//                     ) : (
//                       <>
//                         <ShoppingBag className="w-4 h-4" /> Quick Add
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* View All CTA */}
//         <div className="mt-16 flex justify-center reveal">
//           <Link
//             to="/menu"
//             id="view-entire-menu"
//             className="group flex items-center gap-4 border border-[#E8D8C8] hover:border-[#D4952A]/50 rounded-full px-8 py-4 transition-all duration-400 hover:bg-[#D4952A]/5"
//           >
//             <span className="font-barlow text-[15px] font-700 uppercase tracking-[0.15em] text-[#555555] group-hover:text-[#D4952A] transition-colors duration-300">
//               View The Entire Menu
//             </span>
//             <div className="w-8 h-[1px] bg-[#1A1A1A]/5 group-hover:bg-[#D4952A] group-hover:w-14 transition-all duration-400" />
//             <ArrowRight className="w-4 h-4 text-[#555555] group-hover:text-[#D4952A] transition-colors" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CustomerFavourites;
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useSectionContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config/api';
import { type MenuItem } from '../types/menu';
import CustomizationModal from '../components/CustomizationModal';

// We now fetch ratings from the database field `rating`

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? 'fill-[#D4952A] text-[#D4952A]' : 'text-[#555555]'}`}
      />
    ))}
    <span className="font-barlow text-[13px] font-600 text-[#555555] ml-1">{rating}</span>
  </div>
);

const CustomerFavourites: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { sectionContent, loading: contentLoading } = useSectionContent('favourites');
  const { addToCart } = useCart();
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Customization Modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Helper to construct full image URLs
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80'; // Fallback
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_URL}/api/catalog/products?isFavorite=true`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.products)) {
            setFavorites(data.products.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

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
  }, [loading, contentLoading]);

  // Handle adding the customized item to cart
  const handleAddToCart = (item: MenuItem, customization?: any) => {
    addToCart(item, customization || { price: item.price, quantity: 1 });
    setSelectedItem(null); // Close modal
  };

  // Open modal instead of adding directly
  const handleQuickAddClick = (item: any) => {
    setSelectedItem(item as MenuItem);
  };

  if (loading || contentLoading) return <div className="min-h-[400px] bg-[#FDF8F2]" />;

  return (
    <section ref={sectionRef} className="bg-[#FDF8F2] py-24 md:py-32 overflow-hidden relative">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-leather.png')` }} />

      {/* Red glow top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C8201A]/8 blur-[100px] pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16 reveal">
          <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#D4952A] mb-4">
            {sectionContent.subtitle || '— Community Picks —'}
          </span>
          <h2 className="font-bebas text-[52px] md:text-[68px] text-[#1A1A1A] tracking-wider leading-none mb-4">
            {sectionContent.title || 'Customer Favourites'}
          </h2>
          <p className="font-inter text-[#555555] text-[16px] max-w-md">
            {sectionContent.description || 'The most-loved pizzas from our menu, ordered again and again.'}
          </p>
          <div className="divider-gold w-24 mt-6" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {favorites.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleQuickAddClick(item)} // Allow clicking anywhere on card
              className="reveal group relative bg-white rounded-2xl border border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col cursor-pointer
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-[#1A1A1A]/10 hover:-translate-y-1.5 transition-all duration-500"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white font-bebas text-[18px] px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                  ${item.sizes?.length ? item.sizes[0].price : item.price}
                </div>

                {/* Favourite badge */}
                <div className="absolute top-4 right-4 bg-[#D4952A] text-white font-barlow text-[10px] font-800 uppercase tracking-[0.2em] px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  #Fave
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-grow gap-3">
                <StarRating rating={Number(item.rating) || 4.8} />

                <h3 className="font-bebas text-[22px] tracking-widest text-[#1A1A1A] leading-none">
                  {item.name}
                </h3>

                <p className="font-inter text-[#555555] text-[13px] leading-relaxed line-clamp-2 flex-grow">
                  {item.description}
                </p>

                {/* Quick Add button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAddClick(item);
                  }}
                  id={`fav-add-${item.id}`}
                  className="mt-4 flex items-center justify-between bg-[#F5F5F5] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white font-barlow text-[14px] font-800 uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300 group/btn"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 opacity-60 group-hover/btn:opacity-100" />
                    Quick Add
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 flex justify-center reveal">
          <Link
            to="/menu"
            id="view-entire-menu"
            className="group flex items-center gap-4 border border-[#E8D8C8] hover:border-[#D4952A]/50 rounded-full px-8 py-4 transition-all duration-400 hover:bg-[#D4952A]/5"
          >
            <span className="font-barlow text-[15px] font-700 uppercase tracking-[0.15em] text-[#555555] group-hover:text-[#D4952A] transition-colors duration-300">
              View The Entire Menu
            </span>
            <div className="w-8 h-[1px] bg-[#1A1A1A]/5 group-hover:bg-[#D4952A] group-hover:w-14 transition-all duration-400" />
            <ArrowRight className="w-4 h-4 text-[#555555] group-hover:text-[#D4952A] transition-colors" />
          </Link>
        </div>
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
};

export default CustomerFavourites;
