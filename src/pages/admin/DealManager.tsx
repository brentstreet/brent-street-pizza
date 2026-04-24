import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

export default function DealManager() {
  const [deals, setDeals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
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
    products: [] as string[],
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [dealsRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/catalog/deals?showInactive=true`),
        fetch(`${API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (dealsRes.ok) {
        const dData = await dealsRes.json();
        setDeals(dData.deals || []);
      }
      
      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData || []);
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
        products: Array.isArray(deal.products) ? deal.products : [],
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
        products: [],
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

      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      const isSelected = prev.products.includes(productId);
      if (isSelected) {
        return { ...prev, products: prev.products.filter(id => id !== productId) };
      } else {
        return { ...prev, products: [...prev.products, productId] };
      }
    });
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
            Manage bundle offers, combinations of existing products, and dynamic pricing.
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
              
              <div className="mb-4">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888] mb-1.5">Includes ({deal.products?.length || 0} items):</p>
                <div className="flex flex-wrap gap-1.5">
                  {(deal.products || []).map((prodId: string) => {
                    const p = products.find(x => x.id === prodId);
                    return p ? (
                      <span key={prodId} className="bg-[#FDF8F2] border border-[#E8D8C8] text-[#555] text-[11px] font-inter px-2 py-0.5 rounded-md">
                        {p.name}
                      </span>
                    ) : null;
                  })}
                </div>
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
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
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

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Deal Title</label>
                <input
                  required
                  value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  placeholder="E.g., Family Combo"
                />
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Description</label>
                <textarea
                  required
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none min-h-[80px]"
                  placeholder="2 Large Pizzas + 1 Garlic Bread + 1.25L Drink"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="E.g., Hot, Special, Save 20%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Icon Type</label>
                  <select
                    value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  >
                    <option value="Star">Star</option>
                    <option value="Flame">Flame (Hot)</option>
                    <option value="Zap">Zap (Flash)</option>
                    <option value="Clock">Clock (Limited)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Accent Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="h-11 w-11 rounded border border-[#E8D8C8] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 border border-[#E8D8C8] rounded-xl px-4 py-2 font-mono text-[13px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Product Multi-Select */}
              <div className="pt-2">
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-3">
                  Included Products (Select multiple)
                </label>
                <div className="border border-[#E8D8C8] rounded-xl max-h-48 overflow-y-auto bg-[#FDFAF6] p-2 space-y-1">
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.products.includes(p.id)}
                        onChange={() => handleProductToggle(p.id)}
                        className="w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
                      />
                      <span className="font-inter text-[13px] text-[#1A1A1A]">{p.name} <span className="text-[#888] ml-1">(${Number(p.price).toFixed(2)})</span></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8D8C8]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-[#E8D8C8] focus:ring-emerald-600"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Deal is Active</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
