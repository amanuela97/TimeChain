"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "../store/gameStore";
import GameControls from "../components/GameControls";
import CountDown from "../components/CountDown";
import { useEffect } from "react";
import { Event } from "../types/game";

export default function HomeClient({ allEvents }: { allEvents: Event[][] }) {
  const router = useRouter();
  const {
    events,
    setEvents,
    currentRound,
    setGuessOrder,
    guessOrder,
    setAllEvents,
  } = useGameStore();

  // Use useEffect in the client component
  useEffect(() => {
    setAllEvents(allEvents);
    if (allEvents[currentRound - 1]) {
      setEvents(allEvents[currentRound - 1]);
    }
  }, [currentRound, allEvents, setEvents, setAllEvents]);

  const handleLockIn = () => {
    if (guessOrder.length < currentRound) {
      const currentOrder = events.map((event) => event.year);
      setGuessOrder(currentOrder);
    }
    if (currentRound === 5) {
      router.push("/finalscore");
    } else {
      router.push("/roundscore");
    }
  };

  const handleTimeUp = () => {
    handleLockIn();
  };

  return (
    <main className="flex flex-col items-center justify-top p-24 min-h-screen">
      <div className="w-full flex justify-between">
        <div>Round: {currentRound}/5</div>
        <CountDown initialTime={60} onTimeUp={handleTimeUp} />
      </div>
      <h1 className="text-4xl font-bold mb-8">TimeChain</h1>
      <GameControls />
      <button
        onClick={handleLockIn}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {currentRound === 5 ? "Final Score" : "Lock In"}
      </button>
    </main>
  );
}
