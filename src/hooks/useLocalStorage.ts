import { useEffect, useRef, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (value: string) => T | undefined;
type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;

interface Options<T> {
  serializer?: Serializer<T>;
  parser?: Parser<T>;
  logger?: (error: unknown) => void;
  syncData?: boolean;
}

/**
 * Replaces the `use-local-storage` package, whose CJS-only distribution broke
 * under Vite 8's consistent CJS interop (the default import resolves to
 * `module.exports`, not `module.exports.default`).
 *
 * Behavior mirrors `use-local-storage` 3.0.0: localStorage-backed state,
 * writes on value change, and cross-tab sync via `storage` events.
 */
export function useLocalStorage<T>(key: string, defaultValue: T, options?: Options<T>): [T, Setter<T>] {
  const opts: Required<Options<T>> = {
    serializer: (object) => JSON.stringify(object),
    // JSON.parse is typed `unknown` in TS7; the caller's generic declares the
    // boundary type, mirroring upstream use-local-storage's typing.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- JSON parsing boundary, caller declares T
    parser: (raw) => JSON.parse(raw) as T,
    logger: console.log,
    syncData: true,
    ...options,
  };
  const { serializer, parser, logger, syncData } = opts;

  const rawValueRef = useRef<string | null>(null);
  const [value, setValue] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? parser(raw) : defaultValue;
    } catch (error) {
      logger(error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Browser ONLY dispatches storage events to other tabs, NOT the current tab.
    // Dispatch one manually so subscribers in this tab observe the write too.
    const updateLocalStorage = () => {
      if (value !== undefined) {
        const newValue = serializer(value);
        const oldValue = rawValueRef.current ?? window.localStorage.getItem(key);
        rawValueRef.current = newValue;
        window.localStorage.setItem(key, newValue);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: window.localStorage,
            url: window.location.href,
            key,
            newValue,
            oldValue,
          }),
        );
      } else {
        window.localStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: window.localStorage,
            url: window.location.href,
            key,
          }),
        );
      }
    };

    try {
      updateLocalStorage();
    } catch (error) {
      logger(error);
    }
  }, [value, serializer, key, logger]);

  useEffect(() => {
    if (!syncData || typeof window === "undefined") {
      return undefined;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) return;
      try {
        if (event.newValue !== rawValueRef.current) {
          rawValueRef.current = event.newValue;
          setValue(event.newValue ? parser(event.newValue) : undefined);
        }
      } catch (error) {
        logger(error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, syncData, parser, logger]);

  // The value is `T` in practice: this hook is only used with a string theme
  // value that is always written on mount. The undefined case exists only in
  // the upstream API shape (another tab clearing the key).
  const typedValue: T = value ?? defaultValue;

  return [typedValue, setValue];
}
