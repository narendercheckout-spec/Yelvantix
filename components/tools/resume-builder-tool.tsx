"use client"

import { useState, useRef, useCallback } from "react"
import { Plus, Trash2, Printer, Eye, Edit3, LayoutTemplate, ArrowLeft, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TemplateSelector } from "@/components/tools/template-selector"
import { ResumePreview, getTemplatePrintStyles } from "@/components/tools/resume-preview"
import type { ResumeData, Experience, Education, ResumeTemplate } from "@/lib/resume-templates"
import { emptyResume, resumeTemplates } from "@/lib/resume-templates"

type Step = "templates" | "edit" | "preview"

export function ResumeBuilderTool() {
  const [step, setStep] = useState<Step>("templates")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [resume, setResume] = useState<ResumeData>(emptyResume)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleSelectTemplate = useCallback((template: ResumeTemplate) => {
    setSelectedTemplateId(template.id)
    setResume(template.sampleData)
  }, [])

  const handleStartEditing = useCallback(() => {
    if (selectedTemplateId) {
      setStep("edit")
    }
  }, [selectedTemplateId])

  const handleUseBlank = useCallback((template: ResumeTemplate) => {
    setSelectedTemplateId(template.id)
    setResume(emptyResume)
    setStep("edit")
  }, [])

  const updateField = (field: keyof ResumeData, value: string) => {
    setResume((prev) => ({ ...prev, [field]: value }))
  }

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: crypto.randomUUID(), title: "", company: "", startDate: "", endDate: "", description: "" },
      ],
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { id: crypto.randomUUID(), degree: "", school: "", year: "" }],
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow || !previewRef.current) return

    const styles = getTemplatePrintStyles(selectedTemplateId || "classic-professional")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resume.fullName || "Resume"} - Resume</title>
          <style>${styles}</style>
        </head>
        <body>${previewRef.current.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleResetToSample = () => {
    const template = resumeTemplates.find((t) => t.id === selectedTemplateId)
    if (template) {
      setResume(template.sampleData)
    }
  }

  const hasContent = resume.fullName || resume.experience.length > 0 || resume.education.length > 0
  const currentTemplate = resumeTemplates.find((t) => t.id === selectedTemplateId)

  // Step 1: Template Selection
  if (step === "templates") {
    return (
      <div className="flex flex-col gap-6">
        <TemplateSelector selectedId={selectedTemplateId} onSelect={handleSelectTemplate} />

        {selectedTemplateId && currentTemplate && (
          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">
                Selected: <span className="font-semibold">{currentTemplate.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Template comes pre-filled with sample data you can customize
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUseBlank(currentTemplate)}
                className="bg-transparent"
              >
                Start Blank
              </Button>
              <Button size="sm" onClick={handleStartEditing}>
                Use Template
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Step 2: Edit Mode
  if (step === "edit") {
    return (
      <div className="flex flex-col gap-6">
        {/* Navigation bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep("templates")}
            className="gap-1.5 bg-transparent"
          >
            <LayoutTemplate className="h-4 w-4" />
            Change Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToSample}
            className="gap-1.5 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Sample
          </Button>
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={() => setStep("preview")} className="gap-1.5">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        {currentTemplate && (
          <div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
            <LayoutTemplate className="h-4 w-4 text-primary" />
            <p className="text-sm text-foreground">
              Editing with <strong>{currentTemplate.name}</strong> template
            </p>
          </div>
        )}

        {/* Personal Info */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={resume.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={resume.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={resume.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-foreground">
                Location
              </label>
              <Input
                id="location"
                placeholder="New York, NY"
                value={resume.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Professional Summary</h2>
          <Textarea
            placeholder="A brief summary of your professional background and goals..."
            value={resume.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            rows={4}
          />
        </section>

        {/* Experience */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">Work Experience</h2>
            <Button variant="outline" size="sm" onClick={addExperience} className="gap-1.5 bg-transparent">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {resume.experience.length === 0 ? (
            <p className="text-sm text-muted-foreground">{"No experience added yet. Click \"Add\" to start."}</p>
          ) : (
            <div className="flex flex-col gap-6">
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className="relative rounded-lg border border-border bg-background p-4">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove experience ${idx + 1}`}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Job Title</label>
                      <Input
                        placeholder="Software Engineer"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Company</label>
                      <Input
                        placeholder="Acme Inc."
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Start Date</label>
                      <Input
                        placeholder="Jan 2022"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">End Date</label>
                      <Input
                        placeholder="Present"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
                    <Textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Education */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">Education</h2>
            <Button variant="outline" size="sm" onClick={addEducation} className="gap-1.5 bg-transparent">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {resume.education.length === 0 ? (
            <p className="text-sm text-muted-foreground">{"No education added yet. Click \"Add\" to start."}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {resume.education.map((edu, idx) => (
                <div key={edu.id} className="relative rounded-lg border border-border bg-background p-4">
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove education ${idx + 1}`}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Degree</label>
                      <Input
                        placeholder="B.S. Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">School</label>
                      <Input
                        placeholder="MIT"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Year</label>
                      <Input
                        placeholder="2020"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Skills */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Skills</h2>
          <Input
            placeholder="React, TypeScript, Node.js, Python (comma-separated)"
            value={resume.skills}
            onChange={(e) => updateField("skills", e.target.value)}
          />
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setStep("preview")} className="gap-2">
            <Eye className="h-4 w-4" />
            Preview Resume
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={!hasContent} className="gap-2 bg-transparent">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Preview Mode
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setStep("edit")} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back to Edit
        </Button>
        <Button variant="outline" onClick={() => setStep("templates")} className="gap-2 bg-transparent">
          <LayoutTemplate className="h-4 w-4" />
          Change Template
        </Button>
        <Button onClick={handlePrint} disabled={!hasContent} className="gap-2">
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div ref={previewRef} className="mx-auto max-w-[800px] p-8 md:p-12">
          <ResumePreview data={resume} templateId={selectedTemplateId || "classic-professional"} />
        </div>
      </div>
    </div>
  )
}
