import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  { name: 'Sarah M.', date: 'a year ago', text: 'Best pizza I have had in years. The crust is perfect! Perfectly crunchy on the outside, and incredibly soft inside. Highly recommended.' },
  { name: 'John D.', date: 'a year ago', text: 'Delivery was so fast, and the food was still steaming hot. The cheese pull was unbelievable. My new favorite pizza spot!' },
  { name: 'Emily R.', date: 'a year ago', text: 'Amazing quality and great value for money. The Margherita is an absolute classic done right. Will definitely order again soon!' },
];

const CustomerTestimonials: React.FC = () => {
  return (
    <section className="bg-white py-24 section-padding">
      <div className="container-custom">
        <h2 className="font-bangers text-[36px] text-gray-900 text-center uppercase tracking-heading mb-16">
          CUSTOMER TESTIMONIALS
        </h2>

        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">

          {/* Left Block -> Overall Rating */}
          <div className="lg:w-[30%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 mb-4 shadow-sm">
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&q=80" alt="Brent Street Pizza Logo" className="w-full h-full object-cover" />
            </div>

            <h3 className="font-oswald text-2xl font-bold uppercase text-gray-900 mb-2">Brent Street Pizza</h3>

            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-gray-900 leading-none">5.0</span>
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-gold" />)}
              </div>
            </div>

            <p className="font-opensans text-[13px] text-gray-500 mb-4 font-light">
              Based on 20 reviews
            </p>

            <div className="flex items-center gap-2 mb-6">
              <span className="font-opensans text-[12px] text-gray-400 font-light">powered by</span>
              <span className="font-bold text-gray-600 text-[14px] flex items-center gap-1">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </span>
            </div>

            <button className="bg-brand-red text-white font-oswald text-[13px] uppercase font-bold py-3 px-6 rounded-full w-full max-w-[200px] hover:bg-brand-darkred transition-colors shadow-md">
              Review us on Google
            </button>
          </div>

          {/* Right Block -> Scrollable Reviews */}
          <div className="lg:w-[70%] w-full flex flex-col">
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scroll">
              {reviews.map((rev, i) => (
                <div key={i} className="min-w-[300px] w-[300px] sm:min-w-[350px] bg-white border border-gray-100 p-6 rounded-xl shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] snap-start shrink-0 flex flex-col relative group hover:-translate-y-1 transition-transform duration-300">

                  {/* Google G icon */}
                  <div className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center font-bold text-[14px]">
                    <span className="text-blue-500">G</span>
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold text-white font-bold flex items-center justify-center uppercase shadow-sm">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-oswald font-bold text-gray-900 text-[15px] leading-tight">{rev.name}</h4>
                      <p className="font-opensans text-gray-400 text-[11px] font-light">{rev.date}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-brand-gold mb-4 gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-gold" />)}
                  </div>

                  {/* Text */}
                  <p className="font-opensans text-[13px] text-gray-600 leading-[1.6] font-light line-clamp-4 flex-grow">
                    {rev.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
