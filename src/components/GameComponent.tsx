"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  questionText: string;
  options: string;
  correctAnswer: string;
}

interface GameComponentProps {
  categoryId?: number;
  lobbyId?: number;
  isSingleplayer: boolean;
}

interface Scores {
  [key: string]: number;
}

export default function GameComponent({
  categoryId,
  lobbyId,
  isSingleplayer,
}: GameComponentProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>({});

  const supabase = createClient();

  useEffect(() => {
    if (categoryId) {
      fetchQuestions();
    }
    if (!isSingleplayer && lobbyId) {
      setupRealtimeSubscription();
    }
  }, [categoryId, lobbyId, isSingleplayer]);

  const setupRealtimeSubscription = () => {
    if (!lobbyId) return;

    const channel = supabase
      .channel(`lobby:${lobbyId}`)
      .on("broadcast", { event: "game_update" }, handleGameUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleGameUpdate = (payload: any) => {
    // Handle game updates here (e.g., update scores, current question, etc.)
  };

  const fetchQuestions = async () => {
    if (!categoryId) return;

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("categoryId", categoryId)
      .order("RANDOM()")
      .limit(5);

    if (error) {
      console.error("Error fetching questions:", error);
    } else {
      setQuestions(data || []);
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Update scores
    setScores((prevScores) => ({
      ...prevScores,
      player: (prevScores.player || 0) + (isCorrect ? 1 : 0),
    }));

    if (!isSingleplayer && lobbyId) {
      // Broadcast answer to other players
      await supabase.channel(`lobby:${lobbyId}`).send({
        type: "broadcast",
        event: "game_update",
        payload: { action: "answer", isCorrect },
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Game over logic
      alert("Game Over!");
      if (!isSingleplayer && lobbyId) {
        // Broadcast game over to other players
        await supabase.channel(`lobby:${lobbyId}`).send({
          type: "broadcast",
          event: "game_update",
          payload: { action: "game_over", scores },
        });
      }
    }
  };

  if (questions.length === 0) {
    return <div>Fragen werden geladen....</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {currentQuestion.questionText}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.split(",").map((option, index) => (
          <Button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </Button>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Score:</h3>
        <p>Player: {scores.player || 0}</p>
      </div>
    </div>
  );
}
