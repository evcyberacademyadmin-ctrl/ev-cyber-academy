import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import logoUrl from '../assets/logo';

export default function Header({ onRegisterClick, webinarDate = 'Coming Soon' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cyber-dark/95 backdrop-blur-md border-b border-cyber-border/80 py-3 shadow-xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <img 
            src={logoUrl} 
            alt="EV CYBER ACADEMY" 
            className="h-10 sm:h-12 w-auto rounded-lg object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => scrollToSection('hero')} 
            className="hover:text-cyber-cyan transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('founder-video')} 
            className="hover:text-cyber-cyan transition-colors"
          >
            Founder Message
          </button>
          <button 
            onClick={() => scrollToSection('learn')} 
            className="hover:text-cyber-cyan transition-colors"
          >
            What You'll Learn
          </button>
          <button 
            onClick={() => scrollToSection('toolkit')} 
            className="hover:text-cyber-cyan transition-colors"
          >
            Free Resources
          </button>
          <button 
            onClick={() => scrollToSection('lfhp')} 
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1 text-cyber-gold font-semibold"
          >
            LFHP Offer
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="hover:text-cyber-cyan transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Header CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
            <span>Date: {webinarDate}</span>
          </div>

          <button
            onClick={onRegisterClick}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-glow-cyan flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>REGISTER FREE</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onRegisterClick}
            className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs shadow-glow-cyan"
          >
            REGISTER
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-cyber-card border border-cyber-border"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyber-card border-b border-cyber-border px-4 pt-4 pb-6 space-y-3 mt-3 shadow-2xl animate-fadeIn">
          <div className="px-3 py-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 text-xs font-mono text-cyber-cyan flex items-center justify-between mb-2">
            <span>EV-WEB-2 Webinar</span>
            <span className="font-bold">{webinarDate}</span>
          </div>

          <button
            onClick={() => scrollToSection('hero')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:bg-cyber-dark rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('founder-video')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:bg-cyber-dark rounded-md"
          >
            Founder Message
          </button>
          <button
            onClick={() => scrollToSection('learn')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:bg-cyber-dark rounded-md"
          >
            What You'll Learn
          </button>
          <button
            onClick={() => scrollToSection('toolkit')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:bg-cyber-dark rounded-md"
          >
            Free Resources
          </button>
          <button
            onClick={() => scrollToSection('lfhp')}
            className="w-full text-left px-3 py-2 text-base font-medium text-cyber-gold hover:bg-cyber-dark rounded-md font-bold"
          >
            LFHP Offer
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:bg-cyber-dark rounded-md"
          >
            FAQ
          </button>

          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onRegisterClick(); }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-extrabold text-center text-sm shadow-glow-cyan flex items-center justify-center gap-2"
            >
              <span>REGISTER FREE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
