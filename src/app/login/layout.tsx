import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/site.config.ts"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: "Generated by create next app",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>
  );
}