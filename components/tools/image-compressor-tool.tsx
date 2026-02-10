"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, Download, ImageDown, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface CompressedImage {
  id: string
  name: string
  originalSize: number
  compressedSize: number
  originalUrl: string
  compressedUrl: string
  width: number
  height: number
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getSavingsPercent(original: number, compressed: number): number {
  if (original === 0) return 0
  return Math.round(((original - compressed) / original) * 100)
}

export function ImageCompressorTool() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [quality, setQuality] = useState(75)
  const [isCompressing, setIsCompressing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = useCallback(
    async (file: File): Promise<CompressedImage> => {
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

            const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg"
            const qualityVal = mimeType === "image/png" ? undefined : quality / 100

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Compression failed"))
                  return
                }
                resolve({
                  id: crypto.randomUUID(),
                  name: file.name,
                  originalSize: file.size,
                  compressedSize: blob.size,
                  originalUrl: e.target?.result as string,
                  compressedUrl: URL.createObjectURL(blob),
                  width: img.width,
                  height: img.height,
                })
              },
              mimeType,
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
    [quality]
  )

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter((f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type)
      )
      if (validFiles.length === 0) return

      setIsCompressing(true)
      try {
        const results = await Promise.all(validFiles.map((f) => compressImage(f)))
        setImages((prev) => [...prev, ...results])
      } catch {
        // silently handle errors
      } finally {
        setIsCompressing(false)
      }
    },
    [compressImage]
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
      if (img) URL.revokeObjectURL(img.compressedUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const downloadImage = (img: CompressedImage) => {
    const a = document.createElement("a")
    a.href = img.compressedUrl
    const ext = img.name.split(".").pop() || "jpg"
    const nameWithoutExt = img.name.replace(/\.[^.]+$/, "")
    a.download = `${nameWithoutExt}-compressed.${ext}`
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
      URL.revokeObjectURL(img.compressedUrl)
    }
    setImages([])
  }

  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0)
  const totalCompressed = images.reduce((sum, img) => sum + img.compressedSize, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Quality Setting */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">Compression Quality</h2>
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
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/40"
        }`}
      >
        <Upload className={`h-12 w-12 ${dragOver ? "text-primary" : "text-muted-foreground/50"}`} />
        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
          {isCompressing ? "Compressing..." : "Drop images here or click to upload"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Supports JPG, PNG, and WebP. Multiple files allowed.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
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
                <p className="text-xs text-muted-foreground">Compressed</p>
                <p className="font-heading text-2xl font-bold text-accent">{formatFileSize(totalCompressed)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Saved</p>
                <p className="font-heading text-2xl font-bold text-accent">
                  {getSavingsPercent(totalOriginal, totalCompressed)}%
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
                    src={img.compressedUrl || "/placeholder.svg"}
                    alt={`Compressed ${img.name}`}
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
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatFileSize(img.originalSize)}</span>
                    <span className="text-foreground">{"→"}</span>
                    <span className="font-medium text-accent">{formatFileSize(img.compressedSize)}</span>
                    <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {getSavingsPercent(img.originalSize, img.compressedSize)}% saved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {images.length === 0 && !isCompressing && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            No images yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload images above to start compressing. Everything runs locally in your browser.
          </p>
        </div>
      )}
    </div>
  )
}
