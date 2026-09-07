import React from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Zap, Award, Layers, Terminal, BookOpen, Lock } from 'lucide-react';

export default function LFHPOffer({ config, onJoinClick }) {
  const originalPrice = parseFloat(config?.lfhp_original_price || '15000');
  const offerPrice = parseFloat(config?.lfhp_offer_price || '4000');

  const savingsAmount = Math.max(0, originalPrice - offerPrice);
  const discountPercentage = originalPrice > 0 
    ? (((originalPrice - offerPrice) / originalPrice) * 100).toFixed(1) 
    : '73.3';

  const title = config?.lfhp_title || 'LFHP — Learn the Fundamentals of Hacking';
  const desc = config?.lfhp_desc || 'EV-WEB-2 gives you the foundation. If you want structured practical Cyber Security training after the webinar, continue your journey with LFHP.';
  const ctaText = config?.lfhp_cta_text || 'JOIN LFHP NOW';

  const valueStack = [
    { title: 'Cyber Security Fundamentals', desc: 'Core security models, CIA triad, threat vectors & defense principles.' },
    { title: 'Networking & Reconnaissance', desc: 'In-depth TCP/IP, OSI layers, active/passive recon techniques.' },
    { title: 'Linux Fundamentals', desc: 'Command line mastery, bash scripting, file permissions & administration.' },
    { title: 'Ethical Hacking Concepts', desc: 'Methodologies, vulnerability assessments & scanning workflows.' },
    { title: 'Web Security Basics', desc: 'OWASP Top 10 vulnerabilities, web traffic analysis & HTTP basics.' },
    { title: 'Security Tools Hands-On', desc: 'Nmap, Wireshark, Burp Suite, and proprietary EV Cyber Academy tools.' },
    { title: 'Practical Hands-On Labs', desc: 'Real-world guided lab exercises and hands-on practical scenarios.' },
    { title: 'Structured Learning Path', desc: 'Step-by-step curriculum with mentorship and direct Q&A support.' }
  ];

  return (
    <section id="lfhp" className="py-16 md:py-24 bg-gradient-to-b from-cyber-dark via-cyber-card/70 to-cyber-dark border-t border-cyber-gold/30 relative">
      
      {/* Background Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyber-gold/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-gold/10 border border-cyber-gold/30 text-cyber-gold text-xs font-bold mb-3 shadow-glow-gold">
            <Zap className="w-3.5 h-3.5 fill-cyber-gold" />
            <span>ADVANCED POST-WEBINAR ROADMAP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Want to Go Beyond the 2-Day Webinar?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {desc}
          </p>
        </div>

        {/* LFHP Main Offer Card */}
        <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-10 rounded-3xl border border-cyber-gold/40 shadow-glow-gold relative overflow-hidden mb-16">
          
          {/* Top Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-cyber-gold to-amber-600 text-slate-950 px-5 py-1.5 rounded-bl-2xl font-mono font-extrabold text-xs tracking-wider uppercase">
            {discountPercentage}% OFF WEBINAR SPECIAL
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Offer Info */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-cyber-gold uppercase tracking-widest block font-bold">
                EV CYBER ACADEMY FLAGSHIP PROGRAM
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                A complete, structured practical training program designed for students and beginners looking to master practical security, networking, Linux, and penetration testing concepts.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyber-gold shrink-0" />
                  <span>Comprehensive Practical Curriculum</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyber-gold shrink-0" />
                  <span>Hands-on Lab Exercises & Tool Walkthroughs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyber-gold shrink-0" />
                  <span>Certificate of Completion from EV CYBER ACADEMY</span>
                </div>
              </div>
            </div>

            {/* Price Box & CTA */}
            <div className="lg:col-span-5 bg-cyber-dark/90 border border-cyber-gold/30 rounded-2xl p-6 text-center space-y-6">
              
              <div>
                <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Original Value</span>
                <span className="text-xl font-bold text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="py-2 border-y border-cyber-border">
                <span className="text-xs text-cyber-gold font-mono uppercase font-bold block mb-1">
                  Special EV-WEB-2 Offer
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-gradient-gold">
                  ₹{offerPrice.toLocaleString('en-IN')}
                </div>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                  SAVE ₹{savingsAmount.toLocaleString('en-IN')} ({discountPercentage}% OFF)
                </div>
              </div>

              <button
                onClick={onJoinClick}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-gold via-amber-500 to-yellow-400 text-slate-950 font-extrabold text-base hover:scale-105 transition-all shadow-glow-gold flex items-center justify-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-[11px] text-slate-400">
                Optional post-webinar advancement program.
              </p>

            </div>

          </div>

        </div>

        {/* LFHP Value Stack Section */}
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              LFHP Complete Curriculum Stack
            </h3>
            <p className="text-slate-400 text-sm">
              Here is what is included in the complete LFHP training curriculum:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valueStack.map((item, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-cyber-border hover:border-cyber-gold/40 transition-all">
                <div className="w-8 h-8 rounded-lg bg-cyber-gold/10 border border-cyber-gold/20 flex items-center justify-center text-cyber-gold font-bold text-sm mb-3">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
