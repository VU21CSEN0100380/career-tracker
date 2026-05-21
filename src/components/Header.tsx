import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0z" />
              <path d="M8 12c2-3 6-3 8 0-2 3-6 3-8 0z" />
            </svg>
          </span>
          <span>career-tracker</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/" className="font-medium text-slate-900">
            Jobs
          </Link>
          <span className="text-slate-400">Companies</span>
          <span className="text-slate-400">Blog</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />
          <span className="hidden text-sm text-slate-600 sm:inline">Login</span>
          <a
            href="https://github.com/VU21CSEN0100380/career-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
