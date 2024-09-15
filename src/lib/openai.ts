import OpenAI from "openai/index.mjs";

const openAiApiKey = process.env.OPENAI_API_KEY;
const groqApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw Error("OpenAI API key is required...");
}

// Use OpenAI with Local Ollama API
export const openaiLocal = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: openAiApiKey,
});

if (!groqApiKey) {
  throw Error("GROQ API key is required...");
}

// Use OpenAI with GROQ API
export const openaiGROQ = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});
