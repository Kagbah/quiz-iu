export const runtime = "edge";
import AuthButton from "@/components/AuthButton";
import Header from "@/components/HeaderLanding";
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
        Wenn sie hilfe benötigen kontaktieren sie bitte das Projektteam.
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <div className="flex justify-evenly text-sm text-muted-foreground gap-8">
          <Link prefetch={false} href="#">
            Datenschutz
          </Link>
          <Link prefetch={false} href="#">
            Impressum
          </Link>
          <Link prefetch={false} href="/help">
            Hilfe
          </Link>
        </div>
      </footer>
    </div>
  );
}
