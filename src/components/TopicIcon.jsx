const PATHS = {
  // Shield with a lock
  cyber_safety: (
    <>
      <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6z" />
      <rect x="8.8" y="11" width="6.4" height="5" rx="1" />
      <path d="M10 11V9.6a2 2 0 0 1 4 0V11" />
    </>
  ),
  // Government building
  digital_seva: (
    <>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18" />
    </>
  ),
  // Chip
  ai_explorer: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
      <path d="M10 10h4v4h-4z" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  )
};

/** Line icon for a question topic. */
export default function TopicIcon({ id, size = 26 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[id]}
    </svg>
  );
}
