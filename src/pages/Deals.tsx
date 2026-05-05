// import React, { useEffect, useState } from 'react';
// import { Tag, Clock, ArrowRight, Star, Flame, Zap, ShoppingCart, Check, X, Package } from 'lucide-react';
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

// interface SelectionState {
//   productId: string | null;
//   variant: string | null;
// }

// const Deals: React.FC = () => {
//   const { sectionContent, loading: contentLoading } = useSectionContent('deals');
//   const { addToCart, setIsCartOpen } = useCart();
  
//   const [deals, setDeals] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Deal Builder Modal State
//   const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  
//   // Changed selections state to track BOTH product and variant
//   const [selections, setSelections] = useState<Record<string, SelectionState[]>>({});
  
//   // NEW: State specifically for FIXED items that have variants (like Coke/Sprite Can)
//   const [fixedSelections, setFixedSelections] = useState<Record<string, string | null>>({});

//   const [errorMsg, setErrorMsg] = useState<string>('');

//   useEffect(() => {
//     Promise.all([
//       fetch(`${API_URL}/api/catalog/deals`).then(res => res.json()),
//       fetch(`${API_URL}/api/catalog/products`).then(res => res.json())
//     ]).then(([dealsData, productsData]) => {
//       if (dealsData.deals) setDeals(dealsData.deals);
//       if (productsData.products) setProducts(productsData.products);
//     }).catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   const openDealBuilder = (deal: any) => {
//     const components = Array.isArray(deal.components) ? deal.components : [];
//     const initialSelections: Record<string, SelectionState[]> = {};
//     const initialFixedSelections: Record<string, string | null> = {};
    
//     components.forEach((comp: any) => {
//       if (comp.type === 'choice') {
//         initialSelections[comp.id] = Array(comp.quantity).fill({ productId: null, variant: null });
//       } else if (comp.type === 'fixed' && comp.fixedProductId) {
//         // If the fixed product has variants, set initial state to null so user is forced to pick one
//         const fixedProduct = products.find(p => p.id === comp.fixedProductId);
//         if (fixedProduct?.variants && fixedProduct.variants.length > 0) {
//           initialFixedSelections[comp.id] = null;
//         }
//       }
//     });

//     setSelections(initialSelections);
//     setFixedSelections(initialFixedSelections);
//     setSelectedDeal(deal);
//     setErrorMsg('');
//   };

//   const handleSelectionChange = (componentId: string, index: number, productId: string) => {
//     setSelections(prev => {
//       const updatedArray = [...prev[componentId]];
      
//       // If product changes, reset the variant to null
//       updatedArray[index] = { productId, variant: null };
//       return { ...prev, [componentId]: updatedArray };
//     });
//     setErrorMsg('');
//   };

//   const handleVariantChange = (componentId: string, index: number, variant: string) => {
//     setSelections(prev => {
//       const updatedArray = [...prev[componentId]];
//       updatedArray[index] = { ...updatedArray[index], variant };
//       return { ...prev, [componentId]: updatedArray };
//     });
//     setErrorMsg('');
//   };

//   const handleFixedVariantChange = (componentId: string, variant: string) => {
//     setFixedSelections(prev => ({
//       ...prev,
//       [componentId]: variant
//     }));
//     setErrorMsg('');
//   };

//   const handleAddToCart = () => {
//     if (!selectedDeal) return;

//     const components = Array.isArray(selectedDeal.components) ? selectedDeal.components : [];
//     const formattedSelections: any[] = [];

//     for (const comp of components) {
//       if (comp.type === 'choice') {
//         const userChoices = selections[comp.id];
        
//         for (let i = 0; i < userChoices.length; i++) {
//           const choice = userChoices[i];
          
//           if (!choice.productId) {
//             setErrorMsg(`Please complete all product selections for "${comp.title}".`);
//             return;
//           }

//           const product = products.find(p => p.id === choice.productId);
          
