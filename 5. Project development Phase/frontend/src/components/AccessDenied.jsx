import React from 'react';
import { ShieldAlert, Lock, ArrowRight, HardHat, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AccessDenied({ moduleName, userRole, requiredRole = 'Project Admin / Director', onSwitchToAdmin, onSwitchRole }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#0B0F19] border-2 border-red-500/40 rounded-2xl p-7 shadow-2xl relative overflow-hidden text-center text-slate-100">
        
        {/* Ambient Warning Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center mx-auto mb-5 text-red-400 shadow-lg shadow-red-500/20">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-bold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>RBAC CLEARANCE RESTRICTION</span>
        </div>

        <h2 className="text-xl font-black tracking-tight text-white mb-2">
          Access Restricted: {moduleName}
        </h2>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Your current operational session is authenticated as <span className="font-bold text-white">{userRole}</span>.
          Access to this module requires <span className="font-bold text-orange-400">{requiredRole}</span> clearance under site security protocols.
        </p>

        {/* Security Clearance Comparison Table */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 mb-6 text-left space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Role:</span>
            <span className="text-sky-300 font-semibold">{userRole}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Required Clearance:</span>
            <span className="text-orange-400 font-semibold">{requiredRole}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 pt-2">
            <span className="text-slate-400">Status:</span>
            <span className="text-red-400 font-bold uppercase">Restricted (403 RBAC)</span>
          </div>
        </div>

        {/* Quick Action Buttons for Live Presentation / Viva */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <HardHat className="w-4 h-4" />
              <span>Elevate to Project Admin</span>
            </button>
          )}

          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Account / Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
