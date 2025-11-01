import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export interface DocumentAnalysis {
  categories?: string[];
  summary?: string;
  entities?: Array<{ type: string; text: string }>;
  sentiment?: { label: "positive" | "neutral" | "negative"; score?: number };
  topics?: string[];
}

export async function processDocumentWithAI(text: string): Promise<DocumentAnalysis> {
  if (!openai) {
    // Fallback stub if no API key provided
    return {
      categories: [],
      summary: text.length > 180 ? `${text.slice(0, 177)}...` : text,
      entities: [],
      sentiment: { label: "neutral" as const, score: 0.5 },
      topics: []
    };
  }

  try {
    // Use chat completions API for structured output
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a document analysis assistant. Analyze the provided document and extract:
1. categories: Array of category strings
2. summary: A concise summary of the document
3. entities: Array of objects with {type: string, text: string} (e.g., persons, organizations, locations)
4. sentiment: Object with {label: "positive" | "neutral" | "negative", score: number between 0-1}
5. topics: Array of 3-5 key topic strings

Return ONLY valid JSON without any markdown formatting or code blocks.`
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as DocumentAnalysis;
    
    // Validate and normalize the response
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      summary: parsed.summary || (text.length > 180 ? `${text.slice(0, 177)}...` : text),
      entities: Array.isArray(parsed.entities) ? parsed.entities : [],
      sentiment: {
        label: parsed.sentiment?.label || "neutral",
        score: parsed.sentiment?.score || 0.5
      },
      topics: Array.isArray(parsed.topics) ? parsed.topics : []
    };
  } catch (error) {
    console.error("Error processing document with AI:", error);
    // Return fallback response on error
    return {
      categories: [],
      summary: text.length > 180 ? `${text.slice(0, 177)}...` : text,
      entities: [],
      sentiment: { label: "neutral" as const, score: 0.5 },
      topics: []
    };
  }
}

