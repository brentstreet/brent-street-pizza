import React from 'react';

const MarqueeBanner: React.FC = () => {
  return (
    <section className="bg-brand-red w-full h-[350px] relative overflow-hidden flex flex-col justify-center">

      {/* Background Marquee Texts */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center gap-6 overflow-hidden select-none">

        {/* Top Row - Ghosted */}
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around text-brand-red/30 font-bangers text-[60px] whitespace-nowrap">
            <span>#HOT</span>
            <span>#LOVE</span>
            <span>#YUMMY</span>
            <span>#WOW</span>
            <span>#CRISPY</span>
            <span>#HOT</span>
            <span>#LOVE</span>
          </div>
          <div className="flex w-1/2 justify-around text-brand-red/30 font-bangers text-[60px] whitespace-nowrap">
            <span>#HOT</span>
            <span>#LOVE</span>
            <span>#YUMMY</span>
            <span>#WOW</span>
            <span>#CRISPY</span>
            <span>#HOT</span>
            <span>#LOVE</span>
          </div>
        </div>

        {/* Bottom Row - Gold Bold */}
        <div className="flex w-[200%] animate-marquee" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
          <div className="flex w-1/2 justify-around text-brand-gold font-bangers text-[80px] md:text-[100px] leading-none whitespace-nowrap drop-shadow-md">
            <span>HOT PIZZA</span>
            <span>FLAVOUR</span>
            <span>CRISPY</span>
            <span>FOODIE</span>
            <span>HOT PIZZA</span>
          </div>
          <div className="flex w-1/2 justify-around text-brand-gold font-bangers text-[80px] md:text-[100px] leading-none whitespace-nowrap drop-shadow-md">
            <span>HOT PIZZA</span>
            <span>FLAVOUR</span>
            <span>CRISPY</span>
            <span>FOODIE</span>
            <span>HOT PIZZA</span>
          </div>
        </div>

      </div>

      {/* Girl Image, fully extracted out */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg h-[400px] pointer-events-none drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]">
        <img
          src="https://images.unsplash.com/photo-1579933923485-5b4819d2b27d?w=800&q=80"
          alt="Girl holding pizza"
          className="w-full h-full object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
        />
      </div>

    </section>
  );
};

export default MarqueeBanner;
