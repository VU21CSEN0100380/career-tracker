import { htmlToPlainText } from "@/lib/html";
import {
  detectJobType,
  extractExperienceHint,
  matches2025Passout,
  matchesBtech,
  matchesRegion,
} from "@/lib/filters";
import type { JobListing, Region } from "@/lib/types";

/** Free public job APIs — no company-specific key required */

function buildTags(text: string): string[] {
  const tags: string[] = [];
  if (matchesBtech(text, false)) tags.push("B.Tech-friendly");
  if (matches2025Passout(text)) tags.push("2025 passout");
  if (/\bintern/i.test(text)) tags.push("Internship");
  if (/\bengineer|developer|devops/i.test(text)) tags.push("Full-time");
  return tags;
}

const TECH =
  /\b(devops|sre|software\s+engineer|backend|frontend|full[\s-]?stack|cloud|platform|data\s+engineer|graduate|intern|entry|fresher|developer)\b/i;

export async function fetchRemotiveJobs(): Promise<JobListing[]> {
  const res = await fetch("https://remotive.com/api/remote-jobs?category=devops", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    jobs: {
      id: number;
      title: string;
      company_name: string;
      description: string;
      url: string;
      candidate_required_location?: string;
      job_type?: string;
      publication_date?: string;
    }[];
  };

  const jobs: JobListing[] = [];
  for (const job of data.jobs ?? []) {
    if (!TECH.test(job.title) && !/devops/i.test(job.description)) continue;
    const location = job.candidate_required_location ?? "Remote";
    const description = job.description ?? "";
    const plain = htmlToPlainText(description);
    const regions: Region[] = ["global", "europe", "india"];
    if (!matchesRegion(location, regions) && !/\bremote|worldwide|anywhere|india|europe|uk|germany\b/i.test(plain)) {
      continue;
    }

    jobs.push({
      id: `remotive-${job.id}`,
      companyId: `remotive-${job.company_name.toLowerCase().replace(/\s+/g, "-")}`,
      companyName: job.company_name,
      careerUrl: job.url,
      title: job.title,
      location,
      jobType: detectJobType(job.title, plain),
      description: plain.slice(0, 8000),
      experienceHint: extractExperienceHint(plain),
      applyUrl: job.url,
      postedAt: job.publication_date,
      source: "remotive",
      matchTags: [...buildTags(`${job.title} ${plain}`), "Remote-friendly"],
    });
  }
  return jobs;
}

export async function fetchArbeitnowJobs(): Promise<JobListing[]> {
  const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    data: {
      slug: string;
      title: string;
      company_name: string;
      description: string;
      url: string;
      location: string;
      remote: boolean;
      tags?: string[];
    }[];
  };

  const jobs: JobListing[] = [];
  for (const job of data.data ?? []) {
    if (!TECH.test(job.title) && !(job.tags ?? []).some((t) => /devops|engineer|software/i.test(t))) {
      continue;
    }
    const plain = htmlToPlainText(job.description ?? "");
    const location = job.remote ? `Remote · ${job.location}` : job.location;
    if (!matchesRegion(location, ["europe", "global"]) && !job.remote) continue;

    jobs.push({
      id: `arbeitnow-${job.slug}`,
      companyId: `arbeitnow-${job.company_name.toLowerCase().replace(/\s+/g, "-")}`,
      companyName: job.company_name,
      careerUrl: job.url,
      title: job.title,
      location,
      jobType: detectJobType(job.title, plain),
      description: plain.slice(0, 8000),
      experienceHint: extractExperienceHint(plain),
      applyUrl: job.url,
      source: "arbeitnow",
      matchTags: [...buildTags(`${job.title} ${plain}`), "Europe"],
    });
  }
  return jobs;
}
