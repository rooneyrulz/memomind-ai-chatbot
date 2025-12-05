import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { embeddingModel } from "@/config";

const apiKey = process.env.HUGGINGFACEHUB_API_KEY;

if (!apiKey) {
  throw Error("HUGGINGFACE API key not specified...");
}

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey, // Defaults to process.env.HUGGINGFACEHUB_API_KEY
  model: embeddingModel, // Defaults to `BAAI/bge-base-en-v1.5` if not provided
});

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddings.embedQuery(text);

    // Handle different response formats
    if (Array.isArray(result)) {
      if (result.length > 0 && Array.isArray(result[0])) {
        return result[0] as number[];
      }
      return result as number[];
    }

    throw new Error("Unexpected response format from HuggingFace API");
  } catch (error) {
    console.error("Error getting embeddings:", error);
    throw error;
  }
}
