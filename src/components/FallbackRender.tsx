import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
      <pre style={{ color: "red" }}>{error?.message}</pre>
    </div>
  );
}
