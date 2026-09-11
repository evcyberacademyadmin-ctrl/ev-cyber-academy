import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, ExternalLink, Gift, Clock, Calendar, Lock } from 'lucide-react';

export default function RegistrationForm({ registrationFormUrl = 'https://forms.gle/GqsnVfsERERKRVCp7', webinarDate = 'Coming Soon' }) {
  const targetUrl = registrationFormUrl || 'https://forms.gle/GqsnVfsERERKRVCp7';

  return (
    <section id="register" className="py-16 md:py-24 bg-cyber-card/40 border-y border-cyber-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Container Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-cyber-cyan/40 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold mb-3 shadow-glow-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FREE REGISTRATION • LIMITED SEATS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
              Reserve Your Spot for EV CYBER ACADEMY
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Click the button below to complete your registration via our official registration form and unlock your free webinar access pass.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            
            <div className="p-4 rounded-2xl bg-cyber-dark/80 border border-cyber-border flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyber-cyan/10 text-cyber-cyan shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">2-Day Live Interactive Webinar</h4>
                <p className="text-xs text-slate-400 mt-0.5">Date: {webinarDate} • 7:00 PM – 8:00 PM IST</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyber-dark/80 border border-cyber-border flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyber-blue/10 text-cyber-blue shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Free Practical Toolkit Included</h4>
                <p className="text-xs text-slate-400 mt-0.5">IP/DNS recon tools, scripts & learning roadmap</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyber-dark/80 border border-cyber-border flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Beginner Friendly</h4>
                <p className="text-xs text-slate-400 mt-0.5">Designed for students & complete beginners</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyber-dark/80 border border-cyber-border flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Free Registration</h4>
                <p className="text-xs text-slate-400 mt-0.5">Zero payment or credit card required</p>
              </div>
            </div>

          </div>

          {/* Main Action CTA */}
          <div className="space-y-4 text-center">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-cyan-bright to-cyber-blue text-slate-950 font-extrabold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-glow-cyan flex items-center justify-center gap-3"
            >
              <ShieldCheck className="w-6 h-6 fill-slate-950" />
              <span>FILL REGISTRATION FORM</span>
              <ExternalLink className="w-5 h-5" />
            </a>

            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Official Google Form registration link opens securely in a new tab</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
