import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, ExternalLink, Gift, Clock, Calendar, Lock, DollarSign } from 'lucide-react';

export default function RegistrationForm({ 
  registrationFormUrl = 'https://forms.gle/GqsnVfsERERKRVCp7', 
  webinarDate = 'Coming Soon',
  webinarTitle = 'EV CYBER ACADEMY',
  isPaid = false,
  price = 0,
  originalPrice = 0
}) {
  const targetUrl = registrationFormUrl || 'https://forms.gle/GqsnVfsERERKRVCp7';
  const numPrice = Number(price || 0);
  const numOrigPrice = Number(originalPrice || 0);

  return (
    <section id="register" className="py-16 md:py-24 bg-cyber-card/40 border-y border-cyber-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Container Card */}
        <div className={`glass-panel p-6 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden ${
          isPaid ? 'border-cyber-gold/50 shadow-glow-gold' : 'border-cyber-cyan/40'
        }`}>
          
          {/* Subtle Glow */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isPaid ? 'bg-cyber-gold/10' : 'bg-cyber-cyan/10'
          }`}></div>

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-3 ${
              isPaid
                ? 'bg-cyber-gold/15 border border-cyber-gold/40 text-cyber-gold shadow-glow-gold'
                : 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan shadow-glow-cyan'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isPaid 
                  ? `WEBINAR PASS • ₹${numPrice.toLocaleString('en-IN')} ONLY`
                  : 'FREE REGISTRATION • LIMITED SEATS'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
              {isPaid 
                ? `Reserve Your Seat for ${webinarTitle} — ₹${numPrice.toLocaleString('en-IN')}`
                : `Reserve Your Free Spot for ${webinarTitle}`}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Click the button below to register via our official Google Form and secure your live webinar access pass.
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
                <h4 className="text-sm font-bold text-white">Practical Toolkit Included</h4>
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
              <div className={`p-2 rounded-xl shrink-0 ${
                isPaid ? 'bg-cyber-gold/10 text-cyber-gold' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {isPaid ? <DollarSign className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isPaid ? `Webinar Fee: ₹${numPrice.toLocaleString('en-IN')}` : '100% Free Registration'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isPaid 
                    ? (numOrigPrice > numPrice 
                        ? `Regular value ₹${numOrigPrice.toLocaleString('en-IN')} (Special Access Price)` 
                        : 'Access to both days of practical training')
                    : 'Zero payment or credit card required'}
                </p>
              </div>
            </div>

          </div>

          {/* Main Action CTA */}
          <div className="space-y-4 text-center">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 px-6 rounded-xl font-extrabold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 ${
                isPaid
                  ? 'bg-gradient-to-r from-cyber-gold via-amber-400 to-cyber-cyan text-slate-950 shadow-glow-gold'
                  : 'bg-gradient-to-r from-cyber-cyan via-cyber-cyan-bright to-cyber-blue text-slate-950 shadow-glow-cyan'
              }`}
            >
              <ShieldCheck className="w-6 h-6 fill-slate-950" />
              <span>{isPaid ? `FILL REGISTRATION FORM (₹${numPrice.toLocaleString('en-IN')})` : 'FILL FREE REGISTRATION FORM'}</span>
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
