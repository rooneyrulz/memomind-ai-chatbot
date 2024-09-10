import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/huggingface";
import { auth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { groq } from "@/lib/groq";

interface ChatCompletionMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
