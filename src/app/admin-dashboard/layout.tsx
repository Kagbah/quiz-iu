import "@/app/globals.css";
import ServerSidebar from "@/components/ServerSidebar";
import { GeistSans } from "geist/font/sans";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground flex">
        <ServerSidebar />
        <main className="min-h-screen flex gap-8 items-start">{children}</main>
      </body>
    </html>
  );
}
