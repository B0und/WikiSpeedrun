/**
 * Parse a JSON response as `T` at exactly one documented boundary. The wiki
 * API shapes are pinned by type declarations; runtime schemas would duplicate
 * them, so the unknown → T narrowing happens here and nowhere else.
 */
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- single JSON parsing boundary, see doc comment
export const jsonAs = async <T>(response: Response): Promise<T> => (await response.json()) as T;
