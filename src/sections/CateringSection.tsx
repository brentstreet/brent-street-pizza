import React, { useRef, useEffect, useState } from 'react';

import { Send, Users, Calendar, MessageSquare, ArrowRight, Check } from 'lucide-react';

const eventTypes = [
  { emoji: '🎂', label: 'Birthdays' },
  { emoji: '💼', label: 'Corporate Events' },
  { emoji: '🏈', label: 'Footy Nights' },
  { emoji: '🎉', label: 'Private Parties' },
  { emoji: '🎓', label: 'Graduations' },
  { emoji: '🎪', label: 'Community Events' },
];

const CateringSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', guests: '', message: '' });

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.date && form.guests) setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="bg-[#1a0a00] py-24 md:py-28 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4a017]/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Info */}
          <div className="reveal-left">
            <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] block mb-4">
              — For Groups —
            </span>
            <h2 className="font-bebas text-[52px] md:text-[64px] text-white tracking-wider leading-none mb-4">
              Feeding a Crowd?
            </h2>
            <p className="font-inter text-white/50 text-[16px] leading-relaxed mb-8">
              Whether it's 20 or 200 — we've got you covered. Our catering team works with your schedule, your budget, and your crowd to deliver a pizza experience everyone will remember.
            </p>

            {/* Event types */}
            <div className="flex flex-wrap gap-2 mb-10">
              {eventTypes.map(ev => (
                <div
                  key={ev.label}
                  className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-full px-4 py-2"
                >
                  <span>{ev.emoji}</span>
                  <span className="font-barlow text-[13px] font-600 text-white/60">{ev.label}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-4">
              {[
                'Minimum 20 pizzas for catering',
                'Fresh, made-to-order on the day',
                'Delivery or pickup available',
                'Custom menu options available',
                'Early booking discounts for 50+ orders',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C0392B]/20 border border-[#C0392B]/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#C0392B]" />
                  </div>
                  <span className="font-inter text-[14px] text-white/50">{item}</span>
                </div>
              ))}
            </div>

            {/* Quick call CTA */}
            <a
              href="tel:0455123678"
              className="mt-10 inline-flex items-center gap-3 btn-outline border-[#d4a017]/30 text-[#d4a017] hover:border-[#d4a017] hover:bg-[#d4a017]/10"
            >
              Talk to Us Directly <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Enquiry form */}
          <div className="reveal-right">
            <div className="bg-[#2b1200] rounded-[20px] border border-white/8 p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
              <h3 className="font-bebas text-[32px] text-white tracking-wider mb-6">Catering Enquiry</h3>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">Your Name</label>
                    <input
                      type="text"
                      id="catering-name"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jane Smith"
                      className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder:text-white/20 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">
                        <Calendar className="inline w-3 h-3 mr-1" />Event Date
                      </label>
                      <input
                        type="date"
                        id="catering-date"
                        value={form.date}
                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                        className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[14px] text-white/70 outline-none transition-all"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">
                        <Users className="inline w-3 h-3 mr-1" />Guests
                      </label>
                      <input
                        type="number"
                        id="catering-guests"
                        value={form.guests}
                        onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}
                        placeholder="e.g. 50"
                        min="20"
                        className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder:text-white/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30 block mb-1.5">
                      <MessageSquare className="inline w-3 h-3 mr-1" />Tell Us More
                    </label>
                    <textarea
                      id="catering-message"
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Event type, dietary requirements, delivery address..."
                      className="w-full bg-[#1a0a00] border border-white/8 focus:border-[#d4a017] rounded-[8px] px-4 py-3 font-inter text-[13px] text-white placeholder:text-white/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    id="catering-submit"
                    className="w-full btn-primary justify-center py-4 text-[14px]"
                  >
                    <Send className="w-4 h-4" /> Submit Enquiry
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#C0392B]/20 border border-[#C0392B]/40 flex items-center justify-center">
                    <Check className="w-8 h-8 text-[#C0392B]" />
                  </div>
                  <h4 className="font-bebas text-[28px] text-white tracking-wider">Enquiry Received!</h4>
                  <p className="font-inter text-[14px] text-white/40">We'll be in touch within 24 hours to discuss your event.</p>
                  <a href="tel:0455123678" className="font-barlow font-700 text-[15px] uppercase tracking-wider text-[#d4a017] hover:underline mt-2">
                    Or call us now: 0455 123 678
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
