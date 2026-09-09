import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const displayFaqs = faqs.length > 0 ? faqs : [
    { question: 'Is this webinar really free?', answer: 'Yes! EV CYBER ACADEMY is 100% free for 2 days. There are no hidden fees or payment required to attend.' },
    { question: 'Do I need Cyber Security experience?', answer: 'No previous experience is required! The webinar is designed specifically for complete beginners, college students, and anyone starting from scratch.' },
    { question: 'Who can attend?', answer: 'College students, working professionals, job seekers, ethical hacking enthusiasts, or anyone interested in Cyber Security and Pentesting.' },
    { question: 'What time is the webinar?', answer: 'The webinar runs for 2 consecutive days, 1 hour per day, from 7:00 PM to 8:00 PM IST.' },
    { question: 'What will I learn?', answer: 'Day 1 covers Cyber Security fundamentals, networking, IP & DNS basics. Day 2 covers IP/DNS recon, port scanning, and practical security concepts.' },
    { question: 'Will I receive the toolkit & resources?', answer: 'Yes! All registered attendees will receive access to our beginner security tools, IP/DNS recon scripts, and installation guides.' },
    { question: 'Do I need a laptop?', answer: 'Having a laptop or desktop computer is recommended for following along with the practical demonstrations, but you can also watch on a phone or tablet.' },
    { question: 'What happens after the webinar?', answer: 'You will have a solid foundation in cyber security basics. If you wish to advance further, you can optionally enroll in our structured LFHP program.' }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-cyber-dark relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Everything you need to know about EV CYBER ACADEMY webinar and your learning journey.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="glass-card rounded-2xl border border-cyber-border overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-cyber-card border border-cyber-border flex items-center justify-center text-cyber-cyan shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 bg-cyber-cyan/10' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-cyber-border/50 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
