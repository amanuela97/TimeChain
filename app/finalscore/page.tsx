"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "../../store/gameStore";

export default function FinalScore() {
  const router = useRouter();
  const { roundScore, setFinalScore, resetGame } = useGameStore();

  useEffect(() => {
    const finalScore = roundScore.reduce((sum, score) => sum + score, 0);
    setFinalScore(finalScore);
  }, [roundScore, setFinalScore]);

  const handlePlayAgain = () => {
    resetGame();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Final Score</h1>
      <p className="text-2xl">
        Your final score: {useGameStore.getState().finalScore}
      </p>
      <button
        onClick={handlePlayAgain}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Play Again
      </button>
    </div>
  );
}
