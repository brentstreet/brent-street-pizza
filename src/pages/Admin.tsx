import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, LogOut } from 'lucide-react';
import type { MenuItem } from '../types/menu';
import ExtrasManager from '../components/ExtrasManager';

export default function Admin() {
  const { categories, menuItems, addMenuItem, updateMenuItem, deleteMenuItem, isAdmin, loginNode, logoutNode } = useMenu();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded auth
      loginNode();
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    logoutNode();
    navigate('/');
  };

  const openEditModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem({
        name: '', categoryId: categories[0]?.id || '', description: '', price: 0, image: '', tags: {}
      });
    }
    setIsEditing(true);
  };

  const saveItem = () => {
    let parsedSizes = undefined;
    if (editingItem.sizes && typeof editingItem.sizes === 'string') {
      try {
        parsedSizes = (editingItem.sizes as any).split(',').map((s: string) => {
          const [name, p] = s.split(':');
          return { name: name.trim(), price: parseFloat(p) };
        });
      } catch (e) {
        parsedSizes = [];
      }
    } else if (Array.isArray(editingItem.sizes)) {
      parsedSizes = editingItem.sizes;
    }

    let parsedToppings = undefined;
    if (editingItem.toppings && typeof editingItem.toppings === 'string') {
      parsedToppings = (editingItem.toppings as any).split(',').map((t: string) => t.trim());
    } else if (Array.isArray(editingItem.toppings)) {
      parsedToppings = editingItem.toppings;
    }

    const payload = { ...editingItem, sizes: parsedSizes, toppings: parsedToppings };

    if (editingItem.id) {
      updateMenuItem(editingItem.id, payload as MenuItem);
    } else {
      addMenuItem(payload as Omit<MenuItem, 'id'>);
    }
    setIsEditing(false);
  };

  if (!isAdmin) {
    return (
      <div className="bg-[#FDF8F2] min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#F5EDE0] border border-[#E8D8C8] p-8 rounded-xl shadow-xl w-full max-w-sm">
          <h2 className="text-[#1A1A1A] font-bebas text-4xl text-center mb-6">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <input
            type="password"
            placeholder="Password (admin123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FDF8F2] border border-[#E8D8C8] text-[#1A1A1A] rounded p-3 mb-6 outline-none focus:border-[#D4952A]"
          />
          <button type="submit" className="w-full bg-[#C8201A] text-[#FFFCF7] font-barlow font-bold py-3 rounded uppercase tracking-wider hover:bg-[#9E1510] transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF8F2] min-h-screen text-[#2B2B2B] pt-32 pb-20">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-bebas text-5xl">Menu Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => openEditModal()}
              className="bg-[#D4952A] text-black font-barlow font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-500 transition-colors"
            >
              <Plus size={18} /> Add Item
            </button>
            <button
              onClick={handleLogout}
              className="bg-transparent border border-[#E8D8C8] text-[#FFFCF7] font-barlow px-4 py-2 rounded flex items-center gap-2 hover:bg-[#1A1A1A]/5 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="bg-[#F5EDE0] border border-[#E8D8C8] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A]/5 font-barlow text-sm uppercase tracking-wider text-[#555555]">
                <th className="p-4 border-b border-[#E8D8C8]">Image</th>
                <th className="p-4 border-b border-[#E8D8C8]">Name</th>
                <th className="p-4 border-b border-[#E8D8C8]">Category</th>
                <th className="p-4 border-b border-[#E8D8C8]">Price</th>
                <th className="p-4 border-b border-[#E8D8C8] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id} className="border-b border-[#E8D8C8] hover:bg-[#1A1A1A]/5 transition-colors">
                  <td className="p-4">
                    <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-4 font-bold">{item.name}</td>
                  <td className="p-4 text-[#555555]">{categories.find(c => c.id === item.categoryId)?.name}</td>
                  <td className="p-4">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-right flex justify-end gap-3 mt-2">
                    <button onClick={() => openEditModal(item)} className="text-[#D4952A] hover:text-[#1A1A1A] transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteMenuItem(item.id)} className="text-[#C8201A] hover:text-[#1A1A1A] transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {menuItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#555555]">No menu items found. Add some!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ExtrasManager />
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#F5EDE0] border border-[#E8D8C8] p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <h3 className="font-bebas text-3xl mb-4">{editingItem.id ? 'Edit Item' : 'New Item'}</h3>
            <div className="space-y-4 font-inter text-sm">
              <div>
                <label className="block text-[#555555] mb-1">Name</label>
                <input type="text" value={editingItem.name || ''} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A]" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[#555555] mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={editingItem.price || 0} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })} className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A]" />
                </div>
                <div className="flex-1">
                  <label className="block text-[#555555] mb-1">Category</label>
                  <select value={editingItem.categoryId || ''} onChange={e => setEditingItem({ ...editingItem, categoryId: e.target.value })} className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A]">
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#555555] mb-1">Description</label>
                <textarea value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A] h-20 resize-none" />
              </div>
              <div>
                <label className="block text-[#555555] mb-1">Image URL</label>
                <input type="text" value={editingItem.image || ''} onChange={e => setEditingItem({ ...editingItem, image: e.target.value })} className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A]" />
              </div>
              <div>
                <label className="block text-[#555555] mb-1">Sizes (format: Small:12, Large:15)</label>
                <input
                  type="text"
                  value={Array.isArray(editingItem.sizes) ? editingItem.sizes.map(s => `${s.name}:${s.price}`).join(', ') : (editingItem.sizes || '')}
                  onChange={e => setEditingItem({ ...editingItem, sizes: e.target.value as any })}
                  className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A]"
                  placeholder="Small:12, Large:15"
                />
              </div>
              <div>
                <label className="block text-[#555555] mb-1">Current Toppings (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingItem.toppings) ? editingItem.toppings.join(', ') : (editingItem.toppings || '')}
                  onChange={e => setEditingItem({ ...editingItem, toppings: e.target.value as any })}
                  className="w-full bg-[#FDF8F2] border border-[#E8D8C8] p-2 rounded text-[#1A1A1A] outline-none focus:border-[#D4952A]"
                  placeholder="Tomato Sauce, Cheese, Oregano"
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  checked={editingItem.hasPizzaExtras || false}
                  onChange={e => setEditingItem({ ...editingItem, hasPizzaExtras: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-[#555555]">Enable Pizza Customization Extras</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded border border-[#E8D8C8] hover:bg-[#1A1A1A]/5 transition-colors font-barlow font-bold">Cancel</button>
              <button onClick={saveItem} className="px-5 py-2 rounded bg-[#C8201A] hover:bg-[#9E1510] transition-colors font-barlow font-bold">Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