//           // Check if product requires a variant but user hasn't selected one
//           if (product?.variants && product.variants.length > 0 && !choice.variant) {
//              setErrorMsg(`Please select an option for ${product.name} in "${comp.title}".`);
//              return;
//           }

//           formattedSelections.push({
//             componentId: comp.id,
//             productId: choice.productId,
//             name: product ? product.name : 'Selected Item',
//             quantity: 1,
//             size: comp.requiredSize || null,
//             variant: choice.variant || null, // Include variant
//             type: 'choice'
//           });
//         }
//       } else if (comp.type === 'fixed' && comp.fixedProductId) {
//         const product = products.find(p => p.id === comp.fixedProductId);
//         const requiresVariant = product?.variants && product.variants.length > 0;
//         const chosenVariant = fixedSelections[comp.id];

//         if (requiresVariant && !chosenVariant) {
//           setErrorMsg(`Please select an option for the included ${product.name}.`);
//           return;
//         }

//         formattedSelections.push({
//           componentId: comp.id,
//           productId: comp.fixedProductId,
//           name: product ? product.name : comp.title,
//           quantity: comp.quantity || 1,
//           size: null,
//           variant: chosenVariant || null, // Include fixed product variant
//           type: 'fixed'
//         });
//       }
//     }

//     const dealMenuItem = {
//       id: `deal_${selectedDeal.id}`,
//       name: selectedDeal.title,
//       description: selectedDeal.description,
//       price: selectedDeal.price,
//       categoryId: 'deals',
//       dealId: selectedDeal.id,
//       selectedDealItems: formattedSelections 
//     };

//     addToCart(dealMenuItem as any, { price: selectedDeal.price, quantity: 1, selectedDealItems: formattedSelections });
    
//     setSelectedDeal(null);
//     setIsCartOpen(true);
//   };

//   const getFilteredProducts = (comp: any) => {
//     return products.filter(p => {
//       if (!p.isActive) return false;
      
//       if (comp.allowedCategoryIds && comp.allowedCategoryIds.length > 0) {
//         const safeAllowedIds = comp.allowedCategoryIds.map((id: string) => id.trim().toLowerCase());
//         const safeProductId = p.categoryId?.trim().toLowerCase();
        
//         if (!safeProductId || !safeAllowedIds.includes(safeProductId)) {
//           return false;
//         }
//       }
      
//       if (comp.requiredSize && p.sizes && Array.isArray(p.sizes)) {
//         const safeRequiredSize = comp.requiredSize.trim().toLowerCase();
//         const hasSize = p.sizes.some((s: any) => s.name.trim().toLowerCase() === safeRequiredSize);
//         if (!hasSize) return false;
//       }
      
//       return true;
//     });
//   };

//   if (contentLoading || loading) return <div className="min-h-screen bg-[#FDF8F2]" />;

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
//             {sectionContent.description || 'Grab our famous combo packs and save big. Build your own perfect combination.'}
//           </p>
//         </div>

//         {/* Deals Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
//           {deals.length === 0 ? (
//             <p className="text-center text-[#555] col-span-full">No active deals at the moment. Check back soon!</p>
//           ) : deals.map((deal: any) => (
//             <div
//               key={deal.id}
//               className="group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden hover:border-[#E8D8C8] transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] flex flex-col"
//             >
//               <div className="p-8 md:p-10 flex flex-col flex-1">
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
                
//                 <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-6">
//                   {deal.description}
//                 </p>

//                 <div className="mb-8 flex-1">
//                   <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888] mb-2">Bundle Includes:</p>
//                   <ul className="space-y-1">
//                     {(deal.components || []).map((comp: any, idx: number) => (
//                       <li key={idx} className="flex items-center gap-2 text-[13px] font-inter text-[#333]">
//                         <Package className="w-4 h-4 text-[#D4952A]" />
//                         <span className="font-medium">{comp.quantity}x</span> {comp.title}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="flex items-end justify-between mt-auto border-t border-[#E8D8C8] pt-6">
//                   <div className="flex flex-col">
//                     <span className="font-barlow font-700 text-[12px] uppercase tracking-wider text-[#888]">Combo Price</span>
//                     <span className="font-bebas text-[32px] text-[#C8201A] leading-none">${Number(deal.price).toFixed(2)}</span>
//                   </div>

