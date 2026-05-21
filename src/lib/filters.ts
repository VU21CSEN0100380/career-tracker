import type { JobListing, JobType, Region } from "./types";

const BTECH_PATTERNS = [
  /\bb\.?\s*tech\b/i,
  /\bb\.?\s*e\.?\b/i,
  /\bbachelor.*(technology|engineering)/i,
  /\bengineering\s+degree\b/i,
  /\bcomputer\s+science\b/i,
  /\bcse\b/i,
  /\bit\s+degree\b/i,
  /\bundergraduate\b/i,
  /\b(?:bsc|bs)\b.*\b(?:cs|computer)/i,
];

const PASSOUT_2025_PATTERNS = [
  /\b2025\b/,
  /\bclass\s+of\s+2025\b/i,
  /\bgraduat(?:e|ing)\s+in\s+2025\b/i,
  /\b(?:may|june|july|august|dec(?:ember)?)\s+2025\b/i,
  /\brecent\s+graduate\b/i,
  /\bnew\s+grad(?:uate)?\b/i,
  /\buniversity\s+recruit/i,
  /\bcampus\s+hire/i,
  /\bearly\s+career\b/i,
  /\b0\s*[-–]\s*1\s+years?\b/i,
  /\b0\s*[-–]\s*2\s+years?\b/i,
  /\bfresher\b/i,
  /\bentry[\s-]level\b/i,
];

const INTERN_PATTERNS = [
  /\bintern(?:ship)?\b/i,
  /\bco[\s-]?op\b/i,
  /\btrainee\b/i,
  /\bapprentice/i,
  /\bgraduate\s+program/i,
  /\buniversity\s+program/i,
];

const FULLTIME_PATTERNS = [
  /\bfull[\s-]?time\b/i,
  /\bassociate\b/i,
  /\bengineer\b/i,
  /\bdeveloper\b/i,
  /\bsoftware\b/i,
  /\banalyst\b/i,
  /\bnew\s+grad\b/i,
];

const INDIA_LOCATION_PATTERNS = [
  /\bindia\b/i,
  /\bbangalore\b/i,
  /\bbengaluru\b/i,
  /\bhyderabad\b/i,
  /\bmumbai\b/i,
  /\bdelhi\b/i,
  /\bgurugram\b/i,
  /\bgurgaon\b/i,
  /\bchennai\b/i,
  /\bpune\b/i,
  /\bnoida\b/i,
  /\bkolkata\b/i,
  /\btamil\s+nadu\b/i,
  /\bkarnataka\b/i,
  /\btelangana\b/i,
];

const EUROPE_LOCATION_PATTERNS = [
  /\beurope\b/i,
  /\buk\b/i,
  /\bunited\s+kingdom\b/i,
  /\blondon\b/i,
  /\bireland\b/i,
  /\bdublin\b/i,
  /\bgermany\b/i,
  /\bberlin\b/i,
  /\bfrance\b/i,
  /\bparis\b/i,
  /\bnetherlands\b/i,
  /\bamsterdam\b/i,
  /\bspain\b/i,
  /\bitaly\b/i,
  /\bpoland\b/i,
  /\bsweden\b/i,
  /\bswitzerland\b/i,
  /\baustria\b/i,
  /\bbelgium\b/i,
  /\bportugal\b/i,
  /\bremote\s*[-–]?\s*eu\b/i,
  /\beu\s+remote\b/i,
];

export function detectJobType(title: string, text: string): JobType {
  const combined = `${title} ${text}`;
  const isIntern = INTERN_PATTERNS.some((p) => p.test(combined));
  const isFt = FULLTIME_PATTERNS.some((p) => p.test(combined));
  if (isIntern && !isFt) return "internship";
  if (isIntern) return "both";
  return "full-time";
}

export function matchesBtech(text: string, strict: boolean): boolean {
  const hit = BTECH_PATTERNS.some((p) => p.test(text));
  if (strict) {
    return (
      hit ||
      /\b(engineer|developer|software|devops|sre|cloud|technology|computer science)\b/i.test(text)
    );
  }
  return hit || /\b(engineer|developer|software|technology|devops)\b/i.test(text);
}

export function matches2025Passout(text: string): boolean {
  return (
    PASSOUT_2025_PATTERNS.some((p) => p.test(text)) ||
    /\b(intern|internship|graduate|university|campus|entry[\s-]level|fresher|early career)\b/i.test(text)
  );
}

export function matchesRegion(locationText: string, regions: Region[]): boolean {
  if (regions.length === 0) return true;
  const india = INDIA_LOCATION_PATTERNS.some((p) => p.test(locationText));
  const europe = EUROPE_LOCATION_PATTERNS.some((p) => p.test(locationText));
  if (regions.includes("india") && india) return true;
  if (regions.includes("europe") && europe) return true;
  if (regions.includes("global") && (india || europe || /\bremote\b/i.test(locationText))) return true;
  return false;
}

export function filterJobs(
  jobs: JobListing[],
  opts: {
    regions: Region[];
    jobTypes: JobType[];
    requireBtech: boolean;
    require2025: boolean;
    search: string;
  }
): JobListing[] {
  const q = opts.search.trim().toLowerCase();

  return jobs.filter((job) => {
    const text = `${job.title} ${job.description} ${job.experienceHint} ${job.location}`;
    const isPortal = job.source === "manual";

    if (opts.requireBtech && !isPortal && !matchesBtech(text, true)) return false;
    if (opts.require2025 && !isPortal && !matches2025Passout(text)) return false;
    if (opts.jobTypes.length) {
      const typeOk =
        job.jobType === "both" ||
        opts.jobTypes.includes(job.jobType);
      if (!typeOk) return false;
    }
    if (opts.regions.length && !matchesRegion(job.location, opts.regions)) return false;
    if (q) {
      const hay = `${job.title} ${text} ${job.companyName}`.toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      const allTermsMatch = terms.every((term) => hay.includes(term));
      if (!allTermsMatch) return false;
    }
    return true;
  });
}

export function extractExperienceHint(description: string): string {
  const plain = description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const patterns = [
    /(\d+\s*[-–]\s*\d+\s*years?[^.]{0,80})/i,
    /(\d+\+?\s*years?[^.]{0,60}experience)/i,
    /(experience\s*:\s*[^.]{5,80})/i,
    /(minimum\s+qualification[^.]{10,120})/i,
    /(education[^.]{10,120})/i,
    /(b\.?\s*tech[^.]{0,80})/i,
  ];
  for (const p of patterns) {
    const m = plain.match(p);
    if (m) return m[1].trim().slice(0, 200);
  }
  if (PASSOUT_2025_PATTERNS.some((p) => p.test(plain))) return "Likely new grad / 2025 passout friendly";
  if (INTERN_PATTERNS.some((p) => p.test(plain))) return "Internship / early career";
  return "See full JD on career page";
}
