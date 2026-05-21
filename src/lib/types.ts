export type JobType = "internship" | "full-time" | "both";
export type Region = "india" | "europe" | "global";

export interface JobListing {
  id: string;
  companyId: string;
  companyName: string;
  careerUrl: string;
  title: string;
  location: string;
  jobType: JobType;
  description: string;
  experienceHint: string;
  applyUrl: string;
  postedAt?: string;
  source: "greenhouse" | "lever" | "manual";
  matchTags: string[];
}

export interface FetchMeta {
  fetchedAt: string;
  totalRaw: number;
  totalMatched: number;
  companiesScanned: number;
  errors: string[];
}
