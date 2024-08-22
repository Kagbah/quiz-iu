import Link from "next/link";
import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center my-auto">
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <div className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center flex flex-col gap-2">
        <p className="font-semibold">Los geht's.</p>
        <p className="text-2xl lg:text-3xl">Viel Spaß beim Quizzen!</p>
      </div>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "default" }), "")}
      >
        <p className="font-bold">Anmelden und loslegen</p>
      </Link>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
