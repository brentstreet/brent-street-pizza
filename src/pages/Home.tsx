import Hero from '../sections/HeroSlider';

import CategorySection from '../sections/CategorySection';
import MarqueeBanner from '../sections/MarqueeBanner';
import CustomerFavourites from '../sections/CustomerFavourites';
import WhyOrderDirect from '../sections/WhyOrderDirect';
import CustomerTestimonials from '../sections/CustomerTestimonials';
import InfoSection from '../sections/InfoSection';
import CateringSection from '../sections/CateringSection';
import DeliveryAreas from '../sections/DeliveryAreas';

export default function Home() {
  return (
    <div className="bg-[#1a0a00] min-h-screen">
      <Hero />

      <CategorySection />
      <MarqueeBanner />
      <CustomerFavourites />
      <WhyOrderDirect />
      <CustomerTestimonials />
      <InfoSection />
      <CateringSection />
      <DeliveryAreas />
    </div>
  );
}
