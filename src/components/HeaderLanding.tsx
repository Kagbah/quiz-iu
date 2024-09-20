import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center my-auto">
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <div className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center flex flex-col gap-2">
        <p className="font-semibold">Los geht's.</p>
        <p className="text-2xl lg:text-3xl">Viel Spaß beim Quizzen!</p>
      </div>
      <Link href="/login" className="border-gradient">
        <Button className="p-6">
          <p className="font-bold">Anmelden und loslegen</p>
        </Button>
      </Link>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
