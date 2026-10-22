import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Zap,
  Building2,
  ClipboardList,
  BookOpen,
  MessageSquare,
  HardHat,
  CloudSun,
  Activity,
  Layers,
  Sparkles,
  Lock,
  LogOut,
  UserCheck,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { getEnterpriseProfile } from '../utils/userProfile';

export const NAVIGATION_ITEMS = [
  { 
    id: 'overview', 
    label: 'Overview Hub', 
    icon: LayoutDashboard, 
    badge: 'Live',
    requiredRole: 'All Clearances',
    rolesAllowed: ['Site Safety Officer', 'QC Structural Engineer', 'Project Admin / Director']
  },
  { 
    id: 'provisioning', 
    label: 'Staff Provisioning', 
    icon: UserPlus, 
    badge: 'Admin',
    requiredRole: 'Project Admin / Director',
    rolesAllowed: ['Project Admin / Director']
  },
  { 
    id: 'safety', 
    label: 'Safety Monitor', 
    icon: ShieldAlert, 
    badge: 'Vision',
    requiredRole: 'Site Safety Officer',
    rolesAllowed: ['Site Safety Officer', 'Project Admin / Director']
  },
  { 
    id: 'crack', 
    label: 'Crack Detection', 
    icon: Zap, 
    badge: 'Vision',
    requiredRole: 'QC Structural Engineer',
    rolesAllowed: ['QC Structural Engineer', 'Project Admin / Director']
  },
  { 
    id: 'valuation', 
    label: 'Real Estate Valuation', 
    icon: Building2, 
    badge: 'INR ₹',
    requiredRole: 'Project Admin / Director',
    rolesAllowed: ['Project Admin / Director']
  },
  { 
    id: 'planner', 
    label: 'Project Planner', 
    icon: ClipboardList, 
    badge: 'BOQ',
    requiredRole: 'Project Admin / Director',
    rolesAllowed: ['QC Structural Engineer', 'Project Admin / Director']
  },
  { 
    id: 'knowledge', 
    label: 'Knowledge Base', 
    icon: BookOpen, 
    badge: 'IS Codes',
    requiredRole: 'All Clearances',
    rolesAllowed: ['Site Safety Officer', 'QC Structural Engineer', 'Project Admin / Director']
  },
  { 
    id: 'chatbot', 
    label: 'Chatbot Copilot', 
    icon: MessageSquare, 
    badge: 'GPT',
    requiredRole: 'All Clearances',
    rolesAllowed: ['Site Safety Officer', 'QC Structural Engineer', 'Project Admin / Director']
  },
  { 
    id: 'daily', 
    label: 'Daily Site Assistant', 
    icon: HardHat, 
    badge: 'SOP',
    requiredRole: 'Site Safety Officer',
    rolesAllowed: ['Site Safety Officer', 'Project Admin / Director']
  },
  { 
    id: 'weather', 
    label: 'Weather Advisor', 
    icon: CloudSun, 
    badge: 'Risk',
    requiredRole: 'All Clearances',
    rolesAllowed: ['Site Safety Officer', 'QC Structural Engineer', 'Project Admin / Director']
  },
];

export default function Sidebar({ activeTab, setActiveTab, isOnline = true, user, onLogout }) {
  const profile = getEnterpriseProfile(user);
  const currentRole = profile.role;

  // Role Badge Styling
  const getRoleBadge = (role) => {
    switch (role) {
      case 'Site Safety Officer':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          avatar: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
        };
      case 'QC Structural Engineer':
        return {
          bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          dot: 'bg-sky-400',
          avatar: 'bg-sky-950/70 border-sky-500/40 text-sky-300'
        };
      default:
        return {
          bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          dot: 'bg-orange-500',
          avatar: 'bg-orange-950/70 border-orange-500/40 text-orange-300'
        };
    }
  };

  const roleStyle = getRoleBadge(currentRole);

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col justify-between text-slate-300 select-none min-h-screen">
      {/* Top Section */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-construction-500 to-construction-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <HardHat className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">
                  CONSTRUCT<span className="text-construction-500">AI</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-construction-500/10 text-construction-400 border border-construction-500/30">
                  RBAC
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight font-medium font-mono">
                Multimodal Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* User RBAC Profile Card */}
        {user && (
          <div className="p-3 mx-3 mt-3 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-xs tracking-tight ${roleStyle.avatar}`}
                  title={`Station ID: ${profile.employee_id} | ${profile.role_title}`}
                >
                  {profile.initials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5 flex items-center gap-1">
                    <span className="text-slate-500">ID:</span>
                    <span className="text-sky-400 font-semibold">{profile.employee_id}</span>
                  </p>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Switch Role / Logout"
                  className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className={`px-2 py-0.5 rounded-full font-mono font-semibold border flex items-center gap-1.5 ${roleStyle.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot}`} />
                <span className="truncate max-w-[130px]">{profile.role_title}</span>
              </span>
              <span className="text-slate-400 font-mono">Active</span>
            </div>
          </div>
        )}

        {/* Section Label */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Intelligence Modules
          </p>
          <span className="text-[9px] font-mono text-slate-400">IS 456 / BOCW</span>
        </div>

        {/* Navigation items */}
        <nav className="px-3 space-y-1 overflow-y-auto flex-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasPermission = item.rolesAllowed.includes(currentRole);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-sm'
                    : hasPermission
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
                    : 'text-slate-400/80 hover:text-slate-300 hover:bg-slate-900/40 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-construction-500 rounded-r-full shadow-glow-orange" />
                )}

                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive
                        ? 'text-construction-500'
                        : hasPermission
                        ? 'text-slate-400 group-hover:text-slate-300'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="tracking-tight truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!hasPermission && (
                    <span title="Restricted by RBAC clearance">
                      <Lock className="w-3 h-3 text-amber-500/80" />
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-construction-500/20 text-construction-400 font-bold'
                          : hasPermission
                          ? 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & Role Switcher */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070a0f] space-y-2">
        <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-200 leading-none">
                {isOnline ? 'Core AI Online' : 'Offline Mode'}
              </p>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                v1.0.0 High-Speed Inference
              </p>
            </div>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-construction-400" />
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span>Switch Role / Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
