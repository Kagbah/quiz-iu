"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCategoryById } from "@/actions/fetchCategoryById";
import { fetchQuestionsByCategoryId } from "@/actions/fetch-questions-by-category";
import { Button } from "@/components/ui/button";

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]); // Zustand für Fragen
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Lade Kategorie und die zugehörigen Fragen
  useEffect(() => {
    const fetchCategoryData = async () => {
      const fetchedCategory = await fetchCategoryById(params.id);
      const fetchedQuestions = await fetchQuestionsByCategoryId(params.id);
      setCategory(fetchedCategory);
      setQuestions(fetchedQuestions); // Setze die Fragen in den Zustand
      setLoading(false);
    };

    fetchCategoryData();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Lädt...</div>;
  }

  if (!category) {
    return <div className="text-center text-lg font-semibold">Kategorie nicht gefunden</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <p className="text-lg mb-4">
        Dies ist die Detailseite für die Kategorie {category.name}. Hier sind die zugehörigen Fragen:
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className="border rounded-lg shadow-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">{question.questionText}</h2>
              <ul className="list-disc ml-5">
                {question.options && question.options.split(",").map((option: string, index: number) => (
                  <li key={index} className="mb-2 text-gray-700">
                    {option}
                  </li>
                ))}
              </ul>
              <p className="text-green-600 mt-4">
                <strong>Richtige Antwort:</strong> {question.correctAnswer}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Keine Fragen in dieser Kategorie vorhanden.</p>
        )}
      </div>

      <Button className="mt-6 bg-blue-500 text-white" onClick={() => router.push("/app/categories")}>
        Zurück zur Übersicht
      </Button>
    </div>
  );
}