//                   <button
//                     onClick={() => openDealBuilder(deal)}
//                     className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#C8201A] text-white font-barlow font-800 text-[13px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1"
//                   >
//                     Build Deal <ArrowRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               <div 
//                 className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
//                 style={{ backgroundColor: deal.color || '#C8201A' }}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Deal Builder Modal */}
//         {selectedDeal && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
//             <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
              
//               <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 md:p-8 flex justify-between items-start z-10">
//                 <div>
//                   <h3 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-1">
//                     {selectedDeal.title}
//                   </h3>
//                   <p className="font-inter text-[#555] text-[14px]">Customize your selections below.</p>
//                 </div>
//                 <button 
//                   onClick={() => setSelectedDeal(null)}
//                   className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-[#E8D8C8] transition-colors shrink-0"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="p-6 md:p-8 flex-1 space-y-8">
//                 {errorMsg && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
//                     {errorMsg}
//                   </div>
//                 )}

//                 {(selectedDeal.components || []).map((comp: any) => {
                   
//                   if (comp.type === 'fixed' && comp.fixedProductId) {
//                     const fixedProduct = products.find(p => p.id === comp.fixedProductId);
//                     const hasVariants = fixedProduct?.variants && fixedProduct.variants.length > 0;

//                     return (
//                       <div key={comp.id} className="border border-[#E8D8C8] rounded-xl p-5 bg-[#FDFAF6]">
//                         <div className="flex items-center gap-3 mb-4 border-b border-[#E8D8C8] pb-3">
//                           <div className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center font-bebas text-[18px]">
//                             {comp.quantity}
//                           </div>
//                           <div>
//                             <h4 className="font-barlow font-800 text-[16px] uppercase tracking-wide text-[#1A1A1A]">
//                               {comp.title}
//                             </h4>
//                           </div>
//                         </div>
                        
//                         <div className="flex flex-col gap-3 bg-white border border-[#E8D8C8] p-3 rounded-lg">
//                           <div className="flex items-center gap-3">
//                             <Check className="w-5 h-5 text-emerald-600 shrink-0" />
//                             <span className="font-inter text-[14px] font-medium text-[#1A1A1A]">
//                               {fixedProduct?.name || 'Included Item'}
//                             </span>
//                           </div>

//                           {/* Show variant selector for fixed product if needed */}
//                           {hasVariants && (
//                             <div className="pl-8">
//                                <select
//                                   value={fixedSelections[comp.id] || ''}
//                                   onChange={(e) => handleFixedVariantChange(comp.id, e.target.value)}
//                                   className="w-full bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg px-4 py-2.5 font-inter text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none"
//                                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
//                                 >
//                                   <option value="" disabled>-- Select Option --</option>
//                                   {fixedProduct.variants.map((v: string) => (
//                                     <option key={v} value={v}>{v}</option>
//                                   ))}
//                                 </select>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   }

//                   return (
//                     <div key={comp.id} className="border border-[#E8D8C8] rounded-xl p-5 bg-[#FDFAF6]">
//                       <div className="flex items-center gap-3 mb-4 border-b border-[#E8D8C8] pb-3">
//                         <div className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center font-bebas text-[18px]">
//                           {comp.quantity}
//                         </div>
//                         <div>
//                           <h4 className="font-barlow font-800 text-[16px] uppercase tracking-wide text-[#1A1A1A]">
//                             {comp.title}
//                           </h4>
//                           {comp.requiredSize && (
//                             <p className="text-[12px] text-[#C8201A] font-bold">Size: {comp.requiredSize}</p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-4">
//                         {Array.from({ length: comp.quantity }).map((_, index) => {
//                           const options = getFilteredProducts(comp);
//                           const choiceState = selections[comp.id]?.[index] || { productId: '', variant: '' };
//                           const selectedProduct = products.find(p => p.id === choiceState.productId);
//                           const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0;

