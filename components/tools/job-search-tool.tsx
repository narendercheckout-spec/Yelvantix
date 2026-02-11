"use client"

import React from "react"
import { useState } from "react"
import {
  Search,
  MapPin,
  Briefcase,
  ExternalLink,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ExperienceLevel = "any" | "fresher" | "junior" | "mid" | "senior" | "lead"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  experienceLabel: string
  matchedSkills: string[]
  description: string
  postedDate: string
  salary?: string
  applyLink?: string
  employerLogo?: string | null
  source: "live" | "curated"
}

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "any", label: "Any Experience" },
  { value: "fresher", label: "Fresher (0-1 yrs)" },
  { value: "junior", label: "Junior (1-3 yrs)" },
  { value: "mid", label: "Mid-Level (3-5 yrs)" },
  { value: "senior", label: "Senior (5-8 yrs)" },
  { value: "lead", label: "Lead / Principal (8+ yrs)" },
]

const IT_JOB_ROLES = [
  { value: "", label: "Select a role..." },
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "fullstack-developer", label: "Full Stack Developer" },
  { value: "mobile-developer", label: "Mobile Developer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "data-scientist", label: "Data Scientist / ML Engineer" },
  { value: "data-analyst", label: "Data Analyst / BI Developer" },
  { value: "qa-engineer", label: "QA / Test Engineer" },
  { value: "ui-ux-designer", label: "UI/UX Designer" },
  { value: "product-designer", label: "Product Designer" },
  { value: "cloud-engineer", label: "Cloud Architect / Engineer" },
  { value: "database-admin", label: "Database Administrator" },
  { value: "security-engineer", label: "Security Engineer" },
  { value: "technical-writer", label: "Technical Writer" },
  { value: "product-manager", label: "Product Manager" },
]

const LOCATIONS = [
  { value: "India", label: "All India" },
  { value: "Bengaluru", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Pune", label: "Pune" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Gurugram", label: "Delhi/NCR (Gurugram)" },
  { value: "Chennai", label: "Chennai" },
  { value: "Remote", label: "Remote" },
]

export function JobSearchTool() {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("India")
  const [experience, setExperience] = useState<ExperienceLevel>("any")
  const [results, setResults] = useState<Job[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState<string>("")

  const handleSearch = async () => {
    if (!role) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams({
        role,
        location: location || "India",
        experience,
      })

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json()

      setResults(data.jobs || [])
      setSource(data.source || "curated")
    } catch {
      setResults([])
      setSource("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5">
          {/* Role Selector */}
          <div>
            <label
              htmlFor="role-select"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              IT Job Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {IT_JOB_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <label
              htmlFor="location-select"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="location-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-64"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label
              htmlFor="experience-select"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Experience Level
            </label>
            <select
              id="experience-select"
              value={experience}
              onChange={(e) =>
                setExperience(e.target.value as ExperienceLevel)
              }
              suppressHydrationWarning
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-64"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!role || isLoading}
            className="w-full gap-2 sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isLoading ? "Searching..." : "Search Jobs"}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            Searching for jobs...
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Finding the best IT job opportunities across India
          </p>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && (
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "job" : "jobs"} found
            </p>
            {source === "jsearch" && (
              <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Live results from top job sites
              </span>
            )}
            {source === "curated" && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Curated listings from top Indian companies
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                No jobs found for your criteria
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try selecting a different role, location, or experience level.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {job.employerLogo && (
                        <img
                          src={job.employerLogo || "/placeholder.svg"}
                          alt={`${job.company} logo`}
                          className="h-10 w-10 shrink-0 rounded-lg border border-border object-contain bg-background"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).style.display =
                              "none"
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    {job.salary && (
                      <span className="shrink-0 rounded-md bg-accent/10 px-2.5 py-1 text-sm font-semibold text-accent">
                        {job.salary}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.postedDate}
                    </span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                      {job.experienceLabel}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchedSkills.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                    {job.applyLink ? (
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        Apply Now
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1.5 bg-transparent"
                      >
                        View Job
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
