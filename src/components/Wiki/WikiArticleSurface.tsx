import { clsx } from "clsx";
import purify from "dompurify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { WikiArticleFontSize } from "../../stores/SettingsStore";
import articleAdaptationsUrl from "./styles/article-adaptations.css?url";
import type { WikiArticleData, WikiArticleHostStyle, WikiArticleStyleState } from "./Wiki.types";
import { getWikiArticleKey } from "./WikiDisplay.utils";

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

interface SettlementState {
  key: string;
  settledLinks: Set<string>;
  degraded: boolean;
}

export const WikiArticleSurface = ({
  article,
  fontSize,
  isDark,
  onReady,
  onClick,
  onKeyDown,
}: WikiArticleSurfaceProps) => {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const [readyState, setReadyState] = useState<{
    key: string;
    state: WikiArticleStyleState;
  } | null>(null);
  const contentRootRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const onReadyRef = useRef(onReady);

  const articleKey = getWikiArticleKey(article);
  const styleUrls = useMemo(
    () => [...article.styleUrls, articleAdaptationsUrl],
    [article.styleUrls],
  );
  const sanitizedHtml = useMemo(() => purify.sanitize(article.html), [article.html]);

  const settlementRef = useRef<SettlementState>({
    key: articleKey,
    settledLinks: new Set<string>(),
    degraded: false,
  });

  // Refs may not be read or written during render, so the per-article reset
  // happens in an effect keyed on the article instead.
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    settlementRef.current = { key: articleKey, settledLinks: new Set<string>(), degraded: false };
  }, [articleKey]);

  const styleState = readyState?.key === articleKey ? readyState.state : null;
  const isBusy = styleState === null;

  const attachShadowRoot = useCallback((host: HTMLDivElement | null) => {
    if (!host) return;
    setShadowRoot(host.shadowRoot ?? host.attachShadow({ mode: "open" }));
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  const settleStyle = useCallback(
    (linkKey: string, degraded: boolean) => {
      const settlement = settlementRef.current;
      if (settlement.key !== articleKey || settlement.settledLinks.has(linkKey)) return;

      settlement.settledLinks.add(linkKey);
      settlement.degraded ||= degraded;
      if (settlement.settledLinks.size !== styleUrls.length) return;

      frameRef.current = requestAnimationFrame(() => {
        if (settlementRef.current.key !== articleKey) return;
        const contentRoot = contentRootRef.current;
        if (!contentRoot) return;

        const nextState = settlement.degraded ? "degraded" : "ready";
        setReadyState({ key: articleKey, state: nextState });
        onReadyRef.current(contentRoot, nextState);
      });
    },
    [articleKey, styleUrls.length],
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
                key={`${articleKey}:${href}`}
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
