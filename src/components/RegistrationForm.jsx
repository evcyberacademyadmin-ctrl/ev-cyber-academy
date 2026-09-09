import React, { useState } from 'react';
import { ShieldCheck, Loader2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { registerWebinar } from '../services/api';

export default function RegistrationForm({ formFields = [], webinarDate = 'Coming Soon', onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    college_company: '',
    current_status: 'Student',
    experience: 'Complete Beginner',
    main_goal: 'Learn Cyber Security'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on user edit
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  // Client Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name || formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full Name is required (at least 2 characters).';
    }

    const cleanWhatsapp = formData.whatsapp.replace(/[^0-9]/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length < 10 || cleanWhatsapp.length > 15) {
      newErrors.whatsapp = 'Enter a valid WhatsApp / Mobile number (10-15 digits).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.college_company || !formData.college_company.trim()) {
      newErrors.college_company = 'Please specify your College or Company.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await registerWebinar(formData);
      setLoading(false);

      if (response.success) {
        if (onSuccess) {
          onSuccess(response.registration || { ...formData, created_at: new Date().toISOString() });
        }
      } else {
        setApiError(response.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setApiError(err.message || 'Network error. Please check your connection and try again.');
    }
  };

  return (
    <section id="register" className="py-16 md:py-24 bg-cyber-card/40 border-y border-cyber-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Container Card */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-cyber-cyan/40 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Form Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FREE REGISTRATION • LIMITED SEATS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Reserve Your Spot for EV CYBER ACADEMY
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Fill out the details below to complete your registration and receive live webinar joining updates.
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Full Name <span className="text-cyber-cyan">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-4 py-3 rounded-xl bg-cyber-dark border ${
                    errors.full_name ? 'border-red-500' : 'border-cyber-border'
                  } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all`}
                />
                {errors.full_name && (
                  <p className="text-xs text-red-400 mt-1">{errors.full_name}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  WhatsApp Number <span className="text-cyber-cyan">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-3 rounded-xl bg-cyber-dark border ${
                    errors.whatsapp ? 'border-red-500' : 'border-cyber-border'
                  } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all`}
                />
                {errors.whatsapp && (
                  <p className="text-xs text-red-400 mt-1">{errors.whatsapp}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Email Address <span className="text-cyber-cyan">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@example.com"
                  className={`w-full px-4 py-3 rounded-xl bg-cyber-dark border ${
                    errors.email ? 'border-red-500' : 'border-cyber-border'
                  } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* College / Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  College / Company <span className="text-cyber-cyan">*</span>
                </label>
                <input
                  type="text"
                  name="college_company"
                  value={formData.college_company}
                  onChange={handleChange}
                  placeholder="e.g. ABC Tech Institute / Freelance"
                  className={`w-full px-4 py-3 rounded-xl bg-cyber-dark border ${
                    errors.college_company ? 'border-red-500' : 'border-cyber-border'
                  } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all`}
                />
                {errors.college_company && (
                  <p className="text-xs text-red-400 mt-1">{errors.college_company}</p>
                )}
              </div>

              {/* Current Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Current Status <span className="text-cyber-cyan">*</span>
                </label>
                <select
                  name="current_status"
                  value={formData.current_status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                >
                  <option value="Student">Student</option>
                  <option value="Working">Working</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Cyber Security Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Cyber Security Experience <span className="text-cyber-cyan">*</span>
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                >
                  <option value="Complete Beginner">Complete Beginner</option>
                  <option value="Basic Knowledge">Basic Knowledge</option>
                  <option value="Already Learning">Already Learning</option>
                </select>
              </div>

            </div>

            {/* Main Goal (Full width) */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Main Goal <span className="text-cyber-cyan">*</span>
              </label>
              <select
                name="main_goal"
                value={formData.main_goal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
              >
                <option value="Learn Cyber Security">Learn Cyber Security</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="Pentesting">Pentesting</option>
                <option value="Career / Job">Career / Job</option>
                <option value="College Learning">College Learning</option>
                <option value="Exploring">Exploring</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-cyan-bright to-cyber-blue text-slate-950 font-extrabold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-glow-cyan flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
                    <span>REGISTERING...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-6 h-6 fill-slate-950" />
                    <span>REGISTER FREE</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>100% Free Registration • Instant Access to Beginner Toolkit</span>
              </p>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
