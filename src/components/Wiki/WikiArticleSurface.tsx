import { clsx } from "clsx";
import purify from "dompurify";
import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { WikiArticleFontSize } from "../../stores/SettingsStore";
import articleAdaptationsUrl from "./styles/article-adaptations.css?url";
import type { WikiArticleData, WikiArticleHostStyle, WikiArticleStyleState } from "./Wiki.types";

export interface WikiArticleSurfaceProps {
  article: WikiArticleData;
  fontSize: WikiArticleFontSize;
  isDark: boolean;
  onReady: (contentRoot: HTMLElement, styleState: WikiArticleStyleState) => void;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
}

const FONT_STYLE_BY_SIZE: Record<WikiArticleFontSize, WikiArticleHostStyle> = {
  small: {
    "--font-size-medium": "0.875rem",
    "--line-height-content": 1.5714285,
  },
  standard: {
    "--font-size-medium": "1rem",
    "--line-height-content": 1.625,
  },
  large: {
    "--font-size-medium": "1.25rem",
    "--line-height-content": 1.55,
  },
};

// The parent keys one surface instance per article, so a mounted surface only
// ever settles the stylesheets for the article it was created with.
export const WikiArticleSurface = ({
  article,
  fontSize,
  isDark,
  onReady,
  onClick,
  onKeyDown,
}: WikiArticleSurfaceProps) => {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const [styleState, setStyleState] = useState<WikiArticleStyleState | null>(null);
  const contentRootRef = useRef<HTMLDivElement | null>(null);
  const settledLinksRef = useRef<Set<string>>(new Set());
  const degradedRef = useRef(false);

  const styleUrls = useMemo(
    () => [...article.styleUrls, articleAdaptationsUrl],
    [article.styleUrls],
  );
  const sanitizedHtml = useMemo(() => purify.sanitize(article.html), [article.html]);
  const isBusy = styleState === null;

  const attachShadowRoot = useCallback((host: HTMLDivElement | null) => {
    if (!host) return;
    setShadowRoot(host.shadowRoot ?? host.attachShadow({ mode: "open" }));
  }, []);

  const settleStyle = useCallback(
    (href: string, degraded: boolean) => {
      const settledLinks = settledLinksRef.current;
      if (settledLinks.has(href)) return;

      settledLinks.add(href);
      degradedRef.current = degradedRef.current || degraded;
      if (settledLinks.size !== styleUrls.length) return;

      // A missing content root means this surface unmounted before its
      // stylesheets settled, so its article is no longer the one on screen.
      const contentRoot = contentRootRef.current;
      if (!contentRoot) return;

      const nextState = degradedRef.current ? "degraded" : "ready";
      setStyleState(nextState);
      onReady(contentRoot, nextState);
    },
    [onReady, styleUrls.length],
  );

  return (
    <div
      ref={attachShadowRoot}
      className="wiki-article-host"
      data-testid="wiki-article-host"
      aria-busy={isBusy}
      style={FONT_STYLE_BY_SIZE[fontSize]}
    >
      {shadowRoot &&
        createPortal(
          <>
            {styleUrls.map((href) => (
              <link
                key={href}
                rel="stylesheet"
                href={href}
                onLoad={() => settleStyle(href, false)}
                onError={() => settleStyle(href, true)}
              />
            ))}
            <div
              className={clsx(
                "wiki-insert skin-vector skin-vector-2022",
                isDark && "wiki-dark-theme",
                styleState === "degraded" && "wiki-style-degraded",
              )}
            >
              <main className="mw-body">
                <div id="bodyContent" className="vector-body">
                  {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions --
                    The article root only delegates click and bubbled key events to anchors
                    inside sanitized Wikipedia HTML; it is not an interactive widget itself. */}
                  <div
                    id="mw-content-text"
                    className="mw-body-content"
                    ref={contentRootRef}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    // oxlint-disable-next-line react/no-danger -- Wikipedia parse HTML is sanitized immediately before injection.
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                  />
                </div>
              </main>
            </div>
          </>,
          shadowRoot,
        )}
    </div>
  );
};
