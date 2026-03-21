import { Star, ShoppingBag, Plus } from 'lucide-react';
import { type MenuItem } from '../types/menu';

const RATINGS: Record<string, number> = {
  'pizza-1': 4.9, 'pizza-2': 4.8, 'pizza-3': 4.9, 'pizza-4': 4.7,
  'icecream-1': 4.8, 'icecream-2': 4.9, 'icecream-3': 4.7,
  'dessert-1': 4.9, 'dessert-2': 4.8,
};

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  const rating = RATINGS[item.id] ?? 4.8;

  return (
    <div className="group relative bg-[#F5EDE0] rounded-[14px] border border-[#E8D8C8] overflow-hidden flex flex-col hover:border-[#C8201A]/30 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-10px_rgba(200, 32, 26,0.25)] transition-all duration-400 h-full">

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5EDE0]/80 via-transparent to-transparent" />

        {/* Price badge */}
        <div className="absolute top-3 left-3 bg-[#C8201A] text-[#FFFCF7] font-bebas text-[18px] px-3 py-0.5 rounded shadow-lg">
          ${item.price.toFixed(0)}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#FDF8F2]/80 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Star className="w-3 h-3 fill-[#D4952A] text-[#D4952A]" />
          <span className="font-barlow text-[11px] font-700 text-[#2B2B2B]">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <h3 className="font-bebas text-[22px] tracking-widest text-[#1A1A1A] leading-none">{item.name}</h3>
        <p className="font-inter text-[13px] text-[#555555] leading-relaxed line-clamp-2 flex-grow">{item.description}</p>

        <button
          onClick={() => onAdd(item)}
          id={`card-add-${item.id}`}
          className="mt-auto flex items-center justify-between bg-[#1A1A1A]/5 hover:bg-[#C8201A] border border-[#E8D8C8] hover:border-[#C8201A] text-[#FFFCF7] font-barlow text-[13px] font-700 uppercase tracking-wider px-4 py-3 rounded-[8px] transition-all duration-300 group/btn"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 opacity-60 group-hover/btn:opacity-100" />
            Add to Order
          </span>
          <Plus className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
