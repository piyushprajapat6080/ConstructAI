import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Sun,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Copy,
  Download,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';

const SCENARIOS = [
  {
    name: 'Monsoon Concreting (No-Go)',
    activity: 'Concreting 4th floor slab (M25 mix)',
    weather: 'Heavy monsoon showers, 85% humidity, 35 mm rainfall'
  },
  {
    name: 'High Wind Crane Lift (Caution)',
    activity: 'Tower crane hoisting formwork panels & rebar bundles',
    weather: 'High wind gusts up to 40 km/h, partly cloudy'
  },
  {
    name: 'Scorching Heat Wave (Caution)',
    activity: 'Exterior wall plastering and slab casting',
    weather: 'Extreme dry heat, 41°C ambient temperature, 20% humidity'
  },
  {
    name: 'Clear Spring Skies (Go)',
    activity: 'Full-scale structural concreting & rebar tying',
    weather: 'Clear blue skies, 26°C, mild breeze (12 km/h)'
  }
];

export default function WeatherAdvisorView() {
  const { addToast } = useToast();
  const [plannedActivity, setPlannedActivity] = useState(SCENARIOS[0].activity);
  const [forecastWeather, setForecastWeather] = useState(SCENARIOS[0].weather);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e, customData = null) => {
    if (e) e.preventDefault();
    const act = customData ? customData.activity : plannedActivity;
    const weather = customData ? customData.weather : forecastWeather;

    if (!act.trim() || !weather.trim()) {
      addToast('Please enter both activity and forecast weather', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.checkWeatherFeasibility({
        planned_activity: act.trim(),
        forecast_weather: weather.trim()
      });
      setResult(data);
      addToast('Weather feasibility calculated!', 'success');
    } catch (err) {
      addToast(err.message || 'Feasibility check failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyAdvisory = () => {
    if (!result) return;
    const text = `CONSTRUCTAI WEATHER OPERATIONAL FEASIBILITY\nDecision: ${result.feasibility_decision} (${result.confidence_score}% Confidence)\nActivity: ${result.planned_activity}\nForecast: ${result.forecast_weather}\n\nOperational Advisory:\n${result.operational_advisory}\n\nKey Hazards:\n${(result.hazards || []).map((h) => `- [${h.severity}] ${h.hazard}: ${h.reason}`).join('\n')}\n\nPrecautions:\n${(result.precautions || []).map((p) => `- ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    addToast('Weather advisory copied to clipboard', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `weather_feasibility_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported advisory as JSON', 'success');
  };

  const getDecisionStyles = (decision) => {
    const d = (decision || '').toUpperCase();
    if (d === 'GO') {
      return {
        bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/40',
        badge: 'bg-emerald-500 text-white shadow-emerald-500/30',
        icon: CheckCircle2,
        title: 'GO — CONDITIONS COMPLIANT'
      };
    }
    if (d.includes('CAUTION')) {
      return {
        bg: 'bg-amber-500/10 text-amber-900 border-amber-500/40',
        badge: 'bg-amber-500 text-white shadow-amber-500/30',
        icon: AlertTriangle,
        title: 'PROCEED WITH STRICT CAUTION'
      };
    }
    return {
      bg: 'bg-rose-500/10 text-rose-950 border-rose-500/40',
      badge: 'bg-rose-600 text-white shadow-rose-500/30',
      icon: XCircle,
      title: 'NO-GO — CEASE OPERATION'
    };
  };

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
              Meteorological AI & IS 7861 Risk Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Weather Feasibility Advisor & Pour Clearance Engine
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Analyze weather impacts (monsoon dilution, tower crane wind shear, hot weather slump loss) and obtain unequivocal GO / NO-GO site operational clearances.
          </p>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Scenarios:</span>
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPlannedActivity(s.activity);
                setForecastWeather(s.weather);
                handleCheck(null, s);
              }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleCheck} className="cai-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <CloudSun className="w-4 h-4 text-construction-500" />
              Operational & Meteorological Input
            </h3>

            {/* Planned Activity */}
            <div>
              <label className="cai-label">Site Activity</label>
              <input
                type="text"
                value={plannedActivity}
                onChange={(e) => setPlannedActivity(e.target.value)}
                placeholder="e.g. Concreting 4th floor slab (M25 mix)..."
                className="cai-input"
                required
              />
            </div>

            {/* Forecast Weather */}
            <div>
              <label className="cai-label">Forecast Weather Details</label>
              <textarea
                rows={3}
                value={forecastWeather}
                onChange={(e) => setForecastWeather(e.target.value)}
                placeholder="e.g. Heavy monsoon showers, 85% humidity, 35 mm rain..."
                className="cai-input resize-none"
                required
              />
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
                  <span>Evaluating Atmospheric Variables...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Check Feasibility & Hazards</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {loading ? (
            <AnalysisShimmerOverlay message="Correlating Weather Data with Structural Curing Protocols..." />
          ) : result ? (
            <div className="space-y-5">
              {/* Primary Large Feasibility Decision Banner */}
              {(() => {
                const conf = getDecisionStyles(result.feasibility_decision);
                const Icon = conf.icon;
                return (
                  <div className={`cai-card border-2 ${conf.bg} relative overflow-hidden`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${conf.badge}`}>
                          <Icon className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Clearance Status
                          </span>
                          <h3 className="text-xl font-extrabold tracking-tight">
                            {conf.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-800">
                          {result.confidence_score}% Confidence
                        </span>
                        <button
                          onClick={copyAdvisory}
                          className="cai-btn-secondary !text-xs !py-1 !px-2.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={exportJSON}
                          className="cai-btn-secondary !text-xs !py-1 !px-2.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                        {result.operational_advisory}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Weather Hazards Chips */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Meteorological Hazards ({(result.hazards || []).length})
                </h4>

                <div className="space-y-2.5">
                  {(result.hazards || []).map((h, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {h.hazard}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            h.severity === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {h.severity} IMPACT
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {h.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Mitigation Checklist */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Required Actionable Site Precautions
                </h4>

                <ul className="space-y-2">
                  {(result.precautions || []).map((p, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optimal Windows */}
              {(result.optimal_windows || []).length > 0 && (
                <div className="cai-card space-y-2.5 bg-slate-50/60">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-construction-500" />
                    Recommended Safe Operational Time Windows:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(result.optimal_windows || []).map((win, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs"
                      >
                        ⏱️ {win}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="cai-card flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-construction-500 mb-4">
                <CloudSun className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Awaiting Weather Evaluation
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Select your activity and forecast conditions to calculate operational feasibility and risk mitigations.
              </p>
              <button
                type="button"
                onClick={() => handleCheck(null, SCENARIOS[0])}
                className="cai-btn-secondary !text-xs"
              >
                Run Monsoon Concreting Check
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
