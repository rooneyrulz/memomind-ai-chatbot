import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw Error("Groq API key is required...");
}

export const groq = new Groq({ apiKey });