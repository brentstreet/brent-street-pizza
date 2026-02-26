import React from 'react';
import aboutGirl from '../../assets/about-girl.jpg';

const AboutUs: React.FC = () => {
  return (
    <section className="bg-white py-24 section-padding">
      <div className="container-custom flex flex-col lg:flex-row items-center gap-16">

        {/* Left: Premium Image Section */}
        <div className="w-full lg:w-[50%] relative h-[450px] md:h-[550px]">

          {/* Main Large Image */}
          <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl relative border-4 border-white">
            <img
              src={aboutGirl}
              alt="Girl enjoying pizza"
              className="w-full h-full object-cover"
            />
            {/* Red Overlay Badge */}
            <div className="absolute top-8 left-8 bg-brand-red text-white py-2 px-6 rounded-full font-bangers text-xl tracking-widest shadow-xl">
              SINCE 2012
            </div>
          </div>

          {/* Floated Small Pizza Image */}
          <div className="absolute -bottom-10 -right-8 w-1/2 h-1/2 rounded-[30px] overflow-hidden border-[8px] border-white shadow-2xl hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80"
              alt="Fresh Pizza"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Right: Text Content */}
        <div className="w-full lg:w-[45%] flex flex-col items-start pr-0 lg:pr-8">
          <p className="font-dancing text-brand-gold text-[28px] italic mb-2">About Us</p>
          <h2 className="font-bangers text-brand-red text-[28px] tracking-heading mb-2">
            WELCOME TO BRENT STREET PIZZA
          </h2>
          <h3 className="font-bangers text-gray-900 text-4xl md:text-5xl tracking-heading leading-tight mb-6">
            WHERE YOU CAN RELAX, ENJOY GREAT FOOD
          </h3>

          <p className="font-opensans text-[15px] text-gray-600 leading-[1.8] mb-8 font-light">
            Founded with a passion for the perfect crust, Brent Street Pizza has been serving the community for over a decade. We believe in quality above all else, sourcing only the freshest local ingredients. Every pizza is hand-stretched and fired in our stone ovens to give you that perfect authentic crunch and melt. Experience tradition in every bite.
          </p>

          <button className="border-2 border-brand-gold text-brand-red font-oswald font-bold uppercase py-3 px-8 rounded-full text-sm hover:bg-brand-red hover:border-brand-red hover:text-white transition-all shadow-md">
            Read More
          </button>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
