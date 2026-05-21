export type JobType = "internship" | "full-time" | "both";
export type Region = "india" | "europe" | "global";

export type JobSource =
  | "greenhouse"
  | "lever"
  | "manual"
  | "remotive"
  | "arbeitnow";

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
  source: JobSource;
  matchTags: string[];
}

export interface FetchMeta {
  fetchedAt: string;
  totalRaw: number;
  totalMatched: number;
  companiesScanned: number;
  portalLinks: number;
  sources: {
    greenhouse: number;
    lever: number;
    remotive: number;
    arbeitnow: number;
    manual: number;
  };
  errors: string[];
}
