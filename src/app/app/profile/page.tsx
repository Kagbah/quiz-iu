"use client"; // Markiere die Komponente als clientseitig

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Verwende den korrekten Import
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(); // Supabase Client initialisieren
  const router = useRouter();

  // Funktion zum Abrufen des Benutzers
  const fetchUserProfile = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

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
      <h1 className="text-3xl font-bold mb-8 text-center">Dein Profil</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Benutzerinformationen</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">ID:</span>
            <span className="text-gray-600">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">E-Mail:</span>
            <span className="text-gray-600">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Rolle:</span>
            <span className="text-gray-600">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Anmeldemethode:</span>
            <span className="text-gray-600">{user.app_metadata.provider}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Letzte Anmeldung:</span>
            <span className="text-gray-600">{new Date(user.last_sign_in_at).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Erstellungsdatum:</span>
            <span className="text-gray-600">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button className="bg-blue-500 text-white w-full mr-4" onClick={() => router.push("/app/settings")}>
            Einstellungen
          </Button>
          <Button className="bg-red-500 text-white w-full" onClick={() => router.push("/logout")}>
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
}