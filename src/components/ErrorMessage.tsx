"use client";
import { useSearchParams } from "next/navigation";

export function ErrorMessage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  let nachricht = null;

  if (message === "invalid-credentials") {
    nachricht = "Die Kombination aus E-Mail und Passwort ist ungültig.";
  } else if (message === "email-already-exists") {
    nachricht =
      "Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an oder verwenden Sie eine andere E-Mail-Adresse.";
  } else if (message === "check-email") {
    nachricht =
      "Bitte verifizieren Sie Ihre E-Mail. Wir haben hierfür eine Nachricht an Ihre E-Mail-Adresse gesendet.";
  } else if (message === "generic") {
    nachricht =
      "Es ist ein unbekannter Fehler aufgetreten. Versuchen Sie es später erneut oder wenden Sie sich an das Projektteam.";
  }

  if (!nachricht) {
    return null;
  }

  return (
    <div className="p-8 mt-4 bg-background/70 border border-destructive rounded-lg drop-shadow-md">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] text-destructive font-medium">
        {nachricht}
      </div>
    </div>
  );
}
