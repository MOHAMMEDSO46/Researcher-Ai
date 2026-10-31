export interface TopicGeneratorParams {
  fieldOfStudy: string;
  department: string;
  areaOfInterest: string;
  keywords: string;
  academicLevel: string;
}

export function buildTopicGeneratorPrompt(params: TopicGeneratorParams): string {
  return `Generate 4 to 5 rigorous, novel, and highly specific academic research project topics for a student/researcher in the following field:

- **Field of Study:** ${params.fieldOfStudy}
- **Department / Sub-discipline:** ${params.department || 'Not specified'}
- **Area of Interest:** ${params.areaOfInterest}
- **Keywords / Focus:** ${params.keywords || 'Broad exploration'}
- **Academic Level:** ${params.academicLevel}

For EACH topic, provide a structured breakdown with the following exact format:

### Topic [Number]: [Specific Scholarly Title]
- **Scholarly Rationale:** Explain why this topic matters now, citing current theoretical or societal importance (2-3 sentences).
- **Target Research Design:** Specify the ideal research methodology (e.g., Mixed-Methods Sequential Explanatory, Double-Blind Quasi-Experimental, Longitudinal Observational, Systematic Thematic Analysis).
- **Key Variables / Concepts:** List Primary Independent Variables, Dependent Variables, and Contextual Parameters.
- **Feasibility & Data Accessibility:** Briefly assess the feasibility of data collection and expected scope for ${params.academicLevel} level.
- **Key Research Gap:** What unanswered question or contradiction in literature does this topic address?

Ensure the topics are neither too broad (e.g., avoid "AI in Healthcare") nor too narrow to sustain rigorous academic research.`;
}

export function buildExpandTopicPrompt(topicTitle: string, academicLevel: string, field: string): string {
  return `Provide an in-depth academic expansion for the research topic:
"${topicTitle}"
Field: ${field} | Academic Level: ${academicLevel}

Include:
1. **Comprehensive Background & Academic Territory:** Contextualize the scholarly problem.
2. **Detailed Problem Formulation:** Why current solutions or literature are insufficient.
3. **Primary Theoretical Frameworks:** 2-3 established theories applicable to this study.
4. **Primary and Secondary Research Questions:** Formulate 3 distinct questions.
5. **Recommended Data Collection Instruments:** Surveys, interviews, datasets, or lab assays.
6. **Potential Research Impact:** Academic, policy, and practical ramifications.`;
}

export function buildGenerateQuestionsFromTopicPrompt(topicTitle: string, academicLevel: string): string {
  return `Formulate a comprehensive suite of academic research questions for the topic:
"${topicTitle}" (Academic Level: ${academicLevel})

Provide:
1. **Central Overarching Question:** The primary investigative pillar.
2. **Sub-Questions (Quantitative/Hypothesis-Driven):** 2 specific testable questions with clear independent/dependent variables.
3. **Sub-Questions (Qualitative/Exploratory):** 2 exploratory questions investigating mechanisms, perceptions, or nuances.
4. **Corresponding Hypotheses:** Formulate Null (H0) and Alternative (H1) hypotheses for the quantitative inquiries.`;
}

export function buildGenerateObjectivesFromTopicPrompt(topicTitle: string, academicLevel: string): string {
  return `Generate formal, SMART academic research objectives for the topic:
"${topicTitle}" (Academic Level: ${academicLevel})

Include:
1. **Primary General Objective:** The overarching goal of the entire study.
2. **Specific Operational Objectives:** 4 sequential, actionable objectives using measurable action verbs (e.g., "To evaluate...", "To quantify...", "To compare...", "To establish...").
3. **Alignment Matrix:** Briefly map each specific objective to the methodology needed to accomplish it.`;
}

export function buildGenerateOutlineFromTopicPrompt(topicTitle: string, academicLevel: string, field: string): string {
  return `Construct a rigorous chapter-by-chapter / section-by-section research paper outline for:
"${topicTitle}"
Field: ${field} | Academic Level: ${academicLevel}

Format as a detailed hierarchical blueprint covering:
1. Chapter 1: Introduction (Background, Problem Statement, Objectives, Scope, Significance)
2. Chapter 2: Literature Review (Theoretical Framework, Empirical Synthesis, Conceptual Framework, Identified Gaps)
3. Chapter 3: Methodology (Research Design, Population & Sampling, Instrumentation, Reliability/Validity, Data Analysis, Ethics)
4. Chapter 4: Anticipated Results & Findings Structure
5. Chapter 5: Discussion & Theoretical Integration
6. Chapter 6: Conclusion, Policy Implications & Future Research Directions
Include estimated word counts or page distributions per section.`;
}

