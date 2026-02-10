import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AdBanner } from "@/components/ad-banner"
import { ImageCompressorTool } from "@/components/tools/image-compressor-tool"

export const metadata: Metadata = {
  title: "Free Image Compressor - Reduce Image File Size Online",
  description:
    "Compress images online for free. Reduce file size of JPG, PNG, and WebP images without losing quality. No upload, runs in your browser.",
  keywords: [
    "image compressor",
    "compress image online",
    "reduce image size",
    "free image compression",
    "compress jpg png webp",
  ],
}

export default function ImageCompressorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Yelvatix Image Compressor",
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
            Free Image Compressor
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Compress your images right in the browser. No uploading, no server processing. Your files stay on your device.
          </p>
        </div>

        <AdBanner format="horizontal" className="mb-8" />

        <ImageCompressorTool />

        <AdBanner format="horizontal" className="mt-8" />
      </main>
      <SiteFooter />
    </>
  )
}
