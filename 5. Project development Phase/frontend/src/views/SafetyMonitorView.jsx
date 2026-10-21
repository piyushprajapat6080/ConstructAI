import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Clock,
  Copy,
  Download,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import FileUploadZone from '../components/FileUploadZone';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';
import { SAFETY_DEMO_IMAGE_B64 } from '../assets/safetyDemoImage';
import { compressImage } from '../utils/imageCompressor';

export default function SafetyMonitorView() {
  const { addToast } = useToast();
  const [sitePhoto, setSitePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [observationLog, setObservationLog] = useState('');
  const [safetyDoc, setSafetyDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const MAX_IMAGE_SIZE_MB = 8;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  const handleSizeError = (file, maxMB) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    addToast({
      type: 'error',
      title: 'Image Size Exceeded',
      message: `Selected photo is ${sizeInMB} MB. Maximum allowed image size is ${maxMB || MAX_IMAGE_SIZE_MB} MB.`
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      handleSizeError(file, MAX_IMAGE_SIZE_MB);
      return;
    }

    try {
      // Compress and resize on client-side using HTML5 Canvas (max 1600px, 0.8 JPEG quality)
      const compressed = await compressImage(file, 1600, 0.8);
      if (compressed && compressed.file) {
        setSitePhoto(compressed.file);
        setPreviewUrl(compressed.dataUrl || URL.createObjectURL(compressed.file));
        const originalMB = (file.size / (1024 * 1024)).toFixed(2);
        const optKB = Math.round(compressed.sizeBytes / 1024);
        addToast(`Site photo attached (${originalMB} MB optimized to ${optKB} KB)`, 'success');
      } else {
        setSitePhoto(file);
        setPreviewUrl(URL.createObjectURL(file));
        addToast('Site photo attached successfully', 'success');
      }
    } catch (_) {
      setSitePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      addToast('Site photo attached successfully', 'success');
    }
  };

  const handleFileRemove = () => {
    setSitePhoto(null);
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    addToast('Site photo removed', 'info');
  };

  const loadSamplePreset = async () => {
    setPreviewUrl(SAFETY_DEMO_IMAGE_B64);
    try {
      // Create authentic JPEG File object from base64
      const byteString = atob(SAFETY_DEMO_IMAGE_B64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const sampleBlob = new Blob([ab], { type: 'image/jpeg' });
      const sampleFile = new File([sampleBlob], 'site_inspection_safety.jpg', { type: 'image/jpeg' });
      setSitePhoto(sampleFile);
    } catch (_) {
      setSitePhoto(null);
    }
    setObservationLog('Level 4 perimeter slab edge lacks toe boards and guardrails. Active crane hoisting overhead near pedestrian staging zone. Scaffolding cross-bracing audit needed.');
    addToast('Loaded high-rise perimeter sample photo & log', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.analyzeSafety({
        sitePhoto,
        sitePhotoBase64: previewUrl && previewUrl.startsWith('data:image/') ? previewUrl : undefined,
        observationLog: observationLog || 'Standard routine safety sweep',
        safetyDoc
      });
      setResult(data);
      addToast('Safety analysis complete!', 'success');
    } catch (err) {
      addToast(err.message || 'Analysis failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!result) return;
    const text = `CONSTRUCTAI SAFETY AUDIT REPORT\nRisk: ${result.overall_risk} (Score: ${result.risk_score}/100)\n\nSummary:\n${result.summary}\n\nHazards Identified: ${(result.hazards || []).length}\nPPE Items Audited: ${(result.ppe_compliance || []).length}`;
    navigator.clipboard.writeText(text);
    addToast('Audit summary copied to clipboard', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `safety_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported audit report as JSON', 'success');
  };

  // Severity color helpers
  const getRiskBadge = (risk) => {
    const r = (risk || '').toUpperCase();
    if (r === 'CRITICAL') return 'bg-rose-500/15 text-rose-600 border-rose-300';
    if (r === 'HIGH') return 'bg-amber-500/15 text-amber-600 border-amber-300';
    if (r === 'MODERATE') return 'bg-yellow-500/15 text-yellow-700 border-yellow-300';
    return 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
  };

  const getPpeStatusIcon = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLIANT') return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    if (s === 'PARTIAL') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    return <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Lead */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
              Vision AI + IS Code Compliance
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Site Safety & OSHA/IS Hazard Auditor
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Upload site inspection photos to automatically detect fall hazards, PPE non-compliance, scaffolding defects, and mandatory regulatory stop-work mandates.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSamplePreset}
          className="cai-btn-secondary !bg-slate-800 !text-slate-100 !border-slate-700 hover:!bg-slate-700 !text-xs whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-construction-400" />
          Load Demo Photo
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleSubmit} className="cai-card space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4 h-4 text-construction-500" />
              Site Observation Input
            </h3>

            {/* Photo Upload Zone */}
            <FileUploadZone
              label="Site Inspection Photo"
              hint="Drop site photo or click to browse (Max 8MB)"
              maxSizeMB={8}
              file={sitePhoto}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              onSizeError={handleSizeError}
              sampleOptions={[
                { label: 'Unguarded Slab Edge', onSelect: loadSamplePreset }
              ]}
            />

            {/* Observation Log */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="cai-label !mb-0">Observation Notes / Log</label>
                <span className="text-[11px] text-slate-400">Optional text notes</span>
              </div>
              <textarea
                rows={4}
                value={observationLog}
                onChange={(e) => setObservationLog(e.target.value)}
                placeholder="e.g. Scaffolding on 4th floor perimeter. Workers noticed without chin straps on helmets. Wet cable across transit corridor..."
                className="cai-input resize-none"
              />

              {/* Prompt Helpers */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">Quick tags:</span>
                {[
                  'Edge perimeter unguarded',
                  'Scaffold base loose',
                  'Missing safety harness',
                  'Exposed starter bars'
                ].map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setObservationLog((prev) => prev ? `${prev}. ${tag}` : tag)}
                    className="text-[10px] bg-slate-100 hover:bg-orange-50 hover:text-construction-600 text-slate-600 px-2 py-0.5 rounded transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="cai-btn-primary w-full py-3 text-sm font-bold shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Multimodal Hazards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Multimodal Safety Audit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {loading ? (
            <AnalysisShimmerOverlay message="Multimodal Vision AI Auditing Site Photo..." />
          ) : result ? (
            <div className="space-y-5">
              {/* Top Risk Header Card */}
              <div className="cai-card relative overflow-hidden bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${
                        result.overall_risk === 'CRITICAL'
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : result.overall_risk === 'HIGH'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      }`}
                    >
                      {result.risk_score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getRiskBadge(
                            result.overall_risk
                          )}`}
                        >
                          {result.overall_risk} RISK LEVEL
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Score: {result.risk_score}/100
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        Site Safety Audit Findings
                      </h4>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copySummary}
                      className="cai-btn-secondary !text-xs !py-1.5 !px-2.5"
                      title="Copy Summary"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={exportJSON}
                      className="cai-btn-secondary !text-xs !py-1.5 !px-2.5"
                      title="Export JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 pt-4 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Identified Hazards List */}
              <div className="cai-card space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Identified Site Hazards ({(result.hazards || []).length})
                  </h4>
                </div>

                <div className="space-y-3">
                  {(result.hazards || []).map((h) => (
                    <div
                      key={h.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {h.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {h.title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskBadge(
                            h.severity
                          )}`}
                        >
                          {h.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{h.description}</p>

                      <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                        <span className="text-slate-500 font-medium">
                          📍 <span className="font-semibold text-slate-700">{h.location}</span>
                        </span>
                        <span className="text-construction-700 font-medium">
                          ⚡ <span className="underline decoration-construction-300">{h.recommendation}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PPE Compliance Checklist */}
              <div className="cai-card space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Personal Protective Equipment (PPE) Audit
                </h4>

                <div className="divide-y divide-slate-100">
                  {(result.ppe_compliance || []).map((ppe, i) => (
                    <div key={i} className="py-2.5 flex items-start gap-3">
                      {getPpeStatusIcon(ppe.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800">
                            {ppe.item}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              ppe.status === 'COMPLIANT'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ppe.status === 'PARTIAL'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {ppe.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{ppe.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Actions (IS Codes / BOCW) */}
              <div className="cai-card space-y-3 bg-gradient-to-br from-white to-slate-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  Mandatory Regulatory Compliance Directives
                </h4>

                <div className="space-y-2.5">
                  {(result.regulatory_actions || []).map((reg, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {reg.code}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{reg.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{reg.action}</p>
                      </div>

                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded whitespace-nowrap self-start sm:self-center">
                        ⏳ {reg.timeline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="cai-card flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-construction-500 mb-4">
                <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Awaiting Inspection Submission
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Upload a photo or select the demo preset to run an instant multimodal hazard audit.
              </p>
              <button
                type="button"
                onClick={loadSamplePreset}
                className="cai-btn-secondary !text-xs"
              >
                Try Demo Inspection Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
