/**
 * Lottie Animation Data Registry
 *
 * Instead of runtime fetch() calls (which can silently fail in production due to
 * CSP, CORS, or network issues), this module uses webpack dynamic imports to
 * bundle lottie JSON data at build time.
 *
 * Files live in src/assets/lottie/ (build-time) AND public/lottie/ (direct URL access).
 */

/**
 * Extract the base filename (without extension) from a lottie src path.
 * E.g., "/lottie/vulnman.json" → "vulnman"
 */
function getLottieName(src: string): string {
  const filename = src.split("/").pop() || src;
  return filename.replace(/\.json$/i, "");
}

/**
 * Try to load lottie animation data via static dynamic import.
 * Falls back to null if the file doesn't exist in the build-time assets.
 */
export async function loadLottieData(
  src: string
): Promise<object | null> {
  const name = getLottieName(src);
  if (!name) return null;

  try {
    // webpack dynamic import — resolves at build time for all .json files in the directory
    const imported = (await import(
      `@/assets/lottie/${name}.json`
    )) as { default: object };
    return imported.default ?? imported;
  } catch (err) {
    console.warn(
      `[LottieRegistry] Static import failed for "${name}.json", will try fetch fallback.`,
      err
    );
    return null;
  }
}
