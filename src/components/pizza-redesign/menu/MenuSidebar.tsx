import { Pizza, Salad, CupSoda, CakeSlice } from 'lucide-react';
import { type MenuCategory } from '../../../types/menu';

const iconMap: Record<string, React.ReactNode> = {
  Pizza: <Pizza className="w-6 h-6 rotate-90" />,
  Salad: <Salad className="w-6 h-6 rotate-90" />,
  CupSoda: <CupSoda className="w-6 h-6 rotate-90" />,
  CakeSlice: <CakeSlice className="w-6 h-6 rotate-90" />,
};

interface MenuSidebarProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function MenuSidebar({ categories, activeCategory, onSelectCategory }: MenuSidebarProps) {
  return (
    <div className="flex flex-col gap-4 sticky top-[100px]">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`
              w-16 h-36 flex flex-col items-center justify-center rounded-r-2xl shadow-md transition-all duration-300
              ${isActive ? 'bg-white text-brand-red pr-2 drop-shadow-lg z-10 scale-x-105' : 'bg-[#F5C300] text-gray-800 -ml-2 opacity-90 hover:opacity-100 hover:-ml-1'}
            `}
          >
            {/* We rotate the entire content container to match the vertical aesthetic */}
            <div className={`flex items-center gap-3 -rotate-90 transform origin-center whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>
              {iconMap[cat.iconName]}
              <span className="font-oswald tracking-widest text-lg uppercase">{cat.name}</span>
            </div>
          </button>
        )
      })}
    </div>
  );
}
