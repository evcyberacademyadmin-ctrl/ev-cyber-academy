import React, { useState, useEffect } from 'react';
import { 
  Video, Settings, HelpCircle, Gift, DollarSign, 
  Trash2, Edit, Save, Plus, Check, LogOut, RefreshCw, AlertCircle,
  LayoutDashboard, ShieldAlert, CheckCircle2, ChevronRight, ExternalLink, Link2, FormInput,
  Pin, Globe, Eye, EyeOff, Layers, Calendar, Clock, Play
} from 'lucide-react';
import { 
  fetchAdminWebinars, createAdminWebinar, updateAdminWebinar, toggleWebinarPin, toggleWebinarStatus, deleteAdminWebinar,
  updateWebinarConfig, updateFaqsConfig, updateResourcesConfig, updateFormFieldsConfig,
  fetchPublicConfig
} from '../services/api';
import logoUrl from '../assets/logo';
import { parseYouTubeEmbedUrl } from '../components/FounderVideo';

export default function AdminDashboard({ token, onLogout, onBackToSite }) {
  const [activeTab, setActiveTab] = useState('webinars'); // default to webinars tab for quick access
  
  // Data state
  const [webinars, setWebinars] = useState([]);
  const [loadingWebinars, setLoadingWebinars] = useState(false);
  const [siteConfig, setSiteConfig] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [resources, setResources] = useState([]);
  const [formFields, setFormFields] = useState([]);

  // Modal / Form state for Create & Edit Webinar
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [editingWebinarId, setEditingWebinarId] = useState(null);
  const [webinarModalForm, setWebinarModalForm] = useState({
    title: '',
    short_description: '',
    date: 'Coming Soon',
    start_time: '7:00 PM',
    end_time: '8:00 PM IST',
    thumbnail_url: '',
    youtube_url: '',
    registration_form_url: 'https://forms.gle/GqsnVfsERERKRVCp7',
    status: 'Published',
    is_pinned: 0
  });

  // Global settings form
  const [webinarSettingsForm, setWebinarSettingsForm] = useState({
    webinar_name: '',
    webinar_title: '',
    webinar_subtitle: '',
    webinar_desc: '',
    webinar_date: '',
    webinar_time: '',
    youtube_url: '',
    founder_title: '',
    registration_form_url: 'https://forms.gle/GqsnVfsERERKRVCp7',
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

  // Load Data
  useEffect(() => {
    loadAllData();
  }, [token]);

  const loadAllData = async () => {
    loadWebinars();
    try {
      const configRes = await fetchPublicConfig();
      if (configRes.success) {
        setSiteConfig(configRes.config || {});
        setFaqs(configRes.faqs || []);
        setResources(configRes.resources || []);
        setFormFields(configRes.formFields || []);

        const c = configRes.config || {};
        setWebinarSettingsForm({
          webinar_name: c.webinar_name || 'EV CYBER ACADEMY',
          webinar_title: c.webinar_title || '2-Day FREE Cyber Security Webinar',
          webinar_subtitle: c.webinar_subtitle || 'Start Your Cyber Security Journey From Zero',
          webinar_desc: c.webinar_desc || '',
          webinar_date: c.webinar_date || 'Coming Soon',
          webinar_time: c.webinar_time || '7:00 PM – 8:00 PM IST',
          youtube_url: c.youtube_url || '',
          founder_title: c.founder_title || 'Before You Register, Watch This',
          registration_form_url: c.registration_form_url || 'https://forms.gle/GqsnVfsERERKRVCp7',
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
      console.error('Error loading config:', err);
    }
  };

  const loadWebinars = async () => {
    setLoadingWebinars(true);
    try {
      const res = await fetchAdminWebinars(token);
      setLoadingWebinars(false);
      if (res.success) {
        setWebinars(res.webinars || []);
      }
    } catch (err) {
      setLoadingWebinars(false);
      console.error('Error loading webinars:', err);
    }
  };

  // Open modal to Create Webinar
  const handleOpenCreateModal = () => {
    setEditingWebinarId(null);
    setWebinarModalForm({
      title: '',
      short_description: '',
      date: 'Coming Soon',
      start_time: '7:00 PM',
      end_time: '8:00 PM IST',
      thumbnail_url: '',
      youtube_url: '',
      registration_form_url: siteConfig.registration_form_url || 'https://forms.gle/GqsnVfsERERKRVCp7',
      status: 'Published',
      is_pinned: 0
    });
    setIsWebinarModalOpen(true);
  };

  // Open modal to Edit Webinar
  const handleOpenEditModal = (webinar) => {
    setEditingWebinarId(webinar.id);
    setWebinarModalForm({
      title: webinar.title || '',
      short_description: webinar.short_description || '',
      date: webinar.date || 'Coming Soon',
      start_time: webinar.start_time || '7:00 PM',
      end_time: webinar.end_time || '8:00 PM IST',
      thumbnail_url: webinar.thumbnail_url || '',
      youtube_url: webinar.youtube_url || '',
      registration_form_url: webinar.registration_form_url || 'https://forms.gle/GqsnVfsERERKRVCp7',
      status: webinar.status || 'Published',
      is_pinned: webinar.is_pinned || 0
    });
    setIsWebinarModalOpen(true);
  };

  // Submit Webinar Modal Form
  const handleSaveWebinarModal = async (e) => {
    e.preventDefault();
    if (!webinarModalForm.title.trim()) {
      alert('Please enter a Webinar Title');
      return;
    }

    try {
      if (editingWebinarId) {
        await updateAdminWebinar(token, editingWebinarId, webinarModalForm);
        setSaveSuccessMsg(`Webinar "${webinarModalForm.title}" updated successfully!`);
      } else {
        await createAdminWebinar(token, webinarModalForm);
        setSaveSuccessMsg(`New webinar "${webinarModalForm.title}" created successfully!`);
      }

      setIsWebinarModalOpen(false);
      loadWebinars();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg(err.message || 'Failed to save webinar');
      setTimeout(() => setSaveErrorMsg(''), 4000);
    }
  };

  // Toggle Pin
  const handleTogglePin = async (id, currentPin) => {
    try {
      const newPin = currentPin === 1 ? 0 : 1;
      await toggleWebinarPin(token, id, newPin);
      loadWebinars();
      setSaveSuccessMsg(newPin === 1 ? 'Webinar pinned to the top of public website!' : 'Webinar unpinned.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to change pin status');
    }
  };

  // Toggle Publish / Draft
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
      await toggleWebinarStatus(token, id, newStatus);
      loadWebinars();
      setSaveSuccessMsg(`Webinar status set to ${newStatus}`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Delete Webinar
  const handleDeleteWebinar = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete webinar: "${title}"?`)) return;
    try {
      await deleteAdminWebinar(token, id);
      loadWebinars();
      setSaveSuccessMsg(`Webinar "${title}" deleted successfully.`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete webinar');
    }
  };

  // Save Global Webinar Settings
  const handleSaveGlobalWebinarConfig = async (e) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    try {
      await updateWebinarConfig(token, webinarSettingsForm);
      setSaveSuccessMsg('Global webinar configuration & founder video updated successfully!');
      loadAllData();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update global settings');
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
      loadAllData();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update LFHP settings');
    }
  };

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

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'New Question?', answer: 'Answer details here...', sort_order: faqs.length + 1 }]);
  };

  // Save Resources
  const handleSaveResources = async () => {
    try {
      await updateResourcesConfig(token, resources);
      setSaveSuccessMsg('Resources toolkit updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update resources');
    }
  };

  const handleAddResource = () => {
    setResources([...resources, { title: 'New Tool / Guide', description: 'Description here...', type: 'tool', badge: 'Included Free', sort_order: resources.length + 1 }]);
  };

  // Save Form Fields
  const handleSaveFormFields = async () => {
    try {
      await updateFormFieldsConfig(token, formFields);
      setSaveSuccessMsg('Form Builder settings saved successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to save form fields');
    }
  };

  const handleAddFormField = () => {
    const newField = {
      field_name: `field_${Date.now()}`,
      label: 'New Form Field',
      type: 'text',
      placeholder: '',
      options: [],
      required: true,
      enabled: true,
      sort_order: formFields.length + 1
    };
    setFormFields([...formFields, newField]);
  };

  const origPrice = parseFloat(lfhpForm.lfhp_original_price || '0');
  const offerPrice = parseFloat(lfhpForm.lfhp_offer_price || '0');
  const computedDiscount = origPrice > 0 ? (((origPrice - offerPrice) / origPrice) * 100).toFixed(1) : '0';

  const pinnedCount = webinars.filter(w => w.is_pinned === 1).length;
  const publishedCount = webinars.filter(w => w.status === 'Published').length;

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      
      {/* Admin Top Navbar */}
      <header className="bg-cyber-card border-b border-cyber-border py-3 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="EV CYBER ACADEMY" className="h-8 sm:h-9 w-auto rounded-lg object-contain" />
          <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold">
            ADMIN PANEL • MULTI-WEBINAR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-3.5 py-1.5 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Site</span>
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
            onClick={() => setActiveTab('webinars')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
              activeTab === 'webinars' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Webinar Manager</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-[10px] font-mono font-bold text-cyber-cyan">
              {webinars.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'overview' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Status</span>
          </button>

          <button
            onClick={() => setActiveTab('webinar-settings')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'webinar-settings' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Global Settings & Video</span>
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
            onClick={() => setActiveTab('resources')}
            className={`w-full px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'resources' ? 'bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan' : 'text-slate-400 hover:bg-cyber-dark hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Toolkit Resources</span>
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

          {/* TAB 1: WEBINAR MANAGEMENT (CORE) */}
          {activeTab === 'webinars' && (
            <div className="space-y-6 max-w-6xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Webinar Management Hub</h1>
                  <p className="text-xs text-slate-400">Create, edit, pin, publish, and delete multiple webinars for EV CYBER ACADEMY.</p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-cyan flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Webinar</span>
                  </button>
                  <button
                    onClick={loadWebinars}
                    className="p-2.5 rounded-xl bg-cyber-card border border-cyber-border text-xs text-slate-300 hover:text-white"
                    title="Refresh List"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingWebinars ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Webinar Cards List */}
              <div className="space-y-4">
                {webinars.map((webinar) => {
                  const isPinned = webinar.is_pinned === 1;
                  const isPublished = webinar.status === 'Published';

                  return (
                    <div 
                      key={webinar.id}
                      className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all ${
                        isPinned 
                          ? 'border-cyber-cyan/70 bg-cyber-cyan/5 shadow-glow-cyan' 
                          : 'border-cyber-border bg-cyber-card/60'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Info Left */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {isPinned && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan text-[11px] font-mono font-bold shadow-glow-cyan">
                                <Pin className="w-3.5 h-3.5 fill-cyber-cyan" />
                                <span>PINNED AT TOP</span>
                              </span>
                            )}

                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPublished 
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
                                : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                            }`}>
                              {webinar.status || 'Published'}
                            </span>

                            <span className="text-xs text-slate-400 font-mono">
                              ID #{webinar.id}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold text-white">
                            {webinar.title}
                          </h3>

                          {webinar.short_description && (
                            <p className="text-xs text-slate-300 line-clamp-2">
                              {webinar.short_description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                              <span>{webinar.date || 'Coming Soon'}</span>
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-cyber-blue" />
                              <span>{webinar.start_time || '7:00 PM'} – {webinar.end_time || '8:00 PM'}</span>
                            </span>

                            {webinar.youtube_url && (
                              <span className="flex items-center gap-1.5 text-cyber-cyan truncate max-w-xs">
                                <Play className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{webinar.youtube_url}</span>
                              </span>
                            )}
                          </div>

                          {webinar.registration_form_url && (
                            <div className="flex items-center gap-2 text-xs pt-1">
                              <span className="text-slate-400">Registration Link:</span>
                              <a 
                                href={webinar.registration_form_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="font-mono text-cyber-cyan hover:underline truncate max-w-sm flex items-center gap-1"
                              >
                                <span>{webinar.registration_form_url}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons Right */}
                        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                          {/* Pin / Unpin Button */}
                          <button
                            onClick={() => handleTogglePin(webinar.id, webinar.is_pinned)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                              isPinned
                                ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/30'
                                : 'bg-cyber-dark border border-cyber-border text-slate-400 hover:text-white hover:border-cyber-cyan/40'
                            }`}
                            title={isPinned ? 'Unpin Webinar' : 'Pin to Top (Automatically unpins any other webinar)'}
                          >
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-cyber-cyan' : ''}`} />
                            <span>{isPinned ? 'Pinned' : 'Pin to Top'}</span>
                          </button>

                          {/* Publish / Unpublish Button */}
                          <button
                            onClick={() => handleToggleStatus(webinar.id, webinar.status)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                              isPublished
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            }`}
                            title={isPublished ? 'Unpublish (Switch to Draft)' : 'Publish (Make visible publicly)'}
                          >
                            {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{isPublished ? 'Published' : 'Draft'}</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(webinar)}
                            className="px-3 py-2 rounded-xl bg-cyber-dark border border-cyber-border text-xs font-bold text-slate-200 hover:text-white hover:border-cyber-cyan/40 transition-colors flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteWebinar(webinar.id, webinar.title)}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete Webinar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}

                {webinars.length === 0 && !loadingWebinars && (
                  <div className="glass-panel p-12 text-center rounded-3xl border border-cyber-border space-y-3">
                    <Layers className="w-10 h-10 mx-auto text-slate-500" />
                    <h3 className="text-lg font-bold text-white">No Webinars Created Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click "+ Create Webinar" above to add your first webinar or workshop session.
                    </p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="px-4 py-2 rounded-xl bg-cyber-cyan text-slate-950 font-bold text-xs"
                    >
                      + Create First Webinar
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Platform Status Overview</h1>
                <p className="text-xs text-slate-400">Live multi-webinar analytics and configuration metrics for EV CYBER ACADEMY.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Total Webinars</div>
                  <div className="text-3xl font-extrabold text-white mt-1">{webinars.length}</div>
                  <div className="text-[11px] text-cyber-cyan mt-1">{publishedCount} live & published</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Pinned Webinar</div>
                  <div className="text-xl font-bold text-cyber-cyan mt-1 truncate">
                    {webinars.find(w => w.is_pinned === 1)?.title || 'None Pinned'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Shown at top of public site</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Active FAQs</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">{faqs.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Live questions</div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-cyber-border">
                  <div className="text-xs text-slate-400 font-medium">Toolkit Resources</div>
                  <div className="text-3xl font-extrabold text-cyber-blue mt-1">{resources.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Tools & Guides</div>
                </div>
              </div>

              {/* Founder Video Preview Card */}
              <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Founder YouTube Video Status</h3>
                  <button 
                    onClick={() => setActiveTab('webinar-settings')}
                    className="text-xs text-cyber-cyan hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Edit Video URL</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="text-xs text-slate-400">Current Video Title:</div>
                    <div className="text-sm font-semibold text-white mt-1">{webinarSettingsForm.founder_title}</div>
                    <div className="text-xs text-slate-400 mt-3">YouTube URL:</div>
                    <div className="text-xs font-mono text-cyber-cyan truncate mt-0.5">{webinarSettingsForm.youtube_url}</div>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden border border-cyber-border bg-black">
                    <iframe
                      src={parseYouTubeEmbedUrl(webinarSettingsForm.youtube_url)}
                      title="Founder Video Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL WEBINAR & FOUNDER VIDEO SETTINGS */}
          {activeTab === 'webinar-settings' && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Global Site & Founder Video Settings</h1>
                <p className="text-xs text-slate-400">Manage global branding, default registration form link, and founder YouTube URL.</p>
              </div>

              <form onSubmit={handleSaveGlobalWebinarConfig} className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
                
                {/* Registration Form Link Setting */}
                <div className="p-4 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/30">
                  <label className="block text-xs font-bold text-cyber-cyan uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Link2 className="w-4 h-4" />
                    <span>Default External Registration Form URL (Google Form)</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-3">Default fallback link when a specific webinar does not have its own URL set.</p>
                  <input
                    type="url"
                    value={webinarSettingsForm.registration_form_url}
                    onChange={(e) => setWebinarSettingsForm({ ...webinarSettingsForm, registration_form_url: e.target.value })}
                    placeholder="https://forms.gle/..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-cyan/40 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Academy Brand Name</label>
                    <input
                      type="text"
                      value={webinarSettingsForm.webinar_name}
                      onChange={(e) => setWebinarSettingsForm({ ...webinarSettingsForm, webinar_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Default Display Date</label>
                    <input
                      type="text"
                      value={webinarSettingsForm.webinar_date}
                      onChange={(e) => setWebinarSettingsForm({ ...webinarSettingsForm, webinar_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Founder Video Section Title</label>
                  <input
                    type="text"
                    value={webinarSettingsForm.founder_title}
                    onChange={(e) => setWebinarSettingsForm({ ...webinarSettingsForm, founder_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Founder YouTube Video URL</label>
                  <input
                    type="text"
                    value={webinarSettingsForm.youtube_url}
                    onChange={(e) => setWebinarSettingsForm({ ...webinarSettingsForm, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all flex items-center gap-2 shadow-glow-cyan"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE GLOBAL SETTINGS</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: LFHP OFFER PRICING */}
          {activeTab === 'lfhp' && (
            <div className="max-w-3xl space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">LFHP Course Offer & Pricing</h1>
                <p className="text-xs text-slate-400">Manage original vs discount offer pricing and promotional text.</p>
              </div>

              <form onSubmit={handleSaveLfhpConfig} className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={lfhpForm.lfhp_original_price}
                      onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_original_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Offer Price (₹)</label>
                    <input
                      type="number"
                      value={lfhpForm.lfhp_offer_price}
                      onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_offer_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyber-gold/10 border border-cyber-gold/30 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Live Computed Discount:</span>
                  <span className="text-lg font-bold text-cyber-gold font-mono">{computedDiscount}% OFF</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">LFHP Course Title</label>
                  <input
                    type="text"
                    value={lfhpForm.lfhp_title}
                    onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">LFHP Description</label>
                  <textarea
                    rows={3}
                    value={lfhpForm.lfhp_desc}
                    onChange={(e) => setLfhpForm({ ...lfhpForm, lfhp_desc: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-gold to-amber-500 text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE LFHP PRICING</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: FAQ MANAGER */}
          {activeTab === 'faqs' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">FAQ Manager</h1>
                  <p className="text-xs text-slate-400">Add, edit, and organize frequently asked questions.</p>
                </div>
                
                <button
                  onClick={handleAddFaq}
                  className="px-3.5 py-2 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-xs font-bold text-cyber-cyan hover:bg-cyber-cyan/25 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="glass-panel p-4 rounded-xl border border-cyber-border space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-cyber-cyan">FAQ #{index + 1}</span>
                      <button
                        onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[index].question = e.target.value;
                        setFaqs(updated);
                      }}
                      placeholder="Question"
                      className="w-full px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                    />

                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[index].answer = e.target.value;
                        setFaqs(updated);
                      }}
                      placeholder="Answer"
                      className="w-full px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveFaqs}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>SAVE ALL FAQS</span>
              </button>
            </div>
          )}

          {/* TAB 6: TOOLKIT RESOURCES */}
          {activeTab === 'resources' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Toolkit Resources Manager</h1>
                  <p className="text-xs text-slate-400">Manage free tools and learning materials shown on landing page.</p>
                </div>
                
                <button
                  onClick={handleAddResource}
                  className="px-3.5 py-2 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-xs font-bold text-cyber-cyan hover:bg-cyber-cyan/25 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>

              <div className="space-y-4">
                {resources.map((res, index) => (
                  <div key={index} className="glass-panel p-4 rounded-xl border border-cyber-border space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-cyber-cyan">Resource #{index + 1}</span>
                      <button
                        onClick={() => setResources(resources.filter((_, i) => i !== index))}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => {
                          const updated = [...resources];
                          updated[index].title = e.target.value;
                          setResources(updated);
                        }}
                        placeholder="Title"
                        className="sm:col-span-2 px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                      />
                      <input
                        type="text"
                        value={res.badge}
                        onChange={(e) => {
                          const updated = [...resources];
                          updated[index].badge = e.target.value;
                          setResources(updated);
                        }}
                        placeholder="Badge (e.g. Included Free)"
                        className="px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={res.description}
                      onChange={(e) => {
                        const updated = [...resources];
                        updated[index].description = e.target.value;
                        setResources(updated);
                      }}
                      placeholder="Description"
                      className="w-full px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveResources}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>SAVE ALL RESOURCES</span>
              </button>
            </div>
          )}

          {/* TAB 7: FORM BUILDER */}
          {activeTab === 'form-builder' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Registration Form Field Manager</h1>
                  <p className="text-xs text-slate-400">Configure registration field schemas and form parameters.</p>
                </div>
                
                <button
                  onClick={handleAddFormField}
                  className="px-3.5 py-2 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-xs font-bold text-cyber-cyan hover:bg-cyber-cyan/25 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field</span>
                </button>
              </div>

              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div key={index} className="glass-panel p-4 rounded-xl border border-cyber-border space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-cyber-cyan">Field #{index + 1} ({field.field_name})</span>
                      <button
                        onClick={() => setFormFields(formFields.filter((_, i) => i !== index))}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...formFields];
                          updated[index].label = e.target.value;
                          setFormFields(updated);
                        }}
                        placeholder="Label"
                        className="px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                      />
                      <input
                        type="text"
                        value={field.field_name}
                        onChange={(e) => {
                          const updated = [...formFields];
                          updated[index].field_name = e.target.value;
                          setFormFields(updated);
                        }}
                        placeholder="Field Key (e.g. full_name)"
                        className="px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white font-mono"
                      />
                      <select
                        value={field.type || 'text'}
                        onChange={(e) => {
                          const updated = [...formFields];
                          updated[index].type = e.target.value;
                          setFormFields(updated);
                        }}
                        className="px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-xs text-white"
                      >
                        <option value="text">Text Input</option>
                        <option value="tel">Telephone / WhatsApp</option>
                        <option value="email">Email Address</option>
                        <option value="select">Dropdown Select</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveFormFields}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all flex items-center gap-2 shadow-glow-cyan"
              >
                <Save className="w-4 h-4" />
                <span>SAVE FORM CONFIGURATION</span>
              </button>
            </div>
          )}

        </main>

      </div>

      {/* CREATE / EDIT WEBINAR MODAL */}
      {isWebinarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-cyber-card border border-cyber-cyan/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between border-b border-cyber-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingWebinarId ? 'Edit Webinar' : 'Create New Webinar'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure webinar details and assign its dedicated external registration form URL.
                </p>
              </div>
              <button
                onClick={() => setIsWebinarModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyber-dark"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWebinarModal} className="space-y-4 text-xs">
              
              {/* Webinar Title (REQUIRED) */}
              <div>
                <label className="block font-bold text-white uppercase tracking-wider mb-1">
                  Webinar Title <span className="text-cyber-cyan">*</span>
                </label>
                <input
                  type="text"
                  value={webinarModalForm.title}
                  onChange={(e) => setWebinarModalForm({ ...webinarModalForm, title: e.target.value })}
                  placeholder="e.g. Python AI Cyber Tool Building"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-sm text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={webinarModalForm.short_description}
                  onChange={(e) => setWebinarModalForm({ ...webinarModalForm, short_description: e.target.value })}
                  placeholder="Brief summary of what attendees will learn in this session..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              {/* Date & Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="text"
                    value={webinarModalForm.date}
                    onChange={(e) => setWebinarModalForm({ ...webinarModalForm, date: e.target.value })}
                    placeholder="e.g. Oct 24-25, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="text"
                    value={webinarModalForm.start_time}
                    onChange={(e) => setWebinarModalForm({ ...webinarModalForm, start_time: e.target.value })}
                    placeholder="e.g. 7:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="text"
                    value={webinarModalForm.end_time}
                    onChange={(e) => setWebinarModalForm({ ...webinarModalForm, end_time: e.target.value })}
                    placeholder="e.g. 8:00 PM IST"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  />
                </div>
              </div>

              {/* External Registration Form URL (Specific to this Webinar) */}
              <div className="p-3.5 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/30">
                <label className="block font-bold text-cyber-cyan uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4" />
                  <span>Dedicated External Registration Form URL</span>
                </label>
                <p className="text-[11px] text-slate-400 mb-2">Each webinar has its own unique Google Form link.</p>
                <input
                  type="url"
                  value={webinarModalForm.registration_form_url}
                  onChange={(e) => setWebinarModalForm({ ...webinarModalForm, registration_form_url: e.target.value })}
                  placeholder="https://forms.gle/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-cyan/40 text-xs text-white focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>

              {/* YouTube / Video URL */}
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  YouTube / Video Preview URL (Optional)
                </label>
                <input
                  type="url"
                  value={webinarModalForm.youtube_url}
                  onChange={(e) => setWebinarModalForm({ ...webinarModalForm, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white font-mono"
                />
              </div>

              {/* Status & Pin Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cyber-border">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Publication Status</label>
                  <select
                    value={webinarModalForm.status}
                    onChange={(e) => setWebinarModalForm({ ...webinarModalForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-white"
                  >
                    <option value="Published">Published (Live on Website)</option>
                    <option value="Draft">Draft (Hidden from Public)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="is_pinned_checkbox"
                    checked={webinarModalForm.is_pinned === 1}
                    onChange={(e) => setWebinarModalForm({ ...webinarModalForm, is_pinned: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-cyber-cyan bg-cyber-dark border-cyber-border focus:ring-cyber-cyan"
                  />
                  <label htmlFor="is_pinned_checkbox" className="font-bold text-white flex items-center gap-1.5 cursor-pointer">
                    <Pin className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>Pin to Top of Website</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setIsWebinarModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-border text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-xs hover:scale-[1.02] active:scale-[0.98] shadow-glow-cyan"
                >
                  {editingWebinarId ? 'Save Changes' : 'Create Webinar'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
