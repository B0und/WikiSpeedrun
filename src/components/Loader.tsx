import { useLingui } from "@lingui/react/macro";
import { BookOpen, Globe, Link as LinkIcon } from "react-feather";
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
        "z-20 flex items-center justify-center p-8",
        overlay
          ? "wiki-loader-overlay absolute inset-x-0 top-0 h-[min(70vh,32rem)] min-h-[18rem] bg-neutral-50/80 backdrop-blur-sm dark:bg-dark-surface/80"
          : "min-h-72",
      )}
    >
      <span className="wiki-loader-card">
        <span className="wiki-loader-stage" aria-hidden="true">
          <span className="wiki-loader-orbit wiki-loader-orbit-primary" />
          <span className="wiki-loader-orbit wiki-loader-orbit-secondary" />
          <span className="wiki-loader-scanline" />
          <span className="wiki-loader-globe">
            <Globe size={30} strokeWidth={1.8} />
          </span>
          <span className="wiki-loader-page wiki-loader-page-front">
            <BookOpen size={18} strokeWidth={1.8} />
          </span>
          <span className="wiki-loader-page wiki-loader-page-back">
            <LinkIcon size={16} strokeWidth={1.8} />
          </span>
        </span>
        <span className="flex items-baseline gap-1 text-sm font-semibold text-neutral-700 dark:text-dark-primary">
          <span>{loadingLabel}</span>
          <span className="wiki-loader-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </span>
      </span>
    </output>
  );
};
