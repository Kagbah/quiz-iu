import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";

export function Logo() {
  return (
    <div>
      <Link href="/" className={cn(buttonVariants({ variant: "logo" }), "")}>
        <Icons.logo />
        <p className="font-bold ml-2">Quiz-iu</p>
      </Link>
    </div>
  );
}
