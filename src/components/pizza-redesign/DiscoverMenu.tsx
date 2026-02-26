import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { type MenuItem, type CartItem } from '../../types/menu';
import { CATEGORIES, MENU_ITEMS } from '../../data/dummyMenuData';
import { Link } from 'react-router-dom';

import MenuSidebar from './menu/MenuSidebar';
import MenuItemCard from './menu/MenuItemCard';
import CartWidget from './menu/CartWidget';

export default function DiscoverMenu() {
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
    <section className="bg-brand-light py-24 section-padding relative">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 3px 3px, #000 1.5px, transparent 0)', backgroundSize: '24px 24px' }}></div>

      {/* Floating Cart Button (Homepage only active when items exist) */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className={`fixed bottom-6 right-6 md:top-24 md:bottom-auto w-14 h-14 bg-brand-gold rounded-full shadow-2xl flex items-center justify-center z-40 transition-all ${cartTotalItems > 0 ? 'scale-100' : 'scale-0 opacity-0'}`}
      >
        <ShoppingCart className="w-6 h-6 text-gray-900" />
        <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
          {cartTotalItems}
        </span>
      </button>

      {/* Cart Widget Overlay */}
      <CartWidget
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />

      <div className="container-custom relative z-10 flex flex-col items-center">

        <h2 className="font-bangers text-[48px] text-gray-900 text-center uppercase tracking-heading mb-12">
          DISCOVER MENU
        </h2>

        {/* Main Content Layout */}
        <div className="max-w-[1400px] mx-auto w-full flex relative">

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

            <div className="mb-8 flex justify-between items-end border-b border-gray-200 pb-4">
              <h3 className="font-oswald text-3xl font-bold uppercase tracking-wide text-gray-900">
                {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Menu'}
              </h3>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredItems.map(item => (
                <MenuItemCard key={item.id} item={item} onAdd={handleAddToCart} />
              ))}
              {filteredItems.length === 0 && (
                <p className="col-span-full py-12 text-center text-gray-500 font-opensans italic">No items found in this category.</p>
              )}
            </div>

            {/* Bottom CTA Row */}
            <div className="flex flex-col items-center gap-6 mt-4">
              <p className="font-opensans text-sm uppercase text-gray-500 font-bold tracking-widest text-center">
                FIND OUR FULL MENU & ADD-ONS ONLINE
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu" className="border-2 border-brand-red text-brand-red font-oswald font-bold uppercase py-3 px-8 rounded-full text-[14px] hover:bg-brand-red hover:text-white transition-all text-center">
                  VIEW FULL MENU
                </Link>
                <Link to="/menu" className="bg-brand-gold text-gray-900 font-oswald font-bold uppercase py-[14px] px-8 rounded-full text-[14px] hover:bg-yellow-400 hover:scale-105 transition-all shadow-md text-center">
                  ORDER ONLINE
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
