export interface ProgressState {
  /** topicId -> completion 0..100 */
  topics: Record<string, number>;
  completedConcepts: string[];
  solved: { id: string; difficulty: "Easy" | "Medium" | "Hard"; at: string }[];
  bookmarks: string[];
  visits: string[]; // ISO dates (yyyy-mm-dd) the user studied
  recent: string[]; // recently viewed topic ids, newest first
}

export const EMPTY_PROGRESS: ProgressState = {
  topics: {},
  completedConcepts: [],
  solved: [],
  bookmarks: [],
  visits: [],
  recent: [],
};

export function today() {
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

/** Weighted readiness score across the tracked topics. */
export function readinessScore(topics: Record<string, number>, tracked: string[]) {
  if (tracked.length === 0) return 0;
  const total = tracked.reduce((sum, id) => sum + (topics[id] ?? 0), 0);
  return Math.round(total / tracked.length);
}
