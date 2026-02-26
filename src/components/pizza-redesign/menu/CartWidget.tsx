import { X, Plus, Minus } from 'lucide-react';
import { type CartItem } from '../../../types/menu';

interface CartWidgetProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export default function CartWidget({ items, isOpen, onClose, onIncrement, onDecrement }: CartWidgetProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed top-24 right-4 md:right-8 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 flex flex-col z-50 animate-in slide-in-from-right-10 fade-in duration-300">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="font-oswald text-xl font-bold tracking-wide text-gray-900">Your Order</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar flex-grow">
        {items.length === 0 ? (
          <p className="text-sm font-opensans text-gray-400 text-center py-6 italic">Your cart is empty.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex gap-4 items-center group">
              {/* Image */}
              <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Info & Controls */}
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-start w-full">
                  <span className="font-oswald text-[14px] font-bold text-gray-800 uppercase line-clamp-1 mr-2 flex-grow">{item.name}</span>
                  <span className="font-bangers text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3 mt-1 bg-gray-50 rounded-full w-fit px-2 py-0.5 border border-gray-200">
                  <button onClick={() => onDecrement(item.id)} className="text-gray-500 hover:text-brand-red active:scale-90 transition-transform">
                    <Minus className="w-3 h-3 stroke-[3]" />
                  </button>
                  <span className="font-opensans text-xs font-bold w-3 text-center text-gray-800">{item.quantity}</span>
                  <button onClick={() => onIncrement(item.id)} className="text-gray-500 hover:text-green-600 active:scale-90 transition-transform">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Total */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <span className="font-oswald text-sm font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
          <span className="font-bangers text-[28px] leading-none text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        <button
          className="w-full bg-brand-gold py-3.5 rounded-xl font-oswald uppercase text-[15px] font-bold tracking-wider text-gray-900 hover:bg-yellow-400 active:scale-[0.98] transition-all shadow-md mt-2 disabled:opacity-50 disabled:pointer-events-none"
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>

    </div>
  );
}
