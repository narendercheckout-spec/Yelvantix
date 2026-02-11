import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Yelvatix",
    url: "https://yelvatix.com",
    description:
      "Free online tools: skill-based job search, resume builder, and image compressor.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://yelvatix.com/tools/job-search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <SiteFooter />
    </>
  )
}
