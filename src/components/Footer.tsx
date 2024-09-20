import Link from "next/link";

export function Footer() {
  return (
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
  );
}
