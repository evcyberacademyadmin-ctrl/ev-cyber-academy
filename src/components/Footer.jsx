import React from 'react';
import { Shield, ExternalLink, Heart } from 'lucide-react';
import logoUrl from '../assets/logo';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="bg-cyber-dark border-t border-cyber-border py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <img src={logoUrl} alt="EV CYBER ACADEMY" className="h-10 w-auto rounded-lg object-contain" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              EV CYBER ACADEMY is dedicated to empowering complete beginners, college students, and security aspirants with practical, hands-on Cyber Security & Pentesting education.
            </p>
            <div className="text-xs text-cyber-cyan font-mono font-semibold">
              EV-WEB-2 • 2-Day FREE Cyber Security Webinar
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-cyber-cyan transition-colors">Home</a></li>
              <li><a href="#founder-video" className="hover:text-cyber-cyan transition-colors">Founder Message</a></li>
              <li><a href="#learn" className="hover:text-cyber-cyan transition-colors">What You'll Learn</a></li>
              <li><a href="#toolkit" className="hover:text-cyber-cyan transition-colors">Free Toolkit</a></li>
              <li><a href="#lfhp" className="hover:text-cyber-gold transition-colors font-semibold">LFHP Offer</a></li>
              <li><a href="#faq" className="hover:text-cyber-cyan transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Academy Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onNavigateAdmin} 
                  className="hover:text-cyber-cyan transition-colors text-slate-300 font-mono flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Admin Panel Login</span>
                </button>
              </li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-cyber-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EV CYBER ACADEMY. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with precision & practical focus for Cyber Security Aspirants.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
