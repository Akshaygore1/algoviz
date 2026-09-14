"use client";

import { useCallback, useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, streakFrom, today, type ProgressState } from "@/lib/progress";

const STORAGE_KEY = "dsa-visualizer:progress:v1";
const CHANGE_EVENT = "dsa-progress-change";

let cachedRaw: string | null | undefined;
let cachedProgress = EMPTY_PROGRESS;

function readProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedProgress;

    cachedRaw = raw;
    cachedProgress = raw
      ? { ...EMPTY_PROGRESS, ...(JSON.parse(raw) as Partial<ProgressState>) }
      : EMPTY_PROGRESS;
  } catch {
    cachedProgress = EMPTY_PROGRESS;
  }

  return cachedProgress;
}

function writeProgress(next: ProgressState) {
  const raw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedProgress = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function subscribeToHydration() {
  return () => undefined;
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, readProgress, () => EMPTY_PROGRESS);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const update = useCallback((fn: (current: ProgressState) => ProgressState) => {
    writeProgress(fn(readProgress()));
  }, []);

  const setTopicProgress = useCallback(
    (topicId: string, value: number) =>
      update((current) => ({
        ...current,
        topics: {
          ...current.topics,
          [topicId]: Math.max(current.topics[topicId] ?? 0, value),
        },
        visits: current.visits.includes(today()) ? current.visits : [...current.visits, today()],
        recent: [topicId, ...current.recent.filter((id) => id !== topicId)].slice(0, 6),
      })),
    [update],
  );

  const markConceptComplete = useCallback(
    (conceptId: string) =>
      update((current) => ({
        ...current,
        completedConcepts: current.completedConcepts.includes(conceptId)
          ? current.completedConcepts
          : [...current.completedConcepts, conceptId],
        topics: { ...current.topics, [conceptId]: 100 },
        visits: current.visits.includes(today()) ? current.visits : [...current.visits, today()],
      })),
    [update],
  );

  const toggleSolved = useCallback(
    (id: string, difficulty: "Easy" | "Medium" | "Hard") =>
      update((current) => {
        const solved = current.solved.some((problem) => problem.id === id);
        return {
          ...current,
          solved: solved
            ? current.solved.filter((problem) => problem.id !== id)
            : [...current.solved, { id, difficulty, at: new Date().toISOString() }],
          visits: current.visits.includes(today()) ? current.visits : [...current.visits, today()],
        };
      }),
    [update],
  );

  const toggleBookmark = useCallback(
    (id: string) =>
      update((current) => ({
        ...current,
        bookmarks: current.bookmarks.includes(id)
          ? current.bookmarks.filter((bookmark) => bookmark !== id)
          : [...current.bookmarks, id],
      })),
    [update],
  );

  const touch = useCallback(
    (topicId: string) =>
      update((current) => ({
        ...current,
        visits: current.visits.includes(today()) ? current.visits : [...current.visits, today()],
        recent: [topicId, ...current.recent.filter((id) => id !== topicId)].slice(0, 6),
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
    reset: useCallback(() => writeProgress(EMPTY_PROGRESS), []),
  };
}
