// import { useEffect, useState } from 'react';
// import { API_URL } from '../../config/api';
// import { Plus, Edit2, Trash2, Pizza, Image as ImageIcon } from 'lucide-react';

// export default function ProductManager() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<any>(null);

//   // New states for file upload
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');

//   // Form State
//   const [formData, setFormData] = useState({
//     id: '',
//     categoryId: '',
//     name: '',
//     description: '',
//     price: 0,
//     toppings: '', // Store toppings as a comma-separated string
//     variants: '', // NEW: Store variants as a comma-separated string
//     hasPizzaExtras: false,
//     isFavorite: false,
//     isActive: true,
//     sizes: [] as { name: string; price: number }[],
//   });

//   // Helper to correctly display local uploads vs external URLs
//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath; // Already a full URL
//     return `${API_URL}${imagePath}`; // Attach the backend API URL to local uploads
//   };

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
      
//       const [productsRes, categoriesRes] = await Promise.all([
//         fetch(`${API_URL}/api/admin/products`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/catalog/categories`)
//       ]);

//       if (productsRes.ok) {
//         const pData = await productsRes.json();
//         setProducts(pData);
//       }
      
//       if (categoriesRes.ok) {
//         const cData = await categoriesRes.json();
//         setCategories(cData.categories || []);
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

//   const handleOpenModal = (product: any = null) => {
//     if (product) {
//       setEditingProduct(product);
//       setFormData({
//         id: product.id,
//         categoryId: product.categoryId,
//         name: product.name,
//         description: product.description || '',
//         price: Number(product.price),
//         toppings: product.toppings && Array.isArray(product.toppings) 
//           ? product.toppings.join(', ') 
//           : '',
//         // NEW: Convert array ["Coke", "Sprite"] to string "Coke, Sprite" for editing
//         variants: product.variants && Array.isArray(product.variants)
//           ? product.variants.join(', ')
//           : '',
//         hasPizzaExtras: product.hasPizzaExtras || false,
//         isFavorite: product.isFavorite || false,
//         isActive: product.isActive !== undefined ? product.isActive : true,
//         sizes: product.sizes ? [...product.sizes] : [],
//       });
//       // Correctly format the preview URL for editing
//       setImagePreview(product.image ? getImageUrl(product.image) : '');
//       setImageFile(null);
//     } else {
//       setEditingProduct(null);
//       setFormData({
//         id: `item-${Date.now()}`,
//         categoryId: categories.length > 0 ? categories[0].id : 'cat-classic-pizza',
//         name: '',
//         description: '',
//         price: 0,
//         toppings: '',
//         variants: '', // NEW: Empty string for new products
//         hasPizzaExtras: false,
//         isFavorite: false,
//         isActive: true,
//         sizes: [],
//       });
//       setImagePreview('');
//       setImageFile(null);
//     }
//     setIsModalOpen(true);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('adminToken');
//       const method = editingProduct ? 'PUT' : 'POST';
//       const url = editingProduct 
//         ? `${API_URL}/api/admin/products/${editingProduct.id}`
//         : `${API_URL}/api/admin/products`;

//       // Convert comma-separated strings back to arrays, removing empty strings and whitespace
//       const formattedToppings = formData.toppings
//         .split(',')
//         .map(t => t.trim())
//         .filter(t => t !== '');
        
//       // NEW: Parse comma-separated string back to array, remove empty strings
//       const formattedVariants = formData.variants
//         .split(',')
//         .map(v => v.trim())
//         .filter(v => v !== '');

//       // Use FormData to support multipart/form-data file uploads
//       const submitData = new FormData();
//       submitData.append('id', formData.id);
//       submitData.append('categoryId', formData.categoryId);
//       submitData.append('name', formData.name);
//       submitData.append('description', formData.description);
//       submitData.append('price', formData.price.toString());
//       submitData.append('hasPizzaExtras', formData.hasPizzaExtras.toString());
//       submitData.append('isFavorite', formData.isFavorite.toString());
//       submitData.append('isActive', formData.isActive.toString());
//       submitData.append('sizes', JSON.stringify(formData.sizes)); // Arrays must be stringified
//       submitData.append('toppings', JSON.stringify(formattedToppings));
//       submitData.append('variants', JSON.stringify(formattedVariants)); // NEW: Append stringified array

