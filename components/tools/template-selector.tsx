"use client"

import React from "react"

import { useState } from "react"
import { Check, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ResumeTemplate } from "@/lib/resume-templates"
import { resumeTemplates } from "@/lib/resume-templates"

interface TemplateSelectorProps {
  selectedId: string | null
  onSelect: (template: ResumeTemplate) => void
}

const categoryColors: Record<string, string> = {
  Traditional: "bg-primary/10 text-primary",
  Modern: "bg-accent/10 text-accent",
  Executive: "bg-foreground/10 text-foreground",
  Creative: "bg-chart-5/20 text-foreground",
  Technical: "bg-chart-1/10 text-primary",
  Academic: "bg-chart-2/10 text-accent",
  Business: "bg-chart-4/20 text-foreground",
  "Entry Level": "bg-chart-2/10 text-accent",
}

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  const [filter, setFilter] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(resumeTemplates.map((t) => t.category)))]
  const filtered = filter === "All" ? resumeTemplates : resumeTemplates.filter((t) => t.category === filter)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Choose a Template
        </h2>
        <p className="text-sm text-muted-foreground">
          Select an ATS-friendly template to get started. All templates are optimized for applicant tracking systems with clean formatting and proper section hierarchy.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => {
          const isSelected = selectedId === template.id
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`group relative flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}

              {/* Template icon with mini-preview */}
              <div className={`flex h-24 w-full items-center justify-center rounded-lg ${
                isSelected ? "bg-primary/10" : "bg-muted"
              }`}>
                <TemplateMiniPreview templateId={template.id} />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    {template.name}
                  </h3>
                </div>
                <Badge variant="secondary" className={`w-fit text-[10px] ${categoryColors[template.category] || ""}`}>
                  {template.category}
                </Badge>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                {isSelected ? "Selected" : "Use this template"}
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TemplateMiniPreview({ templateId }: { templateId: string }) {
  const styles: Record<string, React.ReactNode> = {
    "classic-professional": (
      <div className="flex w-28 flex-col gap-1 rounded bg-card p-2 shadow-sm">
        <div className="h-2 w-16 rounded-sm bg-foreground/70" />
        <div className="h-1 w-20 rounded-sm bg-muted-foreground/30" />
        <div className="mt-1 h-0.5 w-full bg-foreground/50" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/20" />
        <div className="h-1 w-20 rounded-sm bg-muted-foreground/20" />
        <div className="mt-0.5 h-0.5 w-full bg-foreground/50" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/20" />
        <div className="h-1 w-16 rounded-sm bg-muted-foreground/20" />
      </div>
    ),
    "modern-minimal": (
      <div className="flex w-28 flex-col gap-1.5 rounded bg-card p-2 shadow-sm">
        <div className="h-2.5 w-14 rounded-sm bg-primary/60" />
        <div className="h-0.5 w-20 rounded-sm bg-muted-foreground/20" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="mt-0.5 h-1.5 w-10 rounded-sm bg-primary/30" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-18 rounded-sm bg-muted-foreground/15" />
      </div>
    ),
    "executive-bold": (
      <div className="flex w-28 flex-col gap-1 rounded bg-card p-2 shadow-sm">
        <div className="rounded-sm bg-foreground/80 p-1">
          <div className="h-2 w-14 rounded-sm bg-card/90" />
          <div className="mt-0.5 h-0.5 w-18 rounded-sm bg-card/50" />
        </div>
        <div className="h-1.5 w-12 rounded-sm bg-foreground/60" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/20" />
        <div className="h-1.5 w-12 rounded-sm bg-foreground/60" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/20" />
      </div>
    ),
    "creative-edge": (
      <div className="flex w-28 flex-col gap-1 rounded bg-card p-2 shadow-sm">
        <div className="h-2 w-16 rounded-sm bg-foreground/70" />
        <div className="h-0.5 w-20 rounded-sm bg-muted-foreground/20" />
        <div className="flex gap-1">
          <div className="h-6 w-1 rounded-sm bg-accent/60" />
          <div className="flex flex-col gap-0.5">
            <div className="h-1 w-20 rounded-sm bg-muted-foreground/20" />
            <div className="h-1 w-16 rounded-sm bg-muted-foreground/20" />
            <div className="h-1 w-20 rounded-sm bg-muted-foreground/20" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="h-6 w-1 rounded-sm bg-accent/60" />
          <div className="flex flex-col gap-0.5">
            <div className="h-1 w-20 rounded-sm bg-muted-foreground/20" />
            <div className="h-1 w-14 rounded-sm bg-muted-foreground/20" />
            <div className="h-1 w-18 rounded-sm bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    ),
    "compact-efficient": (
      <div className="flex w-28 flex-col gap-0.5 rounded bg-card p-2 shadow-sm">
        <div className="h-2 w-16 rounded-sm bg-foreground/70" />
        <div className="h-0.5 w-22 rounded-sm bg-muted-foreground/20" />
        <div className="mt-0.5 h-0.5 w-full bg-foreground/30" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-20 rounded-sm bg-muted-foreground/15" />
        <div className="h-0.5 w-full bg-foreground/30" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-18 rounded-sm bg-muted-foreground/15" />
        <div className="h-0.5 w-full bg-foreground/30" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
      </div>
    ),
    "two-column-pro": (
      <div className="flex w-28 gap-1 rounded bg-card p-1.5 shadow-sm">
        <div className="flex w-8 flex-col gap-1 rounded-sm bg-muted p-1">
          <div className="h-1 w-full rounded-sm bg-muted-foreground/30" />
          <div className="h-0.5 w-full rounded-sm bg-muted-foreground/20" />
          <div className="h-0.5 w-full rounded-sm bg-muted-foreground/20" />
          <div className="mt-1 h-1 w-full rounded-sm bg-muted-foreground/30" />
          <div className="h-0.5 w-full rounded-sm bg-primary/30" />
          <div className="h-0.5 w-full rounded-sm bg-primary/30" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5 p-0.5">
          <div className="h-2 w-12 rounded-sm bg-foreground/70" />
          <div className="h-0.5 w-full bg-foreground/30" />
          <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
          <div className="h-1 w-14 rounded-sm bg-muted-foreground/15" />
          <div className="h-0.5 w-full bg-foreground/30" />
          <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        </div>
      </div>
    ),
    "tech-focused": (
      <div className="flex w-28 flex-col gap-1 rounded bg-card p-2 shadow-sm font-mono">
        <div className="h-2 w-14 rounded-sm bg-primary/50" />
        <div className="h-0.5 w-20 rounded-sm bg-primary/20" />
        <div className="mt-0.5 flex gap-1">
          <div className="h-2.5 rounded-sm bg-muted px-1 py-0.5">
            <div className="h-1 w-4 rounded-sm bg-primary/40" />
          </div>
          <div className="h-2.5 rounded-sm bg-muted px-1 py-0.5">
            <div className="h-1 w-3 rounded-sm bg-primary/40" />
          </div>
          <div className="h-2.5 rounded-sm bg-muted px-1 py-0.5">
            <div className="h-1 w-4 rounded-sm bg-primary/40" />
          </div>
        </div>
        <div className="h-0.5 w-full bg-primary/20" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-18 rounded-sm bg-muted-foreground/15" />
      </div>
    ),
    "academic-formal": (
      <div className="flex w-28 flex-col items-center gap-1 rounded bg-card p-2 shadow-sm">
        <div className="h-2 w-18 rounded-sm bg-foreground/70" />
        <div className="h-0.5 w-20 rounded-sm bg-muted-foreground/20" />
        <div className="h-[1px] w-full bg-foreground/40" />
        <div className="h-1 w-8 self-start rounded-sm bg-foreground/40" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-8 self-start rounded-sm bg-foreground/40" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-8 self-start rounded-sm bg-foreground/40" />
        <div className="h-1 w-20 rounded-sm bg-muted-foreground/15" />
      </div>
    ),
    "sales-impact": (
      <div className="flex w-28 flex-col gap-1 rounded bg-card p-2 shadow-sm">
        <div className="h-2.5 w-16 rounded-sm bg-foreground/70" />
        <div className="h-0.5 w-20 rounded-sm bg-muted-foreground/20" />
        <div className="flex gap-2">
          <div className="flex flex-col items-center">
            <div className="text-[6px] font-bold text-primary">145%</div>
            <div className="h-0.5 w-6 rounded-sm bg-muted-foreground/20" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[6px] font-bold text-accent">$4.2M</div>
            <div className="h-0.5 w-6 rounded-sm bg-muted-foreground/20" />
          </div>
        </div>
        <div className="h-0.5 w-full bg-foreground/30" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/15" />
        <div className="h-1 w-18 rounded-sm bg-muted-foreground/15" />
      </div>
    ),
    "clean-starter": (
      <div className="flex w-28 flex-col gap-1.5 rounded bg-card p-2 shadow-sm">
        <div className="h-2 w-12 rounded-sm bg-foreground/60" />
        <div className="h-0.5 w-18 rounded-sm bg-muted-foreground/20" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/10" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/10" />
        <div className="mt-0.5 h-1.5 w-8 rounded-sm bg-accent/30" />
        <div className="h-1 w-full rounded-sm bg-muted-foreground/10" />
        <div className="h-1.5 w-8 rounded-sm bg-accent/30" />
        <div className="h-1 w-20 rounded-sm bg-muted-foreground/10" />
      </div>
    ),
  }

  return styles[templateId] || <FileText className="h-8 w-8 text-muted-foreground" />
}
