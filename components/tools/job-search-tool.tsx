"use client"

import React from "react"
import { useState, useCallback } from "react"
import {
  Search,
  MapPin,
  Briefcase,
  X,
  ExternalLink,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const SUGGESTED_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "SQL",
  "Node.js",
  "TypeScript",
  "CSS",
  "HTML",
  "AWS",
  "Docker",
  "Java",
  "Excel",
  "Figma",
  "Flutter",
  "SEO",
  "Testing",
]

export function JobSearchTool() {
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [experience, setExperience] = useState<ExperienceLevel>("any")
  const [results, setResults] = useState<Job[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState<string>("")

  const addSkill = useCallback(
    (skill: string) => {
      const normalized = skill.trim().toLowerCase()
      if (normalized && !skills.includes(normalized)) {
        setSkills((prev) => [...prev, normalized])
      }
      setSkillInput("")
    },
    [skills],
  )

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const handleSearch = async () => {
    if (skills.length === 0) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams({
        query: skills.join(", "),
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5">
          {/* Skills Input */}
          <div>
            <label
              htmlFor="skills-input"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Your Skills
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="skills-input"
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => addSkill(skillInput)}
                disabled={!skillInput.trim()}
              >
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 pr-1 text-sm capitalize"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {skills.length === 0 && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Suggested skills:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.map((s) => (
                    <button
                      key={s}
                      suppressHydrationWarning
                      onClick={() => addSkill(s)}
                      className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Input */}
          <div>
            <label
              htmlFor="location-input"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Location{" "}
              <span className="text-muted-foreground">(defaults to all India)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location-input"
                placeholder="e.g. Remote, Bengaluru, Mumbai, Hyderabad..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
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
            disabled={skills.length === 0 || isLoading}
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
            Finding the best matches for your skills across India
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
                No jobs found for your exact criteria
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No jobs match your skills in the specified location. Try a
                different location, adjust your skills, or search with
                fewer filters.
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
                            ;(e.target as HTMLImageElement).style.display =
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
                          variant={
                            skills.some(
                              (us) => us.toLowerCase() === s.toLowerCase(),
                            )
                              ? "default"
                              : "secondary"
                          }
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
