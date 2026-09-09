import React from 'react';
import { CheckCircle2, Calendar, Clock, Gift, ShieldCheck, ArrowLeft, Download, Terminal, Sparkles } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function RegistrationSuccess({ registration, config, onBackToHome }) {
  const webinarName = config?.webinar_name || 'EV CYBER ACADEMY';
  const webinarDate = config?.webinar_date || 'Coming Soon';
  const webinarTime = config?.webinar_time || '7:00 PM – 8:00 PM IST';

  return (
    <div className="min-h-screen pt-28 pb-16 bg-cyber-dark bg-cyber-grid flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        
        {/* Glass Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyber-cyan/40 shadow-glow-cyan text-center relative overflow-hidden">
          
          {/* Top Success Badge */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-blue p-0.5 shadow-glow-cyan flex items-center justify-center animate-bounce">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-cyber-cyan" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            You're Registered!
          </h1>
          <p className="text-lg font-bold text-cyber-cyan mb-6">
            Your {webinarName} registration has been received successfully.
          </p>

          {/* Registration Details Box */}
          <div className="bg-cyber-card/80 border border-cyber-border rounded-2xl p-6 mb-8 text-left space-y-4">
            
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <span className="text-xs text-slate-400 font-mono">REGISTRATION ID</span>
              <span className="text-sm font-mono font-bold text-cyber-cyan">#EV-REG-{registration?.id || '2026'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Name</span>
                <span className="text-sm font-bold text-white">{registration?.full_name || 'Attendee'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">WhatsApp Number</span>
                <span className="text-sm font-bold text-white">{registration?.whatsapp || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Email</span>
                <span className="text-sm font-bold text-white">{registration?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Status</span>
                <span className="text-sm font-bold text-emerald-400">Confirmed (Free)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-cyber-border grid grid-cols-2 gap-4 text-center bg-cyber-dark/60 p-3 rounded-xl">
              <div>
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Webinar Date</span>
                </div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">{webinarDate}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Timing</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{webinarTime}</div>
              </div>
            </div>

          </div>

          {/* Joining Details Status */}
          <div className="p-4 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-sm mb-8 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Webinar joining details & access links will be updated soon via WhatsApp & Email.</span>
          </div>

          {/* Toolkit Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyber-card to-cyber-dark border border-cyber-gold/40 text-left mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-6 h-6 text-cyber-gold" />
              <h3 className="text-lg font-bold text-white">Your Free Resources Are Waiting</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              All tools, IP/DNS recon scripts, and beginner lab resources will be unlocked live during the webinar session.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-gold bg-cyber-gold/10 p-2.5 rounded-lg border border-cyber-gold/20">
              <Terminal className="w-4 h-4" />
              <span>Status: Unlocked for Registered Attendees</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyber-card border border-cyber-border text-slate-300 font-semibold text-sm hover:bg-cyber-hover hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Landing Page</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
