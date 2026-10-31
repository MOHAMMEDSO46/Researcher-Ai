import { ResearchProject, ToolDefinition, SectionKey } from '../types';

export const SECTION_ORDER: SectionKey[] = [
  'title',
  'abstract',
  'introduction',
  'literature_review',
  'methodology',
  'results',
  'discussion',
  'conclusion',
  'references',
];

export const SECTION_METADATA: Record<SectionKey, { title: string; description: string; targetShare: string }> = {
  title: {
    title: 'Title & Running Header',
    description: 'Specific, concise statement of the primary investigation and scope.',
    targetShare: '1-2 lines',
  },
  abstract: {
    title: 'Abstract & Keywords',
    description: 'Comprehensive 150-300 word synthesis of problem, methodology, findings, and implications.',
    targetShare: '5% of total',
  },
  introduction: {
    title: 'Introduction & Background',
    description: 'Contextualizes the research problem, scholarly debate, and theoretical significance.',
    targetShare: '10-15% of total',
  },
  literature_review: {
    title: 'Literature Review',
    description: 'Critical thematic synthesis of prior empirical findings, theoretical paradigms, and gaps.',
    targetShare: '25-30% of total',
  },
  methodology: {
    title: 'Research Methodology',
    description: 'Philosophical stance, research design, population, sampling, instruments, and ethical protocols.',
    targetShare: '15-20% of total',
  },
  results: {
    title: 'Results / Findings',
    description: 'Objective presentation of empirical findings, statistical tests, or qualitative themes.',
    targetShare: '15-20% of total',
  },
  discussion: {
    title: 'Discussion & Interpretation',
    description: 'Critical interpretation of findings against prior literature, theoretical implications, and limits.',
    targetShare: '15% of total',
  },
  conclusion: {
    title: 'Conclusion & Recommendations',
    description: 'Culminating takeaways, practical and policy recommendations, and future research agendas.',
    targetShare: '5-10% of total',
  },
  references: {
    title: 'References & Bibliography',
    description: 'Exhaustive bibliography in designated scholarly format (APA 7th, MLA, IEEE, Chicago).',
    targetShare: 'As required',
  },
};

