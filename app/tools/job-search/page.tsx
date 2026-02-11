import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { JobSearchTool } from "@/components/tools/job-search-tool"

export const metadata: Metadata = {
  title: "IT Job Search - Find Tech Jobs Across India",
  description:
    "Search for IT jobs by role across major Indian cities. Find Frontend, Backend, Full Stack, DevOps, Data Science, and other tech jobs. Free, no login required.",
  keywords: [
    "IT jobs India",
    "tech jobs India",
    "software developer jobs",
    "find IT jobs by role",
    "frontend developer jobs",
    "backend developer jobs",
    "data scientist jobs India",
    "free job search tool",
  ],
}

export default function JobSearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Yelvatix IT Job Search",
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
            IT Job Search
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Find IT jobs across India by role. Search for Frontend, Backend, Full Stack, DevOps, Data Science, and other tech positions in major Indian cities.
          </p>
        </div>

        <JobSearchTool />
      </main>
      <SiteFooter />
    </>
  )
}
