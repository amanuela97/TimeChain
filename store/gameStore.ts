import { create } from "zustand";
import { Event } from "../types/game";

interface GameState {
  events: Event[];
  allEvents: Event[][];
  roundScore: number[];
  finalScore: number;
  guessOrder: number[][];
  correctOrder: number[];
  currentRound: number;
  setEvents: (events: Event[]) => void;
  setAllEvents: (allEvents: Event[][]) => void;
  setRoundScore: (score: number) => void;
  setFinalScore: (score: number) => void;
  setGuessOrder: (order: number[]) => void;
  setCorrectOrder: (order: number[]) => void;
  incrementRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  events: [],
  allEvents: [],
  roundScore: [],
  finalScore: 0,
  guessOrder: [],
  correctOrder: [],
  currentRound: 1,
  setEvents: (events) => set({ events }),
  setAllEvents: (allEvents) => set({ allEvents, events: allEvents[0] || [] }),
  setRoundScore: (score) =>
    set((state) => ({ roundScore: [...state.roundScore, score] })),
  setFinalScore: (score) => set({ finalScore: score }),
  setGuessOrder: (order) =>
    set((state) => {
      if (state.guessOrder.length < state.currentRound) {
        return { guessOrder: [...state.guessOrder, order] };
      }
      return state; // Don't update if we already have a guess for this round
    }),
  setCorrectOrder: (order) => set({ correctOrder: order }),
  incrementRound: () =>
    set((state) => {
      const nextRound = state.currentRound + 1;
      return {
        currentRound: nextRound,
        events: state.allEvents[nextRound - 1] || [],
      };
    }),
  resetGame: () =>
    set((state) => ({
      roundScore: [],
      finalScore: 0,
      guessOrder: [],
      currentRound: 1,
      events: state.allEvents[0] || [],
    })),
}));
