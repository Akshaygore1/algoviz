"use client";

import { useSyncExternalStore, type ReactNode } from "react";

type ClientOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/** Prevents its children from rendering until the app is running in the browser. */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return mounted ? children : fallback;
}
