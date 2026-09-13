type P = { size?: number; className?: string };

const wrap = (children: React.ReactNode, size = 16, className = "") => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const Icon = {
  overview: ({ size, className }: P) =>
    wrap(<><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>, size, className),
  group: ({ size, className }: P) =>
    wrap(<><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-3-4.9" /></>, size, className),
  itinerary: ({ size, className }: P) =>
    wrap(<><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4M7.5 13h4M7.5 16.5h7" /></>, size, className),
  budget: ({ size, className }: P) =>
    wrap(<><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M16.5 14.5h1.5" /></>, size, className),
  stay: ({ size, className }: P) =>
    wrap(<><path d="M3 18V8M3 12h13a4 4 0 0 1 4 4v2M3 18h18M7 12V9.5a1.5 1.5 0 0 1 1.5-1.5H12" /></>, size, className),
  transport: ({ size, className }: P) =>
    wrap(<><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M8.2 18h7.6M6 15.8V8a2 2 0 0 1 2-2h5l3 5h1a2 2 0 0 1 2 2v2.8" /></>, size, className),
  sparkle: ({ size, className }: P) =>
    wrap(<><path d="M12 3l1.6 4.9L18.5 9.5 13.6 11 12 16l-1.6-5L5.5 9.5l4.9-1.6L12 3Z" /><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" /></>, size, className),
  lock: ({ size, className }: P) =>
    wrap(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>, size, className),
  unlock: ({ size, className }: P) =>
    wrap(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 7.5-2" /></>, size, className),
  edit: ({ size, className }: P) =>
    wrap(<><path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2V20Z" /><path d="M14 8l2.5 2.5" /></>, size, className),
  trash: ({ size, className }: P) =>
    wrap(<><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></>, size, className),
  plus: ({ size, className }: P) => wrap(<path d="M12 5v14M5 12h14" />, size, className),
  swap: ({ size, className }: P) =>
    wrap(<><path d="M4 8h13l-3-3M20 16H7l3 3" /></>, size, className),
  clock: ({ size, className }: P) =>
    wrap(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, size, className),
  walk: ({ size, className }: P) =>
    wrap(<><circle cx="13" cy="4.5" r="1.6" /><path d="M11 21l1.5-5-2.5-2 1-5 3 2 2 1M8 21l2-5" /></>, size, className),
  link: ({ size, className }: P) =>
    wrap(<><path d="M10 13a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5" /><path d="M14 11a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5" /></>, size, className),
  chevron: ({ size, className }: P) => wrap(<path d="M9 6l6 6-6 6" />, size, className),
  chevronDown: ({ size, className }: P) => wrap(<path d="M6 9l6 6 6-6" />, size, className),
  pin: ({ size, className }: P) =>
    wrap(<><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>, size, className),
  sun: ({ size, className }: P) =>
    wrap(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>, size, className),
  rain: ({ size, className }: P) =>
    wrap(<><path d="M7 15a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 0 1 17 15Z" /><path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" /></>, size, className),
  cloud: ({ size, className }: P) =>
    wrap(<path d="M7 18a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 0 1 17 18Z" />, size, className),
  check: ({ size, className }: P) => wrap(<path d="M4 12l5 5L20 6" />, size, className),
  arrowDown: ({ size, className }: P) => wrap(<path d="M12 5v14M6 13l6 6 6-6" />, size, className),
  menu: ({ size, className }: P) => wrap(<path d="M4 7h16M4 12h16M4 17h16" />, size, className),
  close: ({ size, className }: P) => wrap(<path d="M6 6l12 12M18 6L6 18" />, size, className),
  info: ({ size, className }: P) => wrap(<><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>, size, className),
  star: ({ size, className }: P) =>
    wrap(<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />, size, className),
  play: ({ size, className }: P) => wrap(<path d="M7 5l12 7-12 7V5Z" />, size, className),
  heart: ({ size, className }: P) =>
    wrap(<path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.5 12 20 12 20Z" />, size, className),
};
