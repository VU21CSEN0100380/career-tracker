"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getCompanyInitials, getCompanyLogoUrl } from "@/lib/company-logo";

interface CompanyLogoProps {
  companyId: string;
  companyName: string;
  careerUrl: string;
  jobId: string;
  size?: number;
}

export default function CompanyLogo({
  companyId,
  companyName,
  careerUrl,
  jobId,
  size = 48,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getCompanyLogoUrl(companyId, careerUrl);
  const initials = getCompanyInitials(companyName);

  return (
    <Link
      href={`/jobs/${encodeURIComponent(jobId)}`}
      className="logo-link flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-violet-300 hover:shadow-md"
      style={{ width: size, height: size }}
      title={`View job description — ${companyName}`}
    >
      {!failed && logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${companyName} logo`}
          width={size}
          height={size}
          className="object-contain p-1"
          onError={() => setFailed(true)}
          unoptimized
        />
      ) : (
        <span className="text-sm font-bold text-violet-600">{initials}</span>
      )}
    </Link>
  );
}