//       if (imageFile) {
//         submitData.append('image', imageFile);
//       }

//       const res = await fetch(url, {
//         method,
//         // Omit 'Content-Type' header. The browser will automatically set it 
//         // to 'multipart/form-data' with the correct boundary when passing FormData.
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         body: submitData
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
//       alert('Error saving product');
//     }
//   };

//   const handleDelete = async (id: string, name: string) => {
//     if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
//     try {
//       const token = localStorage.getItem('adminToken');
//       const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.ok) fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddSize = () => {
//     setFormData({ ...formData, sizes: [...formData.sizes, { name: '', price: 0 }] });
//   };

//   const handleSizeChange = (index: number, field: 'name' | 'price', value: string | number) => {
//     const newSizes = [...formData.sizes];
//     newSizes[index] = { ...newSizes[index], [field]: value };
//     setFormData({ ...formData, sizes: newSizes });
//   };

//   const handleRemoveSize = (index: number) => {
//     const newSizes = formData.sizes.filter((_, i) => i !== index);
//     setFormData({ ...formData, sizes: newSizes });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   if (loading) return <div className="p-12 text-center animate-spin"><Pizza className="w-8 h-8 text-[#C8201A] mx-auto" /></div>;

//   return (
//     <div className="max-w-7xl mx-auto animate-in fade-in">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
//             Product Catalog
//           </h2>
//           <p className="font-inter text-[14px] text-[#555555]">
//             Manage all menu items, prices, and categories.
//           </p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-700 uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#C8201A]/30"
//         >
//           <Plus className="w-4 h-4" /> Add Product
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <div key={product.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-lg transition-all">
//             <div className="relative h-48 bg-[#FDF8F2] flex items-center justify-center overflow-hidden">
//               {product.image ? (
//                 <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//               ) : (
//                 <ImageIcon className="w-12 h-12 text-[#E8D8C8]" />
//               )}
//               {product.isFavorite && (
//                 <div className="absolute top-3 right-3 bg-[#D4952A] text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded">
//                   Popular
//                 </div>
//               )}
//               <div className="absolute bottom-3 left-3 flex gap-1.5">
//                 <div className="bg-[#1A1A1A]/80 backdrop-blur-sm text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded">
//                   {product.category?.name || product.categoryId}
//                 </div>
//                 {product.isActive === false && (
//                   <div className="bg-red-600 text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded">
//                     Inactive
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="p-5 flex-1 flex flex-col">
//               <h3 className="font-barlow text-[18px] font-700 text-[#1A1A1A] uppercase tracking-wide mb-1 leading-tight">
//                 {product.name}
//               </h3>
//               <p className="font-inter text-[12px] text-[#888888] line-clamp-2 mb-4 flex-1">
//                 {product.description}
//               </p>
              
//               <div className="flex items-center justify-between mt-auto">
//                 <span className="font-bebas text-[24px] text-[#C8201A] leading-none">
//                   ${Number(product.price).toFixed(2)}
//                 </span>
                
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleOpenModal(product)}
//                     className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#D4952A] hover:bg-[#D4952A]/10 transition-colors"
//                   >
//                     <Edit2 className="w-3.5 h-3.5" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product.id, product.name)}
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

//       {/* Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 flex justify-between items-center z-10">
//               <h3 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A] leading-none">
//                 {editingProduct ? 'Edit Product' : 'Add New Product'}
//               </h3>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#1A1A1A]"
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="p-6 space-y-5">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                  <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Internal ID</label>
//                   <input
//                     required disabled={!!editingProduct}
//                     value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-mono text-[13px] text-[#888888] disabled:bg-[#FDF8F2]"
//                   />
//                   <p className="text-[10px] text-[#AAAAAA] mt-1">E.g., pizza-margherita</p>
//                 </div>
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Category</label>
//                   <select
//                     value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   >
//                     {categories.map((c: any) => (
//                       <option key={c.id} value={c.id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Product Name</label>
//                 <input
//                   required
//                   value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   placeholder="E.g., Margherita"
//                 />
//               </div>

