/** Whether the visitor has asked the OS for reduced motion. */
export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Shorten an animation wait when reduced motion is on, so the game doesn't sit still. */
export const motionMs = (ms) => (prefersReducedMotion() ? Math.min(ms, 250) : ms);
