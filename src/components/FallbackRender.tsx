import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error instanceof Error ? error.message : String(error)}</pre>
    </div>
  );
}
