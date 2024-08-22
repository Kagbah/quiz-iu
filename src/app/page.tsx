export const runtime = "edge";
import AuthButton from "@/components/AuthButton";
import Header from "@/components/Header";
import Link from "next/link";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <div className="flex justify-evenly text-sm text-muted-foreground gap-8">
          <Link href="#">Datenschutz</Link>
          <Link href="#">Impressum</Link>
          <Link href="#">Hilfe</Link>
          <Link href="#">Login für Admins</Link>
        </div>
      </footer>
    </div>
  );
}
