"use client";

import { useEffect } from "react";
import { ErrorView } from "./_components/error-view";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <html lang="en">
      <body>
        <ErrorView onRetry={reset} />
      </body>
    </html>
  );
}
