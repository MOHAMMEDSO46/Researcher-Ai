export interface GenerateRequestOptions {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  toolType?: string;
  academicLevel?: string;
  fieldOfStudy?: string;
  writingStyle?: string;
  targetWordCount?: number;
  projectContext?: string;
}

export interface GenerateResponse {
  content: string;
  modelUsed: string;
  requestedModel: string;
  timestamp: string;
}

export async function fetchAiHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err: any) {
    return {
      status: 'error',
      hasApiKey: false,
      preferredModel: 'gemma-2-27b-it',
      supportedModels: [],
    };
  }
}

export async function generateAcademicAiContent(options: GenerateRequestOptions): Promise<GenerateResponse> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error (${response.status}): ${response.statusText}`);
  }

  return await response.json();
}
