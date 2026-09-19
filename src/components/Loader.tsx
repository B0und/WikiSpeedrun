import { useLingui } from "@lingui/react/macro";
import { clsx } from "clsx";

export interface LoaderProps {
  overlay?: boolean;
}

export const Loader = ({ overlay = false }: LoaderProps) => {
  const { t } = useLingui();
  const loadingLabel = t({ id: "Loading" });

  return (
    <output
      aria-live="assertive"
      aria-busy="true"
      aria-label={loadingLabel}
      data-testid="loading"
      className={clsx(
        "z-20 p-4",
        overlay
          ? "wiki-loader-overlay absolute inset-0 bg-neutral-50/70 dark:bg-dark-surface/70"
          : "flex min-h-72 items-center justify-center",
      )}
    >
      <span
        className={clsx("flex items-center justify-center", overlay && "wiki-loader-sticky")}
        aria-hidden="true"
      >
        <span className="wiki-loader-spinner" />
      </span>
    </output>
  );
};
