import { COMPANIES } from "@/data/companies";

const DOMAIN_OVERRIDES: Record<string, string> = {
  "amazon-in": "amazon.com",
  "microsoft-in": "microsoft.com",
  "google-in": "google.com",
  "oracle-in": "oracle.com",
};

export function getCompanyDomain(companyId: string, careerUrl: string): string {
  if (DOMAIN_OVERRIDES[companyId]) return DOMAIN_OVERRIDES[companyId];
  try {
    return new URL(careerUrl).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getCompanyLogoUrl(companyId: string, careerUrl: string): string {
  const domain = getCompanyDomain(companyId, careerUrl);
  if (domain) return `https://logo.clearbit.com/${domain}`;
  return "";
}

export function getCompanyInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function getCompanyCareerUrl(companyId: string): string {
  return COMPANIES.find((c) => c.id === companyId)?.careerUrl ?? "";
}
