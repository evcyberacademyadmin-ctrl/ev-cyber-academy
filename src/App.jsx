import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import RegistrationSuccess from './components/RegistrationSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { fetchPublicConfig } from './services/api';

export default function App() {
  const [route, setRoute] = useState('home'); // home, success, admin-login, admin-dashboard
  const [registeredData, setRegisteredData] = useState(null);
  
  // Site data
  const [config, setConfig] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [resources, setResources] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Auth state
  const [adminToken, setAdminToken] = useState(localStorage.getItem('ev_admin_token') || '');

  // Load public config on initial load
  const loadConfig = async () => {
    try {
      const res = await fetchPublicConfig();
      if (res.success) {
        setConfig(res.config || {});
        setFaqs(res.faqs || []);
        setResources(res.resources || []);
        setFormFields(res.formFields || []);
      }
    } catch (err) {
      console.error('Failed to load public config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();

    // Simple URL hash / path check
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      if (localStorage.getItem('ev_admin_token')) {
        setRoute('admin-dashboard');
      } else {
        setRoute('admin-login');
      }
    }
  }, []);

  // Handle successful student registration
  const handleRegisterSuccess = (data) => {
    setRegisteredData(data);
    setRoute('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Admin Login Success
  const handleAdminLoginSuccess = (token) => {
    setAdminToken(token);
    localStorage.setItem('ev_admin_token', token);
    setRoute('admin-dashboard');
    window.history.pushState({}, '', '/admin');
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setAdminToken('');
    localStorage.removeItem('ev_admin_token');
    setRoute('admin-login');
    window.history.pushState({}, '', '/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-full border-4 border-cyber-cyan border-t-transparent animate-spin mb-4"></div>
        <span className="font-mono text-xs text-cyber-cyan tracking-widest">LOADING EV CYBER ACADEMY...</span>
      </div>
    );
  }

  if (route === 'success') {
    return (
      <RegistrationSuccess 
        registration={registeredData} 
        config={config} 
        onBackToHome={() => setRoute('home')} 
      />
    );
  }

  if (route === 'admin-login') {
    return (
      <AdminLogin 
        onLoginSuccess={handleAdminLoginSuccess} 
        onBackToSite={() => { setRoute('home'); window.history.pushState({}, '', '/'); }} 
      />
    );
  }

  if (route === 'admin-dashboard') {
    if (!adminToken) {
      setRoute('admin-login');
      return null;
    }
    return (
      <AdminDashboard 
        token={adminToken} 
        onLogout={handleAdminLogout} 
        onBackToSite={() => { setRoute('home'); window.history.pushState({}, '', '/'); }} 
      />
    );
  }

  return (
    <Home 
      config={config} 
      faqs={faqs} 
      resources={resources} 
      formFields={formFields} 
      onRegisterSuccess={handleRegisterSuccess} 
      onNavigateAdmin={() => {
        if (adminToken) {
          setRoute('admin-dashboard');
        } else {
          setRoute('admin-login');
        }
        window.history.pushState({}, '', '/admin');
      }} 
    />
  );
}
