import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Pizza, Truck, ArrowRight } from 'lucide-react';


const TrustBar: React.FC = () => (
  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4 px-6 bg-white/5 backdrop-blur-sm border border-white/8 rounded-full mt-10 w-fit">
    {[
      { icon: <Star className="w-4 h-4 fill-[#d4a017] text-[#d4a017]" />, text: '4.9 Google Rating' },
      { icon: <Pizza className="w-4 h-4 text-[#C0392B]" />, text: 'Hand-Stretched Daily' },
      { icon: <Truck className="w-4 h-4 text-[#d4a017]" />, text: 'Fast Local Delivery' },
    ].map(({ icon, text }) => (
      <div key={text} className="flex items-center gap-2">
        {icon}
        <span className="font-barlow text-[13px] font-600 text-white/60">{text}</span>
      </div>
    ))}
  </div>
);

const Hero: React.FC = () => {

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-[#1a0a00]">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        src="https://cdn.coverr.co/videos/coverr-a-pizza-being-made-in-a-restaurant-4989/1080p.mp4"
        autoPlay muted loop playsInline
        poster="/heropic.jpeg"
      />
      {/* Fallback image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-35"
        style={{ backgroundImage: 'url(/heropic.jpeg)' }}
      />
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a00]/95 via-[#1a0a00]/75 to-[#1a0a00]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-transparent to-[#1a0a00]/60" />
      {/* Grain */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`
      }} />
      {/* Decorative ring */}
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[500px] h-[500px] hidden xl:block pointer-events-none opacity-8">
        <div className="w-full h-full rounded-full border-[2px] border-dashed border-[#d4a017] animate-spin-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom flex flex-col justify-center pt-28 pb-20 min-h-screen">
        <div className="max-w-[700px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C0392B]/20 border border-[#C0392B]/40 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#C0392B] animate-pulse-glow" />
            <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.2em] text-white/80">Authentic Italian · Sydney</span>
          </div>

          {/* Headline */}
          <h3
            className="font-barlow text-white/55 text-[18px] md:text-[22px] font-600 uppercase tracking-[0.3em] mb-1 animate-fade-up"
            style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
          >
            HOT &amp; FRESH
          </h3>
          <h1
            className="font-bebas text-[80px] md:text-[120px] lg:text-[150px] leading-[0.85] mb-4 text-white drop-shadow-2xl animate-fade-up"
            style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}
          >
            ORDER DIRECT<br />&amp; <span style={{ color: '#d4a017' }}>SAVE</span>
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#d4a017] to-transparent mb-5 animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }} />
          <p
            className="font-inter text-white/55 text-[15px] md:text-[17px] font-light uppercase tracking-[0.15em] mb-10 animate-fade-up"
            style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Skip the apps — get free garlic bread on every direct order
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <Link
              to="/menu"
              id="hero-order-pickup"
              className="btn-primary text-[15px] px-8 py-4 w-full sm:w-auto justify-center"
            >
              Order Pickup <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/menu"
              id="hero-order-delivery"
              className="btn-outline text-[15px] px-8 py-4 w-full sm:w-auto justify-center"
            >
              Order Delivery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust bar */}
          <div className="animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
            <TrustBar />
          </div>
        </div>


      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35 animate-float">
        <span className="font-barlow text-[10px] uppercase tracking-[0.25em] text-white">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
