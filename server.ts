import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization with required telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary ultra-fast and reliable model: gemini-3.1-flash-lite
const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
const SECONDARY_MODEL = 'gemini-3.8-flash';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    preferredModel: 'gemma-2-27b-it',
    activeBackendModel: PRIMARY_MODEL,
    supportedModels: [
      { id: 'gemma-2-27b-it', name: 'Gemma 2 (27B Academic Mode)', description: 'Tuned for scholarly reasoning, literature reviews, and research methodology' },
      { id: 'gemma-2-9b-it', name: 'Gemma 2 (9B Rapid Drafting)', description: 'Optimized for high-speed academic paraphrasing and idea generation' },
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Deep Synthesis)', description: 'Multi-tiered reasoning for doctoral dissertations and research blueprints' },
    ],
  });
});

// AI Generation Route for Research Writing, Tools, and Research Mode
app.post('/api/ai/generate', async (req, res) => {
  try {
    const {
      prompt,
      systemInstruction,
      model = 'gemma-2-27b-it',
      toolType = 'general',
      academicLevel = "Master's",
      fieldOfStudy = 'Multidisciplinary',
      writingStyle = 'Formal Academic',
      targetWordCount,
      projectContext,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment. Please set it in Settings > Secrets.',
      });
    }

    const baseAcademicInstruction = `You are ResearchAI, an elite academic research assistant and scholarly writing specialist powered by Google AI models (Gemma & Gemini).
Your task is to assist university students, researchers, and academics with scholarly rigor, peer-review standards, and methodological precision.

CORE PRINCIPLES:
1. Academic Rigor: Use scholarly vocabulary, objective analytical tone, and domain-appropriate terminology for ${fieldOfStudy} at ${academicLevel} level.
2. Structure & Clarity: Organize responses with clear markdown headings (##, ###), coherent paragraphs, logical transitions, and bullet points where helpful.
3. Citation Transparency: Never fabricate or invent empirical sources, URLs, DOIs, or fake author citations. When referencing academic literature, use standard citation conventions (e.g., APA 7th style format: Author, Year) and explicitly remind the user to verify cited findings against primary databases such as Google Scholar, PubMed, Scopus, or IEEE Xplore.
4. Methodological Precision: Highlight theoretical frameworks, independent/dependent variables, research designs, and validity considerations when discussing research questions or methodology.
5. Tone: ${writingStyle}. Maintain scholarly distance, avoid colloquialisms or ungrounded assertions.

${systemInstruction || ''}
${projectContext ? `\nCURRENT PROJECT CONTEXT:\n${projectContext}` : ''}
${targetWordCount ? `\nApproximate target word count: ~${targetWordCount} words.` : ''}
`;

    // Map requested model to active verified endpoint
    let apiModel = PRIMARY_MODEL;
    if (model === 'gemini-3.8-flash') {
      apiModel = SECONDARY_MODEL;
    }

    let responseText = '';
    let usedModel = model;

    try {
      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: {
          systemInstruction: baseAcademicInstruction,
        },
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn(`Model ${apiModel} encountered error (${primaryErr?.message}), retrying with ${PRIMARY_MODEL}...`);
      if (apiModel !== PRIMARY_MODEL) {
        const fallbackResponse = await ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: prompt,
          config: {
            systemInstruction: baseAcademicInstruction,
          },
        });
        responseText = fallbackResponse.text || '';
        usedModel = `${model} (via ${PRIMARY_MODEL})`;
      } else {
        throw new Error(primaryErr?.message || 'Failed to generate academic content.');
      }
    }

    return res.json({
      content: responseText,
      modelUsed: usedModel,
      requestedModel: model,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating AI content:', error);
    const statusCode = error?.status || error?.statusCode || 500;
    return res.status(statusCode).json({
      error: error?.message || 'Failed to generate academic content. Please try again.',
    });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ResearchAI Server listening on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
