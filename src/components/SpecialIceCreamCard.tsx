import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

interface Props {
  item: any;
  onAddToCart: (item: any) => void;
}

export default function SpecialIceCreamCard({ item, onAddToCart }: Props) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8D8C8] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-bebas text-[28px] text-white tracking-wider leading-none">{item.name}</h3>
          <span className="font-bebas text-[22px] text-[#D4952A]">${item.price}</span>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-1.5 mb-5">
          {(item.includes || []).map((inc: string) => (
            <li key={inc} className="flex items-center gap-2 font-inter text-[12px] text-[#555555]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8201A] flex-shrink-0" />
              {inc}
            </li>
          ))}
        </ul>
        <button 
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 text-white font-barlow font-700 text-[13px] uppercase tracking-wider py-3 rounded-xl transition-all shadow-[0_4px_16px_rgba(200,32,26,0.3)]
            ${isAdded ? 'bg-emerald-600 scale-95' : 'bg-[#C8201A] hover:bg-[#9E1510]'}`}
        >
          {isAdded ? (
            <><Check className="w-4 h-4" /> Added</>
          ) : (
            <><ShoppingBag className="w-4 h-4" /> Add to Order</>
          )}
        </button>
      </div>
    </div>
  );
}
