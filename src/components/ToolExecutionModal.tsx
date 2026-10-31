import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Send,
  Download,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { ToolDefinition, ResearchProject, AcademicLevel, WritingStyle, SectionKey } from '../types';
import { ACADEMIC_DISCIPLINES } from '../data/defaults';
import { generateAcademicAiContent } from '../services/aiService';

interface ToolExecutionModalProps {
  tool: ToolDefinition;
  activeProject: ResearchProject;
  onClose: () => void;
  onInsertToSection: (sectionKey: SectionKey, content: string) => void;
  activeModel: string;
}

export const ToolExecutionModal: React.FC<ToolExecutionModalProps> = ({
  tool,
  activeProject,
  onClose,
  onInsertToSection,
  activeModel,
}) => {
  // Configurable fields
  const [researchTopic, setResearchTopic] = useState(activeProject.title || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(activeProject.fieldOfStudy || ACADEMIC_DISCIPLINES[0]);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(activeProject.academicLevel);
  const [writingStyle, setWritingStyle] = useState<WritingStyle>(activeProject.writingStyle);
  const [wordCount, setWordCount] = useState<number>(
    tool.id === 'abstract-generator' ? 250 : tool.id === 'lit-review' ? 800 : 500
  );
  const [userPromptInput, setUserPromptInput] = useState('');
  const [targetSection, setTargetSection] = useState<SectionKey>(tool.targetSection || 'introduction');

  // Specific Citation inputs if tool is citation-assistant
  const [citationAuthors, setCitationAuthors] = useState('');
  const [citationYear, setCitationYear] = useState('2024');
  const [citationTitle, setCitationTitle] = useState('');
  const [citationJournal, setCitationJournal] = useState('');
  const [citationDoi, setCitationDoi] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputContent, setOutputContent] = useState('');
  const [modelUsed, setModelUsed] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Preload existing section text if applicable for paraphraser or writing improver
  useEffect(() => {
    if ((tool.id === 'paraphraser' || tool.id === 'grammar-improver' || tool.id === 'summarizer') && !userPromptInput) {
      const existingText = activeProject.sections.introduction?.content || '';
      if (existingText) {
        setUserPromptInput(existingText.slice(0, 800));
      }
    }
  }, [tool.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    let prompt = '';

    if (tool.id === 'citation-assistant') {
      prompt = `Format the following academic source into APA 7th edition, MLA 9th edition, Chicago 17th (Notes & Bibliography), Harvard, IEEE, and BibTeX format:
Author(s): ${citationAuthors || 'Smith, J., & Johnson, E.'}
Publication Year: ${citationYear || '2024'}
Document Title: ${citationTitle || researchTopic}
Journal / Publisher: ${citationJournal || 'Journal of Advanced Scholarly Research'}
DOI / URL: ${citationDoi || 'https://doi.org/10.1016/j.jasr.2024.10234'}

Also provide:
1. In-text parenthetical citation example.
2. In-text narrative citation example.
3. Citation verification checklist: Explain how to check this paper's peer-review status on Web of Science, Scopus, or CrossRef.`;
    } else if (tool.id === 'paraphraser' || tool.id === 'grammar-improver' || tool.id === 'summarizer') {
      prompt = `${tool.placeholderPrompt}

Input Text to Process:
"""
${userPromptInput}
"""

Academic Level: ${academicLevel}
Writing Style: ${writingStyle}
Target Academic Field: ${fieldOfStudy}

Provide the polished academic version along with a brief explanation of stylistic and syntactical enhancements made.`;
    } else {
      prompt = `Execute the academic task: "${tool.name}"

Research Topic / Problem:
"${researchTopic}"

Field of Study: ${fieldOfStudy}
Academic Level: ${academicLevel}
Preferred Writing Style: ${writingStyle}
Target Output Length: ~${wordCount} words.

${userPromptInput ? `Additional researcher instructions / focus areas:\n${userPromptInput}\n` : ''}

CRITICAL SCHOLARLY INSTRUCTIONS:
- Structure with clear academic headings (##, ###), coherent scholarly paragraphs, and precise theoretical arguments.
- Maintain rigorous tone appropriate for ${academicLevel}.
- If literature or methodology is mentioned, provide concrete theoretical frameworks and remind researcher to verify empirical claims.`;
    }

    try {
      const res = await generateAcademicAiContent({
        prompt,
        model: activeModel,
        academicLevel,
        fieldOfStudy,
        writingStyle,
        toolType: tool.id,
        targetWordCount: wordCount,
        projectContext: `Project: ${activeProject.title} | Level: ${activeProject.academicLevel}`,
      });

      setOutputContent(res.content);
      setModelUsed(res.modelUsed);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed. Please verify API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                  {tool.name}
                </h2>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {tool.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tool.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Split into Configuration & Output */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Left Form Settings */}
          <div className="md:col-span-5 p-5 overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Research Topic / Subject Focus
              </label>
              <textarea
                rows={2}
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                placeholder="Core research subject or thesis focus"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Level
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Master's (M.Sc / M.A)">Master's</option>
                  <option value="Doctoral / Ph.D.">Doctoral / Ph.D.</option>
                  <option value="Postdoctoral & Faculty">Postdoctoral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Writing Style
                </label>
                <select
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value as WritingStyle)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Formal Academic">Formal Academic</option>
                  <option value="Empirical & Quantitative">Empirical</option>
                  <option value="Analytical & Rigorous">Analytical</option>
                  <option value="Critical & Qualitative">Critical</option>
                  <option value="Concise & Objective">Concise</option>
                </select>
              </div>
            </div>

            {/* Citation Assistant Specific Fields */}
            {tool.id === 'citation-assistant' ? (
              <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Bibliographic Metadata
                </p>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Authors</label>
                  <input
                    type="text"
                    placeholder="e.g., Vaswani, A., Shazeer, N., et al."
                    value={citationAuthors}
                    onChange={(e) => setCitationAuthors(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400">Year</label>
                    <input
                      type="text"
                      value={citationYear}
                      onChange={(e) => setCitationYear(e.target.value)}
                      className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400">Journal / Book</label>
                    <input
                      type="text"
                      placeholder="e.g., NeurIPS"
                      value={citationJournal}
                      onChange={(e) => setCitationJournal(e.target.value)}
                      className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">DOI / URL</label>
                  <input
                    type="text"
                    placeholder="e.g., 10.1007/s10618-021-00789-x"
                    value={citationDoi}
                    onChange={(e) => setCitationDoi(e.target.value)}
                    className="w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {tool.id === 'paraphraser' || tool.id === 'grammar-improver' || tool.id === 'summarizer'
                      ? 'Source Text to Process'
                      : 'Specific Guidance / Custom Prompt'}
                  </label>
                  <span className="text-[10px] text-slate-400">Target: ~{wordCount} words</span>
                </div>
                <textarea
                  rows={4}
                  value={userPromptInput}
                  onChange={(e) => setUserPromptInput(e.target.value)}
                  placeholder={tool.placeholderPrompt}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}

            {/* Target Workspace Section selector */}
            {tool.targetSection && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Paper Section
                </label>
                <select
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value as SectionKey)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="title">Title</option>
                  <option value="abstract">Abstract</option>
                  <option value="introduction">Introduction</option>
                  <option value="literature_review">Literature Review</option>
                  <option value="methodology">Research Methodology</option>
                  <option value="results">Results</option>
                  <option value="discussion">Discussion</option>
                  <option value="conclusion">Conclusion</option>
                  <option value="references">References</option>
                </select>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with Gemma AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>

          {/* Right Output Panel */}
          <div className="md:col-span-7 flex flex-col bg-slate-50 dark:bg-slate-950/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>AI Scholarly Output</span>
              </span>
              {modelUsed && (
                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                  {modelUsed}
                </span>
              )}
            </div>

            {/* Output Scrollable Area */}
            <div className="flex-1 p-5 overflow-y-auto font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {isGenerating ? (
                <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Applying scholarly guidelines and synthesizing academic content...
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Gemma AI is structuring research logic, checking methodology alignment, and formatting output.
                  </p>
                </div>
              ) : outputContent ? (
                outputContent
              ) : (
                <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-medium">Ready to generate</p>
                  <p className="text-xs max-w-xs">
                    Click "Generate Content" on the left to invoke Gemma AI with your custom research parameters.
                  </p>
                </div>
              )}
            </div>

            {/* Output Actions */}
            {outputContent && (
              <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>

                {tool.targetSection && (
                  <button
                    onClick={() => {
                      onInsertToSection(targetSection, outputContent);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Insert into {targetSection.replace('_', ' ')}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
