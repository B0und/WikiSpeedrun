import { Trans } from "@lingui/react/macro";
import type { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>
        <Trans comment="Heading of the error screen shown when the app crashes">Something went wrong:</Trans>
      </p>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
      <pre style={{ color: "red" }}>{error?.message}</pre>
    </div>
  );
}