export function buildProposalPrompt(params: {
  topic: string;
  field: string;
  academicLevel: string;
  writingStyle: string;
  wordCount?: number;
}): string {
  return `Generate a formal, publication-grade Academic Research Proposal for:
"${params.topic}"
Field: ${params.field} | Academic Level: ${params.academicLevel} | Style: ${params.writingStyle}

Structure the proposal meticulously with:
## 1. Executive Summary
## 2. Statement of the Problem & Scholarly Rationale
## 3. Theoretical & Conceptual Framework
## 4. Research Questions & Hypotheses
## 5. Research Methodology & Data Protocol
- Research Design & Epistemological Stance
- Target Population & Sampling Method
- Data Collection Instruments
- Analytical Techniques (Qualitative/Quantitative)
## 6. Significance & Expected Scholarly Contribution
## 7. Ethical Considerations & Institutional Compliance
## 8. Proposed 12-Month Research Timeline

Ensure scholarly depth, rigorous academic tone, and explicit focus on research feasibility.`;
}

export function buildLitReviewPrompt(params: {
  topic: string;
  field: string;
  subthemes?: string;
  academicLevel: string;
}): string {
  return `Generate a structured, critical Literature Review on the topic:
"${params.topic}"
Field: ${params.field} | Academic Level: ${params.academicLevel}
${params.subthemes ? `Focus Subthemes: ${params.subthemes}` : ''}

CRITICAL SCHOLARLY INSTRUCTIONS:
- Do not merely list authors; synthesize conflicting perspectives, theoretical evolution, and empirical consensus.
- Organize by thematic paradigms:
  1. Historical Foundations & Emergent Debates
  2. Contemporary Empirical Paradigms
  3. Methodological Divergences in Prior Studies
  4. Identified Research Gaps (The "Niche" for this study)
- Use standard academic citation formatting (e.g. Author, Year). Clearly note: All empirical citations provided are illustrative frameworks and must be verified in primary academic databases (Scopus, Web of Science, PubMed, Google Scholar).`;
}

export function buildResearchModePrompt(topicOrQuestion: string, field: string, level: string): string {
  return `Execute a deep, multi-dimensional academic research breakdown for the following research topic or question:
"${topicOrQuestion}"
Field: ${field} | Academic Level: ${level}

Provide a comprehensive, rigorously structured report covering:

## 1. TOPIC DECONSTRUCTION & CORE VARIABLES
- Break down the topic into core sub-domains and operational definitions.
- Independent Variables, Dependent Variables, and Potential Confounding/Moderating Variables.

## 2. THEORETICAL FRAMEWORKS & FOUNDATIONAL CONCEPTS
- 3 foundational academic theories or models that frame this investigation.
- Glossary of 6 critical academic terms and technical concepts.

## 3. METHODOLOGICAL BLUEPRINT
- Ideal research paradigm (Quantitative, Qualitative, or Mixed-Methods).
- Recommended sampling methodology, sample size guidelines, and inclusion/exclusion criteria.
- Recommended data collection instruments (e.g., validated survey scales, semi-structured protocols, API data mining).
- Statistical / Qualitative analytical tools (e.g., ANOVA, Structural Equation Modeling [SEM], Reflexive Thematic Analysis, Grounded Theory).

## 4. UNEXPLORED KNOWLEDGE Gaps & NOVEL ANGLES
- 4 critical knowledge gaps in current post-2022 scholarship that this research could pioneer.

## 5. STRUCTURAL RESEARCH BLUEPRINT
- Detailed section-by-section breakdown with target focus and recommended word allocation.

## 6. ACADEMIC VERIFICATION & SOURCE CITATION NOTICE
- Detailed checklist for verifying empirical literature in primary databases (Google Scholar, PubMed, IEEE Xplore, JSTOR).
- Recommended search strings and Boolean queries (AND / OR) for bibliographic databases.`;
}
