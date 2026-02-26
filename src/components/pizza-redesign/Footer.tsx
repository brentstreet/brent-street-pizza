import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPinned } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-24 pb-6">
      <div className="container-custom">

        {/* 4-column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Col 1: Brand */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-1 font-bangers text-3xl tracking-heading text-white leading-none mb-6">
              BRENT STREET <span className="text-white">PIZZA</span>
            </div>

            <p className="font-opensans text-[13px] text-gray-400 leading-[1.7] mb-8 font-light max-w-[250px]">
              Bringing the freshest and most authentic pizzas straight from our wood-fired ovens to your door. Experience the taste of true passion in every slice.
            </p>

            <button className="bg-brand-red text-white font-oswald text-[14px] font-bold uppercase py-3 px-8 rounded-full mb-4 hover:bg-red-700 transition-colors w-full sm:w-auto text-center">
              Order Now
            </button>
            <button className="bg-black text-white font-oswald text-[14px] font-bold py-3 px-8 rounded-full hover:bg-gray-900 transition-colors w-full sm:w-auto text-center border border-gray-800 flex items-center justify-center gap-2">
              Order online with <span className="text-green-500 text-lg uppercase leading-none mt-0.5">Uber Eats</span>
            </button>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-oswald text-[16px] text-white font-bold uppercase tracking-widest mb-8">
              QUICK LINKS
            </h4>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 font-opensans text-[13px] text-gray-400 font-light">
              <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
              <Link to="/contact" className="hover:text-brand-red transition-colors">Contact us</Link>
              <Link to="/" className="hover:text-brand-red transition-colors">About</Link>
              <Link to="#" className="hover:text-brand-red transition-colors">Terms of Use</Link>
              <Link to="/menu" className="hover:text-brand-red transition-colors">Menu</Link>
              <Link to="#" className="hover:text-brand-red transition-colors">Privacy</Link>
              <Link to="/trading-hours" className="hover:text-brand-red transition-colors">Trading Hours</Link>
            </div>

            <h4 className="font-oswald text-[16px] text-white font-bold uppercase tracking-widest mb-6 mt-8">
              TRADING HOURS
            </h4>

            <div className="flex flex-col gap-2 font-opensans text-[13px] text-gray-400 font-light">
              <div className="flex justify-between border-b md:border-b-0 border-gray-800 pb-2 md:pb-0">
                <span>Mon - Fri</span>
                <span className="text-white font-medium">12:00 PM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sat - Sun</span>
                <span className="text-white font-medium">12:00 PM - 12:00 AM</span>
              </div>
            </div>
          </div>

          {/* Col 3: Contact Us */}
          <div>
            <h4 className="font-oswald text-[16px] text-white font-bold uppercase tracking-widest mb-8">
              CONTACT US
            </h4>

            <div className="flex flex-col gap-6 font-opensans text-[13px] text-gray-400 font-light">
              <a href="tel:0452135367" className="flex items-center gap-4 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-brand-gold shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                0452 135 367
              </a>

              <a href="mailto:brentstreetgroup@gmail.com" className="flex items-center gap-4 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-brand-gold shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                brentstreetgroup@gmail.com
              </a>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-brand-gold shrink-0">
                  <MapPinned className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">2 Brent Street Glenorchy<br />Tasmania 7010</span>
              </div>
            </div>
          </div>

          {/* Col 4: Map */}
          <div>
            <div className="w-full h-[200px] border-2 border-white/10 rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2925.33405391264!2d147.2798651756543!3d-42.84461994073347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaa6ddab79f29bf4d%3A0xc6cb1c4b72782e34!2s2%20Brent%20St%2C%20Glenorchy%20TAS%207010%2C%20Australia!5e0!3m2!1sen!2sau!4v1709121654316!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333] pt-6 flex justify-center">
          <p className="font-opensans text-[12px] text-gray-500 text-center font-light tracking-wide">
            © Copyright 2026 All Rights Reserved | Design By JR Technologies Web
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
