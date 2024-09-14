import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string | null | undefined;
}

export default function Markdown({ children }: MarkdownProps) {
  // Return null if children is null or undefined
  if (!children) {
    return null;
  }

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}