//                           return (
//                             <div key={`${comp.id}-${index}`} className="flex flex-col gap-2">
//                               <select
//                                 value={choiceState.productId || ''}
//                                 onChange={(e) => handleSelectionChange(comp.id, index, e.target.value)}
//                                 className="w-full bg-white border border-[#E8D8C8] rounded-lg px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none"
//                                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
//                               >
//                                 <option value="" disabled>-- Select Option {index + 1} --</option>
//                                 {options.map((opt: any) => (
//                                   <option key={opt.id} value={opt.id}>{opt.name}</option>
//                                 ))}
//                               </select>

//                               {/* Show variant selector if the chosen product has variants */}
//                               {hasVariants && (
//                                 <select
//                                   value={choiceState.variant || ''}
//                                   onChange={(e) => handleVariantChange(comp.id, index, e.target.value)}
//                                   className="w-full bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg px-4 py-2.5 font-inter text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none ml-4 w-[calc(100%-1rem)]"
//                                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
//                                 >
//                                   <option value="" disabled>-- Choose {selectedProduct.name} Option --</option>
//                                   {selectedProduct.variants.map((v: string) => (
//                                     <option key={v} value={v}>{v}</option>
//                                   ))}
//                                 </select>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="sticky bottom-0 bg-white border-t border-[#E8D8C8] p-6 md:p-8 flex items-center justify-between z-10">
//                 <div className="font-bebas text-[36px] text-[#C8201A] leading-none">
//                   ${Number(selectedDeal.price).toFixed(2)}
//                 </div>
//                 <button
//                   onClick={handleAddToCart}
//                   className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[14px] font-800 uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1"
//                 >
//                   <ShoppingCart className="w-5 h-5" /> Add to Order
//                 </button>
//               </div>

