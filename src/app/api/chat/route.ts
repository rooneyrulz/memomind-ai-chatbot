import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/huggingface";
import { auth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { groq } from "@/lib/groq";
import { topK } from "@/config";
import { createChatCompletion } from "@/services/chatCompletion";

interface ChatCompletionMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);
    const queryContent = messagesTruncated
      .map((message) => message.content)
      .join("\n");

    const embedding = await getEmbedding(queryContent);
    const { userId } = auth();

    const relevantNotes = await retrieveRelevantNotes(userId, embedding);

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        "You are an intelligent note-taking assistant. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const combinedMessages = [systemMessage, ...messagesTruncated];

    const response = await createChatCompletion(
      groq.chat.completions,
      combinedMessages,
    );

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function retrieveRelevantNotes(
  userId: string | null,
  embeddings: number[],
) {
  const { matches } = await notesIndex.query({
    vector: embeddings,
    topK,
    filter: { userId },
  });

  const noteIds = matches.map((match) => match.id);
  const relevantNotes = await prisma.note.findMany({
    where: {
      id: {
        in: noteIds,
      },
    },
  });

  return relevantNotes;
}
