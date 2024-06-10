import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("Pinecone API key is required...");
}

const pinecone = new Pinecone({
  apiKey,
});

export const notesIndex = pinecone.Index("memomind");
