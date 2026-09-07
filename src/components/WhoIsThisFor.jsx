import React from 'react';
import { Users, GraduationCap, ShieldCheck, Compass, Code, Terminal, CheckCircle2 } from 'lucide-react';

export default function WhoIsThisFor({ onRegisterClick }) {
  const personas = [
    {
      icon: <Users className="w-6 h-6 text-cyber-cyan" />,
      title: 'Complete Beginners',
      description: 'Zero technical or security background needed. We start right from ground zero.'
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-cyber-blue" />,
      title: 'College Students',
      description: 'Computer Science, IT, or non-tech students wanting to build practical cyber skills.'
    },
    {
      icon: <Terminal className="w-6 h-6 text-cyber-cyan" />,
      title: 'Ethical Hacking Enthusiasts',
      description: 'Anyone curious about ethical hacking, how vulnerabilities work, and defense basics.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyber-blue" />,
      title: 'Pentesting Aspirants',
      description: 'Beginners aiming for career paths in penetration testing and vulnerability assessment.'
    },
    {
      icon: <Compass className="w-6 h-6 text-cyber-cyan" />,
      title: 'Don\'t Know Where to Start',
      description: 'Overwhelmed by scattered YouTube videos? Get a clear, structured learning roadmap.'
    },
    {
      icon: <Code className="w-6 h-6 text-cyber-blue" />,
      title: 'Practical Exposure Seekers',
      description: 'Anyone who prefers practical live tool demonstrations over dry theoretical lectures.'
    }
  ];

  return (
    <section id="audience" className="py-16 md:py-24 bg-cyber-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>TARGET AUDIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
            Who Should Join?
          </h2>

          {/* Strong Statement Banner */}
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyber-cyan/15 via-cyber-blue/15 to-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan font-extrabold text-lg sm:text-xl shadow-glow-cyan">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-cyber-cyan" />
            <span>No Previous Cyber Security Experience Required.</span>
          </div>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {personas.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 rounded-2xl border border-cyber-border hover:border-cyber-cyan/40 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
