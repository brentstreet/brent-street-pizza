import { type MenuItem } from '../../../types/menu';
import { Leaf, Flame } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col group hover:-translate-y-1 transition-all h-full">

      {/* Image Area */}
      <div className="relative w-full h-48 md:h-56 bg-gray-100 p-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-500"
        />

        {/* Tags Overlay */}
        <div className="absolute bottom-2 left-4 flex gap-2">
          {item.tags.isVegan && (
            <span className="bg-white text-green-600 text-[11px] font-bold px-2 py-1 flex items-center gap-1 rounded shadow-sm">
              <Leaf className="w-3 h-3 fill-green-600" /> Vegan
            </span>
          )}
          {item.tags.isGlutenFree && (
            <span className="bg-white text-orange-400 text-[11px] font-bold px-2 py-1 flex items-center gap-1 rounded shadow-sm">
              <span className="font-bangers text-[12px] leading-none mb-0.5">G</span> Gluten-Free
            </span>
          )}
          {item.tags.isSpicy && (
            <span className="bg-white text-red-600 text-[11px] font-bold px-2 py-1 flex items-center gap-1 rounded shadow-sm">
              <Flame className="w-3 h-3 fill-red-600" /> Spicy
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-oswald text-lg font-bold uppercase tracking-wide text-gray-900 mb-1">
          {item.name}
        </h3>
        <p className="font-opensans text-[13px] text-gray-500 leading-snug mb-4 flex-grow line-clamp-2">
          {item.description}
        </p>

        <div className="font-bangers text-2xl text-gray-900 tracking-wider mb-4">
          ${item.price.toFixed(2)}
        </div>

        <button
          onClick={() => onAdd(item)}
          className="w-full bg-[#F5C300] text-gray-900 py-[10px] rounded-lg font-opensans font-bold text-sm shadow hover:bg-yellow-400 active:scale-95 transition-all"
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
}
