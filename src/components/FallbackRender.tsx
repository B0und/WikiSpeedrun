import { useLingui } from "@lingui/react/macro";
import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error }: FallbackProps) {
  // The object form of the t macro is compiler-safe and works around the
  // rolldown-babel plugin's broken <Trans> JSX transform, which drops the
  // runtime Trans binding and crashes the top-level error boundary itself.
  const { t } = useLingui();

  return (
    <div role="alert">
      <p>
        {t({
          id: "Something went wrong:",
          comment: "Heading of the error screen shown when the app crashes",
        })}
      </p>
      <pre style={{ color: "red" }}>{error instanceof Error ? error.message : String(error)}</pre>
    </div>
  );
}
