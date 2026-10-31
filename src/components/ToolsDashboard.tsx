import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  FileSpreadsheet,
  HelpCircle,
  Target,
  BookOpen,
  FileText,
  FlaskConical,
  ListOrdered,
  Feather,
  CheckCircle2,
  Repeat,
  SpellCheck,
  AlignLeft,
  Quote,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { ToolDefinition, ResearchProject, SectionKey } from '../types';
import { AI_TOOLS } from '../data/defaults';
import { ToolExecutionModal } from './ToolExecutionModal';

interface ToolsDashboardProps {
  activeProject: ResearchProject;
  onInsertToSection: (sectionKey: SectionKey, content: string) => void;
  onOpenTopicGenerator: () => void;
  activeModel: string;
}

export const ToolsDashboard: React.FC<ToolsDashboardProps> = ({
  activeProject,
  onInsertToSection,
  onOpenTopicGenerator,
  activeModel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);

  const categories = ['All', 'Ideation & Framing', 'Drafting Sections', 'Refinement & Editing', 'Methodology & Citations'];

  const filteredTools = AI_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-indigo-500" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case 'Target':
        return <Target className="w-5 h-5 text-emerald-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-cyan-500" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-violet-500" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-rose-500" />;
      case 'ListOrdered':
        return <ListOrdered className="w-5 h-5 text-orange-500" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-sky-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-emerald-600" />;
      case 'SpellCheck':
        return <SpellCheck className="w-5 h-5 text-pink-500" />;
      case 'AlignLeft':
        return <AlignLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
      case 'Quote':
        return <Quote className="w-5 h-5 text-indigo-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleToolClick = (tool: ToolDefinition) => {
    if (tool.id === 'topic-generator') {
      onOpenTopicGenerator();
    } else {
      setSelectedTool(tool);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2 border border-indigo-200 dark:border-indigo-800">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Research Assistant Suite • 14 Specialized Modules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">
            Academic Research Tools Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Click any tool to launch guided AI synthesis calibrated for your active research project: <span className="font-medium text-slate-700 dark:text-slate-300">"{activeProject.title}"</span>.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search research tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Tools Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                  {getToolIcon(tool.iconName)}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {tool.category.split(' ')[0]}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <span>{tool.targetSection ? `Targets ${tool.targetSection}` : 'General Assistant'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Modal */}
      {selectedTool && (
        <ToolExecutionModal
          tool={selectedTool}
          activeProject={activeProject}
          onClose={() => setSelectedTool(null)}
          onInsertToSection={onInsertToSection}
          activeModel={activeModel}
        />
      )}
    </div>
  );
};
