import { embeddingModel } from "@/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const apiKey = process.env.HUGGINGFACEHUB_API_KEY;

if (!apiKey) {
  throw Error("HUGGINGFACE API key not specified...");
}

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
  // model:"sentence-transformers/all-MiniLM-l6-v2",
  model: embeddingModel,
});

export default embeddings;

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    // Generate embeddings (assuming method name is embedText)
    const result = await embeddings.embedQuery(text);

    // console.log(result)

    // Return the embeddings array
    return result;
  } catch (error) {
    console.error("Error getting embeddings:", error);
    throw error;
  }
}
