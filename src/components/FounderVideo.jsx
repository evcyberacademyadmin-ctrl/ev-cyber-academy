import React, { useState } from 'react';
import { Play, Video, CheckCircle, Sparkles } from 'lucide-react';

export function parseYouTubeEmbedUrl(url) {
  if (!url) return null;
  
  let videoId = null;

  // Handle youtube.com/watch?v=ID
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) videoId = match[1];
  } 
  // Handle youtu.be/ID
  else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts[1]) videoId = parts[1].split('?')[0];
  } 
  // Handle youtube.com/embed/ID
  else if (url.includes('youtube.com/embed/')) {
    const parts = url.split('youtube.com/embed/');
    if (parts[1]) videoId = parts[1].split('?')[0];
  } 
  // Direct Video ID fallback
  else if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    videoId = url.trim();
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
  }
  return null;
}

export function parseYouTubeThumbnail(url) {
  if (!url) return null;
  let videoId = null;
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) videoId = match[1];
  } else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts[1]) videoId = parts[1].split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    const parts = url.split('youtube.com/embed/');
    if (parts[1]) videoId = parts[1].split('?')[0];
  } else if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    videoId = url.trim();
  }
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}

export default function FounderVideo({ config, onRegisterClick }) {
  const [isPlaying, setIsPlaying] = useState(true);

  const founderTitle = config?.founder_title || 'Before You Register, Watch This';
  const youtubeUrl = config?.youtube_url || '';
  const embedUrl = parseYouTubeEmbedUrl(youtubeUrl);
  const thumbnailUrl = parseYouTubeThumbnail(youtubeUrl);

  const videoPoints = [
    'Who is the Founder & EV CYBER ACADEMY mission',
    'What the 2-day webinar actually covers',
    'What practical skills you will gain in 2 days',
    'How to claim your FREE Cyber Toolkit resources',
    'Next steps for beginners aspiring for pentesting careers'
  ];

  return (
    <section id="founder-video" className="py-16 md:py-24 bg-cyber-card/50 border-y border-cyber-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold mb-3">
            <Video className="w-3.5 h-3.5" />
            <span>FOUNDER'S MESSAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {founderTitle}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Watch this short 3-minute video by our founder explaining why this 2-day webinar will change how you approach Cyber Security.
          </p>
        </div>

        {/* Responsive Video Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Video Player Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-cyber-cyan/30 shadow-2xl bg-cyber-dark aspect-video group">
              {embedUrl ? (
                isPlaying ? (
                  <iframe
                    src={embedUrl}
                    title="EV CYBER ACADEMY Founder Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div 
                    onClick={() => setIsPlaying(true)}
                    className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    {/* Thumbnail Image */}
                    {thumbnailUrl ? (
                      <img 
                        src={thumbnailUrl} 
                        alt="Founder Video Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyber-card to-cyber-dark flex items-center justify-center">
                        <Video className="w-16 h-16 text-cyber-cyan/40" />
                      </div>
                    )}

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors"></div>

                    {/* Play Button */}
                    <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-blue p-0.5 shadow-glow-cyan group-hover:scale-110 transition-transform">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center pl-1">
                        <Play className="w-8 h-8 text-cyber-cyan fill-cyber-cyan" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-200 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                      <span className="font-semibold text-cyber-cyan flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> EV CYBER ACADEMY
                      </span>
                      <span>Click to Play Video</span>
                    </div>
                  </div>
                )
              ) : (
                /* Fallback if no URL configured */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-cyber-dark">
                  <Video className="w-12 h-12 text-cyber-cyan mb-3 opacity-60" />
                  <h4 className="text-lg font-bold text-white mb-1">Founder Video Preview</h4>
                  <p className="text-xs text-slate-400 max-w-md">
                    Video link will be updated shortly by the administrator in the Admin Panel.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Video Highlights / Key Takeaways */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-cyber-border">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>In This Video You'll Discover:</span>
              </h3>

              <ul className="space-y-3.5">
                {videoPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-cyber-border">
                <button
                  onClick={onRegisterClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-glow-cyan flex items-center justify-center gap-2"
                >
                  <span>READY? REGISTER FREE FOR WEBINAR</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
