import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  Hammer,
  FileText,
  Search,
  Bookmark,
  CheckCircle2,
  Copy,
  Download,
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';
import { AnalysisShimmerOverlay } from '../components/LoadingSkeleton';
import { useToast } from '../components/Toast';
import { api } from '../api/client';

const CATEGORIES = [
  { id: 'SAFETY', label: 'Safety Protocols', icon: Shield, subtitle: 'OSHA, NBC Part 7 & IS 3696' },
  { id: 'TECHNIQUE', label: 'Execution Techniques', icon: Hammer, subtitle: 'IS 456, IS 10262 & CPWD' },
  { id: 'DOC_GEN', label: 'Document Generator', icon: FileText, subtitle: 'Site RFIs & Certificates' },
];

const PRESETS_BY_CATEGORY = {
  SAFETY: [
    'Steps for scaffolding inspection',
    'Deep excavation pit shoring safety',
    'Fall protection lifeline standards',
    'Electrical safety on wet concrete sites'
  ],
  TECHNIQUE: [
    'M25 concrete mix ratio & slump',
    'Bar bending schedule (BBS) lap lengths',
    'Pre-cast wall panel joint grouting',
    'Hot weather concreting precautions'
  ],
  DOC_GEN: [
    'Pre-pour slab inspection clearance certificate',
    'Material test cube compressive report template',
    'Site safety violation stop-work notice',
    'Contractor handover snagging checklist'
  ]
};

export default function KnowledgeAssistantView() {
  const { addToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('SAFETY');
  const [query, setQuery] = useState('Steps for scaffolding inspection');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async (e, customQuery = null, customCat = null) => {
    if (e) e.preventDefault();
    const q = customQuery !== null ? customQuery : query;
    const cat = customCat !== null ? customCat : activeCategory;

    if (!q.trim()) {
      addToast('Please enter a query', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.queryKnowledge(cat, q.trim());
      setResult(data);
      addToast('Technical guidelines retrieved!', 'success');
    } catch (err) {
      addToast(err.message || 'Query failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySwitch = (catId) => {
    setActiveCategory(catId);
    const firstPreset = PRESETS_BY_CATEGORY[catId][0];
    setQuery(firstPreset);
    handleSearch(null, firstPreset, catId);
  };

  const copyKnowledge = () => {
    if (!result) return;
    const text = `CONSTRUCTAI KNOWLEDGE REPORT: ${result.title}\n\nIS Codes Cited:\n${(result.is_codes_cited || []).map((c) => `- ${c.code} (${c.clause}): ${c.excerpt}`).join('\n')}\n\nGuidelines:\n${(result.technical_guidelines || []).map((g) => `${g.step_number}. ${g.title}: ${g.instruction}`).join('\n')}\n\n${result.doc_template ? `Template:\n${result.doc_template}` : ''}`;
    navigator.clipboard.writeText(text);
    addToast('Guidelines copied to clipboard', 'success');
  };

  const copyDocTemplate = () => {
    if (!result?.doc_template) return;
    navigator.clipboard.writeText(result.doc_template);
    addToast('Document certificate copied', 'success');
  };

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `knowledge_${activeCategory.toLowerCase()}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Exported knowledge file as JSON', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Lead Banner */}
      <div className="bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-800 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-construction-500/20 text-construction-400 border border-construction-500/40">
            Indian Standards (BIS) & NBC 2016 Repository
          </span>
        </div>
        <h2 className="text-xl font-bold tracking-tight">
          Knowledge Base & Structural Standard Operating Procedures
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Instant technical queries for civil engineering execution, safety mandates, and official documentation templates referencing Bureau of Indian Standards (IS Codes).
        </p>

        {/* Category Segmented Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySwitch(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-construction-500 shadow-md text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-construction-500 text-white shadow-glow-orange'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight tracking-tight">
                    {cat.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {cat.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Indian Standards, concrete mix, safety protocols, or document forms..."
              className="w-full px-4 py-3 pl-10 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-construction-500/50 focus:border-construction-500 transition-all font-medium"
              required
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cai-btn-primary px-6 py-3 whitespace-nowrap text-sm font-bold shadow-md"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching BIS Codes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Query Base</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Chips */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Suggested Topics:</span>
          {PRESETS_BY_CATEGORY[activeCategory].map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(p);
                handleSearch(null, p);
              }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <AnalysisShimmerOverlay message="Querying Indian Standards & National Building Code (NBC 2016)..." />
      ) : result ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="cai-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-construction-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  Category: {result.category}
                </span>
                <span className="text-xs text-slate-400">
                  Topic: "{result.query}"
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {result.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {result.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={copyKnowledge}
                className="cai-btn-secondary !text-xs !py-1.5 !px-3"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
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

          {/* 2-Column: Cited IS Codes & SOP Execution Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cited IS Codes (5 cols) */}
            <div className="lg:col-span-5 cai-card space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Bookmark className="w-4 h-4 text-construction-500" />
                Authoritative IS Codes & NBC Clauses ({(result.is_codes_cited || []).length})
              </h4>

              <div className="space-y-3">
                {(result.is_codes_cited || []).map((codeItem, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-200 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {codeItem.code}
                      </span>
                      <span className="text-[10px] font-mono text-construction-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-bold">
                        {codeItem.clause}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      {codeItem.title}
                    </p>

                    <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-200/60 leading-relaxed">
                      "{codeItem.excerpt}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Practical Tips */}
              {(result.practical_tips || []).length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2">
                  <span className="text-xs font-bold text-orange-950 block">
                    💡 Field Engineer Best Practices:
                  </span>
                  <ul className="space-y-1.5 text-xs text-orange-900/90">
                    {(result.practical_tips || []).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-construction-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SOP Guidelines & Document Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Technical Guidelines Card */}
              <div className="cai-card space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Standard Operating Procedure (SOP) Guidelines
                </h4>

                <div className="space-y-3">
                  {(result.technical_guidelines || []).map((g) => (
                    <div
                      key={g.step_number}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {g.step_number}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">
                          {g.title}
                        </h5>
                      </div>

                      <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                        {g.instruction}
                      </p>

                      <div className="pl-8 pt-1">
                        <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                          <strong>Critical Check:</strong> {g.critical_check}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Use Document Template (if DOC_GEN or provided) */}
              {result.doc_template && (
                <div className="cai-card space-y-3 bg-slate-950 text-slate-200 border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-construction-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Generated Official Document Template
                    </span>

                    <button
                      type="button"
                      onClick={copyDocTemplate}
                      className="cai-btn-secondary !bg-slate-900 !text-slate-100 !border-slate-700 hover:!bg-slate-800 !text-xs !py-1 !px-2.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-construction-400" />
                      <span>Copy Template</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-900 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed border border-slate-800/80">
                    {result.doc_template}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
