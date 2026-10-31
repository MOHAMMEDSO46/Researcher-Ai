export interface IntegrityChecklistItem {
  id: string;
  label: string;
  description: string;
}

export const ACADEMIC_INTEGRITY_CHECKLIST: IntegrityChecklistItem[] = [
  {
    id: 'verify-citations',
    label: 'Primary Citation Verification',
    description: 'Ensure every empirical study, author, date, and statistic has been looked up and verified in primary databases (e.g., Scopus, PubMed, Web of Science, Google Scholar).',
  },
  {
    id: 'original-voice',
    label: 'Scholarly Voice & Critical Synthesis',
    description: 'Review and revise all AI-assisted prose into your authentic voice. AI models should brainstorm and structure, but the core analysis and intellectual judgment must be yours.',
  },
  {
    id: 'university-policy',
    label: 'Institutional & University Disclosure',
    description: 'Adhere to your department or university honor code regarding AI usage (e.g., acknowledging AI assistance in an "Acknowledgements" or "Author Contributions" section).',
  },
  {
    id: 'hallucination-audit',
    label: 'Factual & Hallucination Audit',
    description: 'Verify all mathematical derivations, chemical formulas, legal statutes, and empirical values. Large language models generate probabilistic text that may sound plausible but be inaccurate.',
  },
  {
    id: 'avoid-plagiarism',
    label: 'Plagiarism & Turnitin Screening',
    description: 'Run your final manuscript through your institution’s approved similarity software to ensure proper paraphrasing, quotation marks, and distinct sentence construction.',
  },
];

export const UNIVERSITY_AI_DECLARATION_TEMPLATE = `
**AI Assistance Acknowledgment Statement (Recommended for Thesis/Paper Submissions):**
"During the preparation of this manuscript, the author(s) utilized ResearchAI (powered by Google Gemma / Gemini AI models) for the purposes of preliminary topic brainstorming, literature structure organization, and stylistic proofreading. All generated text was critically evaluated, fact-checked against primary scholarly sources, and revised by the author(s). The author(s) take full intellectual and ethical responsibility for the veracity, data interpretations, and conclusions presented in this work."
`;
