"use client";

import { useEffect } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import { ErrorView } from "./_components/error-view";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <ClientOnly>
      <ErrorView onRetry={reset} />
    </ClientOnly>
  );
}
