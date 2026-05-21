export type AtsType = "greenhouse" | "lever" | "manual";
export type Region = "india" | "europe" | "global";

export interface CompanySource {
  id: string;
  name: string;
  careerUrl: string;
  ats: AtsType;
  /** Greenhouse board slug or Lever company slug (verified) */
  boardId?: string;
  regions: Region[];
  /** Query appended for manual portal deep-search */
  searchParam?: "q" | "keywords" | "base_query";
}

/** Only boards verified against public APIs (reduces "API unavailable" noise) */
export const COMPANIES: CompanySource[] = [
  // —— Greenhouse (live API) ——
  { id: "zscaler", name: "Zscaler", careerUrl: "https://www.zscaler.com/careers", ats: "greenhouse", boardId: "zscaler", regions: ["india", "global"] },
  { id: "postman", name: "Postman", careerUrl: "https://www.postman.com/company/careers/", ats: "greenhouse", boardId: "postman", regions: ["india", "global"] },
  { id: "phonepe", name: "PhonePe", careerUrl: "https://www.phonepe.com/careers/", ats: "greenhouse", boardId: "phonepe", regions: ["india"] },
  { id: "stripe", name: "Stripe", careerUrl: "https://stripe.com/jobs", ats: "greenhouse", boardId: "stripe", regions: ["europe", "global", "india"] },
  { id: "adyen", name: "Adyen", careerUrl: "https://careers.adyen.com/", ats: "greenhouse", boardId: "adyen", regions: ["europe"] },
  { id: "gitlab", name: "GitLab", careerUrl: "https://about.gitlab.com/jobs/", ats: "greenhouse", boardId: "gitlab", regions: ["europe", "global"] },
  { id: "datadog", name: "Datadog", careerUrl: "https://careers.datadoghq.com/", ats: "greenhouse", boardId: "datadog", regions: ["europe", "global", "india"] },
  { id: "cloudflare", name: "Cloudflare", careerUrl: "https://www.cloudflare.com/careers/jobs/", ats: "greenhouse", boardId: "cloudflare", regions: ["europe", "global"] },
  { id: "monzo", name: "Monzo", careerUrl: "https://monzo.com/careers/", ats: "greenhouse", boardId: "monzo", regions: ["europe"] },
  { id: "figma", name: "Figma", careerUrl: "https://www.figma.com/careers/", ats: "greenhouse", boardId: "figma", regions: ["global"] },
  { id: "airbnb", name: "Airbnb", careerUrl: "https://careers.airbnb.com/", ats: "greenhouse", boardId: "airbnb", regions: ["global"] },
  { id: "elastic", name: "Elastic", careerUrl: "https://www.elastic.co/careers", ats: "greenhouse", boardId: "elastic", regions: ["europe", "global"] },
  { id: "mongodb", name: "MongoDB", careerUrl: "https://www.mongodb.com/careers", ats: "greenhouse", boardId: "mongodb", regions: ["europe", "global", "india"] },
  { id: "databricks", name: "Databricks", careerUrl: "https://www.databricks.com/company/careers", ats: "greenhouse", boardId: "databricks", regions: ["europe", "global", "india"] },

  // —— Lever (live API) ——
  { id: "spotify", name: "Spotify", careerUrl: "https://www.lifeatspotify.com/jobs", ats: "lever", boardId: "spotify", regions: ["europe", "global"] },
  { id: "palantir", name: "Palantir", careerUrl: "https://www.palantir.com/careers/", ats: "lever", boardId: "palantir", regions: ["europe", "global"] },
  { id: "cred", name: "CRED", careerUrl: "https://careers.cred.club/", ats: "lever", boardId: "cred", regions: ["india"] },
  { id: "meesho", name: "Meesho", careerUrl: "https://www.meesho.io/careers", ats: "lever", boardId: "meesho", regions: ["india"] },

  // —— Manual portals (official site — use search links in app) ——
  { id: "razorpay", name: "Razorpay", careerUrl: "https://razorpay.com/jobs/", ats: "manual", regions: ["india"], searchParam: "q" },
  { id: "freshworks", name: "Freshworks", careerUrl: "https://www.freshworks.com/company/careers/", ats: "manual", regions: ["india", "global"], searchParam: "q" },
  { id: "swiggy", name: "Swiggy", careerUrl: "https://careers.swiggy.com/", ats: "manual", regions: ["india"] },
  { id: "flipkart", name: "Flipkart", careerUrl: "https://www.flipkartcareers.com/", ats: "manual", regions: ["india"], searchParam: "q" },
  { id: "amazon-in", name: "Amazon India", careerUrl: "https://www.amazon.jobs/en/search?loc_query=India", ats: "manual", regions: ["india"], searchParam: "base_query" },
  { id: "microsoft-in", name: "Microsoft India", careerUrl: "https://careers.microsoft.com/v2/global/en/locations/india.html", ats: "manual", regions: ["india"], searchParam: "q" },
  { id: "google-in", name: "Google India", careerUrl: "https://www.google.com/about/careers/applications/jobs/results/?location=India", ats: "manual", regions: ["india"], searchParam: "q" },
  { id: "oracle-in", name: "Oracle India", careerUrl: "https://careers.oracle.com/en/sites/jobsearch/jobs?location=India", ats: "manual", regions: ["india"], searchParam: "keywords" },
  { id: "infosys", name: "Infosys", careerUrl: "https://www.infosys.com/careers.html", ats: "manual", regions: ["india"] },
  { id: "tcs", name: "TCS", careerUrl: "https://www.tcs.com/careers", ats: "manual", regions: ["india"] },
  { id: "wipro", name: "Wipro", careerUrl: "https://careers.wipro.com/", ats: "manual", regions: ["india"], searchParam: "q" },
  { id: "zoho", name: "Zoho", careerUrl: "https://www.zoho.com/careers/", ats: "manual", regions: ["india"] },
  { id: "revolut", name: "Revolut", careerUrl: "https://www.revolut.com/careers/", ats: "manual", regions: ["europe"] },
  { id: "wise", name: "Wise", careerUrl: "https://wise.jobs/", ats: "manual", regions: ["europe"] },
  { id: "booking", name: "Booking.com", careerUrl: "https://jobs.booking.com/", ats: "manual", regions: ["europe"], searchParam: "q" },
  { id: "shopify", name: "Shopify", careerUrl: "https://www.shopify.com/careers", ats: "manual", regions: ["global"] },
  { id: "notion", name: "Notion", careerUrl: "https://www.notion.so/careers", ats: "manual", regions: ["global"] },
  { id: "canva", name: "Canva", careerUrl: "https://www.canva.com/careers/", ats: "manual", regions: ["global"] },
  { id: "snowflake", name: "Snowflake", careerUrl: "https://careers.snowflake.com/", ats: "manual", regions: ["global", "india"] },
  { id: "sap", name: "SAP", careerUrl: "https://jobs.sap.com/", ats: "manual", regions: ["india", "europe"], searchParam: "q" },
];
