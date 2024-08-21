import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";

export function Logo() {
  return (
    <div>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        <Icons.logo />
        <p className="font-bold ml-2">Quiz-iu</p>
      </Link>
    </div>
  );
}
