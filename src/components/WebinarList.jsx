import React, { useState } from 'react';
import { Shield, Calendar, Clock, Sparkles, ExternalLink, Pin, Play, CheckCircle2, Award, Zap } from 'lucide-react';
import { parseYouTubeEmbedUrl } from './FounderVideo';

export default function WebinarList({ webinars = [], pinnedWebinar = null }) {
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // If no published webinars, don't render empty section
  if (!webinars || webinars.length === 0) {
    return null;
  }

  // Filter out the pinned webinar from the listing below if it's already shown as pinned hero
  const otherWebinars = webinars.filter(w => !pinnedWebinar || w.id !== pinnedWebinar.id);

  return (
    <section id="all-webinars" className="py-20 bg-cyber-dark relative overflow-hidden border-t border-cyber-border">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyber-blue/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold mb-4 shadow-glow-cyan">
            <Zap className="w-3.5 h-3.5 text-cyber-cyan fill-cyber-cyan/20 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">EV CYBER ACADEMY • WEBINAR HUB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Upcoming Webinars & Workshops
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore all live Cyber Security training webinars. Select a session below to reserve your spot via its dedicated registration form.
          </p>
        </div>

        {/* Webinars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map((webinar) => {
            const isPinned = webinar.is_pinned === 1;
            const regUrl = webinar.registration_form_url || 'https://forms.gle/GqsnVfsERERKRVCp7';
            const isPaid = webinar.is_paid === 1 || Number(webinar.price) > 0;
            const price = Number(webinar.price || 0);
            const originalPrice = Number(webinar.original_price || 0);

            return (
              <div 
                key={webinar.id}
                className={`glass-panel p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 ${
                  isPinned 
                    ? 'border-cyber-cyan/60 shadow-glow-cyan bg-cyber-card/80' 
                    : 'border-cyber-border hover:border-cyber-cyan/40 hover:shadow-2xl bg-cyber-card/50'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {isPinned ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan text-[11px] font-mono font-bold tracking-wider shadow-glow-cyan">
                        <Pin className="w-3.5 h-3.5 fill-cyber-cyan" />
                        <span>PINNED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyber-dark border border-cyber-border text-slate-400 text-[11px] font-mono">
                        <span>LIVE WEBINAR</span>
                      </span>
                    )}

                    {/* Free vs Paid Badge */}
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyber-gold/20 border border-cyber-gold/50 text-cyber-gold text-[11px] font-mono font-bold uppercase tracking-wider shadow-glow-gold">
                        <span>₹{price.toLocaleString('en-IN')}</span>
                        {originalPrice > price && (
                          <span className="line-through text-slate-400 font-normal text-[10px]">₹{originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                        100% Free
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 group-hover:text-cyber-cyan transition-colors leading-snug">
                    {webinar.title}
                  </h3>

                  {/* Short Description */}
                  {webinar.short_description && (
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                      {webinar.short_description}
                    </p>
                  )}

                  {/* Metadata Pills */}
                  <div className="space-y-2 mb-6 text-xs text-slate-300">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-cyber-dark/80 border border-cyber-border">
                      <Calendar className="w-4 h-4 text-cyber-cyan shrink-0" />
                      <span className="font-semibold text-white">{webinar.date || 'Coming Soon'}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-cyber-dark/80 border border-cyber-border">
                      <Clock className="w-4 h-4 text-cyber-blue shrink-0" />
                      <span>{webinar.start_time || '7:00 PM'} – {webinar.end_time || '8:00 PM IST'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="space-y-2 pt-2 border-t border-cyber-border/60">
                  {/* Register Button (Links directly to Google Form) */}
                  <a
                    href={regUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                      isPinned && isPaid
                        ? 'bg-gradient-to-r from-cyber-gold via-amber-400 to-cyber-cyan text-slate-950 shadow-glow-gold hover:scale-[1.02]'
                        : isPinned
                        ? 'bg-gradient-to-r from-cyber-cyan via-cyber-cyan-bright to-cyber-blue text-slate-950 shadow-glow-cyan hover:scale-[1.02]'
                        : isPaid
                        ? 'bg-cyber-gold/15 border border-cyber-gold/40 text-cyber-gold hover:bg-cyber-gold hover:text-slate-950 shadow-sm hover:scale-[1.02]'
                        : 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-slate-950 shadow-sm hover:scale-[1.02]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isPaid ? `REGISTER FOR ₹${price.toLocaleString('en-IN')}` : 'REGISTER FREE'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* Video Preview Button if YouTube URL exists */}
                  {webinar.youtube_url && (
                    <button
                      onClick={() => setActiveVideoModal(webinar)}
                      className="w-full py-2 rounded-lg bg-cyber-dark/60 hover:bg-cyber-hover border border-cyber-border text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span>Watch Preview Video</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Modal Preview */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-cyber-card border border-cyber-cyan/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white truncate pr-4">{activeVideoModal.title}</h4>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-cyber-border bg-black">
              <iframe
                src={parseYouTubeEmbedUrl(activeVideoModal.youtube_url)}
                title={activeVideoModal.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="text-right">
              <a
                href={activeVideoModal.registration_form_url || 'https://forms.gle/GqsnVfsERERKRVCp7'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs shadow-glow-cyan hover:scale-105 transition-transform"
              >
                <span>Register For This Webinar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
