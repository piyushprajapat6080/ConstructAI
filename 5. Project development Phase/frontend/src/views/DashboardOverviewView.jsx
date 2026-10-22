import React, { useState, useEffect } from 'react';
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
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
  Layers,
  Radio,
  Clock,
  Compass,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Shield,
  FileText
} from 'lucide-react';
import { getEnterpriseProfile } from '../utils/userProfile';
import { NAVIGATION_ITEMS } from '../components/Sidebar';

export default function DashboardOverviewView({
  user,
  setActiveTab,
  isOnline = true,
  onElevateToAdmin = null
}) {
  const profile = getEnterpriseProfile(user);
  const userRole = profile.role;
  const isAdmin = userRole === 'Project Admin / Director';

  // Live time ticker for enterprise terminal look
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if current user is allowed to access a specific tab
  const hasAccess = (targetTabId) => {
    const navItem = NAVIGATION_ITEMS.find((item) => item.id === targetTabId);
    if (!navItem) return true;
    return navItem.rolesAllowed.includes(userRole);
  };

  // Module catalog strictly covering all requested intelligence components
  const MODULES = [
    {
      id: 'provisioning',
      title: 'Staff Provisioning',
      subtitle: 'Admin Management & RBAC',
      icon: UserPlus,
      tag: 'Admin Only',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      hoverBorder: 'hover:border-amber-400 hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.15)]',
      accentGlow: 'group-hover:text-amber-600',
      description: 'Provision cryptographic terminal access, assign site station IDs, and manage role-based security clearances.',
      highlights: ['SQLite & JWT Auth', 'Role Clearance Matrix', 'Station ID Management'],
      targetTab: 'provisioning',
      actionText: 'Open Staff Terminal'
    },
    {
      id: 'safety',
      title: 'Site Safety Monitor',
      subtitle: 'BOCW Compliance & Vision AI',
      icon: ShieldAlert,
      tag: 'Vision AI',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      hoverBorder: 'hover:border-emerald-400 hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.15)]',
      accentGlow: 'group-hover:text-emerald-600',
      description: 'Real-time CCTV PPE inspection for hardhats & safety vests, perimeter hazard siren alerts, and BOCW Act 1996 audit logs.',
      highlights: ['Live Vision Stream', 'Audible Hazard Sirens', 'BOCW 1996 Violation Logs'],
      targetTab: 'safety',
      actionText: 'Launch Safety Stream'
    },
    {
      id: 'crack',
      title: 'Concrete Crack Detection',
      subtitle: 'IS 456 Structural Diagnostics',
      icon: Zap,
      tag: 'IS 456 Forensics',
      tagColor: 'text-sky-700 bg-sky-50 border-sky-200',
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200/80',
      hoverBorder: 'hover:border-sky-400 hover:shadow-[0_10px_25px_-5px_rgba(14,165,233,0.15)]',
      accentGlow: 'group-hover:text-sky-600',
      description: 'Sub-millimeter fracture width analysis, shear vs shrinkage classification, and IS 9162 epoxy injection specifications.',
      highlights: ['Sub-mm Width Metric', 'IS 456 Clause 35.3.2', 'Epoxy Blueprint Specs'],
      targetTab: 'crack',
      actionText: 'Inspect Structural Elements'
    },
    {
      id: 'valuation',
      title: 'Real Estate Valuation',
      subtitle: 'INR Asset Estimation',
      icon: Building2,
      tag: 'INR (₹) Appraisal',
      tagColor: 'text-violet-700 bg-violet-50 border-violet-200',
      iconBg: 'bg-violet-50 text-violet-600 border-violet-200/80',
      hoverBorder: 'hover:border-violet-400 hover:shadow-[0_10px_25px_-5px_rgba(139,92,246,0.15)]',
      accentGlow: 'group-hover:text-violet-600',
      description: 'Automated discounted cashflow (DCF) models, Indian Rupee (₹) asset appraisal, physical depreciation, and investor yield analysis.',
      highlights: ['Automated DCF Models', 'Depreciation Curves', 'Commercial Yield Metrics'],
      targetTab: 'valuation',
      actionText: 'Open Valuation Engine'
    },
    {
      id: 'planner',
      title: 'Project Planner & BOQ Engine',
      subtitle: 'Material & Schedule Forecast',
      icon: ClipboardList,
      tag: 'BOQ Takeoffs',
      tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-50 text-orange-600 border-orange-200/80',
      hoverBorder: 'hover:border-orange-400 hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.15)]',
      accentGlow: 'group-hover:text-orange-600',
      description: 'Instant Bill of Quantities (BOQ) calculation, concrete volume takeoffs (cement, sand, aggregates, TMT steel), and critical-path schedules.',
      highlights: ['Concrete Volume (m³)', 'TMT Steel & Material Rates', 'Critical Path Milestones'],
      targetTab: 'planner',
      actionText: 'Generate BOQ Plan'
    },
    {
      id: 'knowledge',
      title: 'Digital Knowledge Base',
      subtitle: 'IS & OSHA Codes',
      icon: BookOpen,
      tag: 'IS Standards Codex',
      tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
      hoverBorder: 'hover:border-blue-400 hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.15)]',
      accentGlow: 'group-hover:text-blue-600',
      description: 'Semantic search engine indexing IS 456 (Plain & Reinforced Concrete), IS 875 (Wind Loads), IS 10262 (Mix Design), SP 34, and OSHA.',
      highlights: ['IS 456 / IS 875 / SP 34', 'Instant Semantic Search', 'Indian Construction Codes'],
      targetTab: 'knowledge',
      actionText: 'Browse Knowledge Codex'
    },
    {
      id: 'chatbot',
      title: 'Chatbot Copilot & Daily Assistant',
      subtitle: '24/7 AI Assistance',
      icon: MessageSquare,
      tag: '24/7 Copilot',
      tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200/80',
      hoverBorder: 'hover:border-teal-400 hover:shadow-[0_10px_25px_-5px_rgba(20,184,166,0.15)]',
      accentGlow: 'group-hover:text-teal-600',
      description: 'Autonomous multi-turn engineering copilot for geotechnical queries, structural calculations, daily shift logs, and safety toolbox talks.',
      highlights: ['Groq LPU Acceleration', 'SOP Shift Log Formatter', 'Toolbox Talk Generator'],
      targetTab: 'chatbot',
      secondaryTab: 'daily',
      actionText: 'Launch AI Copilot',
      secondaryActionText: 'Site SOP Assistant'
    },
    {
      id: 'weather',
      title: 'Weather Risk Advisor',
      subtitle: 'Environmental Site Alerts',
      icon: CloudSun,
      tag: 'Meteorological AI',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      hoverBorder: 'hover:border-amber-400 hover:shadow-[0_10px_25px_-5px_rgba(217,119,6,0.15)]',
      accentGlow: 'group-hover:text-amber-600',
      description: 'Monsoon dilution analysis, tower crane wind shear thresholds, hot weather slump loss, and unequivocal GO / NO-GO pour clearances.',
      highlights: ['IS 7861 Curing Analysis', 'GO / NO-GO Site Clearances', 'Optimal Pour Windows'],
      targetTab: 'weather',
      actionText: 'Check Pour Feasibility'
    }
  ];

  const handleCardClick = (targetTab) => {
    setActiveTab(targetTab);
  };

  return (
    <div className="space-y-7 pb-10">
      
      {/* 1. Header Section: Executive Greeting & Operational Status */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B0F19] via-[#0F172A] to-[#1E293B] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Technical Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px), radial-gradient(#F97316 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px'
          }}
        />
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-sky-400 to-emerald-500" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            {/* Top Live Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 font-mono font-bold text-[11px] tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                CONSTRUCTAI COMMAND TERMINAL
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>IST {currentTime}</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80 font-mono text-[11px]">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Sector 62 Site Core</span>
              </span>
            </div>

            {/* Main Greeting */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome to Construct<span className="text-construction-500">AI</span> Command Terminal
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Autonomous Multimodal Construction Intelligence Hub. Synchronizing real-time CCTV safety compliance (BOCW 1996), sub-millimeter IS 456 forensic crack diagnostics, and automated BOQ estimators across all field operational stations.
            </p>

            {/* Operational Credentials & System Status Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs">
                <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-[11px]">
                  {profile.initials}
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Station Operator</span>
                  <span className="font-bold text-slate-200 text-xs">
                    {profile.name} <span className="text-sky-400 font-semibold">[{profile.employee_id}]</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Neural Engine</span>
                  <span className="font-bold text-emerald-400 text-xs">Groq LPU Online</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs">
                <Radio className={`w-4 h-4 ${isOnline ? 'text-sky-400' : 'text-rose-400'}`} />
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">API Gateway</span>
                  <span className={`font-bold text-xs ${isOnline ? 'text-sky-400' : 'text-rose-400'}`}>
                    {isOnline ? 'FastAPI Connected' : 'Gateway Offline'}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Standards Codex</span>
                  <span className="font-bold text-amber-300 text-xs">IS 456 & BOCW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Viva / Live Elevation Action (Convenient for viva & presentations) */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 self-start lg:self-center shrink-0">
            {!isAdmin && onElevateToAdmin && (
              <button
                type="button"
                onClick={onElevateToAdmin}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Elevate to Project Admin</span>
              </button>
            )}

            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs transition-colors"
            >
              <span>Swagger Interactive Docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI & Field Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cai-card !p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              BOCW Safety Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900">98.4%</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grade A
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">0 Fatalities / Full Compliance</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="cai-card !p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              IS 456 Structural QC
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900">0.12 mm</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Below 0.3mm IS 456 threshold</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="cai-card !p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Inference Speed
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900">~240 ms</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                Groq LPU
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Zero-latency multimodal vision</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-construction-500 border border-orange-100 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="cai-card !p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Active Clearances
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-bold font-mono text-slate-900">
                {isAdmin ? '8 / 8' : userRole.includes('Safety') ? '5 / 8' : '5 / 8'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                RBAC Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Scope: {profile.role_title}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Section Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-construction-500" />
            <span>Core Intelligence & Operational Modules</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any subsystem card below to navigate directly into its live analysis terminal.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
          8 Subsystems Registered
        </span>
      </div>

      {/* 4. Interactive Quick-Action Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MODULES.map((module) => {
          const Icon = module.icon;
          const allowed = hasAccess(module.targetTab);

          return (
            <div
              key={module.id}
              onClick={() => handleCardClick(module.targetTab)}
              className={`cai-card group relative flex flex-col justify-between cursor-pointer border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${module.hoverBorder} ${
                !allowed ? 'opacity-90 bg-slate-50/50' : 'bg-white'
              }`}
            >
              <div>
                {/* Header: Icon & Tag */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-200 group-hover:scale-105 ${module.iconBg}`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${module.tagColor}`}>
                    {module.tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-2">
                  <h3 className={`text-base font-bold text-slate-900 tracking-tight transition-colors ${module.accentGlow}`}>
                    {module.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                    {module.subtitle}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {module.description}
                </p>

                {/* Highlight Pills */}
                <div className="space-y-1.5 mb-4 pt-2 border-t border-slate-100">
                  {module.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Clearance State & Action CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-1.5">
                  {allowed ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Clearance OK
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 font-mono">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Admin Role Req.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {module.secondaryTab && allowed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(module.secondaryTab);
                      }}
                      className="text-[11px] font-semibold px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title={module.secondaryActionText}
                    >
                      SOP
                    </button>
                  )}

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-bold text-construction-600 group-hover:text-construction-700 transition-colors"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Industrial Live Telemetry & Site Operational Feed */}
      <div className="cai-card !p-5 bg-gradient-to-br from-slate-900 to-industrial-950 text-white border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Live Field Terminal Event Stream
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-Time Audit Trail • Stream: 2026-OCT-22
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-emerald-400 font-bold">[CCTV-PPE-01]</span>
              <span>12:44:10</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Zone B Scaffolding audit: 100% hardhat & harness compliance recorded.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-sky-400 font-bold">[QC-IS456-02]</span>
              <span>12:42:05</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Column C-14 core scan: Hairline surface micro-fracture (0.12mm) verified.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-amber-400 font-bold">[MET-ADVISOR]</span>
              <span>12:38:50</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Monsoon clearance: GO advisory confirmed for 4th floor slab concreting.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="text-construction-400 font-bold">[BOQ-ENGINE]</span>
              <span>12:30:18</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              M25 mix estimation synchronized: 36.5 m³ concrete ready for dispatch.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
