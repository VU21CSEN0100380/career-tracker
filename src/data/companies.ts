export type AtsType = "greenhouse" | "lever" | "ashby" | "manual";
export type Region = "india" | "europe" | "global";

export interface CompanySource {
  id: string;
  name: string;
  careerUrl: string;
  ats: AtsType;
  boardId?: string;
  regions: Region[];
  /** Ashby org slug when ats is ashby */
  ashbyOrg?: string;
}

/**
 * Curated companies with public job-board APIs or official career pages.
 * Add more board IDs from: boards.greenhouse.io, jobs.lever.co, jobs.ashbyhq.com
 */
export const COMPANIES: CompanySource[] = [
  // India-focused / India offices
  { id: "razorpay", name: "Razorpay", careerUrl: "https://razorpay.com/jobs/", ats: "greenhouse", boardId: "razorpay", regions: ["india"] },
  { id: "freshworks", name: "Freshworks", careerUrl: "https://www.freshworks.com/company/careers/", ats: "greenhouse", boardId: "freshworks", regions: ["india", "global"] },
  { id: "zscaler", name: "Zscaler", careerUrl: "https://www.zscaler.com/careers", ats: "greenhouse", boardId: "zscaler", regions: ["india", "global"] },
  { id: "postman", name: "Postman", careerUrl: "https://www.postman.com/company/careers/", ats: "greenhouse", boardId: "postman", regions: ["india", "global"] },
  { id: "cred", name: "CRED", careerUrl: "https://careers.cred.club/", ats: "greenhouse", boardId: "cred", regions: ["india"] },
  { id: "swiggy", name: "Swiggy", careerUrl: "https://careers.swiggy.com/", ats: "greenhouse", boardId: "swiggy", regions: ["india"] },
  { id: "meesho", name: "Meesho", careerUrl: "https://www.meesho.io/careers", ats: "greenhouse", boardId: "meesho", regions: ["india"] },
  { id: "phonepe", name: "PhonePe", careerUrl: "https://www.phonepe.com/careers/", ats: "greenhouse", boardId: "phonepe", regions: ["india"] },
  { id: "flipkart", name: "Flipkart", careerUrl: "https://www.flipkartcareers.com/", ats: "manual", regions: ["india"] },
  { id: "amazon-in", name: "Amazon India", careerUrl: "https://www.amazon.jobs/en/search?offset=0&loc_query=India", ats: "manual", regions: ["india"] },
  { id: "microsoft-in", name: "Microsoft India", careerUrl: "https://careers.microsoft.com/v2/global/en/locations/india.html", ats: "manual", regions: ["india"] },
  { id: "google-in", name: "Google India", careerUrl: "https://www.google.com/about/careers/applications/jobs/results/?location=India", ats: "manual", regions: ["india"] },
  { id: "adobe-in", name: "Adobe India", careerUrl: "https://careers.adobe.com/us/en/search-results?keywords=india", ats: "manual", regions: ["india"] },
  { id: "oracle-in", name: "Oracle India", careerUrl: "https://careers.oracle.com/en/sites/jobsearch/jobs?location=India", ats: "manual", regions: ["india"] },
  { id: "sap-in", name: "SAP India", careerUrl: "https://jobs.sap.com/search/?q=&locationsearch=India", ats: "manual", regions: ["india", "europe"] },
  { id: "infosys", name: "Infosys", careerUrl: "https://www.infosys.com/careers.html", ats: "manual", regions: ["india"] },
  { id: "tcs", name: "TCS", careerUrl: "https://www.tcs.com/careers", ats: "manual", regions: ["india"] },
  { id: "wipro", name: "Wipro", careerUrl: "https://careers.wipro.com/", ats: "manual", regions: ["india"] },
  { id: "zoho", name: "Zoho", careerUrl: "https://www.zoho.com/careers/", ats: "manual", regions: ["india"] },

  // Europe + global tech (often hire 2025 grads / interns)
  { id: "stripe", name: "Stripe", careerUrl: "https://stripe.com/jobs", ats: "greenhouse", boardId: "stripe", regions: ["europe", "global"] },
  { id: "spotify", name: "Spotify", careerUrl: "https://www.lifeatspotify.com/jobs", ats: "greenhouse", boardId: "spotify", regions: ["europe", "global"] },
  { id: "booking", name: "Booking.com", careerUrl: "https://jobs.booking.com/", ats: "greenhouse", boardId: "bookingcom", regions: ["europe"] },
  { id: "adyen", name: "Adyen", careerUrl: "https://careers.adyen.com/", ats: "greenhouse", boardId: "adyen", regions: ["europe"] },
  { id: "mollie", name: "Mollie", careerUrl: "https://jobs.mollie.com/", ats: "greenhouse", boardId: "mollie", regions: ["europe"] },
  { id: "gitlab", name: "GitLab", careerUrl: "https://about.gitlab.com/jobs/", ats: "greenhouse", boardId: "gitlab", regions: ["europe", "global"] },
  { id: "datadog", name: "Datadog", careerUrl: "https://careers.datadoghq.com/", ats: "greenhouse", boardId: "datadog", regions: ["europe", "global"] },
  { id: "cloudflare", name: "Cloudflare", careerUrl: "https://www.cloudflare.com/careers/jobs/", ats: "greenhouse", boardId: "cloudflare", regions: ["europe", "global"] },
  { id: "revolut", name: "Revolut", careerUrl: "https://www.revolut.com/careers/", ats: "greenhouse", boardId: "revolut", regions: ["europe"] },
  { id: "deliveroo", name: "Deliveroo", careerUrl: "https://careers.deliveroo.com/", ats: "greenhouse", boardId: "deliveroo", regions: ["europe"] },
  { id: "monzo", name: "Monzo", careerUrl: "https://monzo.com/careers/", ats: "greenhouse", boardId: "monzo", regions: ["europe"] },
  { id: "wise", name: "Wise", careerUrl: "https://wise.jobs/", ats: "greenhouse", boardId: "transferwise", regions: ["europe"] },
  { id: "canva", name: "Canva", careerUrl: "https://www.canva.com/careers/", ats: "greenhouse", boardId: "canva", regions: ["global"] },
  { id: "notion", name: "Notion", careerUrl: "https://www.notion.so/careers", ats: "greenhouse", boardId: "notion", regions: ["global"] },
  { id: "figma", name: "Figma", careerUrl: "https://www.figma.com/careers/", ats: "greenhouse", boardId: "figma", regions: ["global"] },
  { id: "airbnb", name: "Airbnb", careerUrl: "https://careers.airbnb.com/", ats: "greenhouse", boardId: "airbnb", regions: ["global"] },
  { id: "shopify", name: "Shopify", careerUrl: "https://www.shopify.com/careers", ats: "greenhouse", boardId: "shopify", regions: ["global"] },
  { id: "elastic", name: "Elastic", careerUrl: "https://www.elastic.co/careers", ats: "greenhouse", boardId: "elastic", regions: ["europe", "global"] },
  { id: "mongodb", name: "MongoDB", careerUrl: "https://www.mongodb.com/careers", ats: "greenhouse", boardId: "mongodb", regions: ["europe", "global"] },
  { id: "snyk", name: "Snyk", careerUrl: "https://snyk.io/careers/", ats: "greenhouse", boardId: "snyk", regions: ["europe"] },
  { id: "hubspot", name: "HubSpot", careerUrl: "https://www.hubspot.com/careers", ats: "greenhouse", boardId: "hubspot", regions: ["europe", "global"] },
  { id: "palantir", name: "Palantir", careerUrl: "https://www.palantir.com/careers/", ats: "greenhouse", boardId: "palantir", regions: ["europe", "global"] },
  { id: "databricks", name: "Databricks", careerUrl: "https://www.databricks.com/company/careers", ats: "greenhouse", boardId: "databricks", regions: ["europe", "global", "india"] },
  { id: "snowflake", name: "Snowflake", careerUrl: "https://careers.snowflake.com/", ats: "greenhouse", boardId: "snowflake", regions: ["global"] },
  { id: "arm", name: "ARM", careerUrl: "https://careers.arm.com/", ats: "greenhouse", boardId: "arm", regions: ["europe"] },
  { id: "siemens", name: "Siemens", careerUrl: "https://jobs.siemens.com/", ats: "manual", regions: ["europe"] },
  { id: "bosch", name: "Bosch", careerUrl: "https://www.bosch.com/careers/", ats: "manual", regions: ["europe", "india"] },
  { id: "sap-eu", name: "SAP (Europe)", careerUrl: "https://jobs.sap.com/", ats: "manual", regions: ["europe"] },
  { id: "spotify-lever", name: "Bolt", careerUrl: "https://bolt.eu/en/careers/", ats: "manual", regions: ["europe"] },
];
