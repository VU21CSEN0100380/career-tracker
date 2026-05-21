"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import SnowEffect from "@/components/SnowEffect";
import type { FetchMeta, JobListing, JobType, Region } from "@/lib/types";

function matchesCategory(title: string, description: string, category: string): boolean {
  if (category === "all") return true;
  const text = `${title} ${description}`.toLowerCase();
  if (category === "devops") return /devops|sre|platform|infrastructure|reliability/.test(text);
  if (category === "software") return /software|developer|engineer|frontend|backend|full.?stack/.test(text);
  if (category === "data") return /data|analyst|ml|machine learning|analytics/.test(text);
  return true;
}

function matchesPostedAt(iso: string | undefined, filter: string): boolean {
  if (filter === "any" || !iso) return true;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return true;
  const ms = Date.now() - then;
  if (filter === "24h") return ms <= 86400000;
  if (filter === "7d") return ms <= 7 * 86400000;
  if (filter === "30d") return ms <= 30 * 86400000;
  return true;
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [meta, setMeta] = useState<FetchMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [regions, setRegions] = useState<Region[]>(["india", "europe"]);
  const [types, setTypes] = useState<JobType[]>(["internship", "full-time"]);
  const [requireBtech, setRequireBtech] = useState(true);
  const [require2025, setRequire2025] = useState(true);
  const [search, setSearch] = useState("");
  const [includeManual, setIncludeManual] = useState(true);

  const [category, setCategory] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [postedAt, setPostedAt] = useState("any");
  const [locationFilter, setLocationFilter] = useState("");

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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (jobTypeFilter !== "all" && job.jobType !== jobTypeFilter) return false;
      if (!matchesCategory(job.title, job.description, category)) return false;
      if (!matchesPostedAt(job.postedAt, postedAt)) return false;
      if (locationFilter.trim()) {
        const loc = locationFilter.toLowerCase();
        if (!job.location.toLowerCase().includes(loc)) return false;
      }
      return true;
    });
  }, [jobs, jobTypeFilter, category, postedAt, locationFilter]);

  return (
    <div className="page-shell relative min-h-screen">
      <SnowEffect />
      <Header />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <section>
            <h1 className="mb-6 text-2xl font-bold text-slate-900">All Jobs</h1>

            {meta && (
              <p className="mb-4 text-sm text-slate-500">
                {loading ? (
                  "Scanning career pages…"
                ) : (
                  <>
                    <span className="font-medium text-violet-600">{filteredJobs.length}</span> roles
                    {filteredJobs.length !== meta.totalMatched && (
                      <> (of {meta.totalMatched} matched)</>
                    )}
                  </>
                )}
              </p>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-500 shadow-sm">
                <p>No roles match your filters.</p>
                <p className="mt-2 text-sm">Try relaxing filters or search terms.</p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {filteredJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} isFeatured={index === 0} />
                ))}
              </ul>
            )}
          </section>

          <FilterSidebar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            jobTypeFilter={jobTypeFilter}
            onJobTypeFilterChange={setJobTypeFilter}
            postedAt={postedAt}
            onPostedAtChange={setPostedAt}
            location={locationFilter}
            onLocationChange={setLocationFilter}
            regions={regions}
            onToggleRegion={toggleRegion}
            types={types}
            onToggleType={toggleType}
            requireBtech={requireBtech}
            onRequireBtechChange={setRequireBtech}
            require2025={require2025}
            onRequire2025Change={setRequire2025}
          />
        </div>
      </div>
    </div>
  );
}
