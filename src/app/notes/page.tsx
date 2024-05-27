import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MemoMind - Notes",
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) throw Error("UserId undefined!");

  const notes = await prisma.note.findMany({ where: { userId } });

  return <div>{JSON.stringify(notes)}</div>;
}
