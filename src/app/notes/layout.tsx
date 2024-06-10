import { Metadata } from "next";
import NavBar from "./NavBar";

export const metadata: Metadata = {
  title: "MemoMind",
  description: "The AI Memo Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <main className="p-4 max-w-7xl m-auto">{children}</main>
    </>
  );
}
