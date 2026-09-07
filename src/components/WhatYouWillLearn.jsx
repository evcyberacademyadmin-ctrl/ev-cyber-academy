import React from 'react';
import { BookOpen, Check, Clock, Terminal, Network, ShieldCheck, Cpu } from 'lucide-react';

export default function WhatYouWillLearn({ config }) {
  const day1Title = config?.day1_title || 'DAY 1: Cyber Security Fundamentals';
  const day1Topics = config?.day1_topics || [
    'Cyber Security fundamentals',
    'Basic networking concepts',
    'IP basics',
    'DNS basics',
    'Reconnaissance fundamentals',
    'Introduction to security tools',
    'Understanding how security professionals approach problems'
  ];

  const day2Title = config?.day2_title || 'DAY 2: Practical Security Basics';
  const day2Topics = config?.day2_topics || [
    'IP Recon',
    'DNS Recon',
    'Basic Port Scanning',
    'Understanding ports and services',
    'EV Cyber Academy tools',
    'Beginner practical security concepts'
  ];

  const webinarTime = config?.webinar_time || '7:00 PM – 8:00 PM';

  return (
    <section id="learn" className="py-16 md:py-24 bg-cyber-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>2-DAY INTENSIVE CURRICULUM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            What You'll Learn in 2 Days
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Structured step-by-step learning designed to take you from absolute zero knowledge to practical cyber security understanding.
          </p>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* DAY 1 CARD */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-cyber-cyan/30 relative flex flex-col justify-between group hover:shadow-glow-cyan transition-all">
            
            <div>
              {/* Day Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-mono font-bold text-lg">
                    01
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyber-cyan uppercase tracking-widest block">DAY ONE</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Fundamentals & Concepts</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>{webinarTime}</span>
                </div>
              </div>

              <h4 className="text-base font-semibold text-cyber-cyan-bright mb-4 flex items-center gap-2">
                <Network className="w-4 h-4 text-cyber-cyan" />
                <span>{day1Title}</span>
              </h4>

              <ul className="space-y-3 mb-8">
                {day1Topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center shrink-0 mt-0.5 text-cyber-cyan">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-cyber-border flex items-center justify-between text-xs text-slate-400">
              <span>Focus: Foundation & Theory</span>
              <span className="text-cyber-cyan font-mono font-semibold">1 Hour Live</span>
            </div>

          </div>

          {/* DAY 2 CARD */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-cyber-blue/30 relative flex flex-col justify-between group hover:shadow-glow-blue transition-all">
            
            <div>
              {/* Day Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-cyber-blue/15 border border-cyber-blue/40 flex items-center justify-center text-cyber-blue font-mono font-bold text-lg">
                    02
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyber-blue uppercase tracking-widest block">DAY TWO</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Practical Security Basics</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyber-blue" />
                  <span>{webinarTime}</span>
                </div>
              </div>

              <h4 className="text-base font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-blue" />
                <span>{day2Title}</span>
              </h4>

              <ul className="space-y-3 mb-8">
                {day2Topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center shrink-0 mt-0.5 text-cyber-blue">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-cyber-border flex items-center justify-between text-xs text-slate-400">
              <span>Focus: Hands-On Demos & Tools</span>
              <span className="text-cyber-blue font-mono font-semibold">1 Hour Live</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
