import React from 'react';
import { Shield, Clock, Calendar, Play, CheckCircle2, Zap, Award, Pin, ExternalLink } from 'lucide-react';

export default function HeroSection({ config, pinnedWebinar, onRegisterClick, onWatchVideoClick }) {
  const webinarName = config?.webinar_name || 'EV CYBER ACADEMY';
  
  // Prefer Pinned Webinar values if available, fallback to global site_config
  const webinarTitle = pinnedWebinar?.title || config?.webinar_title || '2-Day FREE Cyber Security Webinar';
  const webinarSubtitle = pinnedWebinar?.short_description || config?.webinar_subtitle || 'Start Your Cyber Security Journey From Zero';
  const webinarDesc = config?.webinar_desc || 'Learn the fundamentals of Cyber Security, networking, reconnaissance and practical security concepts in a beginner-friendly 2-day webinar.';
  const webinarDate = pinnedWebinar?.date || config?.webinar_date || 'Coming Soon';
  const webinarTime = pinnedWebinar?.start_time && pinnedWebinar?.end_time 
    ? `${pinnedWebinar.start_time} – ${pinnedWebinar.end_time}` 
    : (config?.webinar_time || '7:00 PM – 8:00 PM IST');

  const isPinned = Boolean(pinnedWebinar && pinnedWebinar.is_pinned === 1);

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-cyber-grid">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyber-cyan/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-cyber-blue/15 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-card border border-cyber-cyan/40 text-cyber-cyan text-xs sm:text-sm font-semibold mb-6 shadow-glow-cyan">
          {isPinned ? (
            <>
              <Pin className="w-4 h-4 text-cyber-cyan fill-cyber-cyan animate-pulse" />
              <span className="font-mono uppercase tracking-wider font-bold">FEATURED / PINNED WEBINAR</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyber-cyan fill-cyber-cyan/20 animate-pulse" />
              <span className="font-mono uppercase tracking-wider">{webinarName}</span>
            </>
          )}
          <span className="text-slate-500">•</span>
          <span>100% Live & Interactive</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          {webinarTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl font-bold text-gradient-cyan mb-4 max-w-3xl mx-auto">
          {webinarSubtitle}
        </p>

        {/* Supporting description */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {webinarDesc}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onRegisterClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-cyan-bright to-cyber-blue text-slate-950 font-extrabold text-lg hover:scale-105 active:scale-95 transition-all shadow-glow-cyan flex items-center justify-center gap-3"
          >
            <Shield className="w-5 h-5 fill-slate-950" />
            <span>REGISTER FREE NOW</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={onWatchVideoClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyber-card border border-cyber-border text-slate-200 font-bold text-base hover:bg-cyber-hover hover:border-cyber-cyan/40 transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 text-cyber-cyan fill-cyber-cyan/30" />
            <span>WATCH VIDEO</span>
          </button>
        </div>

        {/* Key Metadata Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          
          <div className="glass-card p-4 rounded-xl text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Duration</div>
            <div className="text-sm sm:text-base font-bold text-white mt-0.5">2 Days</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyber-blue/10 flex items-center justify-center text-cyber-blue">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Time / Day</div>
            <div className="text-sm sm:text-base font-bold text-white mt-0.5">1 Hour / Day</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Webinar Timing</div>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{webinarTime}</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Prerequisites</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">Beginner Friendly</div>
          </div>

          <div className="glass-card p-4 rounded-xl text-center col-span-2 sm:col-span-1">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Webinar Date</div>
            <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">{webinarDate}</div>
          </div>

        </div>

      </div>
    </section>
  );
}
