"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import CompanyLogo from "@/components/CompanyLogo";
import { formatTimeAgo } from "@/lib/time-ago";
import type { JobListing } from "@/lib/types";

interface JobCardProps {
  job: JobListing;
  isFeatured?: boolean;
}

function roleTag(job: JobListing): string {
  const tag = job.matchTags.find((t) => !/B\.Tech|2025|Internship|Full-time/i.test(t));
  if (tag) return tag;
  if (/devops|sre|platform/i.test(job.title)) return "DevOps";
  if (/intern/i.test(job.title)) return "Internship";
  return job.jobType === "internship" ? "Intern" : "Engineering";
}

export default function JobCard({ job, isFeatured }: JobCardProps) {
  const router = useRouter();
  const jdPath = `/jobs/${encodeURIComponent(job.id)}`;
  const timeAgo = formatTimeAgo(job.postedAt);
  const jobTypeLabel = job.jobType === "internship" ? "Internship" : "Full-time";

  const goToJd = () => router.push(jdPath);

  return (
    <li className="job-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <CompanyLogo
          companyId={job.companyId}
          companyName={job.companyName}
          careerUrl={job.careerUrl}
          jobId={job.id}
        />

        <div className="min-w-0 flex-1">
          <Link href={jdPath} className="group block">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-violet-700">
              {job.title}
            </h2>
          </Link>
          <p className="mt-0.5 text-sm text-slate-500">
            {job.companyName} • {jobTypeLabel} • {job.location}
          </p>
          <span className="mt-2 inline-block rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
            {roleTag(job)}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-start gap-2">
          {isFeatured ? (
            <Link
              href={jdPath}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Apply
            </Link>
          ) : (
            <div className="posted-hover group/time relative flex min-w-[7rem] flex-col items-end">
              <div className="flex items-center gap-1.5 text-sm text-slate-400 transition group-hover/time:opacity-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span>{timeAgo}</span>
              </div>
              <label
                className="apply-checkbox absolute right-0 top-0 flex cursor-pointer items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 opacity-0 shadow-sm transition hover:bg-violet-100 group-hover/time:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  goToJd();
                }}
              >
                <input
                  type="checkbox"
                  className="accent-violet-600"
                  onChange={goToJd}
                  onClick={(e) => e.stopPropagation()}
                />
                Apply
              </label>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
