"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface PlayerScore {
  [playerId: string]: number;
}

export default function InGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<PlayerScore>({});
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const supabase = createClient();

  const mode = searchParams.get("mode");
  const categoryId = searchParams.get("category");
  const lobbyId = searchParams.get("lobbyId");

  useEffect(() => {
    if (categoryId) {
      fetchQuestions(Number(categoryId));
    }
    if (mode === "multiplayer" && lobbyId) {
      setupRealtimeSubscription();
    }
  }, [categoryId, mode, lobbyId]);

  const fetchQuestions = async (category: number) => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("categoryId", category);

    if (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to fetch questions. Please try again.");
      setIsLoading(false);
      return;
    }

    if (data && data.length > 0) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(5, shuffled.length));

      const formattedQuestions = selected.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options.split(","),
        correctAnswer: q.correctAnswer,
      }));
      setQuestions(formattedQuestions);
    } else {
      setError("No questions found for this category.");
    }
    setIsLoading(false);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`lobby:${lobbyId}`)
      .on("broadcast", { event: "player_answer" }, (payload) => {
        if (payload.type === "broadcast" && payload.event === "player_answer") {
          handlePlayerAnswer(payload.payload);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handlePlayerAnswer = (payload: {
    playerId: string;
    answer: string;
  }) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && payload.answer === currentQuestion.correctAnswer) {
      setScores((prevScores) => ({
        ...prevScores,
        [payload.playerId]: (prevScores[payload.playerId] || 0) + 1,
      }));
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      setError("No question available. Please try again.");
      return;
    }

    if (mode === "multiplayer" && lobbyId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.channel(`lobby:${lobbyId}`).send({
          type: "broadcast",
          event: "player_answer",
          payload: { playerId: user.id, answer: selectedAnswer },
        });
      } else {
        setError("User not authenticated. Please log in and try again.");
        return;
      }
    } else {
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setScores((prevScores) => ({
          ...prevScores,
          player: (prevScores.player || 0) + 1,
        }));
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  if (isLoading) {
    return <div>Fragen werden geladen....</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>Es gibt derzeit keine Fragen für diese Kategorie.</div>;
  }

  if (gameOver) {
    return (
      <div className="text-center my-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Das Spiel ist vorbei.</h2>
        <div className="text-secondary-foreground bg-secondary p-6 mx-auto aspect-square text-3xl flex justify-center items-center rounded-lg border border-secondary-foreground gap-1">
          <strong>{scores.player || 0}</strong> /{" "}
          <strong>{questions.length}</strong>
        </div>
        <p className="text-xl font-light">
          Du hast <strong>{scores.player || 0}</strong> von{" "}
          <strong>{questions.length}</strong> Fragen richtig beantwortet.
        </p>
        <Button
          variant={"default"}
          onClick={() => (window.location.href = "/app/play")}
        >
          Erneut spielen
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div>
        Error: Es sind leider keine Fragen für diese Kategorie vorhanden.
      </div>
    );
  }

  return (
    <div className="my-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{currentQuestion.questionText}</h2>
      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <Button
            className="h-44 w-64 font-semibold text-lg"
            key={index}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <div>
        <p>
          Frage {currentQuestionIndex + 1} von {questions.length}
        </p>
        <p>Dein Punktestand: {scores.player || 0}</p>
      </div>
    </div>
  );
}
