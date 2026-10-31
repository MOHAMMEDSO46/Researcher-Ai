/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { ToolsDashboard } from './components/ToolsDashboard';
import { TopicGeneratorView } from './components/TopicGeneratorView';
import { ResearchModeView } from './components/ResearchModeView';
import { ProjectManagerView } from './components/ProjectManagerView';
import { AcademicIntegrityModal } from './components/AcademicIntegrityModal';
import { INITIAL_PROJECTS, SECTION_METADATA } from './data/defaults';
import { ResearchProject, SectionKey } from './types';
import { fetchAiHealth } from './services/aiService';
import { Cpu, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY_PROJECTS = 'research_ai_projects_v1';
const STORAGE_KEY_ACTIVE_ID = 'research_ai_active_proj_v1';
const STORAGE_KEY_DARK_MODE = 'research_ai_dark_mode_v1';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DARK_MODE);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Projects state
  const [projects, setProjects] = useState<ResearchProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading projects from localStorage:', e);
    }
    return INITIAL_PROJECTS;
  });

  // Active project ID
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (saved && projects.some((p) => p.id === saved)) return saved;
    return projects[0]?.id || 'proj-ai-pedagogy-2026';
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<'workspace' | 'tools' | 'topics' | 'research-mode' | 'projects'>('workspace');

  // Academic Integrity modal
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);

  // Active AI Model
  const [activeModel, setActiveModel] = useState<string>('gemma-2-27b-it');
  const [aiHealthInfo, setAiHealthInfo] = useState<any>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_DARK_MODE, String(darkMode));
  }, [darkMode]);

  // Persist projects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Error saving projects to localStorage:', e);
    }
  }, [projects]);

  // Persist active project ID
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeProjectId);
  }, [activeProjectId]);

  // Fetch health check on mount
  useEffect(() => {
    fetchAiHealth().then((info) => {
      setAiHealthInfo(info);
      if (info?.preferredModel) {
        setActiveModel(info.preferredModel);
      }
    });
  }, []);

  // Current active project object
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECTS[0];

  // Update active project
  const handleUpdateProject = (updatedProject: ResearchProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  // Create new project
  const handleCreateProject = (newProject: ResearchProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setCurrentTab('workspace');
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id && remaining.length > 0) {
      setActiveProjectId(remaining[0].id);
    }
  };

  // Duplicate project
  const handleDuplicateProject = (id: string) => {
    const orig = projects.find((p) => p.id === id);
    if (!orig) return;

    const dup: ResearchProject = {
      ...orig,
      id: `proj-copy-${Date.now()}`,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [dup, ...prev]);
    setActiveProjectId(dup.id);
  };

  // Apply topic from Topic Generator to current project
  const handleApplyTopicToProject = (title: string, keywords: string[]) => {
    const updated: ResearchProject = {
      ...activeProject,
      title,
      keywords: keywords.length > 0 && keywords[0] ? keywords : activeProject.keywords,
      sections: {
        ...activeProject.sections,
        title: {
          ...activeProject.sections.title,
          content: `# ${title}\n\n**Discipline:** ${activeProject.fieldOfStudy}\n**Level:** ${activeProject.academicLevel}`,
          wordCount: title.split(/\s+/).length + 8,
          lastModified: new Date().toISOString(),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    handleUpdateProject(updated);
    setCurrentTab('workspace');
  };

  // Send content from any tool or modal directly into a workspace section
  const handleInsertToSection = (sectionKey: SectionKey, content: string) => {
    const currentSection = activeProject.sections[sectionKey] || {
      id: sectionKey,
      title: SECTION_METADATA[sectionKey]?.title || sectionKey,
      description: SECTION_METADATA[sectionKey]?.description || '',
      content: '',
      status: 'draft',
      wordCount: 0,
      lastModified: new Date().toISOString(),
    };

    const combined = currentSection.content.trim()
      ? `${currentSection.content}\n\n${content}`
      : content;

    const words = combined.trim() ? combined.trim().split(/\s+/).length : 0;

    const updated: ResearchProject = {
      ...activeProject,
      sections: {
        ...activeProject.sections,
        [sectionKey]: {
          ...currentSection,
          content: combined,
          wordCount: words,
          status: 'in_progress',
          lastModified: new Date().toISOString(),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    handleUpdateProject(updated);
    setCurrentTab('workspace');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeProject={activeProject}
        projects={projects}
        setActiveProjectId={setActiveProjectId}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenIntegrityModal={() => setShowIntegrityModal(true)}
        activeModel={activeModel}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'workspace' && (
          <DocumentWorkspace
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            activeModel={activeModel}
          />
        )}

        {currentTab === 'tools' && (
          <ToolsDashboard
            activeProject={activeProject}
            onInsertToSection={handleInsertToSection}
            onOpenTopicGenerator={() => setCurrentTab('topics')}
            activeModel={activeModel}
          />
        )}

        {currentTab === 'topics' && (
          <TopicGeneratorView
            activeProject={activeProject}
            onApplyTopicToProject={handleApplyTopicToProject}
            onSendToWorkspace={(sectionKey, text) => handleInsertToSection(sectionKey, text)}
            activeModel={activeModel}
          />
        )}

        {currentTab === 'research-mode' && (
          <ResearchModeView
            activeProject={activeProject}
            onSendToWorkspace={(sectionKey, text) => handleInsertToSection(sectionKey, text)}
            activeModel={activeModel}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectManagerView
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setCurrentTab('workspace');
            }}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicateProject}
          />
        )}
      </main>

      {/* Persistent Scholarly Bottom Bar with Model Status */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300 font-serif">
              ResearchAI Platform
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Model:</span>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="bg-transparent font-mono text-[11px] text-indigo-600 dark:text-indigo-400 border-none underline cursor-pointer focus:outline-none"
              >
                <option value="gemma-2-27b-it">Gemma 2 (27B Academic)</option>
                <option value="gemma-2-9b-it">Gemma 2 (9B Fast)</option>
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Deep Synthesis)</option>
              </select>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowIntegrityModal(true)}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Academic Integrity Policy</span>
            </button>
            <span>•</span>
            <span>Local Auto-Save Enabled</span>
          </div>
        </div>
      </footer>

      {/* Academic Integrity Modal */}
      {showIntegrityModal && (
        <AcademicIntegrityModal onClose={() => setShowIntegrityModal(false)} />
      )}
    </div>
  );
}
