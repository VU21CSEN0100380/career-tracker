import { COMPANIES } from "@/data/companies";
import type { JobListing } from "@/lib/types";

/**
 * Companies with custom career sites (no public API) — shown as curated portal links.
 * User opens official career page and filters for 2025 / B.Tech / intern locally.
 */
export function getManualCareerPortals(): JobListing[] {
  return COMPANIES.filter((c) => c.ats === "manual").map((c) => ({
    id: `manual-${c.id}`,
    companyId: c.id,
    companyName: c.name,
    careerUrl: c.careerUrl,
    title: "Open official career portal",
    location: c.regions.includes("india") && c.regions.includes("europe")
      ? "India & Europe"
      : c.regions.includes("india")
        ? "India"
        : c.regions.includes("europe")
          ? "Europe"
          : "Global",
    jobType: "both" as const,
    description:
      "This company uses a custom careers website. Search for: Internship, University, New Grad, 2025, B.Tech, Entry Level, Graduate Program.",
    experienceHint: "Filter on site: 2025 passout · B.Tech · Internship / Full-time",
    applyUrl: c.careerUrl,
    source: "manual" as const,
    matchTags: ["Career portal", ...c.regions.map((r) => r.charAt(0).toUpperCase() + r.slice(1))],
  }));
}
