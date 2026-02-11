"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, Download, RefreshCw, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ConvertedImage {
    id: string
    name: string
    originalFormat: string
    originalSize: number
    convertedSize: number
    originalUrl: string
    convertedUrl: string
    width: number
    height: number
    targetFormat: string
}

const SUPPORTED_FORMATS = [
    { value: "image/jpeg", label: "JPG/JPEG", extension: "jpg" },
    { value: "image/png", label: "PNG", extension: "png" },
    { value: "image/webp", label: "WebP", extension: "webp" },
    // Note: AVIF support depends on browser compatibility
    { value: "image/avif", label: "AVIF", extension: "avif" },
]

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getSavingsPercent(original: number, converted: number): number {
    if (original === 0) return 0
    return Math.round(((original - converted) / original) * 100)
}

function getFormatLabel(mimeType: string): string {
    const format = SUPPORTED_FORMATS.find((f) => f.value === mimeType)
    return format?.label || mimeType.split("/")[1].toUpperCase()
}

export function ImageConverterTool() {
    const [images, setImages] = useState<ConvertedImage[]>([])
    const [targetFormat, setTargetFormat] = useState("image/webp")
    const [quality, setQuality] = useState(85)
    const [isConverting, setIsConverting] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const convertImage = useCallback(
        async (file: File): Promise<ConvertedImage> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const img = new window.Image()
                    img.crossOrigin = "anonymous"
                    img.onload = () => {
                        const canvas = document.createElement("canvas")
                        canvas.width = img.width
                        canvas.height = img.height
                        const ctx = canvas.getContext("2d")
                        if (!ctx) {
                            reject(new Error("Canvas not supported"))
                            return
                        }
                        ctx.drawImage(img, 0, 0)

                        // Use quality for lossy formats (JPEG, WebP, AVIF)
                        const qualityVal =
                            targetFormat === "image/png" ? undefined : quality / 100

                        canvas.toBlob(
                            (blob) => {
                                if (!blob) {
                                    reject(new Error("Conversion failed"))
                                    return
                                }
                                resolve({
                                    id: crypto.randomUUID(),
                                    name: file.name,
                                    originalFormat: file.type,
                                    originalSize: file.size,
                                    convertedSize: blob.size,
                                    originalUrl: e.target?.result as string,
                                    convertedUrl: URL.createObjectURL(blob),
                                    width: img.width,
                                    height: img.height,
                                    targetFormat,
                                })
                            },
                            targetFormat,
                            qualityVal
                        )
                    }
                    img.onerror = () => reject(new Error("Failed to load image"))
                    img.src = e.target?.result as string
                }
                reader.onerror = () => reject(new Error("Failed to read file"))
                reader.readAsDataURL(file)
            })
        },
        [targetFormat, quality]
    )

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const validFiles = Array.from(files).filter((f) =>
                ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(f.type)
            )
            if (validFiles.length === 0) return

            setIsConverting(true)
            try {
                const results = await Promise.all(validFiles.map((f) => convertImage(f)))
                setImages((prev) => [...prev, ...results])
            } catch (error) {
                console.error("Conversion error:", error)
            } finally {
                setIsConverting(false)
            }
        },
        [convertImage]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = () => {
        setDragOver(false)
    }

    const removeImage = (id: string) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === id)
            if (img) URL.revokeObjectURL(img.convertedUrl)
            return prev.filter((i) => i.id !== id)
        })
    }

    const downloadImage = (img: ConvertedImage) => {
        const a = document.createElement("a")
        a.href = img.convertedUrl
        const nameWithoutExt = img.name.replace(/\.[^.]+$/, "")
        const format = SUPPORTED_FORMATS.find((f) => f.value === img.targetFormat)
        const ext = format?.extension || "jpg"
        a.download = `${nameWithoutExt}-converted.${ext}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const downloadAll = () => {
        for (const img of images) {
            downloadImage(img)
        }
    }

    const clearAll = () => {
        for (const img of images) {
            URL.revokeObjectURL(img.convertedUrl)
        }
        setImages([])
    }

    const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0)
    const totalConverted = images.reduce((sum, img) => sum + img.convertedSize, 0)

    const isLossyFormat = targetFormat !== "image/png"

    return (
        <div className="flex flex-col gap-6">
            {/* Conversion Settings */}
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col gap-6">
                    {/* Format Selection */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-heading text-lg font-semibold text-foreground">Output Format</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Select the format to convert your images to.
                            </p>
                        </div>
                        <Select value={targetFormat} onValueChange={setTargetFormat}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUPPORTED_FORMATS.map((format) => (
                                    <SelectItem key={format.value} value={format.value}>
                                        {format.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quality Slider - Only for lossy formats */}
                    {isLossyFormat && (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-heading text-lg font-semibold text-foreground">Quality</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Lower quality means smaller file size. {quality}% quality selected.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 sm:w-64">
                                <span className="text-xs text-muted-foreground">Low</span>
                                <Slider
                                    value={[quality]}
                                    onValueChange={(v) => setQuality(v[0])}
                                    min={10}
                                    max={100}
                                    step={5}
                                    className="flex-1"
                                />
                                <span className="text-xs text-muted-foreground">High</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Drop Zone */}
            <div
                role="button"
                tabIndex={0}
                suppressHydrationWarning
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        fileInputRef.current?.click()
                    }
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
            >
                <Upload className={`h-12 w-12 ${dragOver ? "text-primary" : "text-muted-foreground/50"}`} />
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {isConverting ? "Converting..." : "Drop images here or click to upload"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Supports JPG, PNG, WebP, and AVIF. Multiple files allowed.
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files) handleFiles(e.target.files)
                        e.target.value = ""
                    }}
                />
            </div>

            {/* Results */}
            {images.length > 0 && (
                <>
                    {/* Summary */}
                    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-6">
                            <div>
                                <p className="text-xs text-muted-foreground">Images</p>
                                <p className="font-heading text-2xl font-bold text-foreground">{images.length}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Original</p>
                                <p className="font-heading text-2xl font-bold text-foreground">{formatFileSize(totalOriginal)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Converted</p>
                                <p className="font-heading text-2xl font-bold text-accent">{formatFileSize(totalConverted)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Difference</p>
                                <p className={`font-heading text-2xl font-bold ${totalConverted < totalOriginal ? 'text-accent' : 'text-muted-foreground'}`}>
                                    {getSavingsPercent(totalOriginal, totalConverted)}%
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={downloadAll} className="gap-2">
                                <Download className="h-4 w-4" />
                                Download All
                            </Button>
                            <Button variant="outline" onClick={clearAll} className="gap-2 bg-transparent">
                                <Trash2 className="h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Image List */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="overflow-hidden rounded-xl border border-border bg-card"
                            >
                                <div className="relative aspect-video bg-muted">
                                    <img
                                        src={img.convertedUrl || "/placeholder.svg"}
                                        alt={`Converted ${img.name}`}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-foreground">{img.name}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {img.width} x {img.height}px
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => downloadImage(img)}
                                                aria-label={`Download ${img.name}`}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => removeImage(img.id)}
                                                aria-label={`Remove ${img.name}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
                                                {getFormatLabel(img.originalFormat)}
                                            </span>
                                            <RefreshCw className="h-3 w-3 text-muted-foreground" />
                                            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
                                                {getFormatLabel(img.targetFormat)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{formatFileSize(img.originalSize)}</span>
                                            <span className="text-foreground">{"→"}</span>
                                            <span className="font-medium text-accent">{formatFileSize(img.convertedSize)}</span>
                                            <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${img.convertedSize < img.originalSize
                                                    ? 'bg-accent/10 text-accent'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {getSavingsPercent(img.originalSize, img.convertedSize)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {images.length === 0 && !isConverting && (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                        No images yet
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Upload images above to start converting. Everything runs locally in your browser.
                    </p>
                </div>
            )}
        </div>
    )
}
