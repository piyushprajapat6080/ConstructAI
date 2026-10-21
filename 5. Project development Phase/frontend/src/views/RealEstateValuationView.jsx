import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Coins,
  Percent,
  MapPin,
  Sparkles,
  Copy,
  Download,
  Check,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';

const AMENITY_OPTIONS = [
  'Gated 24/7 Security & CCTV',
  'Clubhouse & Gym',
  '100% DG Power Backup',
  'Metro / Transit Link (<1.5 km)',
  'EV Vehicle Charging Bay',
  'Rainwater Harvesting & STP',
  'Dedicated Covered Parking',
  'Swimming Pool'
];

const QUICK_LOCATIONS = [
  { name: 'Whitefield, Bengaluru', type: 'Residential Apartment', area: 1450, age: 3 },
  { name: 'Bandra West, Mumbai', type: 'Residential Apartment', area: 1100, age: 6 },
  { name: 'Cyber City, Gurugram', type: 'Commercial Office', area: 2500, age: 4 },
  { name: 'Hitec City, Hyderabad', type: 'Villa/Independent House', area: 2800, age: 2 }
];

export default function RealEstateValuationView() {
  const { addToast } = useToast();
  const [location, setLocation] = useState('Whitefield, Bengaluru');
  const [areaSqft, setAreaSqft] = useState(1450);
  const [ageYears, setAgeYears] = useState(3);
  const [propertyType, setPropertyType] = useState('Residential Apartment');
  const [amenities, setAmenities] = useState([
    'Gated 24/7 Security & CCTV',
    'Clubhouse & Gym',
    '100% DG Power Backup',
    'Metro / Transit Link (<1.5 km)'
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleQuickFill = (preset) => {
    setLocation(preset.name);
    setPropertyType(preset.type);
    setAreaSqft(preset.area);
    setAgeYears(preset.age);
    addToast(`Loaded preset for ${preset.name}`, 'info');
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!location.trim() || areaSqft <= 0) {
      addToast('Please enter a valid location and area', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.calculateValuation({
        location: location.trim(),
        area_sqft: Number(areaSqft),
        age_years: Number(ageYears) || 0,
        type: propertyType,
        amenities
      });
      setResult(data);
      addToast('Valuation generated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Valuation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyValuation = () => {
    if (!result) return;
    const text = `CONSTRUCTAI REAL ESTATE VALUATION\nAsset: ${result.area_sqft} sq.ft ${result.property_type} in ${result.location}\nFair Market Value: ${result.formatted_value} (₹${result.price_per_sqft_inr?.toLocaleString('en-IN')}/sq.ft)\nEst. Monthly Rent: ₹${result.expected_monthly_rent_inr?.toLocaleString('en-IN')}\nGross Rental Yield: ${result.rental_yield_percentage}%\n5-Year Projected ROI: ${result.roi_percentage}%\n\nSummary:\n${result.valuation_summary}`;
    navigator.clipboard.writeText(text);
    addToast('Valuation appraisal copied', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `valuation_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported valuation as JSON', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
              Indian Micro-Market Pricing Engine (₹ INR)
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Real Estate Valuation & Investment Yield Modeler
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Instant algorithmic appraisal for Indian residential, commercial, and land assets factoring location micro-market trends, age depreciation, and rental yields.
          </p>
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Quick presets:</span>
          {QUICK_LOCATIONS.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickFill(q)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              {q.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleCalculate} className="cai-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-construction-500" />
              Property Parameters
            </h3>

            {/* Location */}
            <div>
              <label className="cai-label">Location / Micro-Market</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Whitefield, Bengaluru or Sector 62, Noida"
                  className="cai-input pl-9"
                  required
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="cai-label">Asset Classification</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="cai-input bg-white cursor-pointer"
              >
                <option value="Residential Apartment">Residential Apartment (Multi-storey)</option>
                <option value="Commercial Office">Commercial Grade-A Office</option>
                <option value="Villa/Independent House">Villa / Gated Independent Row House</option>
                <option value="Plot/Land">Residential / Commercial Plot</option>
              </select>
            </div>

            {/* Area & Age 2-col */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="cai-label">Super Area (Sq.Ft)</label>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="50"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="cai-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="cai-label">Structure Age (Yrs)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  className="cai-input font-mono"
                  required
                />
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="cai-label">Included Amenities ({amenities.length})</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                {AMENITY_OPTIONS.map((item) => {
                  const isChecked = amenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`text-left text-xs p-2.5 rounded-lg border flex items-center gap-2 transition-all duration-150 ${
                        isChecked
                          ? 'bg-orange-50/80 border-orange-300 text-slate-900 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                          isChecked
                            ? 'bg-construction-500 border-construction-500 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
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
                  <span>Computing Micro-Market Comparables...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate Fair Valuation & Yield</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {loading ? (
            <AnalysisShimmerOverlay message="Simulating Real Estate Cashflows & Benchmarks..." />
          ) : result ? (
            <div className="space-y-5">
              {/* Primary KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  title="Fair Market Value"
                  value={result.formatted_value}
                  subtext={`Range: ₹${Number(result.value_range_min_inr || 0).toLocaleString('en-IN')} - ₹${Number(result.value_range_max_inr || 0).toLocaleString('en-IN')}`}
                  icon={Coins}
                  badgeText="Current Q4"
                  badgeVariant="success"
                  className="bg-gradient-to-br from-white to-orange-50/30 border-orange-200/80"
                />

                <StatCard
                  title="Average Rate / Sq.Ft"
                  value={`₹${Number(result.price_per_sqft_inr || 0).toLocaleString('en-IN')}`}
                  subtext={`Based on ${result.location} micro-market index`}
                  icon={Building2}
                  badgeText={`${result.area_sqft} sq.ft`}
                  badgeVariant="info"
                />

                <StatCard
                  title="Est. Monthly Rent"
                  value={`₹${Number(result.expected_monthly_rent_inr || 0).toLocaleString('en-IN')}`}
                  subtext={`Gross annual yield of ${result.rental_yield_percentage}%`}
                  icon={TrendingUp}
                  badgeText="High Demand"
                  badgeVariant="warning"
                />

                <StatCard
                  title="5-Year Projected ROI"
                  value={`${result.roi_percentage}%`}
                  subtext="Annualized capital appreciation + rent yield"
                  icon={Percent}
                  progress={result.roi_percentage * 5}
                  badgeText="CAGR"
                  badgeVariant="success"
                />
              </div>

              {/* Summary Card with Actions */}
              <div className="cai-card space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Executive Appraisal Narrative
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyValuation}
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

                <p className="text-xs text-slate-600 leading-relaxed">
                  {result.valuation_summary}
                </p>
              </div>

              {/* Micro-Market Drivers */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-construction-500" />
                  Key Valuation Drivers & Catalysts
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(result.market_drivers || []).map((driver, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {driver.factor}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                            driver.impact === 'HIGH'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {driver.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {driver.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparable Benchmarks Table */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Micro-Market Comparable Benchmarks
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="pb-2">Inventory Segment</th>
                        <th className="pb-2">Avg Rate / Sq.Ft</th>
                        <th className="pb-2 text-right">Appreciation YoY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {(result.comparable_benchmarks || []).map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/80">
                          <td className="py-2.5 font-semibold text-slate-800">{c.area_name}</td>
                          <td className="py-2.5 font-mono">₹{Number(c.avg_rate_sqft || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 text-right font-mono text-emerald-600 font-bold">
                            {c.appreciation_rate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="cai-card flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-construction-500 mb-4">
                <Building2 className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Awaiting Property Details
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Configure your asset location and area on the left to calculate fair market rate and rental yield.
              </p>
              <button
                type="button"
                onClick={() => handleQuickFill(QUICK_LOCATIONS[0])}
                className="cai-btn-secondary !text-xs"
              >
                Use Whitefield, Bengaluru Sample
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
