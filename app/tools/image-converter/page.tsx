import type { Metadata } from "next"
import { ImageConverterTool } from "@/components/tools/image-converter-tool"

export const metadata: Metadata = {
    title: "Free Image Format Converter - Convert JPG, PNG, WebP, AVIF Online",
    description:
        "Convert images between formats online for free. Support for JPG, PNG, WebP, and AVIF. No upload, runs in your browser.",
    keywords: [
        "image converter",
        "convert image format",
        "jpg to png",
        "png to webp",
        "webp to jpg",
        "avif converter",
        "free image conversion",
    ],
}

export default function ImageConverterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Yelvatix Image Converter",
        description:
            "Free online image format converter. Convert between JPG, PNG, WebP, and AVIF formats with quality control.",
        applicationCategory: "UtilityApplication",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        operatingSystem: "Any",
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Free Image Converter
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Convert your images right in the browser. No uploading, no server processing. Your files
                        stay on your device.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Supports JPG, PNG, WebP, and AVIF formats with adjustable quality settings.
                    </p>
                </div>

                <ImageConverterTool />

                <div className="mt-12 rounded-xl border border-border bg-card p-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                        About Image Format Conversion
                    </h2>
                    <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                        <p>
                            <strong className="text-foreground">JPG/JPEG:</strong> Best for photographs and images
                            with many colors. Lossy compression, smaller file sizes.
                        </p>
                        <p>
                            <strong className="text-foreground">PNG:</strong> Best for graphics, logos, and images
                            with transparency. Lossless compression, larger file sizes.
                        </p>
                        <p>
                            <strong className="text-foreground">WebP:</strong> Modern format with excellent
                            compression. Supports both lossy and lossless compression. Smaller than JPG/PNG.
                        </p>
                        <p>
                            <strong className="text-foreground">AVIF:</strong> Next-generation format with superior
                            compression. Even smaller than WebP. Browser support may vary.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
