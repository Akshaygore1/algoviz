"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Local progress store. Everything the dashboard, roadmap and revision views
 * need goes through this one interface, so swapping localStorage for a real
 * account-backed store later only touches this file.
 */

export interface ProgressState {
  /** topicId -> completion 0..100 */
  topics: Record<string, number>;
  completedConcepts: string[];
  solved: { id: string; difficulty: "Easy" | "Medium" | "Hard"; at: string }[];
  bookmarks: string[];
  visits: string[]; // ISO dates (yyyy-mm-dd) the user studied
  recent: string[]; // recently viewed topic ids, newest first
}

const EMPTY: ProgressState = {
  topics: {},
  completedConcepts: [],
  solved: [],
  bookmarks: [],
  visits: [],
  recent: [],
};

const KEY = "dsa-visualizer:progress:v1";
const EVENT = "dsa-progress-change";

function read(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<ProgressState>) };
  } catch {
    return EMPTY;
  }
}

function write(next: ProgressState) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function streakFrom(visits: string[]) {
  const set = new Set(visits);
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const sync = () => setState(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    write(fn(read()));
  }, []);

  const setTopicProgress = useCallback(
    (topicId: string, value: number) =>
      update((s) => ({
        ...s,
        topics: { ...s.topics, [topicId]: Math.max(s.topics[topicId] ?? 0, value) },
        visits: s.visits.includes(today()) ? s.visits : [...s.visits, today()],
        recent: [topicId, ...s.recent.filter((r) => r !== topicId)].slice(0, 6),
      })),
    [update],
  );

  const markConceptComplete = useCallback(
    (conceptId: string) =>
      update((s) => ({
        ...s,
        completedConcepts: s.completedConcepts.includes(conceptId)
          ? s.completedConcepts
          : [...s.completedConcepts, conceptId],
        topics: { ...s.topics, [conceptId]: 100 },
        visits: s.visits.includes(today()) ? s.visits : [...s.visits, today()],
      })),
    [update],
  );

  const toggleSolved = useCallback(
    (id: string, difficulty: "Easy" | "Medium" | "Hard") =>
      update((s) => {
        const exists = s.solved.some((p) => p.id === id);
        return {
          ...s,
          solved: exists
            ? s.solved.filter((p) => p.id !== id)
            : [...s.solved, { id, difficulty, at: new Date().toISOString() }],
          visits: s.visits.includes(today()) ? s.visits : [...s.visits, today()],
        };
      }),
    [update],
  );

  const toggleBookmark = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        bookmarks: s.bookmarks.includes(id)
          ? s.bookmarks.filter((b) => b !== id)
          : [...s.bookmarks, id],
      })),
    [update],
  );

  const reset = useCallback(() => write(EMPTY), []);

  const touch = useCallback(
    (topicId: string) =>
      update((s) => ({
        ...s,
        visits: s.visits.includes(today()) ? s.visits : [...s.visits, today()],
        recent: [topicId, ...s.recent.filter((r) => r !== topicId)].slice(0, 6),
      })),
    [update],
  );

  return {
    ...state,
    hydrated,
    streak: streakFrom(state.visits),
    setTopicProgress,
    markConceptComplete,
    toggleSolved,
    toggleBookmark,
    touch,
    reset,
  };
}

/** Weighted readiness score across the tracked topics. */
export function readinessScore(topics: Record<string, number>, tracked: string[]) {
  if (tracked.length === 0) return 0;
  const total = tracked.reduce((sum, id) => sum + (topics[id] ?? 0), 0);
  return Math.round(total / tracked.length);
}
