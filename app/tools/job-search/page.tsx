import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { JobSearchTool } from "@/components/tools/job-search-tool"

export const metadata: Metadata = {
  title: "Skill-Based Job Search - Find Jobs Matching Your Skills",
  description:
    "Search for jobs based on your skills. Enter your abilities, select a location, and find matching opportunities instantly. Free, no login required.",
  keywords: [
    "job search by skills",
    "find jobs by skills",
    "skill based job finder",
    "free job search tool",
  ],
}

export default function JobSearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Yelvatix Skill-Based Job Search",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Skill-Based Job Search
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Enter your skills to find relevant job opportunities. Our engine matches your abilities with real job listings.
          </p>
        </div>

        <JobSearchTool />
      </main>
      <SiteFooter />
    </>
  )
}
