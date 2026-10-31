import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ResearchProject, AcademicLevel, WritingStyle, DocumentType, SectionKey } from '../types';
import { ACADEMIC_DISCIPLINES, SECTION_ORDER, SECTION_METADATA } from '../data/defaults';

interface ProjectManagerViewProps {
  projects: ResearchProject[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (project: ResearchProject) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
}

export const ProjectManagerView: React.FC<ProjectManagerViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newField, setNewField] = useState(ACADEMIC_DISCIPLINES[0]);
  const [newDepartment, setNewDepartment] = useState('');
  const [newLevel, setNewLevel] = useState<AcademicLevel>("Master's (M.Sc / M.A)");
  const [newDocType, setNewDocType] = useState<DocumentType>('Original Research Paper');
  const [newStyle, setNewStyle] = useState<WritingStyle>('Formal Academic');
  const [newTargetWords, setNewTargetWords] = useState<number>(8000);
  const [newKeywords, setNewKeywords] = useState('');

  const filteredProjects = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fieldOfStudy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Build initial blank sections
    const initialSections = SECTION_ORDER.reduce((acc, key) => {
      acc[key] = {
        id: key,
        title: SECTION_METADATA[key].title,
        description: SECTION_METADATA[key].description,
        content: key === 'title' ? `# ${newTitle}\n\n**Discipline:** ${newField}\n**Level:** ${newLevel}` : '',
        status: key === 'title' ? 'completed' : 'not_started',
        wordCount: key === 'title' ? 10 : 0,
        lastModified: new Date().toISOString(),
      };
      return acc;
    }, {} as Record<SectionKey, any>);

    const newProject: ResearchProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      fieldOfStudy: newField,
      department: newDepartment.trim(),
      academicLevel: newLevel,
      documentType: newDocType,
      writingStyle: newStyle,
      targetWordCount: newTargetWords || 8000,
      keywords: newKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      sections: initialSections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateProject(newProject);
    setShowCreateModal(false);
    // Reset form
    setNewTitle('');
    setNewDepartment('');
    setNewKeywords('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2 border border-indigo-200 dark:border-indigo-800">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Research Project Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">
            Manage Research Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize ongoing theses, dissertations, empirical manuscripts, and grant proposals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isActive = project.id === activeProjectId;
          const totalWords = Object.values(project.sections).reduce((sum, s) => sum + (s.wordCount || 0), 0);
          const completedSections = Object.values(project.sections).filter((s) => s.status === 'completed').length;
          const progressPercent = Math.min(100, Math.round((totalWords / (project.targetWordCount || 8000)) * 100));

          return (
            <div
              key={project.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm transition-all flex flex-col justify-between group ${
                isActive
                  ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Meta pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {project.academicLevel}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                      Active Workspace
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {project.fieldOfStudy}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
                    <span>{totalWords.toLocaleString()} words</span>
                    <span>{completedSections}/9 sections completed</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Keywords tags */}
                {project.keywords.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {project.keywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onDuplicateProject(project.id)}
                    title="Duplicate Project"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete project: "${project.title}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onSelectProject(project.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <span>{isActive ? 'Continue Writing' : 'Open Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                <FolderKanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Create Research Project</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title or Working Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cross-Lingual Evaluation of Transformer Architectures"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Discipline
                </label>
                <select
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {ACADEMIC_DISCIPLINES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as AcademicLevel)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Master's (M.Sc / M.A)">Master's</option>
                    <option value="Doctoral / Ph.D.">Doctoral / Ph.D.</option>
                    <option value="Postdoctoral & Faculty">Postdoctoral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Format
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Original Research Paper">Research Paper</option>
                    <option value="Master Thesis / Dissertation">Thesis / Dissertation</option>
                    <option value="Research Proposal / Grant Application">Grant Proposal</option>
                    <option value="Systematic Literature Review">Literature Review</option>
                    <option value="Term Paper / Academic Essay">Term Paper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Word Count
                  </label>
                  <input
                    type="number"
                    value={newTargetWords}
                    onChange={(e) => setNewTargetWords(Number(e.target.value))}
                    step={500}
                    min={500}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Writing Style
                  </label>
                  <select
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value as WritingStyle)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Formal Academic">Formal Academic</option>
                    <option value="Empirical & Quantitative">Empirical</option>
                    <option value="Analytical & Rigorous">Analytical</option>
                    <option value="Critical & Qualitative">Critical</option>
                    <option value="Concise & Objective">Concise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Natural Language Processing, Cross-Lingual, Transformers"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
