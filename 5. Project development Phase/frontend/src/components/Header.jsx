import React from 'react';
import { HardHat, ShieldCheck, Cpu, ExternalLink, ChevronRight, LogOut, User, Sparkles } from 'lucide-react';
import { NAVIGATION_ITEMS } from './Sidebar';
import { getEnterpriseProfile } from '../utils/userProfile';
import { SWAGGER_DOCS_URL } from '../api/client';

export default function Header({ activeTab, onExportReport, canExport = false, user, onLogout }) {
  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];
  const Icon = currentItem.icon;
  const profile = getEnterpriseProfile(user);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Site Safety Officer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'QC Structural Engineer':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  const getAvatarBadge = (role) => {
    switch (role) {
      case 'Site Safety Officer':
        return 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/20';
      case 'QC Structural Engineer':
        return 'bg-sky-600 text-white border-sky-700 shadow-sky-500/20';
      default:
        return 'bg-gradient-to-br from-orange-500 to-amber-600 text-white border-orange-600 shadow-orange-500/20';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
          <span className="hover:text-slate-800 transition-colors">CONSTRUCTAI</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="hover:text-slate-800 transition-colors">Intelligence</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-construction-600 font-semibold">{currentItem.label}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-construction-500">
            <Icon className="w-4 h-4" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            {currentItem.label}
          </h1>
        </div>
      </div>

      {/* Right Controls & User Profile Badge */}
      <div className="flex items-center gap-3">
        {/* System Neural Core Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 font-mono">
          <Cpu className="w-3.5 h-3.5 text-construction-500" />
          <span>Multimodal Core</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* API Docs Link */}
        <a
          href={SWAGGER_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          title="Open FastAPI Swagger Interactive Docs"
        >
          <span>Swagger Docs</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* Authenticated User Badge */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-xs">
              <div 
                className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border shadow-xs tracking-tight ${getAvatarBadge(profile.role)}`}
                title={`Station ID: ${profile.employee_id} | ${profile.role_title}`}
              >
                {profile.initials}
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-1.5 leading-tight">
                  <p className="text-xs font-bold text-slate-900 tracking-tight">
                    {profile.name}
                  </p>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    [{profile.employee_id}]
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border leading-none ${getRoleBadge(profile.role)}`}>
                    {profile.role_title}
                  </span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                title="Switch Role / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Dynamic Export Button if view supports it */}
        {canExport && (
          <button
            onClick={onExportReport}
            className="cai-btn-primary !py-1.5 !px-3.5 !text-xs"
          >
            Export JSON
          </button>
        )}
      </div>
    </header>
  );
}
