// import React, { useEffect, useState } from 'react';
// import { Tag, Clock, ArrowRight, Star, Flame, Zap, ShoppingCart, Check } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useSectionContent } from '../context/ContentContext';
// import { useCart } from '../context/CartContext';
// import { API_URL } from '../config/api';

// const ICON_MAP: Record<string, any> = {
//   Flame: <Flame className="w-5 h-5" />,
//   Star: <Star className="w-5 h-5" />,
//   Zap: <Zap className="w-5 h-5" />,
//   Clock: <Clock className="w-5 h-5" />,
// };

// const Deals: React.FC = () => {
//   const { sectionContent, loading } = useSectionContent('deals');
//   const { addToCart, setIsCartOpen } = useCart();
  
//   const [deals, setDeals] = useState<any[]>([]);
//   const [addingId, setAddingId] = useState<string | null>(null);

//   useEffect(() => {
//     // Fetch live deals from the backend
//     fetch(`${API_URL}/api/catalog/deals`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.deals) setDeals(data.deals);
//       })
//       .catch(console.error);
//   }, []);

//   const handleAddDeal = (deal: any) => {
//     // Treat the Deal as a standard cart item
//     const dealMenuItem = {
//       id: `deal_${deal.id}`,
//       name: deal.title,
//       description: deal.description,
//       price: deal.price,
//       categoryId: 'deals',
//     };

//     addToCart(dealMenuItem as any, { price: deal.price, quantity: 1 });
    
//     setAddingId(deal.id);
//     setIsCartOpen(true);
//     setTimeout(() => setAddingId(null), 2000);
//   };

//   if (loading) return <div className="min-h-screen bg-[#FDF8F2]" />;

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
//           {deals.length === 0 ? (
//             <p className="text-center text-[#555] col-span-full">No active deals at the moment. Check back soon!</p>
//           ) : deals.map((deal: any) => (
//             <div
//               key={deal.id}
//               className="group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden hover:border-[#E8D8C8] transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
//             >
//               <div className="p-8 md:p-10 flex flex-col h-full">
//                 {/* Badge */}
//                 <div 
//                   className="absolute top-6 right-6 px-4 py-1.5 rounded-full font-barlow font-800 text-[11px] tracking-widest uppercase flex items-center gap-2"
//                   style={{ backgroundColor: `${deal.color || '#C8201A'}20`, color: deal.color || '#C8201A', border: `1px solid ${deal.color || '#C8201A'}40` }}
//                 >
//                   {ICON_MAP[deal.icon] || <Tag className="w-5 h-5" />}
//                   {deal.tag || 'Special'}
//                 </div>

//                 <h3 className="font-bebas text-[36px] md:text-[42px] text-[#1A1A1A] tracking-wider mb-2 group-hover:text-[#D4952A] transition-colors mt-4">
//                   {deal.title}
//                 </h3>
                
//                 <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-8 flex-grow">
//                   {deal.description}
//                 </p>

//                 <div className="flex items-end justify-between mt-auto border-t border-[#E8D8C8] pt-6">
//                   <div className="flex flex-col">
//                     <span className="font-barlow font-700 text-[12px] uppercase tracking-wider text-[#888]">Combo Price</span>
//                     <span className="font-bebas text-[32px] text-[#C8201A] leading-none">${Number(deal.price).toFixed(2)}</span>
//                   </div>

//                   <button
//                     onClick={() => handleAddDeal(deal)}
//                     className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#C8201A] text-white font-barlow font-800 text-[13px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1"
//                   >
//                     {addingId === deal.id ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add Deal</>}
//                   </button>
//                 </div>
//               </div>

