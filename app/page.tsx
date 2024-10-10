"use client";

import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import GameControls from "../components/GameControls";

export default function Home() {
  const setEvents = useGameStore((state) => state.setEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startYear: 1800,
            endYear: 2010,
            numberOfEvents: 5,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [setEvents]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-top p-24">
      <h1 className="text-4xl font-bold mb-8">TimeChain</h1>
      <GameControls />
    </main>
  );
}
