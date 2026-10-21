import React, { useState } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Copy,
  Download,
  Sparkles,
  Maximize2,
  Layers,
  ArrowRight
} from 'lucide-react';
import FileUploadZone from '../components/FileUploadZone';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';
import { CRACK_DEMO_IMAGE_B64 } from '../assets/crackDemoImage';
import { compressImage } from '../utils/imageCompressor';

const STRUCTURE_TYPES = [
  "RCC Beam",
  "Column / Shear Wall",
  "Brick Masonry Wall",
  "Foundation Slab / Footing",
  "Retaining Wall",
  "Cantilever Balcony Slab"
];

export default function CrackDetectionView() {
  const { addToast } = useToast();
  const [crackImage, setCrackImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [structureType, setStructureType] = useState('RCC Beam');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const MAX_IMAGE_SIZE_MB = 8;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  const handleSizeError = (file, maxMB) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    addToast({
      type: 'error',
      title: 'Image Size Exceeded',
      message: `Selected crack photo is ${sizeInMB} MB. Maximum allowed image size is ${maxMB || MAX_IMAGE_SIZE_MB} MB.`
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      handleSizeError(file, MAX_IMAGE_SIZE_MB);
      return;
    }

    try {
      // Compress and resize on client-side using HTML5 Canvas (max 1600px, 0.8 JPEG quality)
      const compressed = await compressImage(file, 1600, 0.8);
      if (compressed && compressed.file) {
        setCrackImage(compressed.file);
        setPreviewUrl(compressed.dataUrl || URL.createObjectURL(compressed.file));
        const originalMB = (file.size / (1024 * 1024)).toFixed(2);
        const optKB = Math.round(compressed.sizeBytes / 1024);
        addToast(`Crack photo attached (${originalMB} MB optimized to ${optKB} KB)`, 'success');
      } else {
        setCrackImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        addToast('Crack photo attached', 'success');
      }
    } catch (_) {
      setCrackImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      addToast('Crack photo attached', 'success');
    }
  };

  const handleFileRemove = () => {
    setCrackImage(null);
    if (previewUrl && !previewUrl.startsWith('data:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    addToast('Crack photo removed', 'info');
  };

  const loadSamplePreset = async () => {
    setPreviewUrl(CRACK_DEMO_IMAGE_B64);
    try {
      const byteString = atob(CRACK_DEMO_IMAGE_B64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const sampleBlob = new Blob([ab], { type: 'image/png' });
      const sampleFile = new File([sampleBlob], 'rcc_beam_diagonal_shear_crack.png', { type: 'image/png' });
      setCrackImage(sampleFile);
    } catch (_) {
      setCrackImage(null);
    }
    setStructureType('RCC Beam');
    setDescription('45-degree diagonal shear crack extending from bottom tensile flange upward toward the support column. Width ~3.5mm.');
    addToast('Loaded RCC Beam shear crack sample', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.analyzeCrack({
        crackImage,
        crackImageBase64: previewUrl && previewUrl.startsWith('data:image/') ? previewUrl : undefined,
        description: description || 'Visual structural crack assessment',
        structureType
      });
      setResult(data);
      addToast('Structural crack diagnosis complete!', 'success');
    } catch (err) {
      addToast(err.message || 'Diagnosis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!result) return;
    const text = `CONSTRUCTAI CRACK DIAGNOSIS REPORT\nType: ${result.crack_type} (${result.classification})\nSeverity: ${result.severity} (${result.severity_percentage}%)\nWidth: ${result.width_estimate_mm}\n\nProbable Causes:\n${(result.probable_causes || []).join('\n- ')}\n\nImpact:\n${result.structural_integrity_impact}`;
    navigator.clipboard.writeText(text);
    addToast('Diagnosis copied to clipboard', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `crack_diagnosis_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported diagnosis as JSON', 'success');
  };

  const getSeverityBadge = (sev) => {
    const s = (sev || '').toUpperCase();
    if (s === 'CRITICAL') return 'bg-rose-50 text-rose-700 border-rose-300';
    if (s === 'HIGH') return 'bg-amber-50 text-amber-700 border-amber-300';
    return 'bg-emerald-50 text-emerald-700 border-emerald-300';
  };

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
              Forensic Vision AI + IS 456
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Structural Crack Classifier & Remediation Blueprint
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Multi-resolution computer vision diagnosis to distinguish non-structural shrinkage from critical shear and differential settlement cracks with costed repair steps.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSamplePreset}
          className="cai-btn-secondary !bg-slate-800 !text-slate-100 !border-slate-700 hover:!bg-slate-700 !text-xs whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-construction-400" />
          Load Demo Crack Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleSubmit} className="cai-card space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap className="w-4 h-4 text-construction-500" />
              Crack Diagnosis Input
            </h3>

            {/* Photo dropzone */}
            <FileUploadZone
              label="Crack Macro Photo"
              hint="Upload high-res photo with reference scale (Max 8MB)"
              maxSizeMB={8}
              file={crackImage}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              onSizeError={handleSizeError}
              sampleOptions={[
                { label: 'Diagonal Shear Crack', onSelect: loadSamplePreset }
              ]}
            />

            {/* Structure Type Select */}
            <div>
              <label className="cai-label">Structural Member Type</label>
              <select
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="cai-input bg-white cursor-pointer"
              >
                {STRUCTURE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Observed Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="cai-label !mb-0">Visual Details & Context</label>
                <span className="text-[11px] text-slate-400">Orientation, propagation</span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Diagonal 45-degree angle near beam support. Width appears roughly 3-4mm. No recent water leakage observed..."
                className="cai-input resize-none"
              />

              {/* Quick tags */}
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">Quick presets:</span>
                {[
                  'Diagonal 45° angle near support',
                  'Vertical hairline crack on plaster',
                  'Stepped crack on brick masonry'
                ].map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDescription(tag)}
                    className="text-[10px] bg-slate-100 hover:bg-orange-50 hover:text-construction-600 text-slate-600 px-2 py-0.5 rounded transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="cai-btn-primary w-full py-3 text-sm font-bold shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Finite Fracture Mechanics...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze Crack & Generate Blueprint</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {loading ? (
            <AnalysisShimmerOverlay message="Running AI Structural Crack Diagnosis..." />
          ) : result ? (
            <div className="space-y-5">
              {/* Primary Diagnostic Banner */}
              <div className="cai-card bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                          result.severity
                        )}`}
                      >
                        {result.severity} SEVERITY
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {result.classification}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {result.crack_type}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copySummary}
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

                {/* Metric Gauges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Severity Index
                    </span>
                    <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                      {result.severity_percentage}%
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full ${
                          result.severity_percentage > 70
                            ? 'bg-rose-500'
                            : result.severity_percentage > 40
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${result.severity_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Est. Crack Width
                    </span>
                    <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                      {result.width_estimate_mm}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      IS 456 limit: 0.3mm
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Member Inspected
                    </span>
                    <p className="text-base font-bold text-slate-900 truncate mt-0.5">
                      {result.structure_type}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Critical load zone
                    </span>
                  </div>
                </div>

                {/* Integrity Impact Callout */}
                <div className="mt-4 p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80">
                  <p className="text-xs font-semibold text-orange-950 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-construction-600" />
                    Structural Integrity Impact:
                  </p>
                  <p className="text-xs text-orange-900/90 leading-relaxed">
                    {result.structural_integrity_impact}
                  </p>
                </div>
              </div>

              {/* Probable Causes */}
              <div className="cai-card space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Probable Root Causes ({(result.probable_causes || []).length})
                </h4>

                <ul className="space-y-2">
                  {(result.probable_causes || []).map((cause, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-700 flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-construction-500 mt-1.5 flex-shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Repair Recommendations Blueprint */}
              <div className="cai-card space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-construction-500" />
                  Actionable Repair Blueprint & Materials
                </h4>

                <div className="space-y-3">
                  {(result.repair_recommendations || []).map((step) => (
                    <div
                      key={step.step}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-orange-200 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-construction-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {step.step}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {step.action}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            step.urgency.includes('Immediate')
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {step.urgency}
                        </span>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 border-t border-slate-100">
                        <span>
                          <strong className="text-slate-800">Materials:</strong> {step.materials}
                        </span>
                        <span className="font-mono font-bold text-construction-700 whitespace-nowrap">
                          Est: ₹{Number(step.estimated_cost_inr || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monitoring Protocol */}
              {result.monitoring_protocol && (
                <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1">
                    🔍 Long-Term Tell-Tale Monitoring Protocol:
                  </span>
                  <p className="leading-relaxed">{result.monitoring_protocol}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="cai-card flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-construction-500 mb-4">
                <Zap className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Ready for Crack Diagnostic Scan
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Upload a macro photo of the crack or click the demo preset to diagnose classification and repair cost.
              </p>
              <button
                type="button"
                onClick={loadSamplePreset}
                className="cai-btn-secondary !text-xs"
              >
                Try Demo Crack Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