export const AI_TOOLS: ToolDefinition[] = [
  {
    id: 'topic-generator',
    name: 'Project Topic Generator',
    description: 'Brainstorm viable, novel, and rigorously formulated academic project topics with feasibility scores.',
    category: 'Ideation & Framing',
    iconName: 'Sparkles',
    targetSection: 'title',
    placeholderPrompt: 'Generate 5 researchable, high-impact dissertation topics in Deep Learning for Healthcare focusing on rare disease diagnostics.',
    inputGuidance: 'Specify your academic discipline, primary area of interest, and target research methodology.',
  },
  {
    id: 'proposal-generator',
    name: 'Research Proposal Generator',
    description: 'Draft structured grant proposals, dissertation prospectuses, and institutional review frameworks.',
    category: 'Ideation & Framing',
    iconName: 'FileSpreadsheet',
    targetSection: 'introduction',
    placeholderPrompt: 'Create a formal research proposal for an investigation on Micro-mobility integration in European metropolitan transit networks.',
    inputGuidance: 'Provide problem statement, theoretical framework, planned sample, and anticipated contributions.',
  },
  {
    id: 'question-generator',
    name: 'Research Question Generator',
    description: 'Formulate overarching central questions, secondary quantitative sub-questions, and qualitative inquiries.',
    category: 'Ideation & Framing',
    iconName: 'HelpCircle',
    targetSection: 'introduction',
    placeholderPrompt: 'Formulate primary and secondary research questions exploring the impact of generative AI on university student critical thinking.',
    inputGuidance: 'Define your independent and dependent variables, population, and research design paradigm.',
  },
  {
    id: 'objectives-generator',
    name: 'Research Objectives Generator',
    description: 'Produce SMART research objectives aligned precisely with hypotheses and methodological execution.',
    category: 'Ideation & Framing',
    iconName: 'Target',
    targetSection: 'introduction',
    placeholderPrompt: 'Generate 1 general objective and 4 specific objectives for an empirical study on renewable energy microgrid adoption in sub-Saharan Africa.',
    inputGuidance: 'List research questions or hypotheses that your objectives must address.',
  },
  {
    id: 'lit-review',
    name: 'Literature Review Assistant',
    description: 'Synthesize academic debates, identify thematic paradigms, and articulate critical research gaps.',
    category: 'Drafting Sections',
    iconName: 'BookOpen',
    targetSection: 'literature_review',
    placeholderPrompt: 'Draft a critical thematic literature review on self-supervised contrastive learning in medical imaging over the last five years.',
    inputGuidance: 'Specify key authors, theoretical frameworks, conflicting schools of thought, or thematic subheadings.',
  },
  {
    id: 'abstract-generator',
    name: 'Abstract Generator',
    description: 'Condense an entire thesis or paper into a structured 250-word academic abstract with key takeaways.',
    category: 'Drafting Sections',
    iconName: 'FileText',
    targetSection: 'abstract',
    placeholderPrompt: 'Generate a structured academic abstract (Background, Objectives, Methods, Results, Conclusions) based on our study findings.',
    inputGuidance: 'Paste your project highlights, research question, key methods, and main statistical or thematic findings.',
  },
  {
    id: 'methodology-assistant',
    name: 'Research Methodology Assistant',
    description: 'Formulate sampling strategies, instrumentation, operational definitions, and validity measures.',
    category: 'Methodology & Citations',
    iconName: 'FlaskConical',
    targetSection: 'methodology',
    placeholderPrompt: 'Design a mixed-methods sequential explanatory research methodology for evaluating telemedicine efficacy among geriatric cohorts.',
    inputGuidance: 'Detail your data collection tools, participant criteria, statistical software (R/SPSS), and ethical clearance steps.',
  },
  {
    id: 'outline-generator',
    name: 'Paper Outline Generator',
    description: 'Construct a chapter-by-chapter or section-by-section hierarchical blueprint adhering to scholarly standards.',
    category: 'Ideation & Framing',
    iconName: 'ListOrdered',
    targetSection: 'introduction',
    placeholderPrompt: 'Create a comprehensive 6-chapter dissertation outline for an empirical study on algorithmic bias in automated hiring pipelines.',
    inputGuidance: 'Include academic level, word target, and specific institutional formatting requirements.',
  },
  {
    id: 'introduction-generator',
    name: 'Introduction Generator',
    description: 'Draft compelling scholarly introductions utilizing the Swales CARS (Create a Research Space) model.',
    category: 'Drafting Sections',
    iconName: 'Feather',
    targetSection: 'introduction',
    placeholderPrompt: 'Write an authoritative academic introduction establishing research territory, niche gap, and the present study purpose.',
    inputGuidance: 'State the societal relevance, existing research dilemma, and your theoretical intervention.',
  },
  {
    id: 'conclusion-generator',
    name: 'Conclusion Generator',
    description: 'Synthesize overarching contributions, delineate theoretical boundaries, and outline policy directives.',
    category: 'Drafting Sections',
    iconName: 'CheckCircle2',
    targetSection: 'conclusion',
    placeholderPrompt: 'Generate an academic conclusion summarizing key findings, acknowledging 3 methodological limitations, and proposing future research directions.',
    inputGuidance: 'Provide brief summaries of your primary findings and theoretical takeaways.',
  },
  {
    id: 'paraphraser',
    name: 'Academic Paraphrasing Tool',
    description: 'Rephrase complex academic arguments into refined scholarly prose while preserving precise semantics.',
    category: 'Refinement & Editing',
    iconName: 'Repeat',
    placeholderPrompt: 'Paraphrase this passage to enhance academic elegance, eliminate informal syntax, and improve sentence variety.',
    inputGuidance: 'Paste the source text you wish to restate in high-register academic language.',
  },
  {
    id: 'grammar-improver',
    name: 'Grammar & Style Improver',
    description: 'Diagnose stylistic ambiguities, passive voice overuse, colloquialisms, and hedged assertions.',
    category: 'Refinement & Editing',
    iconName: 'SpellCheck',
    placeholderPrompt: 'Critique and polish this academic paragraph: eliminate redundancies, strengthen scholarly voice, and check syntax.',
    inputGuidance: 'Paste your draft text for comprehensive academic proofreading and stylistic refinement.',
  },
  {
    id: 'summarizer',
    name: 'Text Summarizer',
    description: 'Distill lengthy papers, chapters, or conference proceedings into executive research briefs.',
    category: 'Refinement & Editing',
    iconName: 'AlignLeft',
    placeholderPrompt: 'Provide an executive academic summary of the following research paper, highlighting research questions, methodology, and key contributions.',
    inputGuidance: 'Paste the full excerpt or draft section you need synthesized.',
  },
  {
    id: 'citation-assistant',
    name: 'Citation & Reference Assistant',
    description: 'Generate, convert, and format bibliographies in APA 7th, MLA 9th, Chicago 17th, IEEE, and Harvard styles.',
    category: 'Methodology & Citations',
    iconName: 'Quote',
    targetSection: 'references',
    placeholderPrompt: 'Format the following bibliographic metadata into APA 7th edition and generate a corresponding in-text citation.',
    inputGuidance: 'Enter author name(s), publication year, article title, journal, volume, page range, and DOI.',
  },
];

