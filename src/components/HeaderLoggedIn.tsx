import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center my-auto">
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Du kannst nun <b>mit Freunden</b> oder <b>Alleine</b> Quizzen!
      </p>
      <Button>zur Kategorieauswahl</Button>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
