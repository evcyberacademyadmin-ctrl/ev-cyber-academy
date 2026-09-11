import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import WebinarList from '../components/WebinarList';
import FounderVideo from '../components/FounderVideo';
import WhatYouWillLearn from '../components/WhatYouWillLearn';
import FreeToolkit from '../components/FreeToolkit';
import WhoIsThisFor from '../components/WhoIsThisFor';
import RegistrationForm from '../components/RegistrationForm';
import LFHPOffer from '../components/LFHPOffer';
import FAQSection from '../components/FAQSection';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';

export default function Home({ config, faqs, resources, webinars = [], pinnedWebinar = null, onNavigateAdmin }) {
  // Pinned webinar or fallback registration link
  const activePinned = pinnedWebinar || (webinars.find(w => w.is_pinned === 1) || webinars[0] || null);
  const registrationFormUrl = activePinned?.registration_form_url || config?.registration_form_url || 'https://forms.gle/GqsnVfsERERKRVCp7';
  const webinarDate = activePinned?.date || config?.webinar_date || 'Coming Soon';

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    const el = document.getElementById('founder-video');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAllWebinars = () => {
    const el = document.getElementById('all-webinars');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 selection:bg-cyber-cyan selection:text-black">
      
      {/* Navigation Bar */}
      <Header 
        onRegisterClick={scrollToRegister} 
        webinarDate={webinarDate} 
      />

      {/* Hero Section (Features Pinned Webinar) */}
      <HeroSection 
        config={config} 
        pinnedWebinar={activePinned}
        onRegisterClick={scrollToRegister} 
        onWatchVideoClick={scrollToVideo} 
      />

      {/* All Published Webinars & Workshops Listing */}
      <WebinarList 
        webinars={webinars}
        pinnedWebinar={activePinned}
      />

      {/* Founder Video Section (YouTube Video Rendering Intact) */}
      <FounderVideo 
        config={config} 
        onRegisterClick={scrollToRegister} 
      />

      {/* What You'll Learn Section */}
      <WhatYouWillLearn 
        config={config} 
      />

      {/* Free Toolkit Section */}
      <FreeToolkit 
        resources={resources} 
        onRegisterClick={scrollToRegister} 
      />

      {/* Who Is This For */}
      <WhoIsThisFor 
        onRegisterClick={scrollToRegister} 
      />

      {/* External Registration Form Section */}
      <RegistrationForm 
        registrationFormUrl={registrationFormUrl}
        webinarDate={webinarDate} 
      />

      {/* LFHP Offer Section */}
      <LFHPOffer 
        config={config} 
        onJoinClick={scrollToRegister} 
      />

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs} 
      />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA 
        onRegisterClick={scrollToRegister} 
        webinarDate={webinarDate} 
      />

      {/* Footer */}
      <Footer 
        onNavigateAdmin={onNavigateAdmin} 
      />

    </div>
  );
}
