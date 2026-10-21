import React, { useState } from 'react';
import {
  ClipboardList,
  Layers,
  Clock,
  Coins,
  Package,
  Box,
  Grid,
  Disc,
  Droplet,
  Sparkles,
  Copy,
  Download,
  Calendar,
  CheckCircle2,
  Info,
  UserPlus,
  X
} from 'lucide-react';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';
import EnterpriseStaffProvisioning from '../components/EnterpriseStaffProvisioning';

const SUGGESTIONS = [
  'Create full plan for 20x30 slab construction',
  '2-storey brick masonry work for 1500 sqft',
  'G+1 1200 sqft residential villa structural core',
  'Basement excavation and RCC retaining wall'
];

export default function ProjectPlannerView() {
  const { addToast } = useToast();
  const [projectBrief, setProjectBrief] = useState('Create full plan for 20x30 slab construction');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showProvisioningModal, setShowProvisioningModal] = useState(false);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!projectBrief.trim()) {
      addToast('Please enter a project brief', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.generatePlan(projectBrief.trim());
      setResult(data);
      addToast('Comprehensive construction plan generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Plan generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyPlan = () => {
    if (!result) return;
    const text = `CONSTRUCTAI PROJECT PLAN & BOQ\nProject: ${result.project_name}\nDuration: ${result.estimated_duration_days} Days\nConcrete Volume: ${result.concrete_volume_cum} m³\nTotal Estimated Cost: ₹${Number(result.costs?.total_cost_inr || 0).toLocaleString('en-IN')}\n\nMaterials:\n${(result.materials || []).map((m) => `- ${m.item}: ${m.quantity} ${m.unit} (₹${m.total_cost_inr?.toLocaleString('en-IN')})`).join('\n')}`;
    navigator.clipboard.writeText(text);
    addToast('Project plan copied to clipboard', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `project_plan_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported project plan as JSON', 'success');
  };

  const getMaterialIcon = (iconName) => {
    switch (iconName) {
      case 'layers': return <Layers className="w-4 h-4 text-orange-600" />;
      case 'box': return <Box className="w-4 h-4 text-amber-600" />;
      case 'grid': return <Grid className="w-4 h-4 text-blue-600" />;
      case 'disc': return <Disc className="w-4 h-4 text-purple-600" />;
      case 'droplet': return <Droplet className="w-4 h-4 text-cyan-600" />;
      default: return <Package className="w-4 h-4 text-construction-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
              Bill of Quantities (BOQ) + Timeline Generator
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowProvisioningModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm w-fit"
          >
            <UserPlus className="w-3.5 h-3.5 text-orange-400" />
            <span>Staff Provisioning Modal</span>
          </button>
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          Project Planner & Automated Cost Estimator
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Input any construction requirement to calculate concrete volume, exact raw material quantities (cement, TMT steel, sand, aggregates), labor cost ratios, and critical-path schedules.
        </p>

        {/* Input Form with Prominent Search Bar */}
        <form onSubmit={handleGenerate} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={projectBrief}
              onChange={(e) => setProjectBrief(e.target.value)}
              placeholder="e.g. Create full plan for 20x30 slab construction..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-construction-500/50 focus:border-construction-500 transition-all font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cai-btn-primary px-6 py-3 whitespace-nowrap text-sm font-bold shadow-md"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Estimating BOQ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Quick Prompts:</span>
          {SUGGESTIONS.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setProjectBrief(item);
                // Proactively run estimation
                setTimeout(() => handleGenerate(), 50);
              }}
              className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <AnalysisShimmerOverlay message="Calculating Structural Concrete Volumes & Indian Material Rates..." />
      ) : result ? (
        <div className="space-y-6">
          {/* Top Overview Bar */}
          <div className="cai-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-construction-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  {result.estimated_duration_days} Days Scheduled
                </span>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {result.concrete_volume_cum} m³ Concrete
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {result.project_name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {result.scope_summary}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={copyPlan}
                className="cai-btn-secondary !text-xs !py-1.5 !px-3"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy BOQ</span>
              </button>
              <button
                onClick={exportJSON}
                className="cai-btn-secondary !text-xs !py-1.5 !px-3"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* 3-Section Layout: Materials Table (7 cols) & Cost/Timeline (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Material Estimator Table (7 cols) */}
            <div className="lg:col-span-7 cai-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-construction-500" />
                  Bill of Materials (BOQ Breakdown)
                </h4>
                <span className="text-xs font-semibold text-slate-400">
                  {(result.materials || []).length} Line Items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-2.5">Item Description</th>
                      <th className="pb-2.5 text-right">Quantity</th>
                      <th className="pb-2.5 text-right">Unit Rate</th>
                      <th className="pb-2.5 text-right">Total (₹ INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(result.materials || []).map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 flex items-center gap-2.5 pr-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                            {getMaterialIcon(m.icon)}
                          </div>
                          <span className="font-semibold text-slate-800 leading-snug">
                            {m.item}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-700 whitespace-nowrap">
                          {m.quantity} <span className="text-[11px] text-slate-400">{m.unit}</span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-600 whitespace-nowrap">
                          ₹{Number(m.unit_rate_inr || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          ₹{Number(m.total_cost_inr || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/50">
                      <td colSpan={3} className="py-2.5 font-bold text-slate-700 uppercase text-[11px]">
                        Raw Materials Subtotal
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-construction-700">
                        ₹{Number(result.costs?.materials_cost_inr || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* 2. Cost Estimator & Proportions (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Cost Summary Card */}
              <div className="cai-card bg-gradient-to-br from-white to-orange-50/40 border-orange-200/80 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Project Cost Allocation
                </span>

                <div>
                  <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                    ₹{Number(result.costs?.total_cost_inr || 0).toLocaleString('en-IN')}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Inclusive of materials, skilled labour, formwork, and 7% contingency
                  </p>
                </div>

                {/* Interactive Multi-Segment Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-construction-500 h-full transition-all duration-500"
                      style={{ width: `${result.costs?.materials_percentage || 50}%` }}
                      title={`Materials: ${result.costs?.materials_percentage}%`}
                    />
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${result.costs?.labour_percentage || 30}%` }}
                      title={`Labour: ${result.costs?.labour_percentage}%`}
                    />
                    <div
                      className="bg-slate-600 h-full transition-all duration-500"
                      style={{ width: `${result.costs?.finishing_percentage || 20}%` }}
                      title={`Finishing: ${result.costs?.finishing_percentage}%`}
                    />
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-construction-500 flex-shrink-0" />
                      <span className="text-slate-600 font-medium truncate">
                        Materials ({result.costs?.materials_percentage}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-slate-600 font-medium truncate">
                        Labour ({result.costs?.labour_percentage}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600 flex-shrink-0" />
                      <span className="text-slate-600 font-medium truncate">
                        Finishing ({result.costs?.finishing_percentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-costs breakdown lines */}
                <div className="space-y-2 pt-3 border-t border-slate-200/80 text-xs font-medium text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Materials:</span>
                    <span className="font-mono">₹{Number(result.costs?.materials_cost_inr || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Labour & Shuttering:</span>
                    <span className="font-mono">₹{Number(result.costs?.labour_cost_inr || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Curing, Finishing & Tests:</span>
                    <span className="font-mono">₹{Number(result.costs?.finishing_cost_inr || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Contingency Reserve:</span>
                    <span className="font-mono">₹{Number(result.costs?.contingency_cost_inr || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Engineering Assumptions Card */}
              <div className="cai-card space-y-2.5 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  Engineering Specs & Assumptions
                </span>

                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(result.engineering_assumptions || []).map((asm, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-construction-500 font-bold">•</span>
                      <span>{asm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Time Schedule Vertical Timeline (Full Width) */}
          <div className="cai-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-construction-500" />
                Phase-Wise Execution Schedule ({result.estimated_duration_days} Days)
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                Conforms to standard CPWD curing & de-shuttering intervals
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {(result.timeline || []).map((phase, i) => (
                <div key={i} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-white border-2 border-construction-500 group-hover:scale-125 transition-transform" />

                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-orange-200 hover:shadow-xs transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-900">
                        {phase.phase}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          ⏱️ {phase.duration}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            phase.status === 'Ready'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : phase.status === 'Milestone'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      {(phase.milestones || []).map((m, j) => (
                        <div key={j} className="text-xs text-slate-600 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Enterprise Credential & Staff Provisioning Card on Admin Dashboard */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <EnterpriseStaffProvisioning />
      </div>

      {/* Enterprise Staff Provisioning Modal Overlay */}
      {showProvisioningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] border border-slate-700/80 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowProvisioningModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <EnterpriseStaffProvisioning isModal onClose={() => setShowProvisioningModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
