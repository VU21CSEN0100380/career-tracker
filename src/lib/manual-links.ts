import { COMPANIES, type CompanySource } from "@/data/companies";
import type { JobListing, Region } from "@/lib/types";

const DEFAULT_SEARCH =
  "software engineer OR devops OR intern OR graduate 2025 B.Tech India";

export function buildPortalSearchUrl(company: CompanySource, userQuery: string): string {
  const q = encodeURIComponent(
    userQuery.trim() || DEFAULT_SEARCH
  );
  const base = company.careerUrl;

  switch (company.id) {
    case "amazon-in":
      return `https://www.amazon.jobs/en/search?base_query=${q}&loc_query=India`;
    case "google-in":
      return `https://www.google.com/about/careers/applications/jobs/results/?location=India&q=${q}`;
    case "microsoft-in":
      return `https://careers.microsoft.com/v2/global/en/search?q=${q}&lc=India`;
    case "oracle-in":
      return `https://careers.oracle.com/en/sites/jobsearch/jobs?keywords=${q}&location=India`;
    case "flipkart":
      return `https://www.flipkartcareers.com/#!/search?q=${q}`;
    case "wipro":
      return `https://careers.wipro.com/search/?q=${q}`;
    case "sap":
      return `https://jobs.sap.com/search/?q=${q}`;
    case "booking":
      return `https://jobs.booking.com/search?q=${q}`;
    default:
      if (company.searchParam === "keywords") {
        return `${base}${base.includes("?") ? "&" : "?"}keywords=${q}`;
      }
      if (company.searchParam === "base_query") {
        return `${base}${base.includes("?") ? "&" : "?"}base_query=${q}`;
      }
      if (company.searchParam === "q") {
        return `${base}${base.includes("?") ? "&" : "?"}q=${q}`;
      }
      return base;
  }
}

function regionLabel(regions: Region[]): string {
  if (regions.includes("india") && regions.includes("europe")) return "India & Europe";
  if (regions.includes("india")) return "India";
  if (regions.includes("europe")) return "Europe";
  return "Global";
}

/**
 * Official career portals — no public API, but user gets a direct search URL.
 */
export function getManualCareerPortals(userQuery: string): JobListing[] {
  return COMPANIES.filter((c) => c.ats === "manual").map((c) => {
    const searchUrl = buildPortalSearchUrl(c, userQuery);
    const q = userQuery.trim() || "DevOps / Software Engineer / Intern / 2025";

    return {
      id: `manual-${c.id}`,
      companyId: c.id,
      companyName: c.name,
      careerUrl: c.careerUrl,
      title: `Search careers: ${q}`,
      location: regionLabel(c.regions),
      jobType: "both" as const,
      description: `No public job API for ${c.name}. Click Apply to open their official careers site with your search pre-filled. Look for: B.Tech, 2025 graduate, internship, DevOps, software engineer, entry level.`,
      experienceHint: "Open portal → filter by India/Europe, intern or full-time, 2025 passout",
      applyUrl: searchUrl,
      source: "manual" as const,
      matchTags: ["Career portal search", "No API — official site", regionLabel(c.regions)],
    };
  });
}
