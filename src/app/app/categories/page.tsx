"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/actions/fetch-categories";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Kategorien laden
  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };

    loadCategories();
  }, []);

  // Ladezustand anzeigen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Lädt Kategorien...</div>
      </div>
    );
  }

  // Keine Kategorien gefunden
  if (categories.length === 0) {
    return <div className="text-center text-lg font-semibold">Keine Kategorien gefunden.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Entdecken Sie unseren <span className="text-blue-600">Fragenkatalog</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 bg-gradient-to-r from-blue-50 to-white text-center"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {category.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Diese Kategorie enthält Fragen zu {category.name}.
            </p>
            {/* Link zur Detailseite der Kategorie */}
            <Link href={`/app/categories/${category.id}`}>
              <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors">
                Mehr erfahren
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}