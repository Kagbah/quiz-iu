"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { getGameQuestions } from "@/actions/getGameQuestions";

export interface Question {
  id: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  categoryId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

interface PlayerAnswer {
  playerId: string;
  answer: string;
}

export default function MultiplayerGame() {
  const searchParams = useSearchParams();
  const lobbyId = searchParams.get("lobbyId") || "";
  const gameMode = searchParams.get("gameMode") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, string>>(
    {}
  );
  const [playerVotes, setPlayerVotes] = useState<Record<string, string>>({});

  const [teamScore, setTeamScore] = useState(0);
  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  const parsedLobbyId = parseInt(lobbyId, 10);

  useEffect(() => {
    fetchQuestions();
    fetchUserIdAndSetupSubscription();
  }, [parsedLobbyId]);

  useEffect(() => {
    if (userId) {
      supabase.channel(`lobby:${parsedLobbyId}`).send({
        type: "broadcast",
        event: "player_joined",
        payload: { playerId: userId },
      });
    }
  }, [userId, parsedLobbyId]);

  useEffect(() => {
    const allPlayersAnswered =
      players.length > 0 &&
      players.every((playerId) =>
        gameMode === "vs" ? playerAnswers[playerId] : playerVotes[playerId]
      );

    if (allPlayersAnswered) {
      if (gameMode === "team") {
        processTeamAnswer();
      }
      // short delay before switching to next question
      setTimeout(() => {
        handleNextQuestion();
      }, 1200);
    }
  }, [playerAnswers, playerVotes, players, gameMode]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setGameOver(false); // Reset game over state
    setCurrentQuestionIndex(-1); // Reset question index
    try {
      const fetchedQuestions = await getGameQuestions(parsedLobbyId);

      if (fetchedQuestions.length === 0) {
        setError("No questions found for this category");
      } else {
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserIdAndSetupSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      setupRealtimeSubscription(user.id);
      setPlayers((prevPlayers) => {
        const updatedPlayers = addUniquePlayer(prevPlayers, user.id);

        return updatedPlayers;
      });
    } else {
    }
  };

  const setupRealtimeSubscription = (userId: string) => {
    const channel = supabase
      .channel(`lobby:${parsedLobbyId}`)
      .on(
        "broadcast",
        { event: "player_joined" },
        (payload: { payload: { playerId: string } }) => {
          setPlayers((prevPlayers) =>
            addUniquePlayer(prevPlayers, payload.payload.playerId)
          );
        }
      )
      .on(
        "broadcast",
        { event: "player_answer" },
        (payload: { payload: { playerId: string; answer: string } }) => {
          if (payload.payload.playerId !== userId) {
            setPlayerAnswers((prev) => ({
              ...prev,
              [payload.payload.playerId]: payload.payload.answer,
            }));
            if (gameMode === "vs") {
              checkAnswer(payload.payload.playerId, payload.payload.answer);
            }
          }
        }
      )
      .on(
        "broadcast",
        { event: "player_vote" },
        (payload: { payload: { playerId: string; answer: string } }) => {
          if (payload.payload.playerId !== userId) {
            handlePlayerVote(payload.payload);
          }
        }
      )
      .on(
        "broadcast",
        { event: "score_update" },
        (payload: {
          payload: {
            newScore: number | Record<string, number>;
            mode: "team" | "vs";
          };
        }) => {
          if (payload.payload.mode === "team") {
            setTeamScore(payload.payload.newScore as number);
          } else {
            setScores(payload.payload.newScore as Record<string, number>);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAnswer = async (selectedAnswer: string) => {
    if (!userId || playerAnswers[userId]) {
      return;
    }

    const payload = { playerId: userId, answer: selectedAnswer };

    if (gameMode === "team") {
      setPlayerVotes((prev) => ({ ...prev, [userId]: selectedAnswer }));
      await supabase.channel(`lobby:${parsedLobbyId}`).send({
        type: "broadcast",
        event: "player_vote",
        payload: payload,
      });
    } else {
      setPlayerAnswers((prev) => ({ ...prev, [userId]: selectedAnswer }));
      await supabase.channel(`lobby:${parsedLobbyId}`).send({
        type: "broadcast",
        event: "player_answer",
        payload: payload,
      });
      checkAnswer(userId, selectedAnswer);
    }

    setHasAnswered(true);
  };

  const checkAnswer = (playerId: string, answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && answer === currentQuestion.correctAnswer) {
      const newScores = {
        ...scores,
        [playerId]: (scores[playerId] || 0) + 1,
      };
      setScores(newScores);
      broadcastScoreUpdate(newScores, "vs");
    }
  };

  const broadcastScoreUpdate = async (
    newScore: number | Record<string, number>,
    mode: "team" | "vs"
  ) => {
    await supabase.channel(`lobby:${parsedLobbyId}`).send({
      type: "broadcast",
      event: "score_update",
      payload: { newScore, mode },
    });
  };

  const handlePlayerVote = (payload: { playerId: string; answer: string }) => {
    setPlayerVotes((prev) => ({
      ...prev,
      [payload.playerId]: payload.answer,
    }));
  };

  const processTeamAnswer = () => {
    const voteCount: Record<string, number> = {};
    Object.values(playerVotes).forEach((vote) => {
      voteCount[vote] = (voteCount[vote] || 0) + 1;
    });

    const entries = Object.entries(voteCount);
    if (entries.length === 0) {
      return;
    }

    const mostVotedAnswer = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && mostVotedAnswer === currentQuestion.correctAnswer) {
      setTeamScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = useCallback(() => {
    if (questions.length === 0) {
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => {
        return prev + 1;
      });
      setPlayerAnswers({});
      setPlayerVotes({});
      setHasAnswered(false);
    } else {
      setGameOver(true);
    }
  }, [questions.length, currentQuestionIndex]);

  const addUniquePlayer = (players: string[], newPlayer: string): string[] => {
    return players.includes(newPlayer) ? players : [...players, newPlayer];
  };

  const leaveGameAndReturnToLobby = async () => {
    if (userId) {
      await supabase
        .from("lobbies_user")
        .delete()
        .eq("lobbies_id", parsedLobbyId)
        .eq("user_id", userId);

      await supabase
        .from("lobbies_questions")
        .delete()
        .eq("lobbiesId", parsedLobbyId);

      router.push(`/app/play/${parsedLobbyId}`);
    }
  };

  if (isLoading) {
    return <div className="text-center">Die Fragen werden geladen...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push(`/app/play/${parsedLobbyId}`)}>
          Back to Lobby
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center">Keine Fragen verfügbar.</div>;
  }

  if (gameOver) {
    return (
      <div className="text-center my-auto flex flex-col gap-6 px-8">
        <h2 className="text-2xl font-bold">Das spiel ist vorbei.</h2>
        {gameMode === "vs" ? (
          players.map((playerId) => (
            <p key={playerId} className="text-xl">{`Player ${playerId}: ${
              scores[playerId] || 0
            } points`}</p>
          ))
        ) : (
          <p className="text-xl">{`Als Team habt ihr insgesamt ${teamScore} Punkte erzielt.`}</p>
        )}
        <Button onClick={leaveGameAndReturnToLobby}>Zurück zur Lobby</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const options = currentQuestion
    ? currentQuestion.options.split(",").map((option) => option.trim())
    : [];

  return (
    <div className="my-auto flex flex-col gap-4 p-8 max-md:mt-8 md:max-w-[596px]">
      <h2 className="text-2xl font-bold">{currentQuestion?.questionText}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div className="border-gradient">
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              className="min-h-32 md:min-h-44 w-full md:w-64 font-semibold text-lg text-wrap"
            >
              {option}
            </Button>
          </div>
        ))}
      </div>
      <div>
        <p>{`Frage ${currentQuestionIndex + 1} von ${questions.length}`}</p>
        {gameMode === "vs" ? "" : <p>{`Teampunkte: ${teamScore}`}</p>}
      </div>
      {gameMode === "team" && (
        <div>
          <h3>Das haben deine Mitspieler gewählt:</h3>
          {players.map((playerId) => (
            <p key={playerId}>{`Player ${playerId}: ${
              playerVotes[playerId] || ""
            }`}</p>
          ))}
        </div>
      )}
      {gameMode === "vs" && (
        <div>
          <h3>Punkte:</h3>
          {Object.entries(scores).map(([playerId, score]) => (
            <p key={playerId}>{`Player ${playerId}: ${score}`}</p>
          ))}
        </div>
      )}
    </div>
  );
}
