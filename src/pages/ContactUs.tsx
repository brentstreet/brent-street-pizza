import { Phone, Mail, MapPin, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  return (
    <div className="bg-white">
      {/* Page Header Banner */}
      <div className="bg-brand-light py-20 border-b border-gray-100 flex flex-col items-center relative">
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-full border border-gray-200 font-oswald text-sm font-bold uppercase hover:bg-brand-red hover:text-white hover:border-brand-red transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-bangers text-[60px] md:text-[80px] text-gray-900 uppercase tracking-heading leading-none">
          CONTACT US
        </h1>
        <div className="w-24 h-1.5 bg-brand-red mt-4 rounded-full"></div>
      </div>

      <div className="container-custom py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Contact Information Cards */}
          <div className="flex flex-col gap-8">
            <h2 className="font-bangers text-4xl text-gray-900 uppercase tracking-heading mb-4">
              HAVE QUESTIONS? WE'RE HERE TO HELP!
            </h2>
            <p className="font-opensans text-gray-600 text-lg leading-relaxed mb-6">
              Serving Glenorchy the finest stone-baked pizzas daily. Reach out for orders, catering, or just to say hello.
            </p>

            <div className="grid gap-6">
              {/* Phone Card */}
              <div className="bg-brand-light p-8 rounded-2xl flex items-center gap-6 border-b-4 border-brand-red hover:-translate-y-1 transition-all shadow-sm">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-red shadow-inner">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <span className="block font-oswald text-xs text-gray-400 uppercase tracking-widest mb-1">CALL US DIRECTLY</span>
                  <a href="tel:0452135367" className="font-bangers text-2xl text-gray-900 tracking-wide hover:text-brand-red transition-colors">
                    0452 135 367
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-brand-light p-8 rounded-2xl flex items-center gap-6 border-b-4 border-brand-gold hover:-translate-y-1 transition-all shadow-sm">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-inner">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="overflow-hidden">
                  <span className="block font-oswald text-xs text-gray-400 uppercase tracking-widest mb-1">EMAIL SUPPORT</span>
                  <a href="mailto:brentstreetgroup@gmail.com" className="font-bangers text-xl md:text-2xl text-gray-900 tracking-wide hover:text-brand-gold transition-colors break-words">
                    brentstreetgroup@gmail.com
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-brand-light p-8 rounded-2xl flex items-center gap-6 border-b-4 border-gray-900 hover:-translate-y-1 transition-all shadow-sm">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-inner">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <span className="block font-oswald text-xs text-gray-400 uppercase tracking-widest mb-1">OUR LOCATION</span>
                  <address className="not-italic font-bangers text-2xl text-gray-900 tracking-wide">
                    2 Brent Street, Glenorchy 7010
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Premium Contact Form */}
          <div className="bg-brand-darkred p-1 rounded-[40px] shadow-2xl overflow-hidden group">
            <div className="bg-white p-10 md:p-14 rounded-[36px] flex flex-col items-center">
              <h3 className="font-bangers text-4xl text-gray-900 uppercase tracking-heading mb-10">
                SEND A MESSAGE
              </h3>

              <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-gold px-6 py-4 rounded-xl font-oswald outline-none transition-all tracking-wider"
                  />
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-gold px-6 py-4 rounded-xl font-oswald outline-none transition-all tracking-wider"
                  />
                </div>

                <input
                  type="text"
                  placeholder="SUBJECT"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-gold px-6 py-4 rounded-xl font-oswald outline-none transition-all tracking-wider"
                />

                <textarea
                  rows={4}
                  placeholder="HOW CAN WE HELP?"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-gold px-6 py-4 rounded-xl font-oswald outline-none transition-all tracking-wider resize-none"
                ></textarea>

                <button className="w-full bg-brand-red text-white font-bangers text-2xl py-5 rounded-2xl shadow-xl hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                  <Send className="w-6 h-6" /> SUBMIT NOW
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Full Width Map Embed */}
        <div className="mt-24 w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2925.33405391264!2d147.2798651756543!3d-42.84461994073347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaa6ddab79f29bf4d%3A0xc6cb1c4b72782e34!2s2%20Brent%20St%2C%20Glenorchy%20TAS%207010%2C%20Australia!5e0!3m2!1sen!2sau!4v1709121654316!5m2!1sen!2sau"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            title="Brent Street Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
