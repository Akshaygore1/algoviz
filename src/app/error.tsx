"use client";

import { useEffect } from "react";
import { ErrorView } from "./_components/error-view";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return <ErrorView onRetry={reset} />;
}
