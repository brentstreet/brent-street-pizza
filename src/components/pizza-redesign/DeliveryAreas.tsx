import React from 'react';
import { MapPin } from 'lucide-react';

const areas = [
  'MOUNT WAVERLEY', 'GLEN WAVERLEY', 'BENTLEIGH EAST', 'HUGHESDALE', 'HUNTINGDALE',
  'OAKLEIGH EAST', 'OAKLEIGH SOUTH', 'CLAYTON', 'CLAYTON SOUTH', 'CLARINDA',
  'NOTTING HILL', 'MULGRAVE', 'SPRINGVALE', 'SPRINGVALE SOUTH', 'DINGLEY VILLAGE',
  'KEYSBOROUGH', 'NOBLE PARK'
];

const DeliveryAreas: React.FC = () => {
  return (
    <section className="bg-brand-gold py-24 section-padding relative overflow-hidden">

      {/* Decorative pizza watermark */}
      <div className="absolute top-[-50px] right-[-100px] w-96 h-96 opacity-10 rotate-12 pointer-events-none z-0">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.43 4 16.05 4 12C4 7.95 7.05 4.57 11 4.07V19.93ZM13 4.07C16.95 4.57 20 7.95 20 12C20 16.05 16.95 19.43 13 19.93V4.07Z" />
        </svg>
      </div>

      <div className="container-custom relative z-10 flex flex-col items-center">

        <h2 className="font-bangers text-[40px] text-gray-900 text-center uppercase tracking-heading mb-16">
          DELIVERY AREAS
        </h2>

        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {areas.map((area, i) => (
            <div key={i} className="bg-white rounded-full px-5 py-3 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
              <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span className="font-oswald text-[12px] font-bold text-gray-900 uppercase tracking-widest leading-none mt-0.5">
                {area}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DeliveryAreas;
