import { create } from "zustand";
import { Event } from "../types/game";

interface GameState {
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  events: [],
  setEvents: (events: Event[]) => set({ events }),
}));