export const ACADEMIC_DISCIPLINES = [
  'Computer Science & Artificial Intelligence',
  'Biomedical Engineering & Health Sciences',
  'Economics, Finance & Management',
  'Environmental Sciences & Sustainability',
  'Psychology, Neuroscience & Cognitive Science',
  'Education & Pedagogical Technology',
  'Law, Governance & Public Policy',
  'Sociology, Anthropology & Social Work',
  'Electrical, Mechanical & Civil Engineering',
  'Literature, Philosophy & Cultural Studies',
  'Multidisciplinary / Interdisciplinary Studies',
];

export const INITIAL_PROJECTS: ResearchProject[] = [
  {
    id: 'proj-ai-pedagogy-2026',
    title: 'Evaluating the Pedagogical Impact of Generative Artificial Intelligence on Critical Reasoning in Undergraduate STEM Education',
    fieldOfStudy: 'Education & Pedagogical Technology',
    department: 'Department of Curriculum and Instruction',
    academicLevel: "Master's (M.Sc / M.A)",
    keywords: ['Generative AI', 'STEM Pedagogy', 'Critical Thinking', 'Higher Education', 'Cognitive Load Theory'],
    writingStyle: 'Empirical & Quantitative',
    documentType: 'Original Research Paper',
    targetWordCount: 8000,
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-31T06:15:00.000Z',
    sections: {
      title: {
        id: 'title',
        title: 'Title & Running Header',
        description: 'Specific, concise statement of the primary investigation and scope.',
        content: '# Evaluating the Pedagogical Impact of Generative Artificial Intelligence on Critical Reasoning in Undergraduate STEM Education\n\n**Author:** Research Scholar\n**Affiliation:** Faculty of Graduate Studies\n**Date:** October 2026\n**Keywords:** Generative AI, STEM Pedagogy, Critical Thinking, Cognitive Load Theory, Higher Education',
        status: 'completed',
        wordCount: 38,
        lastModified: '2026-10-20T10:00:00.000Z',
      },
      abstract: {
        id: 'abstract',
        title: 'Abstract & Keywords',
        description: 'Comprehensive 150-300 word synthesis of problem, methodology, findings, and implications.',
        content: `### Abstract

The rapid integration of Large Language Models (LLMs) into higher education has prompted contentious debates regarding student cognitive agency and critical problem-solving faculties. This empirical study investigates the impact of instructional scaffolding with generative AI tools on undergraduate STEM students' critical reasoning competencies. Utilizing a quasi-experimental pretest-posttest control group design across four consecutive academic semesters (N = 342), participants engaged in structured algorithmic problem-solving tasks under either an unassisted baseline condition, an open generative AI environment, or a metacognitively guided AI scaffold. 

Critical reasoning was evaluated using the Watson-Glaser Critical Thinking Appraisal alongside domain-specific conceptual evaluation rubrics. Quantitative multivariate analysis of covariance (MANCOVA) revealed statistically significant advantages for the metacognitively guided cohort in deductive reasoning (F(2, 338) = 14.82, p < .001, ηp² = 0.081) and assumption recognition, whereas unguided AI access resulted in negligible gains and heightened cognitive offloading. These findings demonstrate that while generative AI introduces risks of intellectual passivity, structured pedagogical scaffolding can transform conversational models into dialectical cognitive tools that enrich analytical rigor.`,
        status: 'completed',
        wordCount: 174,
        lastModified: '2026-10-24T14:30:00.000Z',
      },
      introduction: {
        id: 'introduction',
        title: 'Introduction & Background',
        description: 'Contextualizes the research problem, scholarly debate, and theoretical significance.',
        content: `## 1. Introduction

Higher education is navigating a transformative inflection point precipitated by generative artificial intelligence. The deployment of conversational LLMs has dismantled conventional assumptions regarding student authorship, independent research, and formative assessment. In STEM disciplines, where analytical deduction and multi-step algorithmic derivation form the foundation of pedagogical training, scholars have expressed dual concerns: the potential atrophy of foundational problem-solving intuition and the emergence of academic integrity vulnerabilities.

However, viewing generative tools exclusively through the lens of assessment security overlooks their latent potential as personalized cognitive apprentices. According to Cognitive Load Theory (Sweller, 2011), when instructional design deliberately partitions extraneous cognitive burdens, learners can dedicate germane cognitive resources toward higher-order schema acquisition. The central paradox confronting contemporary educators is whether unconstrained access to synthetic reasoning engines undermines or bolsters these internal schemas.

### 1.1 Problem Statement
While preliminary literature has examined student attitudes toward AI chatbots (Kasneci et al., 2023), rigorous longitudinal empirical assessments evaluating measured cognitive gains remain sparse. Specifically, current inquiries lack empirical controls distinguishing unguided technological reliance from pedagogically mediated, inquiry-based AI interactions.

### 1.2 Research Questions
1. **RQ1:** To what extent does instructional scaffolding with generative AI influence undergraduate STEM students' deductive reasoning and assumption recognition compared to unassisted instruction?
2. **RQ2:** How does the frequency of dialectical interaction with AI models correlate with student conceptual retention across longitudinal retention intervals?`,
        status: 'completed',
        wordCount: 228,
        lastModified: '2026-10-25T11:20:00.000Z',
      },
      literature_review: {
        id: 'literature_review',
        title: 'Literature Review',
        description: 'Critical thematic synthesis of prior empirical findings, theoretical paradigms, and gaps.',
        content: `## 2. Literature Review

### 2.1 Theoretical Framework: Metacognitive Scaffolding & Cognitive Load
The conceptual grounding of this inquiry rests at the nexus of Vygotskian sociocultural theory (Vygotsky, 1978) and Cognitive Load Theory (Sweller et al., 2019). The Zone of Proximal Development (ZPD) postulates that learning occurs most effectively when individuals are supported by a More Knowledgeable Other (MKO). In digital learning paradigms, algorithmic dialogue agents function as semi-autonomous MKOs. However, Pea's (1985) seminal distinction between cognitive *offloading* and *cognitive distribution* underscores that technology can either supplant cognitive effort or amplify human intellect depending on intentionality of design.

### 2.2 Generative AI in Academic Contexts
Early scholarship post-2022 documented initial institutional shocks, focusing predominantly on detection mechanisms and plagiarism deterrence (Cotton et al., 2023). Subsequent empirical scholarship transitioned toward pedagogical affordances. For instance, Mollick and Mollick (2023) highlighted prompt-based co-intelligence, demonstrating that iterative self-explanation prompts foster reflective critique. Nevertheless, Baidoo-Anu and Ansah (2023) cautioned against cognitive complacency, noting that learners frequently misattribute authoritative hallucinated responses as validated empirical ground truth.

### 2.3 Research Gap
Existing empirical studies are largely cross-sectional surveys measuring perceived usefulness rather than controlled psychometric assessments of cognitive reasoning. This study addresses this empirical void through standardized experimental measurement.`,
        status: 'in_progress',
        wordCount: 204,
        lastModified: '2026-10-28T09:45:00.000Z',
      },
      methodology: {
        id: 'methodology',
        title: 'Research Methodology',
        description: 'Philosophical stance, research design, population, sampling, instruments, and ethical protocols.',
        content: `## 3. Research Methodology

### 3.1 Research Design
This investigation employed a quasi-experimental pretest-posttest control group design with three comparative conditions:
1. **Control Group (Condition A):** Conventional computer-assisted learning without AI assistance.
2. **Unguided AI Group (Condition B):** Free, self-directed access to Gemma and frontier LLMs during problem sets.
3. **Scaffolded AI Group (Condition C):** Access to an inquiry-guided AI interface calibrated to ask Socratic clarifying questions rather than providing direct solutions.

### 3.2 Participants and Sampling
A convenience sample of undergraduate STEM majors (N = 342) enrolled across Introductory Data Structures and Calculus III modules at an R1 public research university was recruited. Demographic distributions comprised 58% male, 39% female, and 3% non-binary participants (Mean age = 20.4, SD = 1.8).

### 3.3 Instrumentation & Validity
- **Critical Reasoning:** Watson-Glaser Critical Thinking Appraisal (Form S), measuring inference, recognition of assumptions, deduction, interpretation, and evaluation of arguments (Cronbach's alpha = .84).
- **Domain Competency:** 25-item standardized problem sets validated through panel review of four tenured computer science professors.
- **Cognitive Load:** Paas Subjective Mental Effort Scale (9-point Likert).`,
        status: 'in_progress',
        wordCount: 184,
        lastModified: '2026-10-29T16:15:00.000Z',
      },
      results: {
        id: 'results',
        title: 'Results / Findings',
        description: 'Objective presentation of empirical findings, statistical tests, or qualitative themes.',
        content: `## 4. Results

Prior to hypothesis testing, data distributions were verified for univariate normality via Shapiro-Wilk tests and homogeneity of variance-covariance matrices via Box's M test (M = 12.4, p = .28).

A one-way MANCOVA was executed with pre-intervention Watson-Glaser baseline scores serving as the covariate. Statistically significant multivariate differences emerged between instructional conditions (Pillai's Trace = .184, F(4, 676) = 17.21, p < .001). Univariate follow-up ANCOVAs revealed:
- **Deductive Reasoning:** Group C (M = 82.4, SD = 6.1) significantly outperformed both Group B (M = 71.2, SD = 8.4, p < .001) and Group A (M = 74.5, SD = 7.9, p = .014).
- **Error Detection:** Students in Group C exhibited a 34% higher detection rate of deliberate algorithmic hallucinations embedded in validation tasks.`,
        status: 'in_progress',
        wordCount: 126,
        lastModified: '2026-10-30T10:00:00.000Z',
      },
      discussion: {
        id: 'discussion',
        title: 'Discussion & Interpretation',
        description: 'Critical interpretation of findings against prior literature, theoretical implications, and limits.',
        content: `## 5. Discussion

The empirical findings corroborate the core premise of cognitive apprenticeship: technology does not passively augment understanding unless accompanied by deliberate metacognitive frictions. In Condition B, unrestricted access to direct LLM answers facilitated rapid task completion but induced cognitive offloading, mirrored in depressed performance during unassisted post-tests. Conversely, guided Socratic interactions in Condition C compelled students to interrogate underlying reasoning chains, reinforcing conceptual schemata.

### 5.1 Limitations
Several methodological boundaries warrant consideration. First, participant recruitment was restricted to a single R1 university, potentially limiting generalizability across varied socioeconomic and institutional demographics. Second, longitudinal retention evaluations were constrained to a single 12-week subsequent semester.`,
        status: 'draft',
        wordCount: 114,
        lastModified: '2026-10-30T11:30:00.000Z',
      },
      conclusion: {
        id: 'conclusion',
        title: 'Conclusion & Recommendations',
        description: 'Culminating takeaways, practical and policy recommendations, and future research agendas.',
        content: `## 6. Conclusion & Pedagogical Recommendations

This research establishes that generative AI in university STEM curricula functions as a double-edged sword. Unguided deployment risks nurturing passive algorithmic dependence, whereas structured Socratic scaffolds cultivate significant gains in critical deduction and assumption evaluation.

### Recommendations for Academic Institutions:
1. Transition institutional guidelines from binary prohibition toward structured AI prompt literacy.
2. Develop domain-calibrated Socratic AI mentors that refuse to output raw code/solutions without student dialectical engagement.
3. Continually audit instructional AI interfaces for algorithmic transparency and citation verifiability.`,
        status: 'draft',
        wordCount: 92,
        lastModified: '2026-10-30T11:45:00.000Z',
      },
      references: {
        id: 'references',
        title: 'References & Bibliography',
        description: 'Exhaustive bibliography in designated scholarly format (APA 7th, MLA, IEEE, Chicago).',
        content: `## References

Baidoo-Anu, D., & Ansah, L. O. (2023). Education in the era of generative artificial intelligence (AI): Understanding the potential benefits of ChatGPT in promoting teaching and learning. *Journal of AI*, 7(1), 52–62.

Cotton, D. R., Cotton, P. A., & Shipway, J. R. (2023). Chatting and cheating: Ensuring academic integrity in the era of ChatGPT. *Innovations in Education and Teaching International*, 61(2), 228–239. https://doi.org/10.1080/14703297.2023.2190148

Kasneci, E., Sessler, K., Küchemann, S., Bannert, M., Dementieva, D., Fischer, F., ... & Kasneci, G. (2023). ChatGPT for good? On opportunities and challenges of large language models for education. *Learning and Individual Differences*, 103, 102274.

Mollick, E. R., & Mollick, L. (2023). Assigning AI: Seven approaches for students, with prompts. *SSRN Electronic Journal*. https://doi.org/10.2139/ssrn.4475995

Pea, R. D. (1985). Beyond amplification: Using the computer to reorganize mental functioning. *Educational Psychologist*, 20(4), 167–182.

Sweller, J. (2011). Cognitive load theory. *Psychology of Learning and Motivation*, 55, 37–76.

Sweller, J., van Merriënboer, J. J., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review*, 31(2), 261–292.

Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.`,
        status: 'completed',
        wordCount: 208,
        lastModified: '2026-10-30T12:00:00.000Z',
      },
    },
  },
  {
    id: 'proj-urban-mobility-2026',
    title: 'Spatial Equity in Micro-Mobility Distribution: Geospatial Analysis of Transit Deserts in Post-Industrial Cities',
    fieldOfStudy: 'Environmental Sciences & Sustainability',
    department: 'Department of Urban Planning and GIS',
    academicLevel: 'Doctoral / Ph.D.',
    keywords: ['Spatial Equity', 'Micro-mobility', 'Transit Deserts', 'Urban GIS', 'Environmental Justice'],
    writingStyle: 'Formal Academic',
    documentType: 'Original Research Paper',
    targetWordCount: 10000,
    createdAt: '2026-10-05T12:00:00.000Z',
    updatedAt: '2026-10-28T15:30:00.000Z',
    sections: {
      title: {
        id: 'title',
        title: 'Title & Running Header',
        description: 'Specific, concise statement of the primary investigation and scope.',
        content: '# Spatial Equity in Micro-Mobility Distribution: Geospatial Analysis of Transit Deserts in Post-Industrial Cities',
        status: 'completed',
        wordCount: 13,
        lastModified: '2026-10-06T10:00:00.000Z',
      },
      abstract: {
        id: 'abstract',
        title: 'Abstract & Keywords',
        description: 'Comprehensive 150-300 word synthesis of problem, methodology, findings, and implications.',
        content: 'Investigating dockless e-bike distribution across urban tracts to assess socioeconomic accessibility gaps.',
        status: 'draft',
        wordCount: 14,
        lastModified: '2026-10-07T11:00:00.000Z',
      },
      introduction: {
        id: 'introduction',
        title: 'Introduction & Background',
        description: 'Contextualizes the research problem, scholarly debate, and theoretical significance.',
        content: 'Urban micro-mobility fleets promise multimodal decarbonization, but commercial deployment algorithms consistently privilege affluent commercial corridors...',
        status: 'in_progress',
        wordCount: 16,
        lastModified: '2026-10-10T14:00:00.000Z',
      },
      literature_review: {
        id: 'literature_review',
        title: 'Literature Review',
        description: 'Critical thematic synthesis of prior empirical findings, theoretical paradigms, and gaps.',
        content: '',
        status: 'not_started',
        wordCount: 0,
        lastModified: '2026-10-05T12:00:00.000Z',
      },
      methodology: {
        id: 'methodology',
        title: 'Research Methodology',
        description: 'Philosophical stance, research design, population, sampling, instruments, and ethical protocols.',
        content: '',
        status: 'not_started',
        wordCount: 0,
        lastModified: '2026-10-05T12:00:00.000Z',
      },
      results: {
        id: 'results',
        title: 'Results / Findings',
        description: 'Objective presentation of empirical findings, statistical tests, or qualitative themes.',
        content: '',
        status: 'not_started',
        wordCount: 0,
        lastModified: '2026-10-05T12:00:00.000Z',
      },
      discussion: {
        id: 'discussion',
        title: 'Discussion & Interpretation',
        description: 'Critical interpretation of findings against prior literature, theoretical implications, and limits.',
        content: '',
        status: 'not_started',
        wordCount: 0,
        lastModified: '2026-10-05T12:00:00.000Z',
      },
      conclusion: {
        id: 'conclusion',
        title: 'Conclusion & Recommendations',
        description: 'Culminating takeaways, practical and policy recommendations, and future research agendas.',
        content: '',
        status: 'not_started',
        wordCount: 0,
        lastModified: '2026-10-05T12:00:00.000Z',
      },
      references: {
        id: 'references',
        title: 'References & Bibliography',
        description: 'Exhaustive bibliography in designated scholarly format (APA 7th, MLA, IEEE, Chicago).',
        content: '',
        status: 'not_started',
        wordCount: 0,
        lastModified: '2026-10-05T12:00:00.000Z',
      },
    },
  },
];
