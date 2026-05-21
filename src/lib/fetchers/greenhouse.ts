import { COMPANIES, type CompanySource } from "@/data/companies";
import {
  detectJobType,
  extractExperienceHint,
  matches2025Passout,
  matchesBtech,
  matchesRegion,
} from "@/lib/filters";
import type { JobListing, Region } from "@/lib/types";

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  content?: string;
  updated_at?: string;
  metadata?: { id: number; name: string; value: string }[];
}

function buildTags(title: string, description: string, location: string): string[] {
  const text = `${title} ${description} ${location}`;
  const tags: string[] = [];
  if (matchesBtech(text, false)) tags.push("B.Tech-friendly");
  if (matches2025Passout(text)) tags.push("2025 passout");
  if (/\bintern/i.test(text)) tags.push("Internship");
  if (/\bfull[\s-]?time|new\s+grad/i.test(text)) tags.push("Full-time");
  return tags;
}

function isRelevantForGraduate(title: string, description: string, location: string, companyRegions: Region[]): boolean {
  const text = `${title} ${description} ${location}`;
  const gradSignal = matches2025Passout(text) || /\bintern|graduate|university|campus|entry|fresher|0\s*-\s*2/i.test(text);
  const eduSignal = matchesBtech(text, false) || /\bengineer|developer|software|technology|computer/i.test(text);
  const regionOk = matchesRegion(location, companyRegions) || matchesRegion(description, companyRegions);
  return gradSignal && eduSignal && regionOk;
}

export async function fetchGreenhouseJobs(company: CompanySource): Promise<JobListing[]> {
  if (!company.boardId) return [];
  const url = `https://boards-api.greenhouse.io/v1/boards/${company.boardId}/jobs?content=true`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${company.name}: Greenhouse API ${res.status}`);
  const data = (await res.json()) as { jobs: GreenhouseJob[] };
  const jobs: JobListing[] = [];

  for (const job of data.jobs ?? []) {
    const description = job.content ?? "";
    const location = job.location?.name ?? "Unspecified";
    if (!isRelevantForGraduate(job.title, description, location, company.regions)) continue;

    const jobType = detectJobType(job.title, description);
    jobs.push({
      id: `gh-${company.id}-${job.id}`,
      companyId: company.id,
      companyName: company.name,
      careerUrl: company.careerUrl,
      title: job.title,
      location,
      jobType,
      description: description.slice(0, 4000),
      experienceHint: extractExperienceHint(description),
      applyUrl: job.absolute_url,
      postedAt: job.updated_at,
      source: "greenhouse",
      matchTags: buildTags(job.title, description, location),
    });
  }
  return jobs;
}

export async function fetchAllGreenhouseJobs(): Promise<{ jobs: JobListing[]; errors: string[] }> {
  const ghCompanies = COMPANIES.filter((c) => c.ats === "greenhouse" && c.boardId);
  const results = await Promise.allSettled(ghCompanies.map((c) => fetchGreenhouseJobs(c)));
  const jobs: JobListing[] = [];
  const errors: string[] = [];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") jobs.push(...r.value);
    else errors.push(`${ghCompanies[i].name}: ${r.reason?.message ?? "fetch failed"}`);
  });

  return { jobs, errors };
}
