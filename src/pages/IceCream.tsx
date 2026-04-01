import { useSectionContent } from '../context/ContentContext';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import IceCreamBuilder from '../components/IceCreamBuilder';
import SpecialIceCreamCard from '../components/SpecialIceCreamCard';
import type { MenuItem } from '../types/menu';

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IceCream() {
  const { sectionContent, loading: icLoading } = useSectionContent('icecream');
  const { addToCart } = useCart();
  const { menuItems: products, isLoading: menuLoading } = useMenu();

  if (icLoading || menuLoading) return <div className="min-h-screen bg-[#FDF8F2]" />;

  const handleAddToCart = (item: any, customs?: any) => {
    // Try to find the actual product in the menu to get its full metadata
    const product = products.find((p: any) => p.name === item.name || p.id === item.id) || item;
    
    addToCart(product as MenuItem, customs || {
      price: product.price,
      quantity: 1
    });
  };

  const handleCustomAdd = (customs: any) => {
    const iceCreamProduct = products.find((p: any) => p.categoryId === 'cat-ice-cream' && p.name === 'Custom Ice Cream');
    if (iceCreamProduct) {
      const extras = [];
      if (customs.scoops) extras.push({ name: `${customs.scoops}: ${customs.flavours.join(', ')}`, price: 0 });
      if (customs.toppings?.length) extras.push({ name: `Toppings: ${customs.toppings.join(', ')}`, price: 0 });
      if (customs.sauce) extras.push({ name: `Sauce: ${customs.sauce}`, price: 0 });
      handleAddToCart(iceCreamProduct, { price: customs.price, addedExtras: extras, quantity: 1 });
    }
  };

  return (
    <div className="bg-[#FDF8F2] min-h-screen pt-32 pb-24">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-barlow text-[12px] font-700 uppercase tracking-[0.4em] text-[#D4952A] block mb-4">
            {sectionContent.subtitle || '— Sweet Treats —'}
          </span>
          <h1 className="font-bebas text-[64px] md:text-[90px] text-[#1A1A1A] tracking-wider leading-none mb-4 text-center">
            {sectionContent.title_1 || 'Ice'} <span className="text-[#C8201A]">{sectionContent.title_2 || 'Cream'}</span>
          </h1>
          <p className="font-inter text-[#555555] text-[16px] max-w-xl mx-auto leading-relaxed">
            {sectionContent.description || 'Build your perfect scoop or choose one of our signature specials.'}
          </p>
        </div>

        {/* Three-column layout: Builder + 2 Specials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Builder takes 1 column */}
          <div className="lg:col-span-1">
            <IceCreamBuilder 
              scoops={sectionContent.scoops}
              flavours={sectionContent.flavours}
              toppings={sectionContent.toppings}
              sauces={sectionContent.sauces}
              onAddToCart={handleCustomAdd}
            />
          </div>

          {/* Specials take 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(sectionContent.specials || []).map((item: any) => (
              <SpecialIceCreamCard 
                key={item.id} 
                item={item} 
                onAddToCart={(it) => handleAddToCart(it)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
