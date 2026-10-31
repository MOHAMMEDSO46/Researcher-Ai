import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldAlert,
  BookOpen,
  FlaskConical,
  HelpCircle,
  ListTree,
  Copy,
  Check,
  Send,
  Layers,
  ArrowRight,
  Database,
  Info,
} from 'lucide-react';
import { ResearchProject, AcademicLevel } from '../types';
import { ACADEMIC_DISCIPLINES } from '../data/defaults';
import { buildResearchModePrompt } from '../utils/academicPrompts';
import { generateAcademicAiContent } from '../services/aiService';

interface ResearchModeViewProps {
  activeProject: ResearchProject;
  onSendToWorkspace: (sectionKey: 'introduction' | 'methodology' | 'literature_review', text: string) => void;
  activeModel: string;
}

export const ResearchModeView: React.FC<ResearchModeViewProps> = ({
  activeProject,
  onSendToWorkspace,
  activeModel,
}) => {
  const [topicInput, setTopicInput] = useState(
    activeProject.title || 'How does generative artificial intelligence impact cognitive reasoning and schema acquisition in STEM students?'
  );
  const [field, setField] = useState(activeProject.fieldOfStudy || ACADEMIC_DISCIPLINES[0]);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(activeProject.academicLevel || "Master's (M.Sc / M.A)");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setIsAnalyzing(true);
    setReportMarkdown('');

    const prompt = buildResearchModePrompt(topicInput, field, academicLevel);

    try {
      const res = await generateAcademicAiContent({
        prompt,
        model: activeModel,
        academicLevel,
        fieldOfStudy: field,
        toolType: 'research-mode',
      });

      setReportMarkdown(res.content);
      setModelUsed(res.modelUsed);
    } catch (err: any) {
      alert(`Research Mode Error: ${err.message || 'Failed to analyze topic.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate external database search links
  const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(topicInput)}`;
  const pubmedUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(topicInput)}`;
  const crossrefUrl = `https://search.crossref.org/?q=${encodeURIComponent(topicInput)}`;
  const ieeeUrl = `https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(topicInput)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Search className="w-3.5 h-3.5" />
            <span>Deep Research Mode & Concept Breakdown</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white mb-2">
            Deconstruct Academic Topics & Knowledge Gaps
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Submit a complex inquiry, dissertation premise, or research question. ResearchAI dissects core theoretical variables, pinpoints unaddressed literature gaps, and outlines rigorous methodology blueprints.
          </p>
        </div>
      </div>

      {/* Input Search Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
        <form onSubmit={handleRunAnalysis} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Research Question or Central Topic Premise <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g., How does high-frequency micro-mobility fleet distribution impact public transit equity in post-industrial metropolitan corridors?"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discipline / Academic Field
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {ACADEMIC_DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Scholarly Level
              </label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Undergraduate">Undergraduate Honors Thesis</option>
                <option value="Master's (M.Sc / M.A)">Master's Degree</option>
                <option value="Doctoral / Ph.D.">Doctoral / Ph.D. Dissertation</option>
                <option value="Postdoctoral & Faculty">Postdoctoral / Faculty Research</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
            {/* Real Database 1-Click Verification Links (Requirement 5) */}
            <div className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto w-full sm:w-auto">
              <span className="font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                Verify In Databases:
              </span>
              <a
                href={scholarUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-medium"
              >
                <span>Google Scholar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={pubmedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-medium"
              >
                <span>PubMed</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={crossrefUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
              >
                <span>CrossRef</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !topicInput.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deconstructing with Gemma AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Research Breakdown</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prominent Verification & Academic Source Transparency Banner (Requirement 5) */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <p className="font-bold text-amber-950 dark:text-amber-100 mb-0.5">
            Academic Source Integrity & Citation Distinction Notice:
          </p>
          <p>
            All conceptual frameworks, variable categorizations, and methodology suggestions produced in Research Mode are <strong>AI-generated heuristics</strong>. ResearchAI does not fabricate citations or claim unverified real-time indexed papers as empirical ground truth. You must independently consult primary databases (Google Scholar, Web of Science, Scopus, PubMed) to verify all citations before citing in manuscripts or theses.
          </p>
        </div>
      </div>

      {/* Results Section */}
      {isAnalyzing && (
        <div className="py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              Deconstructing Research Topic
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1">
              Gemma AI is formulating conceptual variables, identifying unexamined literature gaps, and drafting the methodological blueprint.
            </p>
          </div>
        </div>
      )}

      {reportMarkdown && !isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Action Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                Comprehensive Research Report
              </span>
              {modelUsed && (
                <span className="text-[10px] text-slate-400 font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {modelUsed}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Report'}</span>
              </button>

              <button
                onClick={() => onSendToWorkspace('literature_review', reportMarkdown)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Literature Review</span>
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6 sm:p-8 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {reportMarkdown}
          </div>
        </div>
      )}
    </div>
  );
};
