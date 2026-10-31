import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RefreshCw,
  SpellCheck,
  AlignLeft,
  ChevronRight,
  Send,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  Save,
} from 'lucide-react';
import { ResearchProject, SectionKey, SectionData, AcademicLevel, WritingStyle, DocumentType } from '../types';
import { SECTION_ORDER, SECTION_METADATA } from '../data/defaults';
import { generateAcademicAiContent } from '../services/aiService';

interface DocumentWorkspaceProps {
  project: ResearchProject;
  onUpdateProject: (updatedProject: ResearchProject) => void;
  activeModel: string;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  project,
  onUpdateProject,
  activeModel,
}) => {
  const [activeSectionKey, setActiveSectionKey] = useState<SectionKey>('introduction');
  const [isEditorMode, setIsEditorMode] = useState<'edit' | 'preview'>('edit');
  const [savedIndicator, setSavedIndicator] = useState<'saved' | 'saving'>('saved');

  // AI Generation Drawer / Configuration State
  const [showGenerateDrawer, setShowGenerateDrawer] = useState(false);
  const [genTopic, setGenTopic] = useState(project.title);
  const [genField, setGenField] = useState(project.fieldOfStudy);
  const [genLevel, setGenLevel] = useState<AcademicLevel>(project.academicLevel);
  const [genDocType, setGenDocType] = useState<DocumentType>(project.documentType);
  const [genStyle, setGenStyle] = useState<WritingStyle>(project.writingStyle);
  const [genWordCount, setGenWordCount] = useState<number>(500);
  const [genCustomPrompt, setGenCustomPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // Quick Action State
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active section data
  const activeSection = project.sections[activeSectionKey] || {
    id: activeSectionKey,
    title: SECTION_METADATA[activeSectionKey]?.title || activeSectionKey,
    description: SECTION_METADATA[activeSectionKey]?.description || '',
    content: '',
    status: 'draft',
    wordCount: 0,
    lastModified: new Date().toISOString(),
  };

  // Sync genTopic when active project title changes
  useEffect(() => {
    setGenTopic(project.title);
  }, [project.title]);

  // Handle section text change
  const handleContentChange = (newContent: string) => {
    setSavedIndicator('saving');
    const words = newContent.trim() ? newContent.trim().split(/\s+/).length : 0;

    const updatedSections = {
      ...project.sections,
      [activeSectionKey]: {
        ...activeSection,
        content: newContent,
        wordCount: words,
        lastModified: new Date().toISOString(),
      },
    };

    const updatedProject = {
      ...project,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject);
    setTimeout(() => {
      setSavedIndicator('saved');
    }, 400);
  };

  // Section status toggle
  const handleStatusChange = (status: SectionData['status']) => {
    const updatedSections = {
      ...project.sections,
      [activeSectionKey]: {
        ...activeSection,
        status,
        lastModified: new Date().toISOString(),
      },
    };
    onUpdateProject({ ...project, sections: updatedSections });
  };

  // Main AI Generation execution for current section
  const handleExecuteGeneration = async () => {
    setIsAiGenerating(true);
    setAiError('');

    const sectionMeta = SECTION_METADATA[activeSectionKey];
    const sectionName = sectionMeta.title;

    const systemPrompt = `You are an elite academic co-author drafting the ${sectionName} for an academic manuscript.
Topic: ${genTopic}
Discipline: ${genField}
Academic Level: ${genLevel}
Document Category: ${genDocType}
Writing Register: ${genStyle}
Section: ${sectionName} (${sectionMeta.description})

SCHOLARLY INSTRUCTIONS:
- Generate comprehensive, publishable academic content structured with subheadings (##, ###), coherent scholarly paragraphs, and clear theoretical justifications.
- Approximate length: ~${genWordCount} words.
- Use precise disciplinary vocabulary, avoid conversational filler.
- Mention relevant academic literature in standard (Author, Year) format and append a brief verification note advising the author to check empirical databases.
${genCustomPrompt ? `\nResearcher's Specific Instructions:\n${genCustomPrompt}` : ''}
`;

    try {
      const res = await generateAcademicAiContent({
        prompt: `Generate the ${sectionName} for our research project on: "${genTopic}".`,
        systemInstruction: systemPrompt,
        model: activeModel,
        academicLevel: genLevel,
        fieldOfStudy: genField,
        writingStyle: genStyle,
        targetWordCount: genWordCount,
        toolType: `section-${activeSectionKey}`,
      });

      // Append or replace
      const combined = activeSection.content.trim()
        ? `${activeSection.content}\n\n${res.content}`
        : res.content;

      handleContentChange(combined);
      setShowGenerateDrawer(false);
    } catch (err: any) {
      setAiError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Quick text transformation actions: Rewrite, Expand, Shorten, Improve Tone
  const handleQuickAiAction = async (action: 'rewrite' | 'expand' | 'shorten' | 'tone' | 'transitions') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = activeSection.content.substring(start, end).trim();
    const textToProcess = selectedText || activeSection.content;

    if (!textToProcess) {
      alert('Please enter or select some text first to apply AI refinement.');
      return;
    }

    setQuickActionLoading(action);

    let instruction = '';
    if (action === 'rewrite') {
      instruction = 'Rewrite the provided academic text to elevate scholarly rigor, vary sentence structure, and enhance clarity.';
    } else if (action === 'expand') {
      instruction = 'Substantially expand this academic text by introducing deeper theoretical explanation, methodological context, and illustrative scholarly nuances.';
    } else if (action === 'shorten') {
      instruction = 'Condense and tighten this academic text, eliminating redundant phrasing while strictly preserving core empirical findings and technical terminology.';
    } else if (action === 'tone') {
      instruction = 'Refine the academic tone of this text: eliminate informal phrasing, replace weak verbs with precise analytical descriptors, and ensure objective scholarly distance.';
    } else if (action === 'transitions') {
      instruction = 'Enhance the logical flow of this academic passage by inserting sophisticated scholarly transitions and dialectical signposts between arguments.';
    }

    try {
      const prompt = `${instruction}

Input Passage:
"""
${textToProcess}
"""

Academic Discipline: ${project.fieldOfStudy}
Academic Level: ${project.academicLevel}
Writing Style: ${project.writingStyle}

Provide ONLY the revised text ready for academic publication.`;

      const res = await generateAcademicAiContent({
        prompt,
        model: activeModel,
        academicLevel: project.academicLevel,
        fieldOfStudy: project.fieldOfStudy,
      });

      if (selectedText) {
        // Replace only selection
        const before = activeSection.content.substring(0, start);
        const after = activeSection.content.substring(end);
        handleContentChange(before + res.content + after);
      } else {
        // Replace whole section
        handleContentChange(res.content);
      }
    } catch (err: any) {
      alert(`AI Action Failed: ${err.message}`);
    } finally {
      setQuickActionLoading(null);
    }
  };

  // Calculate project metrics
  const totalWords = Object.values(project.sections).reduce((sum, sec) => sum + (sec.wordCount || 0), 0);
  const targetWords = project.targetWordCount || 8000;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));
  const estimatedReadMinutes = Math.max(1, Math.round(totalWords / 200));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Workspace Top Metrics & Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {project.documentType}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {project.fieldOfStudy}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white mt-1 line-clamp-1">
            {project.title}
          </h1>
        </div>

        {/* Word count metrics & Generate Button */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Progress Pill */}
          <div className="hidden sm:flex flex-col text-right pr-2">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {totalWords.toLocaleString()} / {targetWords.toLocaleString()} words
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">{progressPercent}%</span>
            </div>
          </div>

          {/* Prominent AI Generate Button (Requirement 4) */}
          <button
            onClick={() => setShowGenerateDrawer(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Generate Section with AI</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: Sections Sidebar + Document Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section Navigation Sidebar (Requirement 3) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 sticky top-24">
          <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Project Sections
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {Object.values(project.sections).filter((s) => s.content.trim().length > 0).length} / 9
            </span>
          </div>

          <div className="space-y-1">
            {SECTION_ORDER.map((key) => {
              const sec = project.sections[key];
              const meta = SECTION_METADATA[key];
              const isActive = key === activeSectionKey;
              const hasContent = sec && sec.content.trim().length > 0;

              return (
                <button
                  key={key}
                  onClick={() => setActiveSectionKey(key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        sec?.status === 'completed'
                          ? 'bg-emerald-500'
                          : sec?.status === 'in_progress'
                          ? 'bg-amber-500'
                          : hasContent
                          ? 'bg-indigo-400'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                    <span className="truncate">{meta?.title || key}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-1">
                    {sec?.wordCount || 0}w
                  </span>
                </button>
              );
            })}
          </div>

          {/* Academic Integrity Mini Notice */}
          <div className="mt-4 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
            <span className="font-semibold">Scholarly Check:</span> Remember to fact-check empirical citations and apply peer-reviewed literature before submission.
          </div>
        </div>

        {/* Right Document Editor Area */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[680px]">
          {/* Section Toolbar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/30 rounded-t-2xl">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                  {SECTION_METADATA[activeSectionKey]?.title}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({activeSection.wordCount || 0} words)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {SECTION_METADATA[activeSectionKey]?.description}
              </p>
            </div>

            {/* Status Selector & Save Indicator */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                {savedIndicator === 'saving' ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Saved</span>
                  </>
                )}
              </span>

              {/* Status Picker */}
              <select
                value={activeSection.status || 'draft'}
                onChange={(e) => handleStatusChange(e.target.value as SectionData['status'])}
                className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="needs_review">Needs Review</option>
                <option value="completed">Completed ✓</option>
              </select>

              {/* Edit / Preview Toggle */}
              <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setIsEditorMode('edit')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    isEditorMode === 'edit'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                  Editor
                </button>
                <button
                  onClick={() => setIsEditorMode('preview')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    isEditorMode === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Scholarly View
                </button>
              </div>
            </div>
          </div>

          {/* AI Quick Transformation Actions Toolbar */}
          <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>AI Refine:</span>
            </span>

            <button
              onClick={() => handleQuickAiAction('rewrite')}
              disabled={!!quickActionLoading}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors whitespace-nowrap flex items-center space-x-1"
            >
              {quickActionLoading === 'rewrite' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              <span>Rewrite Text</span>
            </button>

            <button
              onClick={() => handleQuickAiAction('expand')}
              disabled={!!quickActionLoading}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors whitespace-nowrap flex items-center space-x-1"
            >
              {quickActionLoading === 'expand' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              <span>Expand Details</span>
            </button>

            <button
              onClick={() => handleQuickAiAction('shorten')}
              disabled={!!quickActionLoading}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors whitespace-nowrap flex items-center space-x-1"
            >
              {quickActionLoading === 'shorten' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              <span>Condense / Shorten</span>
            </button>

            <button
              onClick={() => handleQuickAiAction('tone')}
              disabled={!!quickActionLoading}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors whitespace-nowrap flex items-center space-x-1"
            >
              {quickActionLoading === 'tone' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              <span>Improve Academic Tone</span>
            </button>

            <button
              onClick={() => handleQuickAiAction('transitions')}
              disabled={!!quickActionLoading}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors whitespace-nowrap flex items-center space-x-1"
            >
              {quickActionLoading === 'transitions' ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              <span>Add Transitions</span>
            </button>
          </div>

          {/* Document Content Area */}
          <div className="flex-1 p-6 relative">
            {isEditorMode === 'edit' ? (
              <textarea
                ref={textareaRef}
                value={activeSection.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`Draft your ${SECTION_METADATA[activeSectionKey]?.title} here, or click "Generate Section with AI" above to formulate structured academic content...`}
                className="w-full h-full min-h-[480px] bg-transparent text-slate-900 dark:text-slate-100 font-academic text-base leading-relaxed focus:outline-none resize-none placeholder-slate-400"
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none font-academic text-base text-slate-900 dark:text-slate-100 leading-loose whitespace-pre-wrap">
                {activeSection.content ? (
                  activeSection.content
                ) : (
                  <p className="italic text-slate-400 font-sans text-sm">
                    This section is currently empty. Switch to Editor mode or use "Generate Section with AI" to draft content.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 rounded-b-2xl">
            <div className="flex items-center space-x-4">
              <span>Section: {activeSection.wordCount || 0} words</span>
              <span>•</span>
              <span>Project Total: {totalWords} words (~{estimatedReadMinutes} min read)</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(activeSection.content);
                setCopiedSection(true);
                setTimeout(() => setCopiedSection(false), 2000);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              {copiedSection ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection ? 'Copied Section' : 'Copy Section'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent AI Generation System Drawer / Modal (Requirement 4) */}
      {showGenerateDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                    Generate {SECTION_METADATA[activeSectionKey]?.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Calibrated academic synthesis with Google Gemma AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGenerateDrawer(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Requirement 4: User parameters before generating */}
            <div className="space-y-4">
              {/* Research Topic */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Research Topic / Focus <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="The central investigative subject or paper title"
                />
              </div>

              {/* Field of Study & Academic Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={genField}
                    onChange={(e) => setGenField(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Level
                  </label>
                  <select
                    value={genLevel}
                    onChange={(e) => setGenLevel(e.target.value as AcademicLevel)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Master's (M.Sc / M.A)">Master's (M.Sc / M.A)</option>
                    <option value="Doctoral / Ph.D.">Doctoral / Ph.D.</option>
                    <option value="Postdoctoral & Faculty">Postdoctoral & Faculty</option>
                  </select>
                </div>
              </div>

              {/* Type of Document & Writing Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type of Document
                  </label>
                  <select
                    value={genDocType}
                    onChange={(e) => setGenDocType(e.target.value as DocumentType)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Original Research Paper">Original Research Paper</option>
                    <option value="Master Thesis / Dissertation">Master Thesis / Dissertation</option>
                    <option value="Research Proposal / Grant Application">Research Proposal</option>
                    <option value="Systematic Literature Review">Systematic Literature Review</option>
                    <option value="Conference Abstract">Conference Abstract</option>
                    <option value="Term Paper / Academic Essay">Term Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Writing Style
                  </label>
                  <select
                    value={genStyle}
                    onChange={(e) => setGenStyle(e.target.value as WritingStyle)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Formal Academic">Formal Academic</option>
                    <option value="Empirical & Quantitative">Empirical & Quantitative</option>
                    <option value="Analytical & Rigorous">Analytical & Rigorous</option>
                    <option value="Critical & Qualitative">Critical & Qualitative</option>
                    <option value="Concise & Objective">Concise & Objective</option>
                  </select>
                </div>
              </div>

              {/* Word Count */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Word Count
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    ~{genWordCount} words
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {[250, 500, 800, 1200, 2000].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGenWordCount(cnt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        genWordCount === cnt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cnt}w
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Guidance Prompt */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Researcher Notes or Findings to Include (Optional)
                </label>
                <textarea
                  rows={3}
                  value={genCustomPrompt}
                  onChange={(e) => setGenCustomPrompt(e.target.value)}
                  placeholder="e.g., Emphasize the Watson-Glaser critical thinking scores and cite Cognitive Load Theory (Sweller, 2011)."
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {aiError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowGenerateDrawer(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteGeneration}
                disabled={isAiGenerating || !genTopic.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Academic Section...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Append to Editor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
