import { NextRequest, NextResponse } from "next/server";
import { fetchArbeitnowJobs, fetchRemotiveJobs } from "@/lib/fetchers/aggregators";
import { fetchAllGreenhouseJobs } from "@/lib/fetchers/greenhouse";
import { fetchAllLeverJobs } from "@/lib/fetchers/lever";
import { getManualCareerPortals } from "@/lib/manual-links";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const jobId = decodeURIComponent(id);

  const [gh, lever, remotive, arbeitnow] = await Promise.all([
    fetchAllGreenhouseJobs(),
    fetchAllLeverJobs(),
    fetchRemotiveJobs(),
    fetchArbeitnowJobs(),
  ]);

  const manual = getManualCareerPortals("");
  const all = [...gh.jobs, ...lever, ...remotive, ...arbeitnow, ...manual];
  const job = all.find((j) => j.id === jobId);

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}
