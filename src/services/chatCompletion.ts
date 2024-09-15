import { chatModel, temperature, topP } from "@/config";

interface ChatCompletionMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Options {
  model?: string;
  temperature?: number;
  top_p?: number;
}
export async function createChatCompletion(
  completionService: any,
  messages: ChatCompletionMessage[],
  options: Options = {},
) {
  return await completionService.create({
    model: options.model || chatModel,
    temperature: options.temperature || temperature,
    top_p: options.top_p || topP,
    stream: true,
    messages,
  });
}
