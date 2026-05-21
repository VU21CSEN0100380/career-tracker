"use client";

import type { JobType, Region } from "@/lib/types";

interface FilterSidebarProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  jobTypeFilter: string;
  onJobTypeFilterChange: (v: string) => void;
  postedAt: string;
  onPostedAtChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  regions: Region[];
  onToggleRegion: (r: Region) => void;
  types: JobType[];
  onToggleType: (t: JobType) => void;
  requireBtech: boolean;
  onRequireBtechChange: (v: boolean) => void;
  require2025: boolean;
  onRequire2025Change: (v: boolean) => void;
}

export default function FilterSidebar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  jobTypeFilter,
  onJobTypeFilterChange,
  postedAt,
  onPostedAtChange,
  location,
  onLocationChange,
  regions,
  onToggleRegion,
  types,
  onToggleType,
  requireBtech,
  onRequireBtechChange,
  require2025,
  onRequire2025Change,
}: FilterSidebarProps) {
  return (
    <aside className="filter-card sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Filter</h2>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm text-slate-600">Search</span>
        <input
          type="search"
          placeholder="Skill, company, tag ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </label>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm text-slate-600">Category</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-violet-400 focus:outline-none"
        >
          <option value="all">All categories</option>
          <option value="devops">DevOps / SRE</option>
          <option value="software">Software Engineering</option>
          <option value="data">Data / Analytics</option>
        </select>
      </label>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm text-slate-600">Job Type</span>
        <select
          value={jobTypeFilter}
          onChange={(e) => onJobTypeFilterChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-violet-400 focus:outline-none"
        >
          <option value="all">All job types</option>
          <option value="internship">Internship</option>
          <option value="full-time">Full-time</option>
        </select>
      </label>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm text-slate-600">Posted At</span>
        <select
          value={postedAt}
          onChange={(e) => onPostedAtChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-violet-400 focus:outline-none"
        >
          <option value="any">Any time</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </label>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm text-slate-600">Location</span>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
        />
      </label>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Region</p>
        <div className="flex flex-wrap gap-2">
          {(["india", "europe", "global"] as Region[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onToggleRegion(r)}
              className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                regions.includes(r)
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Eligibility</p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={requireBtech}
            onChange={(e) => onRequireBtechChange(e.target.checked)}
            className="accent-violet-600"
          />
          B.Tech / engineering
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={require2025}
            onChange={(e) => onRequire2025Change(e.target.checked)}
            className="accent-violet-600"
          />
          2025 passout
        </label>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role type</p>
        <div className="flex flex-wrap gap-2">
          {(["internship", "full-time"] as JobType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onToggleType(t)}
              className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                types.includes(t)
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
