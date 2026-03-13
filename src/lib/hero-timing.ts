// Shared timing constants for hero word animations.
// This file is NOT "use client" so it can be imported from server components.

/** Interval between words (ms). */
export const GAP = 80;

/** Single word animation duration (ms). */
export const DURATION = 500;

/**
 * Returns the total estimated animation end time (ms) for N words
 * starting at `delay`. Useful for scheduling elements that follow
 * the hero text (CTAs, badges, etc.).
 */
export function heroEnd(words: number, delay = 0) {
  return delay + (words - 1) * GAP + DURATION;
}
