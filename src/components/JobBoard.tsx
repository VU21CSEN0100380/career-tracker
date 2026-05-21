"use client";

import { useCallback, useEffect, useState } from "react";
import type { FetchMeta, JobListing, JobType, Region } from "@/lib/types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [meta, setMeta] = useState<FetchMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [regions, setRegions] = useState<Region[]>(["india", "europe"]);
  const [types, setTypes] = useState<JobType[]>(["internship", "full-time"]);
  const [requireBtech, setRequireBtech] = useState(true);
  const [require2025, setRequire2025] = useState(true);
  const [search, setSearch] = useState("");
  const [includeManual, setIncludeManual] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      regions: regions.join(","),
      types: types.join(","),
      btech: String(requireBtech),
      passout2025: String(require2025),
      manual: String(includeManual),
      q: search,
    });
    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(data.jobs ?? []);
    setMeta(data.meta ?? null);
    setLoading(false);
  }, [regions, types, requireBtech, require2025, search, includeManual]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const toggleRegion = (r: Region) => {
    setRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const toggleType = (t: JobType) => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-400">
          B.Tech · 2025 Passout · India & Europe
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Career Tracker
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Aggregates internship & full-time roles from company career pages (Greenhouse API + official portals).
          Shows role, experience hints, and job description.
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Region</label>
            <div className="flex flex-wrap gap-2">
              {(["india", "europe", "global"] as Region[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRegion(r)}
                  className={`rounded-full px-3 py-1 text-sm capitalize transition ${
                    regions.includes(r)
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Role type</label>
            <div className="flex flex-wrap gap-2">
              {(["internship", "full-time"] as JobType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`rounded-full px-3 py-1 text-sm capitalize transition ${
                    types.includes(t)
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Search</label>
            <input
              type="search"
              placeholder="Company, role, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={requireBtech}
              onChange={(e) => setRequireBtech(e.target.checked)}
              className="accent-emerald-500"
            />
            B.Tech background mentioned
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={require2025}
              onChange={(e) => setRequire2025(e.target.checked)}
              className="accent-emerald-500"
            />
            2025 passout / new grad
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={includeManual}
              onChange={(e) => setIncludeManual(e.target.checked)}
              className="accent-emerald-500"
            />
            Include career portal links
          </label>
        </div>
      </section>

      {meta && (
        <p className="mb-6 text-center text-sm text-slate-500">
          {loading ? "Scanning career pages…" : `${meta.totalMatched} roles · ${meta.companiesScanned} companies with live listings · updated ${new Date(meta.fetchedAt).toLocaleTimeString()}`}
          {meta.errors.length > 0 && (
            <span className="block mt-1 text-amber-500/80">{meta.errors.length} companies skipped (API unavailable)</span>
          )}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 py-16 text-center text-slate-400">
          No roles match your filters. Try turning off &quot;2025 passout&quot; or add more regions.
        </div>
      ) : (
        <ul className="grid gap-4">
          {jobs.map((job) => {
            const plain = stripHtml(job.description);
            const isOpen = expanded === job.id;
            return (
              <li
                key={job.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-emerald-800/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                    <p className="text-emerald-400">{job.companyName}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs capitalize text-slate-300">
                      {job.jobType}
                    </span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      {job.source}
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-slate-950/80 px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Experience / eligibility</p>
                  <p className="text-sm text-slate-300">{job.experienceHint}</p>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {job.matchTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs text-emerald-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-400 line-clamp-3">
                  {plain.slice(0, 320) || job.description}
                  {plain.length > 320 ? "…" : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : job.id)}
                    className="text-sm text-emerald-400 hover:underline"
                  >
                    {isOpen ? "Hide JD" : "View full JD"}
                  </button>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                  >
                    Apply on career page →
                  </a>
                  <a
                    href={job.careerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-300"
                  >
                    All {job.companyName} jobs
                  </a>
                </div>

                {isOpen && (
                  <div
                    className="prose prose-invert prose-sm mt-4 max-h-96 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