//               {/* Decorative line */}
//               <div 
//                 className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
//                 style={{ backgroundColor: deal.color || '#C8201A' }}
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
import { Tag, Clock, ArrowRight, Star, Flame, Zap, ShoppingCart, Check, X, Package } from 'lucide-react';
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
  const { sectionContent, loading: contentLoading } = useSectionContent('deals');
  const { addToCart, setIsCartOpen } = useCart();
  
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Deal Builder Modal State
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [selections, setSelections] = useState<Record<string, any[]>>({});
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    // Fetch live deals and all active products for the selection dropdowns
    Promise.all([
      fetch(`${API_URL}/api/catalog/deals`).then(res => res.json()),
      fetch(`${API_URL}/api/catalog/products`).then(res => res.json())
    ]).then(([dealsData, productsData]) => {
      if (dealsData.deals) setDeals(dealsData.deals);
      if (productsData.products) setProducts(productsData.products);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openDealBuilder = (deal: any) => {
    const components = Array.isArray(deal.components) ? deal.components : [];
    
    // Initialize empty selections for 'choice' components
    const initialSelections: Record<string, any[]> = {};
    components.forEach(comp => {
      if (comp.type === 'choice') {
        // Create an array of nulls based on the required quantity
        initialSelections[comp.id] = Array(comp.quantity).fill(null);
      }
    });

    setSelections(initialSelections);
    setSelectedDeal(deal);
    setErrorMsg('');
  };

  const handleSelectionChange = (componentId: string, index: number, productId: string) => {
    setSelections(prev => {
      const updatedArray = [...prev[componentId]];
      updatedArray[index] = productId;
      return { ...prev, [componentId]: updatedArray };
    });
    setErrorMsg('');
  };

  const handleAddToCart = () => {
    if (!selectedDeal) return;

    const components = Array.isArray(selectedDeal.components) ? selectedDeal.components : [];
    const formattedSelections: any[] = [];

    // Validate and format selections
    for (const comp of components) {
      if (comp.type === 'choice') {
        const userChoices = selections[comp.id];
        
        // Check if any slot for this component is empty
        if (userChoices.includes(null) || userChoices.includes('')) {
          setErrorMsg(`Please complete all selections for "${comp.title}".`);
          return;
        }

        // Add choices to the formatted array expected by the backend
        userChoices.forEach(productId => {
          formattedSelections.push({
            componentId: comp.id,
            productId: productId,
            quantity: 1, // 1 per dropdown slot
            size: comp.requiredSize || null
          });
        });
      }
    }

    // Build the Cart Item
    const dealMenuItem = {
      id: `deal_${selectedDeal.id}`,
      name: selectedDeal.title,
      description: selectedDeal.description,
      price: selectedDeal.price,
      categoryId: 'deals',
      dealId: selectedDeal.id,
      selectedDealItems: formattedSelections // Pass dynamic choices to Cart Context
    };

    addToCart(dealMenuItem as any, { price: selectedDeal.price, quantity: 1 });
    
    setSelectedDeal(null);
    setIsCartOpen(true);
  };

  const getFilteredProducts = (comp: any) => {
    return products.filter(p => {
      // Must be active
      if (!p.isActive) return false;
      // Must match allowed categories if restricted
      if (comp.allowedCategoryIds && comp.allowedCategoryIds.length > 0) {
        if (!comp.allowedCategoryIds.includes(p.categoryId)) return false;
      }
      // Must have the required size if specified
      if (comp.requiredSize && p.sizes && Array.isArray(p.sizes)) {
        const hasSize = p.sizes.some((s: any) => s.name === comp.requiredSize);
        if (!hasSize) return false;
      }
      return true;
    });
  };

  if (contentLoading || loading) return <div className="min-h-screen bg-[#FDF8F2]" />;

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
            {sectionContent.description || 'Grab our famous combo packs and save big. Build your own perfect combination.'}
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {deals.length === 0 ? (
            <p className="text-center text-[#555] col-span-full">No active deals at the moment. Check back soon!</p>
          ) : deals.map((deal: any) => (
            <div
              key={deal.id}
              className="group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden hover:border-[#E8D8C8] transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] flex flex-col"
            >
              <div className="p-8 md:p-10 flex flex-col flex-1">
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
                
                <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-6">
                  {deal.description}
                </p>

                {/* Summary of what's inside */}
                <div className="mb-8 flex-1">
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888] mb-2">Bundle Includes:</p>
                  <ul className="space-y-1">
                    {(deal.components || []).map((comp: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-[13px] font-inter text-[#333]">
                        <Package className="w-4 h-4 text-[#D4952A]" />
                        <span className="font-medium">{comp.quantity}x</span> {comp.title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-end justify-between mt-auto border-t border-[#E8D8C8] pt-6">
                  <div className="flex flex-col">
                    <span className="font-barlow font-700 text-[12px] uppercase tracking-wider text-[#888]">Combo Price</span>
                    <span className="font-bebas text-[32px] text-[#C8201A] leading-none">${Number(deal.price).toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => openDealBuilder(deal)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#C8201A] text-white font-barlow font-800 text-[13px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1"
                  >
                    Build Deal <ArrowRight className="w-4 h-4" />
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

        {/* Deal Builder Modal */}
        {selectedDeal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
              
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 md:p-8 flex justify-between items-start z-10">
                <div>
                  <h3 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-1">
                    {selectedDeal.title}
                  </h3>
                  <p className="font-inter text-[#555] text-[14px]">Customize your selections below.</p>
                </div>
                <button 
                  onClick={() => setSelectedDeal(null)}
                  className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-[#E8D8C8] transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 flex-1 space-y-8">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                {(selectedDeal.components || []).map((comp: any) => (
                  <div key={comp.id} className="border border-[#E8D8C8] rounded-xl p-5 bg-[#FDFAF6]">
                    <div className="flex items-center gap-3 mb-4 border-b border-[#E8D8C8] pb-3">
                      <div className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center font-bebas text-[18px]">
                        {comp.quantity}
                      </div>
                      <div>
                        <h4 className="font-barlow font-800 text-[16px] uppercase tracking-wide text-[#1A1A1A]">
                          {comp.title}
                        </h4>
                        {comp.requiredSize && (
                          <p className="text-[12px] text-[#C8201A] font-bold">Size: {comp.requiredSize}</p>
                        )}
                      </div>
                    </div>

                    {comp.type === 'fixed' ? (
                      <div className="flex items-center gap-3 bg-white border border-[#E8D8C8] p-3 rounded-lg opacity-80">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span className="font-inter text-[14px] font-medium text-[#1A1A1A]">
                          Included automatically
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Array.from({ length: comp.quantity }).map((_, index) => {
                          const options = getFilteredProducts(comp);
                          const currentValue = selections[comp.id]?.[index] || '';

                          return (
                            <select
                              key={`${comp.id}-${index}`}
                              value={currentValue}
                              onChange={(e) => handleSelectionChange(comp.id, index, e.target.value)}
                              className="w-full bg-white border border-[#E8D8C8] rounded-lg px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none"
                              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
                            >
                              <option value="" disabled>-- Select Option {index + 1} --</option>
                              {options.map((opt: any) => (
                                <option key={opt.id} value={opt.id}>{opt.name}</option>
                              ))}
                            </select>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-[#E8D8C8] p-6 md:p-8 flex items-center justify-between z-10">
                <div className="font-bebas text-[36px] text-[#C8201A] leading-none">
                  ${Number(selectedDeal.price).toFixed(2)}
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[14px] font-800 uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Order
                </button>
              </div>

            </div>
          </div>
        )}

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
