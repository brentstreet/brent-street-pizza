import { useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type MenuItem, type CartItem } from '../types/menu';
import { CATEGORIES, MENU_ITEMS, ADD_ONS } from '../data/dummyMenuData';

import MenuSidebar from '../components/pizza-redesign/menu/MenuSidebar';
import MenuItemCard from '../components/pizza-redesign/menu/MenuItemCard';
import CartWidget from '../components/pizza-redesign/menu/CartWidget';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter items based on active category
  const filteredItems = MENU_ITEMS.filter(item => item.categoryId === activeCategory);

  // Cart Functions
  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: Date.now().toString(), menuItemId: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
    setIsCartOpen(true);
  };

  const handleIncrement = (id: string) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const handleDecrement = (id: string) => {
    setCartItems(prev => {
      const target = prev.find(i => i.id === id);
      if (target?.quantity === 1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-[#FAF8F5] min-h-screen relative pb-24">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-40">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/30 font-oswald text-sm font-bold uppercase hover:bg-white hover:text-brand-red transition-all shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Floating Cart Button (Mobile mainly, but useful overall) */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-6 right-6 md:top-24 md:bottom-auto w-14 h-14 bg-brand-gold rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-all"
      >
        <ShoppingCart className="w-6 h-6 text-gray-900" />
        {cartTotalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
            {cartTotalItems}
          </span>
        )}
      </button>

      {/* Cart Widget Overlay */}
      <CartWidget
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background dark overlay pizzas */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80" alt="Pizza Background" className="w-full h-full object-cover" />
        </div>

        {/* Title */}
        <h1 className="relative z-10 font-bangers text-[60px] md:text-[80px] text-white tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] uppercase">
          OUR MENU
        </h1>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto w-full pt-16 flex relative">

        {/* Left Sidebar */}
        <div className="hidden lg:block w-32 shrink-0">
          <MenuSidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Right Content Area */}
        <div className="flex-grow px-4 lg:px-12 w-full max-w-5xl mx-auto lg:mx-0 lg:max-w-none">

          {/* Main Grid Title */}
          <div className="mb-8 flex justify-between items-end border-b border-gray-200 pb-4">
            <h2 className="font-oswald text-3xl font-bold uppercase tracking-wide text-gray-900">
              {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Menu'}
            </h2>

            {/* Legend (Visual Only) */}
            <div className="hidden sm:flex gap-4">
              <span className="text-[12px] font-bold text-gray-600 flex items-center gap-1">
                <span className="text-green-600">🌿</span> Vegan
              </span>
              <span className="text-[12px] font-bold text-gray-600 flex items-center gap-1">
                <span className="text-orange-400 font-bangers">G</span> Gluten-Free
              </span>
              <span className="text-[12px] font-bold text-gray-600 flex items-center gap-1">
                <span className="text-red-500">🌶️</span> Spicy
              </span>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} onAdd={handleAddToCart} />
            ))}
            {filteredItems.length === 0 && (
              <p className="col-span-full py-12 text-center text-gray-500 font-opensans italic">No items found in this category.</p>
            )}
          </div>

          {/* Add-ons Section */}
          <div className="mb-10 border-b border-gray-200 pb-4">
            <h2 className="font-oswald text-2xl font-bold uppercase tracking-wide text-gray-900">
              Recommended Add-ons
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {ADD_ONS.map(item => (
              <MenuItemCard key={item.id} item={item} onAdd={handleAddToCart} />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
