import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title1: "FRESH & AUTHENTIC",
    title2: "PIZZA IN",
    subtitle: "Glenorchy Tasmania",
    centerImg: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    badgeLabel: "Main Pizza"
  },
  {
    title1: "WOOD-FIRED",
    title2: "PERFECTION",
    subtitle: "Hand Stretched",
    centerImg: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    badgeLabel: "Italian Pizza NEW"
  },
  {
    title1: "HOT & SPICY",
    title2: "FLAVORS",
    subtitle: "Taste the Heat",
    centerImg: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80",
    badgeLabel: "Chicago Style"
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto advance
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-brand-red to-brand-darkred h-[500px] md:h-[600px] flex items-center">

      {/* Container */}
      <div className="container-custom flex flex-col md:flex-row items-center relative z-10 w-full px-4 md:px-default">

        {/* Left Text */}
        <div className="w-full md:w-[45%] flex flex-col items-center md:items-start pt-10 md:pt-0 text-center md:text-left transition-all duration-500 ease-in-out">
          <h1 key={`t1-${currentSlide}`} className="text-white font-bangers text-5xl md:text-7xl uppercase mb-0 tracking-heading drop-shadow-lg animate-in fade-in slide-in-from-left-4 duration-500">
            {slide.title1}
          </h1>
          <h1 key={`t2-${currentSlide}`} className="text-white font-bangers text-5xl md:text-7xl uppercase mb-2 tracking-heading drop-shadow-lg animate-in fade-in slide-in-from-left-4 duration-700">
            {slide.title2}
          </h1>
          <h2 key={`sub-${currentSlide}`} className="text-white font-dancing text-5xl md:text-6xl mb-8 md:-rotate-2 transform animate-in fade-in slide-in-from-bottom-4 duration-700">
            {slide.subtitle}
          </h2>

          <button className="bg-brand-gold text-brand-darkred font-oswald font-bold uppercase py-3 px-8 rounded-full text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
            ORDER NOW
          </button>
        </div>

        {/* Right Collage (Hidden on pure mobile to save space, but visible tablet+) */}
        <div className="hidden sm:flex w-full md:w-[55%] mt-12 md:mt-0 relative h-[300px] md:h-[400px] items-center justify-center">

          {/* Background circle behind pizzas */}
          <div className="absolute w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-brand-darkred/60 rounded-full blur-3xl z-0 key-pulse"></div>

          {/* Center Main Pizza */}
          <div key={`img-${currentSlide}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-80 md:h-80 transition-transform z-20 cursor-pointer drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-90 duration-500">
            <img src={slide.centerImg} alt="Main Pizza" className="w-full h-full object-cover rounded-full border-[6px] border-brand-gold shadow-2xl" />

            {/* dynamic badge */}
            <div className="absolute -bottom-4 right-0 bg-white px-3 py-1 font-dancing font-bold text-gray-800 rounded shadow-md rotate-[-10deg]">
              {slide.badgeLabel}
            </div>
          </div>

        </div>
      </div>

      {/* Prev / Next Arrows */}
      <div
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white text-white hover:bg-white hover:text-brand-red cursor-pointer transition-colors z-40 bg-black/20 backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </div>
      <div
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white text-white hover:bg-white hover:text-brand-red cursor-pointer transition-colors z-40 bg-black/20 backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full shadow-md cursor-pointer transition-colors ${currentSlide === index ? 'bg-brand-gold' : 'bg-white opacity-50 hover:bg-white hover:opacity-100'}`}
          ></span>
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;
