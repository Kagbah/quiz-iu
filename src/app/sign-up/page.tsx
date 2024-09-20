export const runtime = "edge";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form-sign-up";
import { Logo } from "@/components/Logo";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Suspense } from "react";

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
        <div className="container relative p-4 h-screen md:h-[800px] flex-col items-center justify-center flex max-md:flex-col lg:px-0">
          <div className="absolute right-4 top-4 md:right-8 md:top-8">
            <Logo />
          </div>

          <div className="p-4 md:p-8 border border-input rounded-lg bg-background drop-shadow-md">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Registrieren
                </h1>
                <p className="text-sm text-muted-foreground">
                  Registrier dich mit deiner E-Mail-Adresse.
                </p>
              </div>
              <UserAuthForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                Du hast bereits einen Account? Dann kannst du dich{" "}
                <Link
                  prefetch={false}
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  einloggen
                </Link>{" "}
                und loslegen!
              </p>
            </div>
          </div>
          <Suspense>
            <ErrorMessage />
          </Suspense>
        </div>
      </div>
    </>
  );
}
