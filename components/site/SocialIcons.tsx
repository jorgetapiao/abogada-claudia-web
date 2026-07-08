export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 9h3V5.5h-3c-2.21 0-4 1.79-4 4V12H8v3.5h2V22h3.5v-6.5H16l.5-3.5h-3V9.5c0-.28.22-.5.5-.5z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5A1.94 1.94 0 1 0 5.27 7.38 1.94 1.94 0 0 0 5.25 3.5ZM20.44 20.5H17.06V14.63C17.06 13.2 16.53 12.23 15.24 12.23 14.26 12.23 13.68 12.9 13.42 13.55 13.33 13.78 13.31 14.1 13.31 14.43V20.5H9.94S9.98 9.4 9.94 8.5H13.31V9.99C13.76 9.29 14.57 8.28 16.51 8.28 18.91 8.28 20.44 9.83 20.44 13.16V20.5Z" />
    </svg>
  );
}
