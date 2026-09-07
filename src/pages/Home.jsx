import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FounderVideo from '../components/FounderVideo';
import WhatYouWillLearn from '../components/WhatYouWillLearn';
import FreeToolkit from '../components/FreeToolkit';
import WhoIsThisFor from '../components/WhoIsThisFor';
import RegistrationForm from '../components/RegistrationForm';
import LFHPOffer from '../components/LFHPOffer';
import FAQSection from '../components/FAQSection';
import MobileStickyCTA from '../components/MobileStickyCTA';
import Footer from '../components/Footer';

export default function Home({ config, faqs, resources, formFields, onRegisterSuccess, onNavigateAdmin }) {
  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    const el = document.getElementById('founder-video');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLFHP = () => {
    const el = document.getElementById('lfhp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 selection:bg-cyber-cyan selection:text-black">
      
      {/* Navigation Bar */}
      <Header 
        onRegisterClick={scrollToRegister} 
        webinarDate={config?.webinar_date} 
      />

      {/* Hero Section */}
      <HeroSection 
        config={config} 
        onRegisterClick={scrollToRegister} 
        onWatchVideoClick={scrollToVideo} 
      />

      {/* Founder Video Section */}
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

      {/* Registration Form Section */}
      <RegistrationForm 
        formFields={formFields} 
        webinarDate={config?.webinar_date} 
        onSuccess={onRegisterSuccess} 
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
        webinarDate={config?.webinar_date} 
      />

      {/* Footer */}
      <Footer 
        onNavigateAdmin={onNavigateAdmin} 
      />

    </div>
  );
}
