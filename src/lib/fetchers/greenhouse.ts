import { COMPANIES, type CompanySource } from "@/data/companies";
import { decodeHtmlEntities } from "@/lib/html";
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
}

const TECH_TITLE =
  /\b(engineer|developer|devops|sre|software|analyst|intern|graduate|cloud|platform|data|backend|frontend|full[\s-]?stack|fresher|entry|associate|programmer|architect|consultant|administrator|reliability|infrastructure|security)\b/i;

function buildTags(title: string, description: string, location: string): string[] {
  const text = `${title} ${description} ${location}`;
  const tags: string[] = [];
  if (matchesBtech(text, false)) tags.push("B.Tech-friendly");
  if (matches2025Passout(text)) tags.push("2025 passout");
  if (/\bintern/i.test(text)) tags.push("Internship");
  if (/\bfull[\s-]?time|new\s+grad|engineer/i.test(text)) tags.push("Full-time");
  return tags;
}

function isRelevantJob(
  title: string,
  description: string,
  location: string,
  companyRegions: Region[]
): boolean {
  if (!TECH_TITLE.test(title)) return false;
  const locText = `${location} ${description}`;
  if (matchesRegion(location, companyRegions)) return true;
  if (matchesRegion(description, companyRegions)) return true;
  if (companyRegions.includes("global") && /\bremote\b/i.test(locText)) return true;
  return false;
}

export async function fetchGreenhouseJobs(company: CompanySource): Promise<JobListing[]> {
  if (!company.boardId) return [];
  const url = `https://boards-api.greenhouse.io/v1/boards/${company.boardId}/jobs?content=true`;
  const res = await fetch(url, {
    next: { revalidate: 1800 },
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as { jobs: GreenhouseJob[] };
  const jobs: JobListing[] = [];

  for (const job of data.jobs ?? []) {
    const rawDescription = job.content ?? "";
    const description = decodeHtmlEntities(rawDescription);
    const location = job.location?.name ?? "Unspecified";
    if (!isRelevantJob(job.title, description, location, company.regions)) continue;

    const jobType = detectJobType(job.title, description);
    jobs.push({
      id: `gh-${company.id}-${job.id}`,
      companyId: company.id,
      companyName: company.name,
      careerUrl: company.careerUrl,
      title: job.title,
      location,
      jobType,
      description: description.slice(0, 8000),
      experienceHint: extractExperienceHint(description),
      applyUrl: job.absolute_url,
      postedAt: job.updated_at,
      source: "greenhouse",
      matchTags: buildTags(job.title, description, location),
    });
  }
  return jobs;
}

export async function fetchAllGreenhouseJobs(): Promise<{
  jobs: JobListing[];
  apiErrors: string[];
}> {
  const ghCompanies = COMPANIES.filter((c) => c.ats === "greenhouse" && c.boardId);
  const jobs: JobListing[] = [];
  const apiErrors: string[] = [];

  const batchSize = 6;
  for (let i = 0; i < ghCompanies.length; i += batchSize) {
    const batch = ghCompanies.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map((c) => fetchGreenhouseJobs(c)));
    results.forEach((r, idx) => {
      const company = batch[idx];
      if (r.status === "fulfilled") {
        jobs.push(...r.value);
      } else {
        apiErrors.push(`${company.name}: ${r.reason?.message ?? "unavailable"}`);
      }
    });
  }

  return { jobs, apiErrors };
}
