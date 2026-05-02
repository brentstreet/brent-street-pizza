// import { useEffect, useState } from 'react';
// import { API_URL } from '../../config/api';
// import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

// export default function DealManager() {
//   const [deals, setDeals] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDeal, setEditingDeal] = useState<any>(null);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: 0,
//     tag: 'Special',
//     icon: 'Star',
//     color: '#C8201A',
//     isActive: true,
//     products: [] as string[],
//   });

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
      
//       const [dealsRes, productsRes] = await Promise.all([
//         fetch(`${API_URL}/api/catalog/deals?showInactive=true`),
//         fetch(`${API_URL}/api/admin/products`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       if (dealsRes.ok) {
//         const dData = await dealsRes.json();
//         setDeals(dData.deals || []);
//       }
      
//       if (productsRes.ok) {
//         const pData = await productsRes.json();
//         setProducts(pData || []);
//       }
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleOpenModal = (deal: any = null) => {
//     if (deal) {
//       setEditingDeal(deal);
//       setFormData({
//         title: deal.title,
//         description: deal.description || '',
//         price: Number(deal.price),
//         tag: deal.tag || 'Special',
//         icon: deal.icon || 'Star',
//         color: deal.color || '#C8201A',
//         isActive: deal.isActive !== undefined ? deal.isActive : true,
//         products: Array.isArray(deal.products) ? deal.products : [],
//       });
//     } else {
//       setEditingDeal(null);
//       setFormData({
//         title: '',
//         description: '',
//         price: 0,
//         tag: 'Special',
//         icon: 'Star',
//         color: '#C8201A',
//         isActive: true,
//         products: [],
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('adminToken');
//       const method = editingDeal ? 'PUT' : 'POST';
//       const url = editingDeal 
//         ? `${API_URL}/api/admin/deals/${editingDeal.id}`
//         : `${API_URL}/api/admin/deals`;

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (res.ok) {
//         setIsModalOpen(false);
//         fetchData(); 
//       } else {
//         const err = await res.json();
//         alert('Failed: ' + (err.error || 'Unknown error'));
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error saving deal');
//     }
//   };

//   const handleDelete = async (id: string, title: string) => {
//     if (!window.confirm(`Are you sure you want to delete deal: ${title}?`)) return;
    
//     try {
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(`${API_URL}/api/admin/deals/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.ok) fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleProductToggle = (productId: string) => {
//     setFormData(prev => {
//       const isSelected = prev.products.includes(productId);
//       if (isSelected) {
//         return { ...prev, products: prev.products.filter(id => id !== productId) };
//       } else {
//         return { ...prev, products: [...prev.products, productId] };
//       }
//     });
//   };

//   if (loading) return <div className="p-12 text-center animate-spin"><Tag className="w-8 h-8 text-[#C8201A] mx-auto" /></div>;

//   return (
//     <div className="max-w-7xl mx-auto animate-in fade-in">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
//             Deals & Combos
//           </h2>
//           <p className="font-inter text-[14px] text-[#555555]">
//             Manage bundle offers, combinations of existing products, and dynamic pricing.
//           </p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-700 uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#C8201A]/30"
//         >
//           <Plus className="w-4 h-4" /> Add Deal
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {deals.map((deal) => (
//           <div key={deal.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-lg transition-all relative">
//             <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: deal.color || '#C8201A' }} />
//             <div className="p-6 pl-8 flex-1 flex flex-col">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-barlow text-[20px] font-800 text-[#1A1A1A] uppercase tracking-wide leading-tight">
//                   {deal.title}
//                 </h3>
//                 <span className="font-bebas text-[28px] text-[#C8201A] leading-none">
//                   ${Number(deal.price).toFixed(2)}
//                 </span>
//               </div>
//               <p className="font-inter text-[13px] text-[#555] mb-4">
//                 {deal.description}
//               </p>
              
//               <div className="mb-4">
//                 <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888] mb-1.5">Includes ({deal.products?.length || 0} items):</p>
//                 <div className="flex flex-wrap gap-1.5">
//                   {(deal.products || []).map((prodId: string) => {
//                     const p = products.find(x => x.id === prodId);
//                     return p ? (
//                       <span key={prodId} className="bg-[#FDF8F2] border border-[#E8D8C8] text-[#555] text-[11px] font-inter px-2 py-0.5 rounded-md">
//                         {p.name}
//                       </span>
//                     ) : null;
//                   })}
//                 </div>
//               </div>
              
//               <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8D8C8]">
//                 <div className="flex gap-2">
//                   <span className="bg-[#F5F5F5] text-[#555] font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
//                     {deal.icon} Icon
//                   </span>
//                   {!deal.isActive && (
//                     <span className="bg-red-100 text-red-700 font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded">
//                       Inactive
//                     </span>
//                   )}
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleOpenModal(deal)}
//                     className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#D4952A] hover:bg-[#D4952A]/10 transition-colors"
//                   >
//                     <Edit2 className="w-3.5 h-3.5" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(deal.id, deal.title)}
//                     className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#C8201A] hover:bg-[#C8201A]/10 transition-colors"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 flex justify-between items-center z-10">
//               <h3 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A] leading-none">
//                 {editingDeal ? 'Edit Deal' : 'Add New Deal'}
//               </h3>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#1A1A1A]"
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="p-6 space-y-5">
//               <div>
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Deal Title</label>
//                 <input
//                   required
//                   value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
//                   className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   placeholder="E.g., Family Combo"
//                 />
//               </div>

//               <div>
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Description</label>
//                 <textarea
//                   required
//                   value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
//                   className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none min-h-[80px]"
//                   placeholder="2 Large Pizzas + 1 Garlic Bread + 1.25L Drink"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Deal Price ($)</label>
//                   <input
//                     required type="number" step="0.01" min="0"
//                     value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Badge Tag</label>
//                   <input
//                     value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                     placeholder="E.g., Hot, Special, Save 20%"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Icon Type</label>
//                   <select
//                     value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   >
//                     <option value="Star">Star</option>
//                     <option value="Flame">Flame (Hot)</option>
//                     <option value="Zap">Zap (Flash)</option>
//                     <option value="Clock">Clock (Limited)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Accent Color</label>
//                   <div className="flex gap-3">
//                     <input
//                       type="color"
//                       value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}
//                       className="h-11 w-11 rounded border border-[#E8D8C8] cursor-pointer"
//                     />
//                     <input
//                       type="text"
//                       value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}
//                       className="flex-1 border border-[#E8D8C8] rounded-xl px-4 py-2 font-mono text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Product Multi-Select */}
//               <div className="pt-2">
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-3">
//                   Included Products (Select multiple)
//                 </label>
//                 <div className="border border-[#E8D8C8] rounded-xl max-h-48 overflow-y-auto bg-[#FDFAF6] p-2 space-y-1">
//                   {products.map(p => (
//                     <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
//                       <input 
//                         type="checkbox" 
//                         checked={formData.products.includes(p.id)}
//                         onChange={() => handleProductToggle(p.id)}
//                         className="w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
//                       />
//                       <span className="font-inter text-[13px] text-[#1A1A1A]">{p.name} <span className="text-[#888] ml-1">(${Number(p.price).toFixed(2)})</span></span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 border-t border-[#E8D8C8]">
//                 <label className="flex items-center gap-2 cursor-pointer group">
//                   <input 
//                     type="checkbox" 
//                     checked={formData.isActive} 
//                     onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
//                     className="w-4 h-4 text-emerald-600 rounded border-[#E8D8C8] focus:ring-emerald-600"
//                   />
//                   <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Deal is Active</span>
//                 </label>
//               </div>

//               <div className="pt-4 flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-6 py-3 rounded-xl border-2 border-[#E8D8C8] hover:bg-[#FDF8F2] font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555555]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-8 py-3 rounded-xl bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-800 uppercase tracking-widest shadow-[0_8px_20px_rgba(200,32,26,0.3)]"
//                 >
//                   Save Deal
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { Plus, Edit2, Trash2, Tag, Clock, Package, MapPin, X } from 'lucide-react';

export default function DealManager() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    tag: 'Special',
    icon: 'Star',
    color: '#C8201A',
    isActive: true,
    components: [] as any[],
    constraints: {
      isTimeRestricted: false,
      startTime: '',
      endTime: '',
      pickupOnly: false
    }
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [dealsRes, productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/catalog/deals?showInactive=true`),
        fetch(`${API_URL}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/catalog/categories`)
      ]);

      if (dealsRes.ok) {
        const dData = await dealsRes.json();
        setDeals(dData.deals || []);
      }
      
      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData || []);
      }

      if (categoriesRes.ok) {
        const cData = await categoriesRes.json();
        setCategories(cData.categories || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (deal: any = null) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        title: deal.title,
        description: deal.description || '',
        price: Number(deal.price),
        tag: deal.tag || 'Special',
        icon: deal.icon || 'Star',
        color: deal.color || '#C8201A',
        isActive: deal.isActive !== undefined ? deal.isActive : true,
        components: Array.isArray(deal.components) ? deal.components : [],
        constraints: deal.constraints || { isTimeRestricted: false, startTime: '', endTime: '', pickupOnly: false }
      });
    } else {
      setEditingDeal(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        tag: 'Special',
        icon: 'Star',
        color: '#C8201A',
        isActive: true,
        components: [],
        constraints: { isTimeRestricted: false, startTime: '', endTime: '', pickupOnly: false }
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const method = editingDeal ? 'PUT' : 'POST';
      const url = editingDeal 
        ? `${API_URL}/api/admin/deals/${editingDeal.id}`
        : `${API_URL}/api/admin/deals`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData(); 
      } else {
        const err = await res.json();
        alert('Failed: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error saving deal');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete deal: ${title}?`)) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/deals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete deal');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Component Builder Helpers ---
  const addComponent = () => {
    const newComp = {
      id: crypto.randomUUID(),
      title: '',
      type: 'choice',
      quantity: 1,
      allowedCategoryIds: [],
      requiredSize: '',
      fixedProductId: ''
    };
    setFormData(prev => ({ ...prev, components: [...prev.components, newComp] }));
  };

  const updateComponent = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeComponent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== id)
    }));
  };

  if (loading) return <div className="p-12 text-center animate-spin"><Tag className="w-8 h-8 text-[#C8201A] mx-auto" /></div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
            Deals & Combos
          </h2>
          <p className="font-inter text-[14px] text-[#555555]">
            Manage dynamic bundle offers, combinations, and time constraints.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-700 uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#C8201A]/30"
        >
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-lg transition-all relative">
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: deal.color || '#C8201A' }} />
            <div className="p-6 pl-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-barlow text-[20px] font-800 text-[#1A1A1A] uppercase tracking-wide leading-tight">
                  {deal.title}
                </h3>
                <span className="font-bebas text-[28px] text-[#C8201A] leading-none">
                  ${Number(deal.price).toFixed(2)}
                </span>
              </div>
              <p className="font-inter text-[13px] text-[#555] mb-4">
                {deal.description}
              </p>
              
              {/* Components Summary */}
              <div className="mb-4">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888] mb-1.5">Bundle Structure:</p>
                <div className="space-y-1">
                  {(deal.components || []).map((comp: any) => (
                    <div key={comp.id} className="flex items-center gap-2 text-[12px] font-inter text-[#555]">
                      <Package className="w-3.5 h-3.5 text-[#D4952A]" />
                      {comp.quantity}x {comp.title} {comp.type === 'choice' ? '(Choice)' : '(Fixed)'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints Flags */}
              <div className="flex gap-2 mb-4">
                {deal.constraints?.pickupOnly && (
                  <span className="bg-amber-100 text-amber-800 font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Pickup Only
                  </span>
                )}
                {deal.constraints?.isTimeRestricted && (
                  <span className="bg-blue-100 text-blue-800 font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {deal.constraints.startTime} - {deal.constraints.endTime}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8D8C8]">
                <div className="flex gap-2">
                  <span className="bg-[#F5F5F5] text-[#555] font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1">
                    {deal.icon} Icon
                  </span>
                  {!deal.isActive && (
                    <span className="bg-red-100 text-red-700 font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(deal)}
                    className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#D4952A] hover:bg-[#D4952A]/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id, deal.title)}
                    className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#C8201A] hover:bg-[#C8201A]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 flex justify-between items-center z-10">
              <h3 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A] leading-none">
                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#1A1A1A]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Deal Title</label>
                  <input
                    required
                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                    placeholder="E.g., Family Combo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none min-h-[60px]"
                    placeholder="2 Large Pizzas + 1 Garlic Bread + 1.25L Drink"
                  />
                </div>

                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Deal Price ($)</label>
                  <input
                    required type="number" step="0.01" min="0"
                    value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Badge Tag</label>
                  <input
                    value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  />
                </div>
              </div>

              {/* Advanced Bundle Builder */}
              <div className="bg-[#FDFAF6] border border-[#E8D8C8] rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-barlow font-800 uppercase tracking-wider text-[#1A1A1A]">Bundle Components</h4>
                  <button type="button" onClick={addComponent} className="flex items-center gap-2 text-white bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-black">
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.components.map((comp, idx) => (
                    <div key={comp.id} className="bg-white border border-[#E8D8C8] p-4 rounded-xl relative shadow-sm">
                      <button type="button" onClick={() => removeComponent(comp.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                        <X className="w-5 h-5" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pr-6">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Component Title</label>
                          <input 
                            type="text" required value={comp.title} 
                            onChange={(e) => updateComponent(comp.id, 'title', e.target.value)}
                            placeholder="e.g., Any 2 Large Pizzas" 
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8201A]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity</label>
                          <input 
                            type="number" min="1" required value={comp.quantity} 
                            onChange={(e) => updateComponent(comp.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8201A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Item Type</label>
                          <select 
                            value={comp.type} 
                            onChange={(e) => updateComponent(comp.id, 'type', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8201A]"
                          >
                            <option value="choice">Customer Chooses (Dynamic)</option>
                            <option value="fixed">Fixed Product (Auto-added)</option>
                          </select>
                        </div>

                        {comp.type === 'choice' ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Allowed Categories</label>
                              <select 
                                multiple required
                                value={comp.allowedCategoryIds || []}
                                onChange={(e) => updateComponent(comp.id, 'allowedCategoryIds', Array.from(e.target.selectedOptions, o => o.value))}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8201A] h-24"
                              >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                              <p className="text-[10px] text-gray-400 mt-1">Hold CMD/CTRL to select multiple</p>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Required Size (Optional)</label>
                              <input 
                                type="text" value={comp.requiredSize || ''} 
                                onChange={(e) => updateComponent(comp.id, 'requiredSize', e.target.value)}
                                placeholder="e.g., Large" 
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8201A]"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Fixed Item</label>
                            <select 
                              required value={comp.fixedProductId || ''} 
                              onChange={(e) => updateComponent(comp.id, 'fixedProductId', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8201A]"
                            >
                              <option value="">-- Choose Product --</option>
                              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {formData.components.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">No components added yet. Click "Add Item" to build the combo.</div>
                  )}
                </div>
              </div>

              {/* Deal Constraints */}
              <div className="border border-[#E8D8C8] rounded-2xl p-5">
                <h4 className="font-barlow font-800 uppercase tracking-wider text-[#1A1A1A] mb-4">Availability Constraints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.constraints.pickupOnly} 
                      onChange={e => setFormData({ ...formData, constraints: { ...formData.constraints, pickupOnly: e.target.checked } })}
                      className="mt-1 w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
                    />
                    <div>
                      <span className="block font-barlow text-[13px] font-700 uppercase tracking-widest text-[#1A1A1A]">Pickup Only</span>
                      <span className="text-[11px] text-[#555]">Users cannot order this deal for delivery</span>
                    </div>
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.constraints.isTimeRestricted} 
                        onChange={e => setFormData({ ...formData, constraints: { ...formData.constraints, isTimeRestricted: e.target.checked } })}
                        className="mt-1 w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
                      />
                      <div>
                        <span className="block font-barlow text-[13px] font-700 uppercase tracking-widest text-[#1A1A1A]">Time Restricted</span>
                        <span className="text-[11px] text-[#555]">Limit deal to specific hours (e.g. Lunch deal)</span>
                      </div>
                    </label>

                    {formData.constraints.isTimeRestricted && (
                      <div className="flex items-center gap-3 pl-7">
                        <input 
                          type="time" required={formData.constraints.isTimeRestricted}
                          value={formData.constraints.startTime}
                          onChange={e => setFormData({ ...formData, constraints: { ...formData.constraints, startTime: e.target.value } })}
                          className="border rounded-lg px-3 py-1.5 text-sm"
                        />
                        <span className="text-gray-400">to</span>
                        <input 
                          type="time" required={formData.constraints.isTimeRestricted}
                          value={formData.constraints.endTime}
                          onChange={e => setFormData({ ...formData, constraints: { ...formData.constraints, endTime: e.target.value } })}
                          className="border rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="pt-2 flex justify-between items-center border-t border-[#E8D8C8]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-[#E8D8C8] focus:ring-emerald-600"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Deal is Active</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl border-2 border-[#E8D8C8] hover:bg-[#FDF8F2] font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555555]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-800 uppercase tracking-widest shadow-[0_8px_20px_rgba(200,32,26,0.3)]"
                  >
                    Save Deal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
