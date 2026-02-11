import type { Metadata } from "next"
import { ImageConverterTool } from "@/components/tools/image-converter-tool"
import { SiteFooter } from "@/components/site-footer"
import { Download, Shield, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Free Image Converter - Convert JPG, PNG, WebP, AVIF Online",
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

const formatConversions = [
    { from: "JPG Converter", formats: ["JPG to PNG", "JPG to WebP", "JPG to AVIF"] },
    { from: "PNG Converter", formats: ["PNG to JPG", "PNG to WebP", "PNG to AVIF"] },
    { from: "WebP Converter", formats: ["WebP to JPG", "WebP to PNG", "WebP to AVIF"] },
    { from: "AVIF Converter", formats: ["AVIF to JPG", "AVIF to PNG", "AVIF to WebP"] },
    { from: "GIF Converter", formats: ["GIF to JPG", "GIF to PNG", "GIF to WebP"] },
    { from: "BMP Converter", formats: ["BMP to JPG", "BMP to PNG", "BMP to WebP"] },
    { from: "TIFF Converter", formats: ["TIFF to JPG", "TIFF to PNG", "TIFF to WebP"] },
    { from: "SVG Converter", formats: ["SVG to PNG", "SVG to JPG", "SVG to WebP"] },
]

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
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Image Converter
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground">
                        CONVERT TO PNG, JPG, SVG, GIF, WEBP
                    </p>
                </div>

                {/* Converter Tool */}
                <ImageConverterTool />

                {/* Get it on Mobile */}
                <div className="mt-8 text-center">
                    <p className="mb-3 text-sm font-medium text-foreground">Get it on Mobile</p>
                    <p className="mb-4 text-xs text-muted-foreground">
                        Download Image Converter on your iOS/Android device or at <span className="text-primary">yelvatix.com</span>
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-xs font-medium text-foreground hover:bg-muted">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            App Store
                        </div>
                        <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-xs font-medium text-foreground hover:bg-muted">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            Google Play
                        </div>
                    </div>
                </div>

                {/* How to Convert Images */}
                <div className="mt-12 rounded-xl border border-border bg-card p-8">
                    <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                        How to Convert Images?
                    </h2>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <p>
                            <span className="font-semibold text-foreground">1.</span> Click "Choose Files" to select the images you want to convert, or drag and drop them into the upload area. You can select multiple images at once.
                        </p>
                        <p>
                            <span className="font-semibold text-foreground">2.</span> Select the output format you want from the dropdown menu (JPG, PNG, WebP, or AVIF). Adjust the quality slider if needed for lossy formats.
                        </p>
                        <p>
                            <span className="font-semibold text-foreground">3.</span> Click "Download" to save your converted images, or use "Download All" to get all converted files at once.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                            Convert Any Image
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Accept any image format including JPG, PNG, WebP, AVIF, GIF, BMP, TIFF, and SVG. Convert to the format you need with just a few clicks.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Download className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                            Best Image Converter
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            High-quality conversion with adjustable quality settings. Batch convert multiple images at once. Preview before downloading.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                            Free & Secure
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            100% free with no limits. All conversions happen in your browser - your images never leave your device. Private and secure.
                        </p>
                    </div>
                </div>

                {/* Versatile Image Tools */}
                <div className="mt-12 rounded-xl border border-border bg-card p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-heading text-2xl font-bold text-foreground">
                            Versatile Image Tools
                        </h2>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-primary">●</span>
                            <div>
                                <span className="font-medium text-foreground">Batch Conversion</span>
                                <span className="text-muted-foreground"> - Convert multiple images at once to save time</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary">●</span>
                            <div>
                                <span className="font-medium text-foreground">Quality Control</span>
                                <span className="text-muted-foreground"> - Adjust image quality to balance file size and visual quality</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary">●</span>
                            <div>
                                <span className="font-medium text-foreground">Format Preview</span>
                                <span className="text-muted-foreground"> - See the converted image before downloading</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary">●</span>
                            <div>
                                <span className="font-medium text-foreground">File Size Comparison</span>
                                <span className="text-muted-foreground"> - View original vs converted file sizes with percentage savings</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specific Image Converters */}
                <div className="mt-12 rounded-xl border border-border bg-card p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-heading text-2xl font-bold text-foreground">
                            Specific Image Converters
                        </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {formatConversions.map((converter) => (
                            <div key={converter.from} className="space-y-2">
                                <h3 className="font-semibold text-foreground">{converter.from}</h3>
                                <ul className="space-y-1.5">
                                    {converter.formats.map((format) => (
                                        <li key={format}>
                                            <button className="text-sm text-primary hover:underline">
                                                {format}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Your Data, Our Priority */}
                <div className="mt-12 rounded-xl border border-border bg-card p-8">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                            <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
                                Your Data, Our Priority
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                At Yelvatix, we take your privacy seriously. All image conversions happen directly in your browser using client-side processing. Your images never leave your device, and we don't store or have access to any of your files. This ensures maximum privacy and security while providing fast, efficient image conversion.
                            </p>
                        </div>
                        <div className="flex-shrink-0 space-y-3 md:w-64">
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                                    Privacy Focused
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                                    Lightning Fast
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Download className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                                    Unlimited Conversions
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}
