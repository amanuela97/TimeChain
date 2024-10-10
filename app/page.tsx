import { Event } from "../types/game";
import HomeClient from "../components/HomeClient";

async function getEvents() {
  const response = await fetch("http://localhost:3000/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startYear: 1800,
      endYear: 2010,
      numberOfEvents: 25,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const events: Event[] = await response.json();

  // Shuffle the events and split them into 5 groups of 5
  const shuffled = events.sort(() => 0.5 - Math.random());
  const allEvents = Array(5)
    .fill(null)
    .map(() => shuffled.splice(0, 5));

  return allEvents;
}

export default async function Home() {
  const allEvents = await getEvents();

  return <HomeClient allEvents={allEvents} />;
}
