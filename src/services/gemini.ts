const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function validateApiKey(apiKey: string): Promise<boolean> {
  // Bypassing strict validation as per user request to allow custom/new key formats
  return true;
}

export async function generateMasterPrompt(
  userGoal: string,
  apiKey: string
): Promise<string> {
  const systemInstruction = `You are a world-class prompt engineer. Your task is to transform the user's simple goal into a detailed, professional, and highly optimized master prompt that can be used with any AI assistant. 

The output should:
- Start with a clear ROLE DEFINITION
- Include CONTEXT and BACKGROUND
- Define the TASK precisely with step-by-step breakdown
- Specify the desired OUTPUT FORMAT
- Add CONSTRAINTS and TONE guidelines
- End with an EXAMPLE if applicable

Return ONLY the master prompt text, no explanations.`;

  const response = await callGemini(
    `User Goal: "${userGoal}"\n\nCreate a master prompt for achieving this goal.`,
    apiKey,
    systemInstruction
  );
  return response;
}

export async function generateBrandStrategy(
  brandName: string,
  niche: string,
  targetAudience: string,
  apiKey: string
): Promise<BrandStrategy> {
  const prompt = `Analyze and create a complete brand strategy for:
Brand Name: ${brandName}
Niche: ${niche}
Target Audience: ${targetAudience}

Return a JSON object with EXACTLY this structure (no markdown, raw JSON only):
{
  "persona": {
    "archetype": "Brand archetype name",
    "tone": "Tone of voice description",
    "personality": ["trait1", "trait2", "trait3"],
    "values": ["value1", "value2", "value3"]
  },
  "hooks": [
    {
      "type": "Curiosity Hook",
      "headline": "Hook headline text",
      "subtext": "Supporting copy"
    },
    {
      "type": "Pain Point Hook",
      "headline": "Hook headline text",
      "subtext": "Supporting copy"
    },
    {
      "type": "Social Proof Hook",
      "headline": "Hook headline text",
      "subtext": "Supporting copy"
    }
  ],
  "audience": {
    "demographics": "Age, income, location overview",
    "psychographics": "Values, beliefs, motivations",
    "painPoints": ["pain1", "pain2", "pain3"],
    "desiredOutcomes": ["outcome1", "outcome2", "outcome3"],
    "platforms": ["platform1", "platform2", "platform3"]
  }
}`;

  const raw = await callGemini(prompt, apiKey);
  // Strip markdown code blocks if present
  const cleaned = raw
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();
  return JSON.parse(cleaned) as BrandStrategy;
}

async function callGemini(
  text: string,
  apiKey: string,
  systemInstruction?: string
): Promise<string> {
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export interface BrandStrategy {
  persona: {
    archetype: string;
    tone: string;
    personality: string[];
    values: string[];
  };
  hooks: Array<{
    type: string;
    headline: string;
    subtext: string;
  }>;
  audience: {
    demographics: string;
    psychographics: string;
    painPoints: string[];
    desiredOutcomes: string[];
    platforms: string[];
  };
}
