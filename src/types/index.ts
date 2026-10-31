export type AcademicLevel = 
  | 'Undergraduate'
  | "Master's (M.Sc / M.A)"
  | 'Doctoral / Ph.D.'
  | 'Postdoctoral & Faculty';

export type WritingStyle = 
  | 'Formal Academic'
  | 'Analytical & Rigorous'
  | 'Empirical & Quantitative'
  | 'Critical & Qualitative'
  | 'Concise & Objective';

export type DocumentType = 
  | 'Original Research Paper'
  | 'Master Thesis / Dissertation'
  | 'Research Proposal / Grant Application'
  | 'Systematic Literature Review'
  | 'Conference Abstract'
  | 'Term Paper / Academic Essay';

export type SectionKey =
  | 'title'
  | 'abstract'
  | 'introduction'
  | 'literature_review'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'references';

export interface SectionData {
  id: SectionKey;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  wordCount: number;
  lastModified: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  fieldOfStudy: string;
  department: string;
  academicLevel: AcademicLevel;
  keywords: string[];
  writingStyle: WritingStyle;
  documentType: DocumentType;
  targetWordCount: number;
  sections: Record<SectionKey, SectionData>;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedTopic {
  id: string;
  title: string;
  rationale: string;
  feasibilityScore: string;
  targetMethodology: string;
  keyVariables: string[];
  expandedDetails?: string;
  suggestedQuestions?: string[];
  suggestedObjectives?: string[];
  suggestedOutline?: string[];
}

export interface ResearchModeResult {
  topic: string;
  field: string;
  academicLevel: string;
  topicBreakdown: string[];
  coreVariables: { independent: string[]; dependent: string[]; moderating?: string[] };
  importantConcepts: { term: string; definition: string }[];
  suggestedQuestions: {
    primary: string;
    secondary: string[];
    quantitative?: string;
    qualitative?: string;
  };
  suggestedMethodology: {
    approach: string;
    dataCollection: string;
    sampling: string;
    analysisInstruments: string[];
  };
  knowledgeGaps: string[];
  structureBlueprint: { section: string; focus: string; estimatedLength: string }[];
  generatedAt: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'Ideation & Framing' | 'Drafting Sections' | 'Refinement & Editing' | 'Methodology & Citations';
  iconName: string;
  targetSection?: SectionKey;
  placeholderPrompt: string;
  inputGuidance: string;
}
