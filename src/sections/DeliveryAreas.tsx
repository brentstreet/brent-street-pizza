import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const areas = [
  'MOUNT WAVERLEY', 'GLEN WAVERLEY', 'BENTLEIGH EAST', 'HUGHESDALE', 'HUNTINGDALE',
  'OAKLEIGH EAST', 'OAKLEIGH SOUTH', 'CLAYTON', 'CLAYTON SOUTH', 'CLARINDA',
  'NOTTING HILL', 'MULGRAVE', 'SPRINGVALE', 'SPRINGVALE SOUTH', 'DINGLEY VILLAGE',
  'KEYSBOROUGH', 'NOBLE PARK'
];

const DeliveryAreas: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#1a0a00] py-24 md:py-32 overflow-hidden relative">
      {/* Red blob */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C0392B]/6 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Map visual */}
          <div className="reveal-left order-2 lg:order-1">
            <div className="relative rounded-[16px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-white/5">
              {/* Map embed */}
              <iframe
                title="Brent Street Pizza Delivery Zone"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50174.07!2d145.07!3d-37.90!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                width="100%"
                height="360"
                style={{ border: 0, filter: 'brightness(0.7) saturate(0.5) invert(1) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
              {/* Overlay with delivery zone info */}
              <div className="absolute top-4 left-4 bg-[#1a0a00]/90 backdrop-blur-sm border border-white/10 rounded-[10px] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-[#C0392B]" />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-wider text-white">Delivery Zone</span>
                </div>
                <p className="font-inter text-[12px] text-white/40">Up to 10km radius</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-[#C0392B] rounded-full w-8 h-8 flex items-center justify-center shadow-[0_0_20px_rgba(192,57,43,0.6)] animate-pulse-glow">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Right: Area list */}
          <div className="reveal-right order-1 lg:order-2">
            <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] block mb-4">
              — We Deliver To —
            </span>
            <h2 className="font-bebas text-[52px] md:text-[64px] text-white tracking-wider leading-none mb-4">
              Delivery Areas
            </h2>
            <p className="font-inter text-white/40 text-[15px] leading-relaxed mb-10">
              Hot, fresh pizza delivered to your door across South-East Melbourne. Can't see your suburb? Call us and we'll try to sort it out.
            </p>
            <div className="divider-gold mb-10" />

            {/* Area chips */}
            <div className="flex flex-wrap gap-2.5">
              {areas.map((area, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-2 bg-white/4 border border-white/8 hover:border-[#C0392B]/40 hover:bg-[#C0392B]/8 rounded-full px-4 py-2 cursor-default transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MapPin className="w-3 h-3 text-[#C0392B] opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  <span className="font-barlow text-[12px] font-600 uppercase tracking-[0.12em] text-white/60 group-hover:text-white transition-colors duration-300">
                    {area}
                  </span>
                </div>
              ))}
            </div>

            {/* Call CTA */}
            <a
              href="tel:0455123678"
              className="mt-8 inline-flex items-center gap-3 text-white/50 hover:text-[#d4a017] transition-colors duration-300 group"
            >
              <span className="font-barlow text-[14px] uppercase tracking-wider font-700">Don't see your suburb? Call us</span>
              <span className="w-8 h-[1px] bg-current group-hover:w-14 transition-all duration-400" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DeliveryAreas;
