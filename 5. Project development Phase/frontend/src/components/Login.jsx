import React, { useState } from 'react';
import {
  HardHat,
  ShieldAlert,
  Zap,
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { api } from '../api/client';

export const INDUSTRIAL_ROLES = [
  {
    id: 'Site Safety Officer',
    label: 'Site Safety Officer',
    displayName: 'HSE Safety Officer',
    stationId: 'HSE-SITE-402',
    roleTitle: 'Site Safety Lead',
    badge: 'Site Safety Lead',
    icon: ShieldAlert,
    accentColor: 'emerald',
    borderColor: 'border-emerald-500/50',
    activeBg: 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    desc: 'Station HSE-SITE-402 | Real-time CCTV PPE streams, sirens & BOCW 1996 compliance',
    defaultView: 'safety'
  },
  {
    id: 'QC Structural Engineer',
    label: 'QC Structural Engineer',
    displayName: 'Lead QC Structural Engineer',
    stationId: 'QC-IS456-01',
    roleTitle: 'Civil QC Specialist',
    badge: 'Civil QC Specialist',
    icon: Zap,
    accentColor: 'sky',
    borderColor: 'border-sky-500/50',
    activeBg: 'bg-sky-950/40 border-sky-400 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    desc: 'Station QC-IS456-01 | IS 456 Crack Diagnostics & epoxy remediation blueprints',
    defaultView: 'crack'
  },
  {
    id: 'Project Admin / Director',
    label: 'Project Admin / Director',
    displayName: 'Project Director',
    stationId: 'DIR-EXEC-001',
    roleTitle: 'Executive Root Admin',
    badge: 'Executive Root Admin',
    icon: Building2,
    accentColor: 'amber',
    borderColor: 'border-orange-500/50',
    activeBg: 'bg-orange-950/40 border-orange-500 text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.2)]',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    desc: 'Station DIR-EXEC-001 | Full access: BOQ Takeoffs, Telemetry & Staff Provisioning',
    defaultView: 'planner'
  }
];

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Project Admin / Director');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter an Operational Station ID or authorized enterprise email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your site terminal access password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login({
        username: username.trim(),
        password: password,
        role: selectedRole
      });

      // Persist auth tokens in localStorage for persistent session
      if (response && response.access_token) {
        localStorage.setItem('constructai_token', response.access_token);
        localStorage.setItem('constructai_user', JSON.stringify(response.user));
        localStorage.setItem('constructai_role', response.user.role);
        
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }
      } else {
        throw new Error('Authentication response did not contain an access token.');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Authentication failed. Please verify credentials or select a valid role.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activeRoleData = INDUSTRIAL_ROLES.find((r) => r.id === selectedRole) || INDUSTRIAL_ROLES[2];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background Technical Grid & Ambient Glows */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px), radial-gradient(#F97316 1px, #0B0F19 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-sky-400 to-emerald-500" />

      {/* Main Container */}
      <div className="w-full max-w-xl z-10">
        
        {/* Brand & Field Terminal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 p-2 px-3.5 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-xl mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <HardHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black tracking-wider text-xl text-white">
                  CONSTRUCT<span className="text-orange-500">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  FIELD TERMINAL
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 tracking-tight">
                Real-Time Safety & Structural Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Core Neural Engine Online</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400 font-mono">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>IS 456 / BOCW Compliant</span>
            </div>
          </div>
        </div>

        {/* Industrial Glassmorphism Authentication Card */}
        <div className="bg-[#0F172A]/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-start gap-2.5 shadow-lg animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-300 uppercase tracking-wide">Terminal Access Denied: </span>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Step 1: Industrial Role Selector (RBAC Clearance) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Select Operational Role (RBAC)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Defines access scope
                </span>
              </div>

              <div className="space-y-2">
                {INDUSTRIAL_ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? role.activeBg
                          : 'bg-[#0F172A]/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-white/10 text-white'
                              : 'bg-slate-800/80 text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white tracking-tight">
                              {role.label}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${role.tagColor}`}>
                              {role.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {role.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center pl-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-white bg-white/20'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Operational Station ID / Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Enterprise Email or Operational Station ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin@constructai.internal or staff@constructai.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Step 3: Password Input with Visibility Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Terminal Access Key / Password
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Field Encryption: HS256 JWT
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter enterprise access key"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Clearance Summary Box */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Authorized View:{' '}
                  <span className="font-semibold text-slate-200">
                    {activeRoleData.label} ({activeRoleData.defaultView.toUpperCase()})
                  </span>
                </span>
              </div>
              <span className="font-mono text-xs text-sky-400 font-bold">
                Level 1 Secure
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Site Clearance...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Launch Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Outdoor Field Environment Notice */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            Optimized for sunlight contrast on Samsung Tab Active & Panasonic Toughbook rugged tablets.
          </p>
        </div>
      </div>
    </div>
  );
}
