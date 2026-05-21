import { NextRequest, NextResponse } from "next/server";
import { filterJobs } from "@/lib/filters";
import { fetchAllGreenhouseJobs } from "@/lib/fetchers/greenhouse";
import { getManualCareerPortals } from "@/lib/manual-links";
import type { JobType, Region } from "@/lib/types";

export const dynamic = "force-dynamic";

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

  const { jobs: ghJobs, errors } = await fetchAllGreenhouseJobs();
  const manual = includeManual ? getManualCareerPortals() : [];
  const all = [...ghJobs, ...manual];

  const filtered = filterJobs(all, {
    regions,
    jobTypes,
    requireBtech,
    require2025,
    search,
  });

  return NextResponse.json({
    jobs: filtered,
    meta: {
      fetchedAt: new Date().toISOString(),
      totalRaw: all.length,
      totalMatched: filtered.length,
      companiesScanned: ghJobs.length > 0 ? new Set(ghJobs.map((j) => j.companyId)).size : 0,
      errors,
    },
  });
}
