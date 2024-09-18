import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");
  
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5 bg-gradient-to-r from-yellow-400 via-gray-50 to-teal-300">
      <div className="flex items-center gap-4">
        <Logo width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          MemoMind
        </span>
      </div>
      <p className="max-w-prose text-center">
        An AI powered memo app, built with OpenAI, Pinecone, Next.js, Shadcn UI,
        Clerk, and more.
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
