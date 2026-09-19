"use client";

import { createContext, useContext, type ReactNode } from "react";

export type VizMotionMode = "full" | "reduced" | "instant";

const VizMotionContext = createContext<VizMotionMode>("instant");

export function VizMotionProvider({
  mode,
  children,
}: {
  mode: VizMotionMode;
  children: ReactNode;
}) {
  return <VizMotionContext.Provider value={mode}>{children}</VizMotionContext.Provider>;
}

export function useVizMotion() {
  return useContext(VizMotionContext);
}
