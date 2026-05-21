"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import Header from "@/components/Header";
import SnowEffect from "@/components/SnowEffect";
import { htmlToPlainText, prepareJobHtml } from "@/lib/html";
import { formatTimeAgo } from "@/lib/time-ago";
import type { JobListing } from "@/lib/types";

export default function JobDetailPage() {
  const params = useParams();
  const id = decodeURIComponent((params?.id as string) ?? "");
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/jobs/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Job not found");
        return res.json();
      })
      .then((data) => {
        setJob(data.job);
        setError("");
      })
      .catch(() => setError("Could not load this job description."))
      .finally(() => setLoading(false));
  }, [id]);

  const isManual = job?.source === "manual";
  const jdHtml = job && !isManual ? prepareJobHtml(job.description) : "";
  const plain = job ? (isManual ? job.description : htmlToPlainText(job.description)) : "";

  return (
    <div className="page-shell relative min-h-screen">
      <SnowEffect />
      <Header />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-violet-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Jobs search
        </Link>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : error || !job ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            <p>{error || "Job not found."}</p>
            <Link href="/" className="mt-4 inline-block text-violet-600 hover:underline">
              Back to all jobs
            </Link>
          </div>
        ) : (
          <article className="jd-card rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-start gap-4 border-b border-slate-100 pb-6">
              <CompanyLogo
                companyId={job.companyId}
                companyName={job.companyName}
                careerUrl={job.careerUrl}
                jobId={job.id}
                size={56}
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{job.title}</h1>
                <p className="mt-2 text-sm text-slate-500">
                  {job.companyName} • {job.jobType === "internship" ? "Internship" : "Full-time"} •{" "}
                  {job.location} • {formatTimeAgo(job.postedAt)}
                </p>
              </div>
            </div>

            <div className="posted-hover group/time relative mt-4 flex justify-end">
              <span className="flex items-center gap-1.5 text-sm text-slate-400 transition group-hover/time:opacity-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {formatTimeAgo(job.postedAt)}
              </span>
              <label
                className="apply-checkbox absolute right-0 top-0 flex cursor-pointer items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 opacity-0 shadow-sm transition hover:bg-violet-100 group-hover/time:opacity-100"
              >
                <input type="checkbox" className="accent-violet-600" readOnly />
                Apply
              </label>
            </div>

            <section className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Responsibilities</h2>
              {jdHtml ? (
                <div
                  className="job-jd-content mt-4 text-sm text-slate-700"
                  dangerouslySetInnerHTML={{ __html: jdHtml }}
                />
              ) : (
                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {plain || "Open the official career page for the full job description."}
                </div>
              )}
            </section>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                {isManual ? "Search on career site" : "Apply on career page"}
              </a>
              <a
                href={job.careerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
              >
                {job.companyName} careers
              </a>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
