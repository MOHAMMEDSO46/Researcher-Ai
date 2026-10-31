import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Search,
  FolderKanban,
  FileDown,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  FileText,
  Printer,
  FileCode,
  Check,
  Cpu,
} from 'lucide-react';
import { ResearchProject } from '../types';
import { exportToWordDocument, downloadPlainText, compileProjectToMarkdown, printToPdf } from '../utils/exportUtils';

interface NavbarProps {
  currentTab: 'workspace' | 'tools' | 'topics' | 'research-mode' | 'projects';
  setCurrentTab: (tab: 'workspace' | 'tools' | 'topics' | 'research-mode' | 'projects') => void;
  activeProject: ResearchProject;
  projects: ResearchProject[];
  setActiveProjectId: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenIntegrityModal: () => void;
  activeModel: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeProject,
  projects,
  setActiveProjectId,
  darkMode,
  setDarkMode,
  onOpenIntegrityModal,
  activeModel,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleCopyCompiled = () => {
    const text = compileProjectToMarkdown(activeProject);
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Tag */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentTab('workspace')}
              className="flex items-center space-x-3 group focus:outline-none text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white font-serif">
                    Research<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <Cpu className="w-2.5 h-2.5 mr-1" />
                    Gemma
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                  Scholarly Writing & Research Platform
                </p>
              </div>
            </button>

            {/* Active Project Selector */}
            <div className="hidden lg:relative lg:block">
              <button
                onClick={() => setShowProjectPicker(!showProjectPicker)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors max-w-[280px]"
              >
                <FolderKanban className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                <span className="truncate">{activeProject.title || 'Untitled Project'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {showProjectPicker && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Active Projects
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {projects.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          setActiveProjectId(proj.id);
                          setShowProjectPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start justify-between ${
                          proj.id === activeProject.id
                            ? 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50/50 dark:bg-indigo-950/20'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="pr-2">
                          <p className="line-clamp-1">{proj.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{proj.fieldOfStudy}</p>
                        </div>
                        {proj.id === activeProject.id && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1 px-2">
                    <button
                      onClick={() => {
                        setCurrentTab('projects');
                        setShowProjectPicker(false);
                      }}
                      className="w-full text-center py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      Manage All Projects →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentTab('workspace')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'workspace'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Workspace</span>
            </button>

            <button
              onClick={() => setCurrentTab('topics')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'topics'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Topic Generator</span>
            </button>

            <button
              onClick={() => setCurrentTab('tools')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'tools'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>AI Tools</span>
            </button>

            <button
              onClick={() => setCurrentTab('research-mode')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                currentTab === 'research-mode'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-500" />
              <span>Research Mode</span>
            </button>

            <button
              onClick={() => setCurrentTab('projects')}
              className={`hidden md:flex px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors items-center space-x-1.5 ${
                currentTab === 'projects'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </button>
          </nav>

          {/* Action Buttons: Export, Integrity, Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Academic Integrity Button */}
            <button
              onClick={onOpenIntegrityModal}
              title="Academic Integrity & Ethics"
              className="p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 transition-colors flex items-center space-x-1 text-xs font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">Integrity</span>
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Export Document
                  </div>
                  <button
                    onClick={() => {
                      exportToWordDocument(activeProject);
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2.5"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Microsoft Word (.doc)</p>
                      <p className="text-[10px] text-slate-400">Formatted with headers & styles</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      printToPdf();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2.5"
                  >
                    <Printer className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="font-medium">PDF Print / Save</p>
                      <p className="text-[10px] text-slate-400">Standard academic 1-inch margins</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      downloadPlainText(
                        `${activeProject.title || 'Research_Paper'}.md`,
                        compileProjectToMarkdown(activeProject)
                      );
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2.5"
                  >
                    <FileCode className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Markdown / Plain Text</p>
                      <p className="text-[10px] text-slate-400">Universal research raw text</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={handleCopyCompiled}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2.5"
                  >
                    {copiedNotification ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    )}
                    <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Full Manuscript'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
