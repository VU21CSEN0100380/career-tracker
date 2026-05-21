import { NextRequest, NextResponse } from "next/server";
import { fetchArbeitnowJobs, fetchRemotiveJobs } from "@/lib/fetchers/aggregators";
import { fetchAllGreenhouseJobs } from "@/lib/fetchers/greenhouse";
import { fetchAllLeverJobs } from "@/lib/fetchers/lever";
import { filterJobs } from "@/lib/filters";
import { getManualCareerPortals } from "@/lib/manual-links";
import type { JobType, Region } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const regions = (sp.get("regions") ?? "india,europe")
    .split(",")
    .filter(Boolean) as Region[];
  const jobTypes = (sp.get("types") ?? "internship,full-time")
    .split(",")
    .filter(Boolean) as JobType[];
  const requireBtech = sp.get("btech") !== "false";
  const require2025 = sp.get("passout2025") !== "false";
  const search = sp.get("q") ?? "";
  const includeManual = sp.get("manual") !== "false";

  const [gh, lever, remotive, arbeitnow] = await Promise.all([
    fetchAllGreenhouseJobs(),
    fetchAllLeverJobs(),
    fetchRemotiveJobs(),
    fetchArbeitnowJobs(),
  ]);

  const manual = includeManual ? getManualCareerPortals(search) : [];
  const all = [...gh.jobs, ...lever, ...remotive, ...arbeitnow, ...manual];

  const filtered = filterJobs(all, {
    regions,
    jobTypes,
    requireBtech,
    require2025,
    search,
  });

  const apiCompanies = new Set(
    [...gh.jobs, ...lever].map((j) => j.companyId)
  ).size;

  return NextResponse.json({
    jobs: filtered,
    meta: {
      fetchedAt: new Date().toISOString(),
      totalRaw: all.length,
      totalMatched: filtered.length,
      companiesScanned: apiCompanies,
      portalLinks: manual.length,
      sources: {
        greenhouse: gh.jobs.length,
        lever: lever.length,
        remotive: remotive.length,
        arbeitnow: arbeitnow.length,
        manual: manual.length,
      },
      errors: gh.apiErrors,
    },
  });
}
