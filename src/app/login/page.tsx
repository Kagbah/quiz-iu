import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form-login";
import { Icons } from "@/components/ui/icons";
import { Logo } from "@/components/Logo";
import { ErrorMessage } from "@/components/ErrorMessage";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div
        className="min-w-full min-h-screen bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/media/bg-img.png')" }}
      >
        <div className="container relative hidden h-[800px] flex-col items-center justify-center md:flex lg:px-0">
          <div className="absolute right-4 top-4 md:right-8 md:top-8">
            <Logo />
          </div>
          <div className="lg:p-8 border border-input rounded-lg bg-background drop-shadow-md">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Einloggen
                </h1>
                <p className="text-sm text-muted-foreground">
                  Melde dich mit deiner E-Mail-Adresse an.
                </p>
              </div>
              <UserAuthForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                Du bist neu hier? Dann{" "}
                <Link
                  href="/sign-up"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Registrier dich
                </Link>{" "}
                jetzt und beginn mit dem Lernen.
              </p>
            </div>
          </div>
          <ErrorMessage />
        </div>
      </div>
    </>
  );
}
