import React from 'react';
import { Gift, Terminal, Search, ShieldAlert, DownloadCloud, FileCode2, ArrowRight } from 'lucide-react';

export default function FreeToolkit({ resources = [], onRegisterClick }) {
  const displayResources = resources.length > 0 ? resources : [
    { title: 'IP / DNS Recon Tool', description: 'Essential beginner scripts for domain and IP reconnaissance.', type: 'tool', badge: 'Included Free' },
    { title: 'Basic Port Scanner', description: 'Lightweight scanner to understand open ports and active services.', type: 'tool', badge: 'Included Free' },
    { title: 'EV Cyber Academy Tools', description: 'Custom academy tools developed for practical hands-on learning.', type: 'software', badge: 'Academy Exclusive' },
    { title: 'Installation Resources', description: 'Step-by-step Linux and security tool setup guides.', type: 'guide', badge: 'Beginner Ready' },
    { title: 'Beginner Learning Resources', description: 'Curated study path from Cyber Security basics to practical pentesting.', type: 'guide', badge: 'PDF Roadmap' }
  ];

  return (
    <section id="toolkit" className="py-16 md:py-24 bg-cyber-card/30 border-y border-cyber-border relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-gold/10 border border-cyber-gold/30 text-cyber-gold text-xs font-semibold mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>FREE TOOLKIT & RESOURCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Register & Attend — Get FREE Resources
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-gradient-gold mb-3">
            Don't Just Watch. Start Practicing.
          </p>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            All registered attendees get instant access to starter scripts, scanning utilities, and setup guides after attending the webinar.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {displayResources.map((res, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-6 rounded-2xl border border-cyber-border hover:border-cyber-cyan/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                    {res.type === 'tool' ? <Terminal className="w-6 h-6" /> : 
                     res.type === 'software' ? <ShieldAlert className="w-6 h-6" /> : 
                     <FileCode2 className="w-6 h-6" />}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold">
                    {res.badge || 'Included Free'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                  {res.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-cyber-cyan">Access Granted Live</span>
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  Free Access
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer inside section */}
        <div className="text-center">
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-extrabold text-sm hover:scale-105 transition-all shadow-glow-cyan"
          >
            <span>CLAIM YOUR FREE TOOLKIT ON REGISTRATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
