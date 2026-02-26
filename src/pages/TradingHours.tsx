import { MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const tradingHours = [
  { day: 'Monday', hours: '11:00 AM - 9:00 PM' },
  { day: 'Tuesday', hours: '11:00 AM - 9:00 PM', active: true }, // Highlighted as per reference image
  { day: 'Wednesday', hours: '11:00 AM - 9:00 PM' },
  { day: 'Thursday', hours: '11:00 AM - 10:00 PM' },
  { day: 'Friday', hours: '11:00 AM - 11:00 PM' },
  { day: 'Saturday', hours: '11:00 AM - 11:00 PM' },
  { day: 'Sunday', hours: '11:00 AM - 10:00 PM' },
];

export default function TradingHours() {
  return (
    <div className="bg-white">
      {/* Banner / Header */}
      <div className="bg-brand-light py-16 border-b border-gray-100 flex flex-col items-center relative">
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-full border border-gray-200 font-oswald text-sm font-bold uppercase hover:bg-brand-red hover:text-white hover:border-brand-red transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-bangers text-[60px] text-gray-900 uppercase tracking-heading leading-none">
          TRADING HOURS
        </h1>
      </div>

      <div className="container-custom py-16 flex flex-col items-center">

        {/* Table Container */}
        <div className="w-full max-w-2xl border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-8 py-4 font-bangers text-2xl tracking-widest text-gray-900 uppercase">DAY</th>
                <th className="px-8 py-4 font-bangers text-2xl tracking-widest text-gray-900 uppercase">HOURS</th>
              </tr>
            </thead>
            <tbody className="font-opensans">
              {tradingHours.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 transition-colors ${row.active ? 'bg-brand-gold font-bold' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-8 py-4 text-gray-800">{row.day}</td>
                  <td className="px-8 py-4 text-gray-800">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Holiday Hours Section */}
        <div className="w-full bg-brand-red py-16 px-4 flex flex-col items-center text-center rounded-3xl overflow-hidden relative mb-16">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 3px 3px, #fff 1.5px, transparent 0)', backgroundSize: '30px 30px' }}></div>

          <h2 className="font-bangers text-5xl text-white uppercase tracking-heading mb-6 relative z-10">
            HOLIDAY HOURS
          </h2>
          <p className="font-opensans text-white opacity-90 text-lg max-w-2xl mb-12 relative z-10">
            Special hours for upcoming holidays will be posted here. Check back soon!
          </p>

          {/* Map Card Mockup */}
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-4 relative z-10">
            <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
              <div className="flex flex-col items-start px-4">
                <h3 className="font-oswald text-xl font-bold text-gray-900">Brent Street Pizza</h3>
                <div className="flex items-center gap-1 text-brand-gold mt-1">
                  <span className="text-sm font-bold text-gray-900 mr-1">4.2</span>
                  {"★★★★☆".split("").map((s, i) => <span key={i}>{s}</span>)}
                  <span className="text-xs text-gray-500 ml-2">4 reviews</span>
                </div>
              </div>
              <div className="flex flex-col items-end pr-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Navigation className="w-4 h-4" /> DIRECTIONS
                </div>
              </div>
            </div>

            <div className="w-full h-[250px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
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

          <button className="mt-12 bg-brand-gold text-brand-darkred font-oswald font-bold uppercase py-4 px-12 rounded-full text-lg shadow-xl hover:bg-yellow-400 hover:scale-105 transition-all relative z-10 flex items-center gap-3">
            <MapPin className="w-5 h-5" /> GET DIRECTIONS
          </button>
        </div>

      </div>
    </div>
  );
}
