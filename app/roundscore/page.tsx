"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "../../store/gameStore";
import GameControls from "../../components/GameControls";

export default function RoundScore() {
  const router = useRouter();
  const { allEvents, guessOrder, setRoundScore, incrementRound, currentRound } =
    useGameStore();

  useEffect(() => {
    const correctOrder = [...allEvents[currentRound - 1]]
      .sort((a, b) => a.year - b.year)
      .map((event) => event.year);
    const lastGuessOrder = guessOrder[guessOrder.length - 1];

    let score = 0;
    for (let i = 0; i < correctOrder.length; i++) {
      if (correctOrder[i] === lastGuessOrder[i]) {
        score += 200;
      }
    }

    // Add bonus points for speed (assuming 30 seconds total)
    const timeBonus = Math.floor(Math.random() * 101); // Replace with actual time calculation
    score += timeBonus;

    setRoundScore(score);
  }, [allEvents, guessOrder, setRoundScore, currentRound]);

  const handleNextRound = () => {
    incrementRound();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Round {currentRound} Score</h1>
      <GameControls isScoreView={true} />
      <p className="text-2xl mt-8">
        Your score for this round:{" "}
        {useGameStore.getState().roundScore[currentRound - 1]}
      </p>
      <button
        onClick={handleNextRound}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Next Round
      </button>
    </div>
  );
}
