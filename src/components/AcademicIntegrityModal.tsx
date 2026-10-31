import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  FileCheck,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ACADEMIC_INTEGRITY_CHECKLIST, UNIVERSITY_AI_DECLARATION_TEMPLATE } from '../utils/academicEthics';

interface AcademicIntegrityModalProps {
  onClose: () => void;
}

export const AcademicIntegrityModal: React.FC<AcademicIntegrityModalProps> = ({ onClose }) => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [copiedDeclaration, setCopiedDeclaration] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyDeclaration = () => {
    navigator.clipboard.writeText(UNIVERSITY_AI_DECLARATION_TEMPLATE.trim());
    setCopiedDeclaration(true);
    setTimeout(() => setCopiedDeclaration(false), 2000);
  };

  const allChecked = checkedIds.size === ACADEMIC_INTEGRITY_CHECKLIST.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Academic Integrity & Responsible AI Protocol
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ethical guidelines for university students, researchers, and faculty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            ✕
          </button>
        </div>

        {/* Core Notice */}
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed mb-6">
          <p className="font-bold mb-1 text-indigo-950 dark:text-indigo-100">
            Core Position: AI as an Intellectual Co-Pilot, Not an Author Proxy
          </p>
          <p>
            ResearchAI is designed exclusively to help researchers brainstorm ideas, structure complex methodologies, identify literature gaps, and refine syntax. It is <strong>not</strong> a tool for submitting unreviewed AI-generated prose. Submitting automated AI outputs without critical intellectual synthesis and verification violates university academic honor codes.
          </p>
        </div>

        {/* Verification Checklist (Requirement 9) */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Mandatory Pre-Submission Verification Checklist
          </h4>

          <div className="space-y-2.5">
            {ACADEMIC_INTEGRITY_CHECKLIST.map((item) => {
              const isChecked = checkedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`cursor-pointer p-3 rounded-xl border text-xs transition-colors flex items-start space-x-3 ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${isChecked ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-900 dark:text-white'}`}>
                      {item.label}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* University AI Declaration Statement */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-indigo-500" />
              <span>Standard Institutional AI Declaration Statement</span>
            </span>
            <button
              onClick={handleCopyDeclaration}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center space-x-1"
            >
              {copiedDeclaration ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDeclaration ? 'Copied' : 'Copy Statement'}</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-academic italic leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            {UNIVERSITY_AI_DECLARATION_TEMPLATE.trim()}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {checkedIds.size} of {ACADEMIC_INTEGRITY_CHECKLIST.length} standards verified
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors"
          >
            I Acknowledge & Comply
          </button>
        </div>
      </div>
    </div>
  );
};
