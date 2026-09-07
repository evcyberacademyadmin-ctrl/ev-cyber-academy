import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function MobileStickyCTA({ onRegisterClick, webinarDate = 'Coming Soon' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById('register');
      if (formElement) {
        const rect = formElement.getBoundingClientRect();
        // Hide if form is near or in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setVisible(false);
          return;
        }
      }
      // Show when scrolled past 200px
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-cyber-dark/95 backdrop-blur-lg border-t border-cyber-cyan/40 shadow-2xl animate-slideUp">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="text-left">
          <div className="text-[11px] font-mono text-cyber-cyan font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span>EV-WEB-2 • FREE</span>
          </div>
          <div className="text-xs text-slate-300 font-semibold">{webinarDate}</div>
        </div>

        <button
          onClick={onRegisterClick}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-extrabold text-sm shadow-glow-cyan flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <ShieldCheck className="w-4 h-4 fill-slate-950" />
          <span>REGISTER FREE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
