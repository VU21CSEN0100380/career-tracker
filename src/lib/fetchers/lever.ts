import { COMPANIES, type CompanySource } from "@/data/companies";
import { decodeHtmlEntities, htmlToPlainText } from "@/lib/html";
import {
  detectJobType,
  extractExperienceHint,
  matches2025Passout,
  matchesBtech,
  matchesRegion,
} from "@/lib/filters";
import type { JobListing, Region } from "@/lib/types";

interface LeverJob {
  id: string;
  text: string;
  hostedUrl: string;
  descriptionPlain?: string;
  description?: string;
  categories?: {
    location?: string;
    commitment?: string;
    team?: string;
  };
  createdAt?: number;
}

const TECH_TITLE =
  /\b(engineer|developer|devops|sre|software|intern|graduate|cloud|platform|data|backend|frontend|fresher|entry)\b/i;

function buildTags(title: string, text: string, location: string): string[] {
  const tags: string[] = [];
  if (matchesBtech(text, false)) tags.push("B.Tech-friendly");
  if (matches2025Passout(text)) tags.push("2025 passout");
  if (/\bintern/i.test(text)) tags.push("Internship");
  if (/\bengineer|full[\s-]?time/i.test(text)) tags.push("Full-time");
  return tags;
}

export async function fetchLeverJobs(company: CompanySource): Promise<JobListing[]> {
  if (!company.boardId) return [];
  const url = `https://api.lever.co/v0/postings/${company.boardId}?mode=json`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) return [];

  const data = (await res.json()) as LeverJob[];
  const jobs: JobListing[] = [];

  for (const job of data) {
    const title = job.text ?? "";
    if (!TECH_TITLE.test(title)) continue;

    const raw = job.description ?? job.descriptionPlain ?? "";
    const description = job.description ? decodeHtmlEntities(raw) : raw;
    const location = job.categories?.location ?? "Unspecified";
    const text = `${title} ${htmlToPlainText(description)} ${location}`;

    if (
      !matchesRegion(location, company.regions) &&
      !matchesRegion(description, company.regions) &&
      !(company.regions.includes("global") && /\bremote\b/i.test(text))
    ) {
      continue;
    }

    jobs.push({
      id: `lever-${company.id}-${job.id}`,
      companyId: company.id,
      companyName: company.name,
      careerUrl: company.careerUrl,
      title,
      location,
      jobType: detectJobType(title, description),
      description: description.slice(0, 8000),
      experienceHint: extractExperienceHint(htmlToPlainText(description)),
      applyUrl: job.hostedUrl,
      postedAt: job.createdAt ? new Date(job.createdAt).toISOString() : undefined,
      source: "lever",
      matchTags: buildTags(title, text, location),
    });
  }
  return jobs;
}

export async function fetchAllLeverJobs(): Promise<JobListing[]> {
  const leverCompanies = COMPANIES.filter((c) => c.ats === "lever" && c.boardId);
  const results = await Promise.allSettled(leverCompanies.map((c) => fetchLeverJobs(c)));
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
