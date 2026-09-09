import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { adminLogin } from '../services/api';
import logoUrl from '../assets/logo';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [username, setUsername] = useState('vimalthehacker');
  const [password, setPassword] = useState('adminsshvimal-2008');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await adminLogin(username, password);
      setLoading(false);
      if (data.success && data.token) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark bg-cyber-grid flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        
        {/* Glass Card */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-cyan/40 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <img src={logoUrl} alt="EV CYBER ACADEMY" className="h-12 mx-auto mb-4 rounded-lg object-contain" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN PORTAL</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-3">Admin Portal Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">Default credentials: vimalthehacker / adminsshvimal-2008</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border text-white text-sm focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-slate-950 font-bold text-sm hover:scale-[1.01] transition-all shadow-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>LOGIN TO DASHBOARD</span>
                </>
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to EV CYBER ACADEMY Public Website
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