//               <div>
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Description</label>
//                 <textarea
//                   value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
//                   className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none min-h-[100px]"
//                   placeholder="Ingredients, taste, specifics..."
//                 />
//               </div>

//               {/* NEW: TOPPINGS INPUT */}
//               <div>
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Toppings (Comma Separated)</label>
//                 <input
//                   type="text"
//                   value={formData.toppings} 
//                   onChange={e => setFormData({ ...formData, toppings: e.target.value })}
//                   className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   placeholder="Tomato Sauce, Cheese, Pineapple, Ham"
//                 />
//                 <p className="text-[10px] text-[#AAAAAA] mt-1">Separate each topping with a comma.</p>
//               </div>

//               {/* NEW: VARIANTS INPUT */}
//               <div>
//                 <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Variants (Comma Separated)</label>
//                 <input
//                   type="text"
//                   value={formData.variants} 
//                   onChange={e => setFormData({ ...formData, variants: e.target.value })}
//                   className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   placeholder="Coke, Sprite, Fanta"
//                 />
//                 <p className="text-[10px] text-[#AAAAAA] mt-1">For drinks or items with flavor options. Separate each variant with a comma.</p>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Base Price ($)</label>
//                   <input
//                     required type="number" step="0.01" min="0"
//                     value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Product Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="w-full border border-[#E8D8C8] rounded-xl px-4 py-2 font-inter text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-[#FDFAF6] file:text-[#C8201A] hover:file:bg-[#FDF8F2]"
//                   />
//                   {imagePreview && (
//                     <div className="mt-3 relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8D8C8] shadow-sm">
//                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Dynamic Sizes Section */}
//               <div className="pt-4 pb-2 border-t border-b border-[#E8D8C8]">
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555]">
//                     Size Variations & Prices
//                   </label>
//                   <button
//                     type="button"
//                     onClick={handleAddSize}
//                     className="text-[#C8201A] font-barlow text-[12px] font-700 uppercase tracking-wider hover:underline"
//                   >
//                     + Add Size
//                   </button>
//                 </div>
                
//                 {formData.sizes.length === 0 ? (
//                   <p className="text-[12px] text-[#888888] italic mb-2">No sizes configured. Base price will be used.</p>
//                 ) : (
//                   <div className="space-y-3">
//                     {formData.sizes.map((size, index) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <input
//                           type="text"
//                           required
//                           placeholder="Size Name (e.g. Large)"
//                           value={size.name}
//                           onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
//                           className="flex-1 border border-[#E8D8C8] rounded-xl px-3 py-2 font-inter text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                         />
//                         <div className="relative w-28">
//                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-[13px]">$</span>
//                           <input
//                             type="number"
//                             required
//                             step="0.01"
//                             min="0"
//                             placeholder="0.00"
//                             value={size.price}
//                             onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value) || 0)}
//                             className="w-full border border-[#E8D8C8] rounded-xl pl-6 pr-3 py-2 font-inter text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
//                           />
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveSize(index)}
//                           className="p-2 text-[#888888] hover:text-[#C8201A] bg-[#FDFAF6] border border-[#E8D8C8] rounded-xl transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-wrap gap-6 pt-2">
//                 <label className="flex items-center gap-2 cursor-pointer group">
//                   <input 
//                     type="checkbox" 
//                     checked={formData.hasPizzaExtras} 
//                     onChange={e => setFormData({ ...formData, hasPizzaExtras: e.target.checked })}
//                     className="w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
//                   />
//                   <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Enable Pizza Customization</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer group">
//                   <input 
//                     type="checkbox" 
//                     checked={formData.isFavorite} 
//                     onChange={e => setFormData({ ...formData, isFavorite: e.target.checked })}
//                     className="w-4 h-4 text-[#D4952A] rounded border-[#E8D8C8] focus:ring-[#D4952A]"
//                   />
//                   <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Mark as Popular</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer group">
//                   <input 
//                     type="checkbox" 
//                     checked={formData.isActive} 
//                     onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
//                     className="w-4 h-4 text-emerald-600 rounded border-[#E8D8C8] focus:ring-emerald-600"
//                   />
//                   <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Active</span>
//                 </label>
//               </div>

