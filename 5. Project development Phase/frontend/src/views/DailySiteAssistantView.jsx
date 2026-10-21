import React, { useState } from 'react';
import {
  HardHat,
  Users,
  AlertTriangle,
  CheckSquare,
  Wrench,
  Clock,
  Sparkles,
  Copy,
  Download,
  ShieldAlert,
  Calendar,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';

const QUICK_ACTIVITIES = [
  { activity: 'Casting 3rd floor slab (M25 Concrete)', workers: 18, condition: 'Dry firm ground' },
  { activity: 'Basement deep excavation & soil retaining', workers: 12, condition: 'Muddy from recent rainfall' },
  { activity: 'Facade external scaffolding & plastering', workers: 14, condition: 'High wind gusts (30 km/h)' },
  { activity: 'Rebar fabrication & column starter tying', workers: 10, condition: 'Normal dry conditions' }
];

export default function DailySiteAssistantView() {
  const { addToast } = useToast();
  const [plannedActivity, setPlannedActivity] = useState('Casting 3rd floor slab (M25 Concrete)');
  const [labourCount, setLabourCount] = useState(18);
  const [siteCondition, setSiteCondition] = useState('Dry firm ground');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e, customData = null) => {
    if (e) e.preventDefault();
    const act = customData ? customData.activity : plannedActivity;
    const workers = customData ? customData.workers : labourCount;
    const cond = customData ? customData.condition : siteCondition;

    if (!act.trim()) {
      addToast('Please enter planned activity', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.generateDailyAssistant({
        planned_activity: act.trim(),
        labour_count: Number(workers) || 10,
        site_condition: cond.trim()
      });
      setResult(data);
      addToast('Daily operational directive generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyDirective = () => {
    if (!result) return;
    const text = `CONSTRUCTAI DAILY SITE DIRECTIVE\nDate: ${result.date}\nActivity: ${result.planned_activity}\n\nSummary:\n${result.summary}\n\nPrioritized Tasks:\n${(result.prioritized_tasks || []).map((t) => `[${t.priority}] ${t.time_slot} - ${t.task} (${t.assignee_role})`).join('\n')}\n\nSafety Gear: ${(result.safety_gear_required || []).join(', ')}`;
    navigator.clipboard.writeText(text);
    addToast('Site directive copied to clipboard', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `daily_site_directive_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported directive as JSON', 'success');
  };

  const getPriorityBadge = (p) => {
    const val = (p || '').toLowerCase();
    if (val === 'high') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (val === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
              Daily Shift Intelligence & Pre-Pour Checkpoints
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Daily Site Assistant & Supervisor Directive
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Generate prioritized morning briefings, workforce allocation plans, equipment checklists, and critical safety alerts tailored to your daily site conditions.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Quick shifts:</span>
          {QUICK_ACTIVITIES.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPlannedActivity(q.activity);
                setLabourCount(q.workers);
                setSiteCondition(q.condition);
                handleGenerate(null, q);
              }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              {q.activity.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleGenerate} className="cai-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <HardHat className="w-4 h-4 text-construction-500" />
              Daily Shift Parameters
            </h3>

            {/* Planned Activity */}
            <div>
              <label className="cai-label">Planned Activity / Pour Target</label>
              <input
                type="text"
                value={plannedActivity}
                onChange={(e) => setPlannedActivity(e.target.value)}
                placeholder="e.g. Casting 3rd floor slab (M25 Concrete)..."
                className="cai-input"
                required
              />
            </div>

            {/* Labour Count & Site Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="cai-label">Deployed Workforce</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={labourCount}
                    onChange={(e) => setLabourCount(e.target.value)}
                    className="cai-input pl-9 font-mono"
                    required
                  />
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="cai-label">Ground Status</label>
                <select
                  value={siteCondition}
                  onChange={(e) => setSiteCondition(e.target.value)}
                  className="cai-input bg-white cursor-pointer"
                >
                  <option value="Dry firm ground">Dry firm ground</option>
                  <option value="Muddy from recent rainfall">Muddy from recent rain</option>
                  <option value="Restricted access near live road">Restricted road access</option>
                  <option value="High wind gusts (30 km/h)">High wind conditions</option>
                  <option value="Night shift with artificial tower lights">Night shift (floodlights)</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cai-btn-primary w-full py-3 text-sm font-bold shadow-md mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Site Directive...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Shift Directive</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {loading ? (
            <AnalysisShimmerOverlay message="Compiling Daily Site Schedule & Toolbox Directive..." />
          ) : result ? (
            <div className="space-y-5">
              {/* Directive Header */}
              <div className="cai-card bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        📅 {result.date}
                      </span>
                      <span className="text-xs font-bold text-construction-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                        {labourCount} Workers Active
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {result.planned_activity}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyDirective}
                      className="cai-btn-secondary !text-xs !py-1.5 !px-2.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={exportJSON}
                      className="cai-btn-secondary !text-xs !py-1.5 !px-2.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 pt-3 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Safety Gear Badges */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-construction-500" />
                  Mandatory PPE Checklist for Shift
                </h4>

                <div className="flex flex-wrap gap-2">
                  {(result.safety_gear_required || []).map((gear, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-950 border border-orange-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-construction-600" />
                      <span>{gear}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Prioritized Shift Tasks */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Prioritized Time-Slot Schedule
                </h4>

                <div className="space-y-2.5">
                  {(result.prioritized_tasks || []).map((taskItem, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(
                              taskItem.priority
                            )}`}
                          >
                            {taskItem.priority}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {taskItem.task}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold whitespace-nowrap">
                          {taskItem.time_slot}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Lead Responsible: <strong className="text-slate-700">{taskItem.assignee_role}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Inspection List */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-construction-500" />
                  Pre-Pour Plant & Machinery Checks
                </h4>

                <div className="divide-y divide-slate-100 text-xs">
                  {(result.equipment_list || []).map((eq, i) => (
                    <div key={i} className="py-2.5 flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900">{eq.equipment}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Checkpoint: <span className="text-slate-700 font-medium">{eq.check_item}</span>
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap">
                        {eq.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Alerts */}
              {(result.risk_alerts || []).length > 0 && (
                <div className="space-y-3">
                  {(result.risk_alerts || []).map((alert, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        alert.level === 'CRITICAL'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                          : 'bg-amber-50/80 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertOctagon
                          className={`w-4 h-4 ${
                            alert.level === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          [{alert.level}] {alert.title}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700 pl-6">
                        {alert.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Supervisor Notes */}
              {result.supervisor_signoff_notes && (
                <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-0.5">✍️ Resident Engineer Sign-Off Protocol:</strong>
                  {result.supervisor_signoff_notes}
                </div>
              )}
            </div>
          ) : (
            <div className="cai-card flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-construction-500 mb-4">
                <HardHat className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Awaiting Daily Shift Plan
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Set today's target activity and workforce count to generate a complete morning toolbox briefing.
              </p>
              <button
                type="button"
                onClick={() => handleGenerate(null, QUICK_ACTIVITIES[0])}
                className="cai-btn-secondary !text-xs"
              >
                Use Slab Casting Preset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
