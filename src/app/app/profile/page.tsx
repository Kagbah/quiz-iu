"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(); // Supabase Client initialisieren
  const router = useRouter();

  // Funktion zum Abrufen des Benutzers
  const fetchUserProfile = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Fehler beim Laden des Benutzers:", error);
      return;
    }

    // Setze die Benutzerdaten in den Zustand
    setUser(user);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Benutzerprofil nicht gefunden</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-xl md:text-3xl font-bold mb-8 text-center">
        Dein Profil
      </h1>

      <div className="bg-primary rounded-lg p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-primary-foreground">
          Benutzerinformationen
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-primary-foreground">ID:</span>
            <span className="text-muted-foreground">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-primary-foreground">
              E-Mail:
            </span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-primary-foreground">
              Rolle:
            </span>
            <span className="text-muted-foreground">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-primary-foreground">
              Anmeldemethode:
            </span>
            <span className="text-muted-foreground">
              {user.app_metadata.provider}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-primary-foreground">
              Letzte Anmeldung:
            </span>
            <span className="text-muted-foreground">
              {new Date(user.last_sign_in_at).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-primary-foreground">
              Erstellungsdatum:
            </span>
            <span className="text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          <Button
            variant={"secondary"}
            onClick={() => router.push("/app/settings")}
          >
            Einstellungen
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => router.push("/logout")}
          >
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
}
