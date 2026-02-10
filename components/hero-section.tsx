import React from "react"
import Link from "next/link"
import { ArrowRight, Search, FileText, ImageDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-card py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(210_100%_45%/0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            100% Free, No Login Required
          </div>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Free Tools to Power Your{" "}
            <span className="text-primary">Productivity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Search jobs by skills, build professional resumes, and compress images instantly. No signup, no paywall, no limits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link href="/tools/job-search">
                Explore Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="#tools">See All Tools</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3" id="tools">
          <ToolCard
            href="/tools/job-search"
            icon={Search}
            title="Skill-Based Job Search"
            description="Find jobs matched to your skills. Enter what you know, get relevant opportunities instantly."
          />
          <ToolCard
            href="/tools/resume-builder"
            icon={FileText}
            title="Free Resume Builder"
            description="Create professional resumes in minutes. Choose a template, fill your details, download as PDF."
          />
          <ToolCard
            href="/tools/image-compressor"
            icon={ImageDown}
            title="Image Compressor"
            description="Reduce image file size without losing quality. Supports JPG, PNG, and WebP formats."
          />
        </div>
      </div>
    </section>
  )
}

function ToolCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
        Try it free
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
