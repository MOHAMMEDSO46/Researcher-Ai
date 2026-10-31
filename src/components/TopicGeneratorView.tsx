import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Target,
  ListOrdered,
  Maximize2,
  Bookmark,
  Send,
  Loader2,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { AcademicLevel, GeneratedTopic, ResearchProject } from '../types';
import { ACADEMIC_DISCIPLINES } from '../data/defaults';
import {
  buildTopicGeneratorPrompt,
  buildExpandTopicPrompt,
  buildGenerateQuestionsFromTopicPrompt,
  buildGenerateObjectivesFromTopicPrompt,
  buildGenerateOutlineFromTopicPrompt,
} from '../utils/academicPrompts';
import { generateAcademicAiContent } from '../services/aiService';

interface TopicGeneratorViewProps {
  activeProject: ResearchProject;
  onApplyTopicToProject: (title: string, keywords: string[]) => void;
  onSendToWorkspace: (sectionKey: 'title' | 'introduction', text: string) => void;
  activeModel: string;
}

export const TopicGeneratorView: React.FC<TopicGeneratorViewProps> = ({
  activeProject,
  onApplyTopicToProject,
  onSendToWorkspace,
  activeModel,
}) => {
  // Input fields per requirement
  const [fieldOfStudy, setFieldOfStudy] = useState(activeProject.fieldOfStudy || ACADEMIC_DISCIPLINES[0]);
  const [customField, setCustomField] = useState('');
  const [department, setDepartment] = useState(activeProject.department || '');
  const [areaOfInterest, setAreaOfInterest] = useState('Impact of Generative AI on Research Methodologies & Verification');
  const [keywords, setKeywords] = useState('Machine Learning, Prompt Engineering, Research Rigor, Verification');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(activeProject.academicLevel || "Master's (M.Sc / M.A)");

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [topics, setTopics] = useState<GeneratedTopic[]>([
    {
      id: 'topic-init-1',
      title: 'Algorithmic Epistemology: Evaluating Hallucination Mitigation Protocols in Academic Literature Synthesis Using Gemma LLMs',
      rationale: 'Addresses the urgent challenge of scientific accuracy in AI-generated literature reviews by testing verification frameworks across peer-reviewed databases.',
      feasibilityScore: 'High Feasibility (Public benchmark datasets available)',
      targetMethodology: 'Controlled Experimental Benchmark & Automated Semantic Evaluation',
      keyVariables: ['IV: Prompt scaffolding & ground-truth verification', 'DV: Citation hallucination rate', 'Moderator: Academic discipline'],
    },
    {
      id: 'topic-init-2',
      title: 'Pedagogical Disruption vs. Cognitive Augmentation: A Quasi-Experimental Assessment of Student Coding Proficiency in Socratic AI Scaffolds',
      rationale: 'Examines whether conversational AI scaffolds foster genuine computational thinking or foster cognitive offloading among undergraduate computer scientists.',
      feasibilityScore: 'Moderate-High (Requires university IRB / classroom cohort access)',
      targetMethodology: 'Quasi-Experimental Mixed-Methods Pretest-Posttest Design',
      keyVariables: ['IV: Socratic AI Scaffold vs. Direct Solution Model', 'DV: Algorithmic problem-solving score', 'Mediator: Metacognitive awareness'],
    },
    {
      id: 'topic-init-3',
      title: 'Spatial Disparities in Urban Climate Resilience: Spatial Econometric Modeling of Micro-Transit Deployment in Disadvantaged Metropolitan Tracts',
      rationale: 'Explores the equitable allocation of municipal electric micro-mobility fleets to alleviate transit poverty and reduce carbon emissions in post-industrial cities.',
      feasibilityScore: 'High (Open GTFS transit feeds and census geospatial GIS layers)',
      targetMethodology: 'Spatial Autoregressive Modeling (SAR) & GIS Network Analysis',
      keyVariables: ['IV: Fleet dock density & municipal subsidies', 'DV: First-mile/last-mile transit connectivity', 'Control: Household median income'],
    },
  ]);

  const [activeModalContent, setActiveModalContent] = useState<{
    topicTitle: string;
    actionType: 'expand' | 'questions' | 'objectives' | 'outline';
    content: string;
    loading: boolean;
  } | null>(null);

  const [savedTopicIds, setSavedTopicIds] = useState<Set<string>>(new Set());
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Generate Topics
  const handleGenerateTopics = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!areaOfInterest.trim()) return;

    setIsGenerating(true);
    const selectedField = fieldOfStudy === 'Other (Specify Below)' ? customField || 'Multidisciplinary' : fieldOfStudy;

    const prompt = buildTopicGeneratorPrompt({
      fieldOfStudy: selectedField,
      department,
      areaOfInterest,
      keywords,
      academicLevel,
    });

    try {
      const response = await generateAcademicAiContent({
        prompt,
        model: activeModel,
        academicLevel,
        fieldOfStudy: selectedField,
        toolType: 'topic-generator',
      });

      // Parse structured topics from markdown response
      const parsedTopics = parseTopicsFromMarkdown(response.content, selectedField);
      if (parsedTopics.length > 0) {
        setTopics(parsedTopics);
      } else {
        // Fallback: create raw topic container
        setTopics([
          {
            id: `topic-${Date.now()}-1`,
            title: `Investigation into ${areaOfInterest}`,
            rationale: response.content.slice(0, 300) + '...',
            feasibilityScore: 'Custom AI Analysis',
            targetMethodology: 'Empirical / Mixed-Methods',
            keyVariables: [keywords],
            expandedDetails: response.content,
          },
        ]);
      }
    } catch (err: any) {
      alert(`Topic Generation Error: ${err.message || 'Please check your connection and API key.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper parser for markdown output
  const parseTopicsFromMarkdown = (text: string, defaultField: string): GeneratedTopic[] => {
    const topicBlocks = text.split(/(?=### Topic \d+:|### Topic:|\bTopic \d+:)/i).filter((b) => b.trim().length > 30);
    if (!topicBlocks || topicBlocks.length === 0) return [];

    return topicBlocks.slice(0, 5).map((block, index) => {
      const titleMatch = block.match(/(?:### Topic \d+:|### Topic:|\bTopic \d+:)\s*([^\n\r]+)/i);
      const title = titleMatch ? titleMatch[1].replace(/\*\*/g, '').trim() : `Academic Study ${index + 1}: ${areaOfInterest}`;

      const rationaleMatch = block.match(/Scholarly Rationale:\*\*?\s*([^\n\r]+(?:\n[^\n\r*]+)?)/i);
      const methodologyMatch = block.match(/Target Research Design:\*\*?\s*([^\n\r]+)/i);
      const feasibilityMatch = block.match(/Feasibility & Data Accessibility:\*\*?\s*([^\n\r]+)/i);
      const variablesMatch = block.match(/Key Variables \/ Concepts:\*\*?\s*([^\n\r]+(?:\n[^\n\r*]+)?)/i);

      return {
        id: `topic-gen-${Date.now()}-${index}`,
        title,
        rationale: rationaleMatch ? rationaleMatch[1].trim() : 'Significant academic inquiry with strong theoretical foundation.',
        targetMethodology: methodologyMatch ? methodologyMatch[1].trim() : 'Empirical / Mixed Methods Study',
        feasibilityScore: feasibilityMatch ? feasibilityMatch[1].trim() : 'Appropriate for ' + academicLevel,
        keyVariables: variablesMatch ? [variablesMatch[1].trim()] : [keywords || 'Key domain variables'],
        expandedDetails: block,
      };
    });
  };

  // Handle Action Buttons per topic: Expand, Questions, Objectives, Outline
  const handleTopicAction = async (
    topic: GeneratedTopic,
    action: 'expand' | 'questions' | 'objectives' | 'outline'
  ) => {
    setActiveModalContent({
      topicTitle: topic.title,
      actionType: action,
      content: '',
      loading: true,
    });

    const selectedField = fieldOfStudy === 'Other (Specify Below)' ? customField || 'Multidisciplinary' : fieldOfStudy;
    let prompt = '';

    if (action === 'expand') {
      prompt = buildExpandTopicPrompt(topic.title, academicLevel, selectedField);
    } else if (action === 'questions') {
      prompt = buildGenerateQuestionsFromTopicPrompt(topic.title, academicLevel);
    } else if (action === 'objectives') {
      prompt = buildGenerateObjectivesFromTopicPrompt(topic.title, academicLevel);
    } else if (action === 'outline') {
      prompt = buildGenerateOutlineFromTopicPrompt(topic.title, academicLevel, selectedField);
    }

    try {
      const res = await generateAcademicAiContent({
        prompt,
        model: activeModel,
        academicLevel,
        fieldOfStudy: selectedField,
      });

      setActiveModalContent((prev) =>
        prev
          ? {
              ...prev,
              content: res.content,
              loading: false,
            }
          : null
      );
    } catch (err: any) {
      setActiveModalContent((prev) =>
        prev
          ? {
              ...prev,
              content: `Error generating content: ${err.message}`,
              loading: false,
            }
          : null
      );
    }
  };

  const handleSaveToggle = (id: string) => {
    setSavedTopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(id);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Research Project Topic Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white mb-2">
            Formulate High-Impact, Researchable Topics
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Enter your field, sub-discipline, and areas of scholarly curiosity. The Gemma AI model evaluates academic feasibility, methodology requirements, and identifies unaddressed research gaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 mb-4 font-serif">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Research Parameters</span>
            </h2>

            <form onSubmit={handleGenerateTopics} className="space-y-4">
              {/* Field of Study */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <select
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {ACADEMIC_DISCIPLINES.map((discipline) => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                  <option value="Other (Specify Below)">Other (Specify Custom Discipline)</option>
                </select>
                {fieldOfStudy === 'Other (Specify Below)' && (
                  <input
                    type="text"
                    placeholder="e.g., Nanotechnology & Quantum Biophysics"
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                    className="mt-2 w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Sub-Discipline
                </label>
                <input
                  type="text"
                  placeholder="e.g., Department of Cognitive Neuroscience"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Academic Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Level
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Undergraduate">Undergraduate (Senior Honors / Capstone)</option>
                  <option value="Master's (M.Sc / M.A)">Master's (M.Sc / M.A / M.Phil)</option>
                  <option value="Doctoral / Ph.D.">Doctoral / Ph.D. Dissertation</option>
                  <option value="Postdoctoral & Faculty">Postdoctoral & Faculty Grant Research</option>
                </select>
              </div>

              {/* Area of Interest */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Area of Interest / Problem <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., How can small language models assist hospital triage without generating medical hallucinations?"
                  value={areaOfInterest}
                  onChange={(e) => setAreaOfInterest(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keywords / Core Concepts
                </label>
                <input
                  type="text"
                  placeholder="e.g., Triage Accuracy, LLM Verification, Healthcare AI"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Comma-separated key variables or themes.</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating || !areaOfInterest.trim()}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Literature with Gemma AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Academic Topics</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Generated Topics List */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Generated Research Topics ({topics.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrated for {academicLevel} level in {fieldOfStudy}
              </p>
            </div>
            {isGenerating && (
              <span className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                Formulating Topics...
              </span>
            )}
          </div>

          {topics.map((topic, index) => {
            const isSaved = savedTopicIds.has(topic.id);
            return (
              <div
                key={topic.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all group"
              >
                {/* Topic Header & Title */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      Topic {index + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {topic.title}
                    </h3>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleSaveToggle(topic.id)}
                    title={isSaved ? 'Remove from saved' : 'Save topic'}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Scholarly Rationale */}
                <div className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white">Academic Rationale: </span>
                  {topic.rationale}
                </div>

                {/* Metadata Pills */}
                <div className="mt-3.5 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    🔬 {topic.targetMethodology}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-medium">
                    ✓ {topic.feasibilityScore}
                  </span>
                  {topic.keyVariables.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]"
                    >
                      {v}
                    </span>
                  ))}
                </div>

                {/* Required Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  {/* Expand */}
                  <button
                    onClick={() => handleTopicAction(topic, 'expand')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Expand</span>
                  </button>

                  {/* Generate Research Questions */}
                  <button
                    onClick={() => handleTopicAction(topic, 'questions')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span>Generate Questions</span>
                  </button>

                  {/* Generate Objectives */}
                  <button
                    onClick={() => handleTopicAction(topic, 'objectives')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
                  >
                    <Target className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Generate Objectives</span>
                  </button>

                  {/* Create Research Outline */}
                  <button
                    onClick={() => handleTopicAction(topic, 'outline')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
                  >
                    <ListOrdered className="w-3.5 h-3.5 text-amber-500" />
                    <span>Create Outline</span>
                  </button>

                  {/* Set as Active Project Topic */}
                  <button
                    onClick={() => onApplyTopicToProject(topic.title, [keywords])}
                    className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center space-x-1"
                  >
                    <span>Use for Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Result Modal (for Expand, Questions, Objectives, Outline) */}
      {activeModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activeModalContent.actionType === 'expand' && 'Topic In-Depth Expansion'}
                  {activeModalContent.actionType === 'questions' && 'Research Questions & Hypotheses'}
                  {activeModalContent.actionType === 'objectives' && 'SMART Research Objectives'}
                  {activeModalContent.actionType === 'outline' && 'Hierarchical Research Outline'}
                </span>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white line-clamp-1">
                  {activeModalContent.topicTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalContent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {activeModalContent.loading ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Generating scholarly analysis using Gemma AI...
                  </p>
                </div>
              ) : (
                activeModalContent.content
              )}
            </div>

            {/* Modal Footer */}
            {!activeModalContent.loading && (
              <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(activeModalContent.content, 'modal-copy')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
                >
                  {copiedStatus === 'modal-copy' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStatus === 'modal-copy' ? 'Copied' : 'Copy Text'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onSendToWorkspace('introduction', activeModalContent.content);
                      setActiveModalContent(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Insert into Introduction</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
