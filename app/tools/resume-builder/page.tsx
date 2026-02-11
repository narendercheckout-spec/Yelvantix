import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ResumeBuilderTool } from "@/components/tools/resume-builder-tool"

export const metadata: Metadata = {
  title: "Free Resume Builder - Create Professional Resumes Online",
  description:
    "Build a professional resume for free. Fill in your details, choose a template, and download your resume. No login, no watermarks.",
  keywords: [
    "free resume builder",
    "resume builder online",
    "create resume free",
    "professional resume maker",
    "download resume pdf",
  ],
}

export default function ResumeBuilderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Yelvatix Free Resume Builder",
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
            Free Resume Builder
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Create a professional resume in minutes. Fill in your details and print or save as PDF directly from your browser.
          </p>
        </div>

        <ResumeBuilderTool />
      </main>
      <SiteFooter />
    </>
  )
}
