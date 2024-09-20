"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Funktion zum Ändern des Passworts
  const handleChangePassword = async () => {
    if (newPassword.trim() === "") {
      alert("Bitte geben Sie ein neues Passwort ein.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      alert("Fehler beim Ändern des Passworts: " + error.message);
    } else {
      alert("Passwort erfolgreich geändert!");
      setNewPassword(""); // Eingabefeld zurücksetzen
    }
  };

  // Funktion zum Löschen des Kontos
  // const handleDeleteAccount = async () => {
  //   const confirmation = confirm("Möchten Sie wirklich Ihr Konto löschen?");

  //   if (!confirmation) return;

  //   setLoading(true);

  //   const { error } = await supabase.auth.deleteUser();

  //   setLoading(false);

  //   if (error) {
  //     alert("Fehler beim Löschen des Kontos: " + error.message);
  //   } else {
  //     alert("Ihr Konto wurde erfolgreich gelöscht.");
  //     router.push("/login"); // Zurück zur Login-Seite leiten
  //   }
  // };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-xl md:text-3xl font-bold mb-10 text-center">
        Einstellungen
      </h1>

      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Erscheinungsbild ändern
          </h2>
          <div className="mx-auto">
            <ModeToggle></ModeToggle>
          </div>
        </div>

        {/* Passwort ändern */}
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Passwort ändern
          </h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Neues Passwort eingeben"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <Button
            className="w-full bg-blue-500"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Ändern..." : "Passwort ändern"}
          </Button>
        </div>

        {/* Konto löschen */}
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Konto löschen
          </h2>
          {/* <Button
            className="w-full bg-red-500"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Löschen..." : "Konto löschen"}
          </Button> */}
        </div>
      </div>
    </div>
  );
}
