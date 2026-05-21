# Career Tracker — B.Tech 2025 (India & Europe)

A personal job board website that pulls **internship** and **full-time** listings from company career pages, filtered for **B.Tech background** and **2025 passout** roles in **India** and **Europe**.

## Is this possible?

| Feature | Status |
|---------|--------|
| Role, JD, experience from career pages | Yes — via Greenhouse public API + JD text parsing |
| B.Tech filter | Yes — keyword matching on job description |
| 2025 passout / new grad | Yes — keyword matching |
| Internship + full-time | Yes |
| India + Europe | Yes — location filters |
| Every company auto-scraped | Partial — only companies on Greenhouse/Lever APIs; others are **career portal links** |

Companies like Google, Amazon, TCS use custom sites — those appear as **official career portal** cards (you open their site and search).

## Quick start

```bash
cd career-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How it works

1. **`src/data/companies.ts`** — list of companies, career URLs, and ATS type (greenhouse / manual).
2. **`src/lib/fetchers/greenhouse.ts`** — fetches live jobs from `boards-api.greenhouse.io`.
3. **`src/lib/filters.ts`** — filters by B.Tech, 2025, region, role type.
4. **`/api/jobs`** — API endpoint used by the UI.
5. **`src/components/JobBoard.tsx`** — search, filters, job cards with JD expand.

## Add more companies

Edit `src/data/companies.ts`:

```ts
{
  id: "company-id",
  name: "Company Name",
  careerUrl: "https://company.com/careers",
  ats: "greenhouse",
  boardId: "greenhouse-board-slug", // from jobs.greenhouse.io URLs
  regions: ["india", "europe"],
}
```

Find Greenhouse `boardId` from job URLs: `https://boards.greenhouse.io/BOARD_ID/jobs/...`

## Deploy (free)

```bash
npm run build
# Deploy to Vercel: vercel deploy
```

## Limitations (important)

- Not legal advice — respect each company’s Terms of Service.
- Scraping arbitrary career HTML is fragile; this project uses **official APIs** where available.
- Filters are keyword-based — always verify eligibility on the official posting.
- Some Greenhouse board IDs may change or return 404; check `meta.errors` in API response.

## Tech stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