//               <div className="pt-6 border-t border-[#E8D8C8] flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-6 py-3 rounded-xl border-2 border-[#E8D8C8] hover:bg-[#FDF8F2] font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555555] transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-8 py-3 rounded-xl bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-800 uppercase tracking-widest shadow-[0_8px_20px_rgba(200,32,26,0.3)] transition-colors"
//                 >
//                   Save Product
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
import { Plus, Edit2, Trash2, Pizza, Image as ImageIcon } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // New states for file upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    toppings: '', // Store toppings as a comma-separated string
    variants: '', // Store variants as a comma-separated string
    hasPizzaExtras: false,
    isFavorite: false,
    isActive: true,
    sizes: [] as { name: string; price: number }[],
  });

  // Helper to correctly display local uploads vs external URLs
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath; // Already a full URL
    return `${API_URL}${imagePath}`; // Attach the backend API URL to local uploads
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/catalog/categories`)
      ]);

      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData);
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

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        categoryId: product.categoryId,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        toppings: product.toppings && Array.isArray(product.toppings) 
          ? product.toppings.join(', ') 
          : '',
        variants: product.variants && Array.isArray(product.variants)
          ? product.variants.join(', ')
          : '',
        hasPizzaExtras: product.hasPizzaExtras || false,
        isFavorite: product.isFavorite || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        sizes: product.sizes ? [...product.sizes] : [],
      });
      // Correctly format the preview URL for editing
      setImagePreview(product.image ? getImageUrl(product.image) : '');
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        id: `item-${Date.now()}`,
        categoryId: categories.length > 0 ? categories[0].id : 'cat-classic-pizza',
        name: '',
        description: '',
        price: 0,
        toppings: '',
        variants: '', 
        hasPizzaExtras: false,
        isFavorite: false,
        isActive: true,
        sizes: [],
      });
      setImagePreview('');
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${API_URL}/api/admin/products/${editingProduct.id}`
        : `${API_URL}/api/admin/products`;

      // Convert comma-separated strings back to arrays, removing empty strings and whitespace
      const formattedToppings = formData.toppings
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');
        
      const formattedVariants = formData.variants
        .split(',')
        .map(v => v.trim())
        .filter(v => v !== '');

      // Use FormData to support multipart/form-data file uploads
      const submitData = new FormData();
      submitData.append('id', formData.id);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price.toString());
      submitData.append('hasPizzaExtras', formData.hasPizzaExtras.toString());
      submitData.append('isFavorite', formData.isFavorite.toString());
      submitData.append('isActive', formData.isActive.toString());
      submitData.append('sizes', JSON.stringify(formData.sizes)); // Arrays must be stringified
      submitData.append('toppings', JSON.stringify(formattedToppings));
      submitData.append('variants', JSON.stringify(formattedVariants)); 

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch(url, {
        method,
        // Omit 'Content-Type' header. The browser will automatically set it 
        // to 'multipart/form-data' with the correct boundary when passing FormData.
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
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
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSize = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, { name: '', price: 0 }] });
  };

  const handleSizeChange = (index: number, field: 'name' | 'price', value: string | number) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="p-12 text-center animate-spin"><Pizza className="w-8 h-8 text-[#C8201A] mx-auto" /></div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
            Product Catalog
          </h2>
          <p className="font-inter text-[14px] text-[#555555]">
            Manage all menu items, prices, and categories.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-700 uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#C8201A]/30"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-lg transition-all">
            <div className="relative h-48 bg-[#FDF8F2] flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <ImageIcon className="w-12 h-12 text-[#E8D8C8]" />
              )}
              {product.isFavorite && (
                <div className="absolute top-3 right-3 bg-[#D4952A] text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded">
                  Popular
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <div className="bg-[#1A1A1A]/80 backdrop-blur-sm text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded">
                  {product.category?.name || product.categoryId}
                </div>
                {product.isActive === false && (
                  <div className="bg-red-600 text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded">
                    Inactive
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-barlow text-[18px] font-700 text-[#1A1A1A] uppercase tracking-wide mb-1 leading-tight">
                {product.name}
              </h3>
              <p className="font-inter text-[12px] text-[#888888] line-clamp-2 mb-4 flex-1">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="font-bebas text-[24px] text-[#C8201A] leading-none">
                  ${Number(product.price).toFixed(2)}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#D4952A] hover:bg-[#D4952A]/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 flex justify-between items-center z-10">
              <h3 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A] leading-none">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#1A1A1A]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Internal ID</label>
                  <input
                    required disabled={!!editingProduct}
                    value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-mono text-[13px] text-[#888888] disabled:bg-[#FDF8F2]"
                  />
                  <p className="text-[10px] text-[#AAAAAA] mt-1">E.g., pizza-margherita</p>
                </div>
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Category</label>
                  <select
                    value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  >
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Product Name</label>
                <input
                  required
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  placeholder="E.g., Margherita"
                />
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Description</label>
                <textarea
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none min-h-[100px]"
                  placeholder="Ingredients, taste, specifics..."
                />
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Toppings (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.toppings} 
                  onChange={e => setFormData({ ...formData, toppings: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  placeholder="Tomato Sauce, Cheese, Pineapple, Ham"
                />
                <p className="text-[10px] text-[#AAAAAA] mt-1">Separate each topping with a comma.</p>
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Variants (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.variants} 
                  onChange={e => setFormData({ ...formData, variants: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  placeholder="Coke, Sprite, Fanta"
                />
                <p className="text-[10px] text-[#AAAAAA] mt-1">For drinks or items with flavor options. Separate each variant with a comma.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Base Price ($)</label>
                  <input
                    required type="number" step="0.01" min="0"
                    value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-2 font-inter text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-[#FDFAF6] file:text-[#C8201A] hover:file:bg-[#FDF8F2]"
                  />
                  {imagePreview && (
                    <div className="mt-3 relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8D8C8] shadow-sm">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Sizes Section */}
              <div className="pt-4 pb-2 border-t border-b border-[#E8D8C8]">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555]">
                    Size Variations & Prices
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="text-[#C8201A] font-barlow text-[12px] font-700 uppercase tracking-wider hover:underline"
                  >
                    + Add Size
                  </button>
                </div>
                
                {formData.sizes.length === 0 ? (
                  <p className="text-[12px] text-[#888888] italic mb-2">No sizes configured. Base price will be used.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Size Name (e.g. Large)"
                          value={size.name}
                          onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                          className="flex-1 border border-[#E8D8C8] rounded-xl px-3 py-2 font-inter text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                        />
                        <div className="relative w-28">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-[13px]">$</span>
                          <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={size.price}
                            onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full border border-[#E8D8C8] rounded-xl pl-6 pr-3 py-2 font-inter text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="p-2 text-[#888888] hover:text-[#C8201A] bg-[#FDFAF6] border border-[#E8D8C8] rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.hasPizzaExtras} 
                    onChange={e => setFormData({ ...formData, hasPizzaExtras: e.target.checked })}
                    className="w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Enable Pizza Customization</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isFavorite} 
                    onChange={e => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="w-4 h-4 text-[#D4952A] rounded border-[#E8D8C8] focus:ring-[#D4952A]"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-[#E8D8C8] focus:ring-emerald-600"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Active</span>
                </label>
              </div>

              <div className="pt-6 border-t border-[#E8D8C8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border-2 border-[#E8D8C8] hover:bg-[#FDF8F2] font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555555] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-800 uppercase tracking-widest shadow-[0_8px_20px_rgba(200,32,26,0.3)] transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
