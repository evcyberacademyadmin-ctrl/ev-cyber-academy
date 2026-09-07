import React, { useState, useEffect } from 'react';
import { 
  Users, Video, Settings, HelpCircle, Gift, FormInput, DollarSign, 
  Search, Trash2, Edit, Save, Plus, Check, LogOut, RefreshCw, AlertCircle,
  LayoutDashboard, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';
import { 
  fetchAdminStats, fetchRegistrations, updateRegistrationStatus, deleteRegistration, 
  updateWebinarConfig, updateFaqsConfig, updateResourcesConfig, updateFormFieldsConfig,
  fetchPublicConfig
} from '../services/api';
import logoUrl from '../assets/logo';
import { parseYouTubeEmbedUrl } from '../components/FounderVideo';

export default function AdminDashboard({ token, onLogout, onBackToSite }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ total: 0, today: 0, beginners: 0, students: 0, lfhpInterested: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Public config state
  const [siteConfig, setSiteConfig] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [resources, setResources] = useState([]);
  const [formFields, setFormFields] = useState([]);

  // Form states for settings
  const [webinarForm, setWebinarForm] = useState({
    webinar_name: '',
    webinar_title: '',
    webinar_subtitle: '',
    webinar_desc: '',
    webinar_date: '',
    webinar_time: '',
    youtube_url: '',
    founder_title: '',
    day1_title: '',
    day1_topics: [],
    day2_title: '',
    day2_topics: []
  });

  const [lfhpForm, setLfhpForm] = useState({
    lfhp_original_price: '15000',
    lfhp_offer_price: '4000',
    lfhp_title: '',
    lfhp_desc: '',
    lfhp_cta_text: ''
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  // Selected lead for detail/notes editing
  const [editingNotesLead, setEditingNotesLead] = useState(null);
  const [notesText, setNotesText] = useState('');

  // FAQ editing state
  const [editingFaq, setEditingFaq] = useState(null);

  // Load Data
  useEffect(() => {
    loadAllData();
  }, [token]);

  const loadAllData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetchAdminStats(token);
      if (statsRes.success) setStats(statsRes.stats);

      // Fetch registrations
      loadRegistrations();

      // Fetch site configuration
      const configRes = await fetchPublicConfig();
      if (configRes.success) {
        setSiteConfig(configRes.config);
        setFaqs(configRes.faqs || []);
        setResources(configRes.resources || []);
        setFormFields(configRes.formFields || []);

        // Populate forms
        const c = configRes.config || {};
        setWebinarForm({
          webinar_name: c.webinar_name || 'EV-WEB-2',
          webinar_title: c.webinar_title || '2-Day FREE Cyber Security Webinar',
          webinar_subtitle: c.webinar_subtitle || 'Start Your Cyber Security Journey From Zero',
          webinar_desc: c.webinar_desc || '',
          webinar_date: c.webinar_date || 'Coming Soon',
          webinar_time: c.webinar_time || '7:00 PM – 8:00 PM IST',
          youtube_url: c.youtube_url || '',
          founder_title: c.founder_title || 'Before You Register, Watch This',
          day1_title: c.day1_title || 'DAY 1: Cyber Security Fundamentals',
          day1_topics: Array.isArray(c.day1_topics) ? c.day1_topics : [],
          day2_title: c.day2_title || 'DAY 2: Practical Security Basics',
          day2_topics: Array.isArray(c.day2_topics) ? c.day2_topics : []
        });

        setLfhpForm({
          lfhp_original_price: c.lfhp_original_price || '15000',
          lfhp_offer_price: c.lfhp_offer_price || '4000',
          lfhp_title: c.lfhp_title || 'LFHP — Learn the Fundamentals of Hacking',
          lfhp_desc: c.lfhp_desc || '',
          lfhp_cta_text: c.lfhp_cta_text || 'JOIN LFHP NOW'
        });
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  const loadRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await fetchRegistrations(token, searchTerm, statusFilter);
      setLoadingRegs(false);
      if (res.success) {
        setRegistrations(res.registrations);
      }
    } catch (err) {
      setLoadingRegs(false);
      console.error('Error loading registrations:', err);
    }
  };

  // Re-trigger registration search when search/filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRegistrations();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Lead Status Update
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRegistrationStatus(token, id, newStatus, undefined);
      loadRegistrations();
      // Reload stats
      const statsRes = await fetchAdminStats(token);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      await deleteRegistration(token, id);
      loadRegistrations();
      const statsRes = await fetchAdminStats(token);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      alert('Failed to delete registration');
    }
  };

  const handleSaveWebinarConfig = async (e) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    try {
      await updateWebinarConfig(token, webinarForm);
      setSaveSuccessMsg('Webinar configuration & video updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update webinar settings');
    }
  };

  // Save LFHP Config
  const handleSaveLfhpConfig = async (e) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    try {
      await updateWebinarConfig(token, lfhpForm);
      setSaveSuccessMsg('LFHP pricing and offer settings updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update LFHP settings');
    }
  };

  // Dynamic calculations for LFHP offer
  const origPrice = parseFloat(lfhpForm.lfhp_original_price || '0');
  const offerPrice = parseFloat(lfhpForm.lfhp_offer_price || '0');
  const computedDiscount = origPrice > 0 ? (((origPrice - offerPrice) / origPrice) * 100).toFixed(1) : '0';

  // Save FAQs
  const handleSaveFaqs = async () => {
    try {
      await updateFaqsConfig(token, faqs);
      setSaveSuccessMsg('FAQs updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update FAQs');
    }
  };

  // Add FAQ
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'New Question?', answer: 'Answer details here...', sort_order: faqs.length + 1 }]);
  };

  // Save Form Fields
  const handleSaveFormFields = async () => {
    try {
      await updateFormFieldsConfig(token, formFields);
      setSaveSuccessMsg('Registration Form fields saved successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to save form fields');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      
      {/* Admin Top Navbar */}
      <header className="bg-cyber-card border-b border-cyber-border py-3 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="EV CYBER ACADEMY" className="h-8 sm:h-9 w-auto rounded-lg object-contain" />
          <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold">
            ADMIN PANEL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-3.5 py-1.5 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-slate-300 hover:text-white transition-colors"
          >
            Public Site
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-cyber-card/60 border-r border-cyber-border p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'overview' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
              activeTab === 'registrations' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Registrations</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-[10px] font-mono font-bold text-cyber-cyan">
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('webinar')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'webinar' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Webinar & Video</span>
          </button>

          <button
            onClick={() => setActiveTab('lfhp')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'lfhp' ? 'bg-cyber-gold/15 border border-cyber-gold/40 text-cyber-gold' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>LFHP Offer Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'faqs' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('form-builder')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'form-builder' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <FormInput className="w-4 h-4" />
            <span>Form Builder</span>
          </button>
        </aside>

        {/* Tab Content Panel */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* Notification Banners */}
          {saveSuccessMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
          {saveErrorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{saveErrorMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
                <p className="text-xs text-slate-400">Live lead analytics and registration metrics for EV-WEB-2.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Total Registrations</div>
                  <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                  <div className="text-[11px] text-cyber-cyan mt-1">All time leads</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Today's Registrations</div>
                  <div className="text-3xl font-extrabold text-cyber-cyan mt-1">{stats.today}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Joined today</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Beginners</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.beginners}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Complete beginners</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">College Students</div>
                  <div className="text-3xl font-extrabold text-cyber-blue mt-1">{stats.students}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Students</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border col-span-2 lg:col-span-1">
                  <div className="text-xs text-slate-400 font-medium">LFHP Interested</div>
                  <div className="text-3xl font-extrabold text-cyber-gold mt-1">{stats.lfhpInterested}</div>
                  <div className="text-[11px] text-cyber-gold mt-1">Hot leads</div>
                </div>

              </div>

              {/* Recent Registrations Table */}
              <div className="glass-panel p-6 rounded-2xl border border-cyber-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
                  <button 
                    onClick={() => setActiveTab('registrations')}
                    className="text-xs text-cyber-cyan hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View All Registrations</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cyber-dark/80 text-slate-400 uppercase font-mono border-b border-cyber-border">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">WhatsApp</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Lead Stage</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-border">
                      {registrations.slice(0, 5).map((reg) => (
                        <tr key={reg.id} className="hover:bg-cyber-hover/50">
                          <td className="p-3 font-semibold text-white">{reg.full_name}</td>
                          <td className="p-3 font-mono text-cyber-cyan">{reg.whatsapp}</td>
                          <td className="p-3 text-slate-300">{reg.email}</td>
                          <td className="p-3">{reg.current_status}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              reg.status === 'Converted' ? 'bg-emerald-500/20 text-emerald-400' :
                              reg.status === 'Interested' ? 'bg-cyber-gold/20 text-cyber-gold' :
                              'bg-cyber-cyan/20 text-cyber-cyan'
                            }`}>
                              {reg.status || 'New'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono">
                            {new Date(reg.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-4 text-center text-slate-500">No registrations found yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REGISTRATIONS MANAGER */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Lead Registrations</h1>
                  <p className="text-xs text-slate-400">View, search, filter, and update lead statuses.</p>
                </div>

                <button
                  onClick={loadRegistrations}
                  className="px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-border text-xs text-slate-300 hover:text-white flex items-center gap-1.5 self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingRegs ? 'animate-spin' : ''}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, WhatsApp, email, college or goal..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyber-card border border-cyber-border text-xs text-white focus:outline-none focus:border-cyber-cyan"
                  >
                    <option value="All">All Lead Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="LFHP Offered">LFHP Offered</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="glass-panel rounded-2xl border border-cyber-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cyber-dark/90 text-slate-400 uppercase font-mono border-b border-cyber-border">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">WhatsApp</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">College / Company</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Experience</th>
                        <th className="p-3">Goal</th>
                        <th className="p-3">Lead Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-border">
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-cyber-hover/50 transition-colors">
                          <td className="p-3 font-mono text-slate-500">#{reg.id}</td>
                          <td className="p-3 font-bold text-white">{reg.full_name}</td>
                          <td className="p-3 font-mono text-cyber-cyan">{reg.whatsapp}</td>
                          <td className="p-3 text-slate-300">{reg.email}</td>
                          <td className="p-3 text-slate-300">{reg.college_company || 'N/A'}</td>
                          <td className="p-3 text-slate-300">{reg.current_status}</td>
                          <td className="p-3 text-slate-300">{reg.experience}</td>
                          <td className="p-3 text-slate-300">{reg.main_goal}</td>
                          <td className="p-3">
                            <select
                              value={reg.status || 'New'}
                              onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                              className="px-2 py-1 rounded bg-cyber-dark border border-cyber-border text-xs text-white focus:outline-none focus:border-cyber-cyan"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Interested">Interested</option>
                              <option value="LFHP Offered">LFHP Offered</option>
                              <option value="Converted">Converted</option>
                            </select>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleDeleteLead(reg.id)}
                              className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan="10" className="p-8 text-center text-slate-500">
                            {loadingRegs ? 'Loading registrations...' : 'No registrations found matching search.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: WEBINAR & VIDEO MANAGEMENT */}
          {activeTab === 'webinar' && (
            <div className="max-w-4xl space-y-8">
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Webinar & Founder Video Settings</h1>
                <p className="text-xs text-slate-400">Manage webinar metadata, dates, times, and founder YouTube URL.</p>
              </div>

              <form onSubmit={handleSaveWebinarConfig} className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Webinar Code Name</label>
                    <input
                      type="text"
                      value={webinarForm.webinar_name}
                      onChange={(e) => setWebinarForm({ ...webinarForm, webinar_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Webinar Display Date</label>
                    <input
                      type="text"
                      value={webinarForm.webinar_date}
                      onChange={(e) => setWebinarForm({ ...webinarForm, webinar_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Webinar Main Title</label>
                  <input
                    type="text"
                    value={webinarForm.webinar_title}
                    onChange={(e) => setWebinarForm({ ...webinarForm, webinar_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Webinar Subtitle</label>
                  <input
                    type="text"
                    value={webinarForm.webinar_subtitle}
                    onChange={(e) => setWebinarForm({ ...webinarForm, webinar_subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Webinar Timing</label>
                  <input
                    type="text"
                    value={webinarForm.webinar_time}
                    onChange={(e) => setWebinarForm({ ...webinarForm, webinar_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                {/* YOUTUBE VIDEO SECTION */}
                <div className="pt-4 border-t border-cyber-border space-y-4">
                  <div className="flex items-center gap-2 text-cyber-cyan font-bold text-sm">
                    <Video className="w-4 h-4" />
                    <span>Founder YouTube Video Configuration</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      YouTube Video URL (supports youtube.com/watch, youtu.be, embed)
                    </label>
                    <input
                      type="text"
                      value={webinarForm.youtube_url}
                      onChange={(e) => setWebinarForm({ ...webinarForm, youtube_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-cyan/40 text-xs text-white font-mono"
                    />
                  </div>

                  {/* YouTube Live Embed Preview */}
                  {parseYouTubeEmbedUrl(webinarForm.youtube_url) && (
                    <div className="mt-3">
                      <span className="text-xs text-slate-400 block mb-1.5">Live Embed Preview:</span>
                      <div className="rounded-xl overflow-hidden border border-cyber-border aspect-video max-w-md">
                        <iframe
                          src={parseYouTubeEmbedUrl(webinarForm.youtube_url).replace('&autoplay=1', '')}
                          title="Preview"
                          className="w-full h-full border-0"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Webinar & Video Settings</span>
                </button>

              </form>

            </div>
          )}

          {/* TAB 4: LFHP OFFER PRICING */}
          {activeTab === 'lfhp' && (
            <div className="max-w-3xl space-y-6">
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">LFHP Offer & Pricing Manager</h1>
                <p className="text-xs text-slate-400">
                  Update original price and offer price. Discount percentage recalculates dynamically.
                </p>
              </div>

              <form onSubmit={handleSaveLfhpConfig} className="glass-panel p-6 rounded-2xl border border-cyber-gold/40 space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={lfhpForm.lfhp_original_price}
                      onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_original_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Special Offer Price (₹)</label>
                    <input
                      type="number"
                      value={lfhpForm.lfhp_offer_price}
                      onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_offer_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-gold/40 text-sm text-cyber-gold font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Dynamic Calculation Box */}
                <div className="p-4 rounded-xl bg-cyber-gold/10 border border-cyber-gold/30 text-cyber-gold text-xs space-y-1 font-mono">
                  <div>Calculated Savings: ₹{(origPrice - offerPrice).toLocaleString('en-IN')}</div>
                  <div className="font-bold text-sm">Calculated Discount: {computedDiscount}% OFF</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">LFHP Section Title</label>
                  <input
                    type="text"
                    value={lfhpForm.lfhp_title}
                    onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={lfhpForm.lfhp_cta_text}
                    onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_cta_text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-gold to-amber-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save LFHP Offer Settings</span>
                </button>

              </form>

            </div>
          )}

          {/* TAB 5: FAQ MANAGER */}
          {activeTab === 'faqs' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">FAQ Manager</h1>
                  <p className="text-xs text-slate-400">Add, edit, or remove landing page FAQs.</p>
                </div>
                <button
                  onClick={handleAddFaq}
                  className="px-3.5 py-2 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan text-xs font-bold hover:bg-cyber-cyan/30 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-cyber-border space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-cyber-cyan">FAQ #{idx + 1}</span>
                      <button
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[idx].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-dark border border-cyber-border text-xs font-bold text-white"
                      placeholder="Question"
                    />

                    <textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[idx].answer = e.target.value;
                        setFaqs(newFaqs);
                      }}
                      rows="3"
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-slate-300"
                      placeholder="Answer"
                    ></textarea>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveFaqs}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All FAQs</span>
              </button>
            </div>
          )}

          {/* TAB 6: DYNAMIC FORM BUILDER */}
          {activeTab === 'form-builder' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Dynamic Form Builder</h1>
                  <p className="text-xs text-slate-400">Customize fields shown on the webinar registration form.</p>
                </div>
              </div>

              <div className="space-y-4">
                {formFields.map((field, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-cyber-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyber-cyan">Field: {field.field_name}</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={Boolean(field.required)}
                            onChange={(e) => {
                              const updated = [...formFields];
                              updated[idx].required = e.target.checked;
                              setFormFields(updated);
                            }}
                          />
                          <span>Required</span>
                        </label>

                        <label className="flex items-center gap-1.5 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={Boolean(field.enabled)}
                            onChange={(e) => {
                              const updated = [...formFields];
                              updated[idx].enabled = e.target.checked;
                              setFormFields(updated);
                            }}
                          />
                          <span>Enabled</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Field Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            const updated = [...formFields];
                            updated[idx].label = e.target.value;
                            setFormFields(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Field Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const updated = [...formFields];
                            updated[idx].type = e.target.value;
                            setFormFields(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                        >
                          <option value="text">Text Input</option>
                          <option value="tel">Telephone / Mobile</option>
                          <option value="email">Email Address</option>
                          <option value="select">Dropdown Select</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveFormFields}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Form Fields Configuration</span>
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