//             </div>
//           </div>
//         )}

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
import { Tag, Clock, ArrowRight, Star, Flame, Zap, ShoppingCart, X, Package, Store } from 'lucide-react';
import { useSectionContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config/api';

const ICON_MAP: Record<string, any> = {
  Flame: <Flame className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
};

interface SelectionState {
  productId: string | null;
  variant: string | null;
}

const Deals: React.FC = () => {
  const { sectionContent, loading: contentLoading } = useSectionContent('deals');
  const { addToCart, setIsCartOpen, orderType, setOrderType } = useCart();
  
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [selections, setSelections] = useState<Record<string, SelectionState[]>>({});
  const [fixedSelections, setFixedSelections] = useState<Record<string, string | null>>({});
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/catalog/deals`).then(res => res.json()),
      fetch(`${API_URL}/api/catalog/products`).then(res => res.json())
    ]).then(([dealsData, productsData]) => {
      if (dealsData.deals) setDeals(dealsData.deals);
      if (productsData.products) setProducts(productsData.products);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isDealAvailableNow = (deal: any) => {
    if (!deal.constraints?.isTimeRestricted) return true;
    if (!deal.constraints.startTime || !deal.constraints.endTime) return true;

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const startMins = parseTime(deal.constraints.startTime);
    const endMins = parseTime(deal.constraints.endTime);

    return currentMins >= startMins && currentMins <= endMins;
  };

  const openDealBuilder = (deal: any) => {
    if (!isDealAvailableNow(deal)) return;

    const components = Array.isArray(deal.components) ? deal.components : [];
    const initialSelections: Record<string, SelectionState[]> = {};
    const initialFixedSelections: Record<string, string | null> = {};
    
    components.forEach((comp: any) => {
      if (comp.type === 'choice') {
        initialSelections[comp.id] = Array(comp.quantity).fill({ productId: null, variant: null });
      } else if (comp.type === 'fixed' && comp.fixedProductId) {
        const fixedProduct = products.find(p => p.id === comp.fixedProductId);
        if (fixedProduct?.variants && fixedProduct.variants.length > 0) {
          initialFixedSelections[comp.id] = null;
        }
      }
    });

    setSelections(initialSelections);
    setFixedSelections(initialFixedSelections);
    setSelectedDeal(deal);
    setErrorMsg('');
  };

  const handleSelectionChange = (componentId: string, index: number, productId: string) => {
    setSelections(prev => {
      const updatedArray = [...prev[componentId]];
      updatedArray[index] = { productId, variant: null };
      return { ...prev, [componentId]: updatedArray };
    });
    setErrorMsg('');
  };

  const handleVariantChange = (componentId: string, index: number, variant: string) => {
    setSelections(prev => {
      const updatedArray = [...prev[componentId]];
      updatedArray[index] = { ...updatedArray[index], variant };
      return { ...prev, [componentId]: updatedArray };
    });
    setErrorMsg('');
  };

  const handleFixedVariantChange = (componentId: string, variant: string) => {
    setFixedSelections(prev => ({ ...prev, [componentId]: variant }));
    setErrorMsg('');
  };

  const handleAddToCart = () => {
    if (!selectedDeal) return;

    if (selectedDeal.constraints?.pickupOnly && orderType === 'delivery') {
      alert('This deal is strictly Pickup Only. Switching your order type to Pickup.');
      setOrderType('pickup');
    }

    const components = Array.isArray(selectedDeal.components) ? selectedDeal.components : [];
    const formattedSelections: any[] = [];

    for (const comp of components) {
      if (comp.type === 'choice') {
        const userChoices = selections[comp.id];
        
        for (let i = 0; i < userChoices.length; i++) {
          const choice = userChoices[i];
          
          if (!choice.productId) {
            setErrorMsg(`Please complete all product selections for "${comp.title}".`);
            return;
          }

          const product = products.find(p => p.id === choice.productId);
          
          if (product?.variants && product.variants.length > 0 && !choice.variant) {
             setErrorMsg(`Please select an option for ${product.name} in "${comp.title}".`);
             return;
          }

          formattedSelections.push({
            componentId: comp.id,
            productId: choice.productId,
            name: product ? product.name : 'Selected Item',
            quantity: 1,
            size: comp.requiredSize || null,
            variant: choice.variant || null,
            type: 'choice'
          });
        }
      } else if (comp.type === 'fixed' && comp.fixedProductId) {
        const product = products.find(p => p.id === comp.fixedProductId);
        const requiresVariant = product?.variants && product.variants.length > 0;
        const chosenVariant = fixedSelections[comp.id];

        if (requiresVariant && !chosenVariant) {
          setErrorMsg(`Please select an option for the included ${product?.name || comp.title}.`);
          return;
        }

        formattedSelections.push({
          componentId: comp.id,
          productId: comp.fixedProductId,
          name: product ? product.name : comp.title,
          quantity: comp.quantity || 1,
          size: null,
          variant: chosenVariant || null,
          type: 'fixed'
        });
      }
    }

    const dealMenuItem = {
      id: `deal_${selectedDeal.id}`,
      name: selectedDeal.title,
      description: selectedDeal.description,
      price: selectedDeal.price,
      categoryId: 'deals',
      dealId: selectedDeal.id,
      selectedDealItems: formattedSelections,
      pickupOnly: selectedDeal.constraints?.pickupOnly
    };

    addToCart(dealMenuItem as any, { price: selectedDeal.price, quantity: 1, selectedDealItems: formattedSelections });
    
    setSelectedDeal(null);
    setIsCartOpen(true);
  };

  const getFilteredProducts = (comp: any) => {
    return products.filter(p => {
      if (!p.isActive) return false;
      if (comp.allowedCategoryIds && comp.allowedCategoryIds.length > 0) {
        const safeAllowedIds = comp.allowedCategoryIds.map((id: string) => id.trim().toLowerCase());
        const safeProductId = p.categoryId?.trim().toLowerCase();
        if (!safeProductId || !safeAllowedIds.includes(safeProductId)) return false;
      }
      if (comp.requiredSize && p.sizes && Array.isArray(p.sizes)) {
        const safeRequiredSize = comp.requiredSize.trim().toLowerCase();
        const hasSize = p.sizes.some((s: any) => s.name.trim().toLowerCase() === safeRequiredSize);
        if (!hasSize) return false;
      }
      return true;
    });
  };

  if (contentLoading || loading) return <div className="min-h-screen bg-[#FDF8F2]" />;

  return (
    <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
      <div className="container-custom">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {deals.length === 0 ? (
            <p className="text-center text-[#555] col-span-full">No active deals at the moment. Check back soon!</p>
          ) : deals.map((deal: any) => {
            const isAvailable = isDealAvailableNow(deal);

            return (
              <div
                key={deal.id}
                className={`group relative bg-[#F5EDE0] border border-[#E8D8C8] rounded-[20px] overflow-hidden transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] flex flex-col
                  ${!isAvailable ? 'opacity-70 grayscale' : 'hover:border-[#E8D8C8] hover:-translate-y-2'}
                `}
              >
                <div className="p-8 md:p-10 flex flex-col flex-1 relative">
                  
                  {/* Deal Tag - Top Right */}
                  <div 
                    className="absolute top-6 right-6 px-4 py-1.5 rounded-full font-barlow font-800 text-[11px] tracking-widest uppercase flex items-center gap-2"
                    style={{ backgroundColor: `${deal.color || '#C8201A'}20`, color: deal.color || '#C8201A', border: `1px solid ${deal.color || '#C8201A'}40` }}
                  >
                    {ICON_MAP[deal.icon] || <Tag className="w-5 h-5" />}
                    {deal.tag || 'Special'}
                  </div>

                  {/* Constraints Badges - Top Left */}
                  <div className="absolute top-6 left-6 flex flex-col items-start gap-2">
                    {deal.constraints?.pickupOnly && (
                       <div className="bg-[#1A1A1A] text-white px-3 py-1 rounded font-barlow text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                         <Store className="w-3 h-3" /> Pickup Only
                       </div>
                    )}
                    {deal.constraints?.isTimeRestricted && (
                       <div className="bg-white border border-[#E8D8C8] text-[#555] px-3 py-1 rounded font-barlow text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                         <Clock className="w-3 h-3" /> {deal.constraints.startTime} - {deal.constraints.endTime}
                       </div>
                    )}
                  </div>

                  <h3 className="font-bebas text-[36px] md:text-[42px] text-[#1A1A1A] tracking-wider mb-2 group-hover:text-[#D4952A] transition-colors mt-12 md:mt-8">
                    {deal.title}
                  </h3>
                  
                  <p className="font-inter text-[#555555] text-[15px] leading-relaxed mb-6">
                    {deal.description}
                  </p>

                  <div className="mb-8 flex-1">
                    <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888] mb-2">Bundle Includes:</p>
                    <ul className="space-y-1">
                      {(deal.components || []).map((comp: any, idx: number) => (
                        >
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
                      disabled={!isAvailable}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-barlow font-800 text-[13px] uppercase tracking-widest transition-all duration-300
                        ${isAvailable 
                          ? 'bg-[#1A1A1A] hover:bg-[#C8201A] text-white hover:shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1'
                          : 'bg-[#E8D8C8] text-[#888] cursor-not-allowed'
                        }
                      `}
                    >
                      {isAvailable ? 'Build Deal' : 'Not Available Now'} {isAvailable && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full" style={{ backgroundColor: deal.color || '#C8201A' }} />
              </div>
            );
          })}
        </div>

        {selectedDeal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
             <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 md:p-8 flex justify-between items-start z-10">
                  <div><h3 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-1">{selectedDeal.title}</h3></div>
                  <button onClick={() => setSelectedDeal(null)} className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#555] hover:text-[#1A1A1A] hover:bg-[#E8D8C8] transition-colors shrink-0"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 md:p-8 flex-1 space-y-8">
                  {errorMsg && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{errorMsg}</div>)}
                  
                  {(selectedDeal.components || []).map((comp: any) => {
                    if (comp.type === 'fixed' && comp.fixedProductId) {
                      const fixedProduct = products.find(p => p.id === comp.fixedProductId);
                      const hasVariants = fixedProduct?.variants && fixedProduct.variants.length > 0;

                      return (
                        <div key={comp.id} className="border border-[#E8D8C8] rounded-xl p-5 bg-[#FDFAF6]">
                          <div className="flex items-center gap-3 mb-4 border-b border-[#E8D8C8] pb-3">
                            <div className="bg-[#1A1A1A] text-white w-8 h-8 rounded-full flex items-center justify-center font-bebas text-[18px]">
                              {comp.quantity}
                            </div>
                            <div>
                              <h4 className="font-barlow font-800 text-[16px] uppercase tracking-wide text-[#1A1A1A]">
                                {comp.title}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-3 bg-white border border-[#E8D8C8] p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-inter text-[14px] font-medium text-[#1A1A1A]">
                                {fixedProduct?.name || 'Included Item'}
                              </span>
                            </div>

                            {hasVariants && (
                              <div className="pl-8">
                                 <select
                                    value={fixedSelections[comp.id] || ''}
                                    onChange={(e) => handleFixedVariantChange(comp.id, e.target.value)}
                                    className="w-full bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg px-4 py-2.5 font-inter text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none"
                                  >
                                    <option value="" disabled>-- Select Option --</option>
                                    {fixedProduct.variants.map((v: string) => (
                                      <option key={v} value={v}>{v}</option>
                                    ))}
                                  </select>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
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

                        <div className="space-y-4">
                          {Array.from({ length: comp.quantity }).map((_, index) => {
                            const options = getFilteredProducts(comp);
                            const choiceState = selections[comp.id]?.[index] || { productId: '', variant: '' };
                            const selectedProduct = products.find(p => p.id === choiceState.productId);
                            const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0;

                            return (
                              <div key={`${comp.id}-${index}`} className="flex flex-col gap-2">
                                <select
                                  value={choiceState.productId || ''}
                                  onChange={(e) => handleSelectionChange(comp.id, index, e.target.value)}
                                  className="w-full bg-white border border-[#E8D8C8] rounded-lg px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none"
                                >
                                  <option value="" disabled>-- Select Option {index + 1} --</option>
                                  {options.map((opt: any) => (
                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                  ))}
                                </select>

                                {hasVariants && (
                                  <select
                                    value={choiceState.variant || ''}
                                    onChange={(e) => handleVariantChange(comp.id, index, e.target.value)}
                                    className="w-full bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg px-4 py-2.5 font-inter text-[13px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] appearance-none ml-4 w-[calc(100%-1rem)]"
                                  >
                                    <option value="" disabled>-- Choose {selectedProduct.name} Option --</option>
                                    {selectedProduct.variants.map((v: string) => (
                                      <option key={v} value={v}>{v}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="sticky bottom-0 bg-white border-t border-[#E8D8C8] p-6 md:p-8 flex items-center justify-between z-10">
                  <div className="font-bebas text-[36px] text-[#C8201A] leading-none">${Number(selectedDeal.price).toFixed(2)}</div>
                  <button onClick={handleAddToCart} className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[14px] font-800 uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(200,32,26,0.3)] hover:-translate-y-1">
                    <ShoppingCart className="w-5 h-5" /> Add to Order
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;
