"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AlgorithmStep } from "@/lib/viz/types";
import type { VizMotionMode } from "@/components/viz/VizMotionContext";

export const SPEEDS = [0.25, 0.5, 1, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];

const BASE_DELAY_MS = 900;

type StepSource = "autoplay" | "pointer" | "keyboard" | "scrub" | "jump" | "reset";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Owns playback time for a pre-computed list of steps.
 * Algorithms never touch this; renderers never touch time.
 */
export function useStepPlayer<TState>(
  steps: AlgorithmStep<TState>[],
  defaultSpeed: Speed = 1,
  keyboardShortcuts = true,
) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(defaultSpeed);
  const [stepSource, setStepSource] = useState<StepSource>("reset");
  const reducedMotion = usePrefersReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const last = Math.max(0, steps.length - 1);

  // Reset whenever a new run is generated.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    setStepSource("reset");
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (index >= last) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => {
      setStepSource("autoplay");
      setIndex((i) => Math.min(i + 1, last));
    }, BASE_DELAY_MS / speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, index, last, speed]);

  const next = useCallback(() => {
    setStepSource("pointer");
    setIndex((i) => Math.min(i + 1, last));
  }, [last]);
  const prev = useCallback(() => {
    setStepSource("pointer");
    setIndex((i) => Math.max(i - 1, 0));
  }, []);
  const first = useCallback(() => {
    setStepSource("jump");
    setIndex(0);
  }, []);
  const lastStep = useCallback(() => {
    setStepSource("jump");
    setIndex(last);
  }, [last]);
  const restart = useCallback(() => {
    setPlaying(false);
    setStepSource("reset");
    setIndex(0);
  }, []);
  const scrub = useCallback((nextIndex: number) => {
    setPlaying(false);
    setStepSource("scrub");
    setIndex(nextIndex);
  }, []);
  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p && index >= last) {
        setStepSource("reset");
        setIndex(0);
        return true;
      }
      return !p;
    });
  }, [index, last]);

  const stepUp = useCallback(() => {
    setSpeed((s) => SPEEDS[Math.min(SPEEDS.indexOf(s) + 1, SPEEDS.length - 1)] ?? s);
  }, []);
  const stepDown = useCallback(() => {
    setSpeed((s) => SPEEDS[Math.max(SPEEDS.indexOf(s) - 1, 0)] ?? s);
  }, []);

  // Keyboard shortcuts: space, arrows, R, +/-
  useEffect(() => {
    if (!keyboardShortcuts) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          e.preventDefault();
          setPlaying(false);
          setStepSource("keyboard");
          setIndex((i) => Math.min(i + 1, last));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setPlaying(false);
          setStepSource("keyboard");
          setIndex((i) => Math.max(i - 1, 0));
          break;
        case "r":
        case "R":
          restart();
          break;
        case "+":
        case "=":
          stepUp();
          break;
        case "-":
        case "_":
          stepDown();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardShortcuts, toggle, last, restart, stepUp, stepDown]);

  const step = useMemo(() => steps[Math.min(index, last)], [steps, index, last]);
  const instant = ["keyboard", "scrub", "jump", "reset"].includes(stepSource);
  const motionMode: VizMotionMode = instant ? "instant" : reducedMotion ? "reduced" : "full";

  return {
    step,
    index,
    total: steps.length,
    playing,
    speed,
    setSpeed,
    setIndex: scrub,
    motionMode,
    next,
    prev,
    first,
    lastStep,
    restart,
    toggle,
    atStart: index === 0,
    atEnd: index >= last,
  };
}
