"use client"

import React from "react"

import type { ResumeData } from "@/lib/resume-templates"

interface ResumePreviewProps {
  data: ResumeData
  templateId: string
}

function getSkills(skills: string) {
  return skills.split(",").map((s) => s.trim()).filter(Boolean)
}

function hasContent(data: ResumeData) {
  return data.fullName || data.experience.length > 0 || data.education.length > 0
}

// Shared empty state
function EmptyState() {
  return (
    <div className="py-16 text-center">
      <p style={{ color: "#999", fontSize: 14 }}>Start filling in your details to see a preview here.</p>
    </div>
  )
}

// 1. Classic Professional - Georgia serif, traditional borders
function ClassicProfessional({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: "#1a1a2e", lineHeight: 1.55 }}>
      {data.fullName && <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 2, letterSpacing: 0.5 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 12, color: "#555", marginBottom: 18 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
        </p>
      )}
      {data.summary && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #1a1a2e", paddingBottom: 3, marginTop: 20, marginBottom: 10 }}>Professional Summary</h2>
          <p style={{ fontSize: 12.5 }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #1a1a2e", paddingBottom: 3, marginTop: 20, marginBottom: 10 }}>Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: 13.5 }}>{exp.title}</strong>
                <span style={{ fontSize: 11, color: "#777" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.company && <p style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{exp.company}</p>}
              {exp.description && <p style={{ fontSize: 12, marginTop: 4, whiteSpace: "pre-line" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #1a1a2e", paddingBottom: 3, marginTop: 20, marginBottom: 10 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
              <p style={{ fontSize: 12, color: "#555" }}>{[edu.school, edu.year].filter(Boolean).join(", ")}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, borderBottom: "2px solid #1a1a2e", paddingBottom: 3, marginTop: 20, marginBottom: 10 }}>Skills</h2>
          <p style={{ fontSize: 12 }}>{skills.join("  \u2022  ")}</p>
        </section>
      )}
    </div>
  )
}

// 2. Modern Minimal - clean sans-serif, blue accents
function ModernMinimal({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", color: "#222", lineHeight: 1.6 }}>
      {data.fullName && <h1 style={{ fontSize: 28, fontWeight: 600, color: "#0a66c2", marginBottom: 2 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 12, color: "#666", marginBottom: 20 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  \u00b7  ")}
        </p>
      )}
      {data.summary && (
        <section style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: "#444", borderLeft: "3px solid #0a66c2", paddingLeft: 12 }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: "#0a66c2", marginTop: 18, marginBottom: 10 }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>{exp.title}</h3>
                <span style={{ fontSize: 11, color: "#888" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.company && <p style={{ fontSize: 12, color: "#0a66c2", fontWeight: 500 }}>{exp.company}</p>}
              {exp.description && <p style={{ fontSize: 12, marginTop: 4, whiteSpace: "pre-line", color: "#444" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: "#0a66c2", marginTop: 18, marginBottom: 10 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
              <p style={{ fontSize: 12, color: "#666" }}>{[edu.school, edu.year].filter(Boolean).join(", ")}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: "#0a66c2", marginTop: 18, marginBottom: 10 }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#f0f4f8", color: "#333" }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// 3. Executive Bold - dark header block, strong headings
function ExecutiveBold({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a", lineHeight: 1.55 }}>
      <div style={{ background: "#1a1a2e", color: "#fff", padding: "20px 24px", margin: "-32px -32px 20px -32px", borderRadius: "8px 8px 0 0" }}>
        {data.fullName && <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>{data.fullName}</h1>}
        {(data.email || data.phone || data.location) && (
          <p style={{ fontSize: 12, color: "#ccc", marginTop: 4 }}>
            {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
          </p>
        )}
      </div>
      {data.summary && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#1a1a2e", borderBottom: "3px solid #1a1a2e", paddingBottom: 4, marginBottom: 10 }}>Executive Summary</h2>
          <p style={{ fontSize: 12.5 }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#1a1a2e", borderBottom: "3px solid #1a1a2e", paddingBottom: 4, marginTop: 22, marginBottom: 10 }}>Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>{exp.title}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#555", fontWeight: 600 }}>{exp.company}</span>
                <span style={{ color: "#777" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.description && <p style={{ fontSize: 12, marginTop: 6, whiteSpace: "pre-line" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#1a1a2e", borderBottom: "3px solid #1a1a2e", paddingBottom: 4, marginTop: 22, marginBottom: 10 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
              <p style={{ fontSize: 12, color: "#555" }}>{[edu.school, edu.year].filter(Boolean).join(", ")}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#1a1a2e", borderBottom: "3px solid #1a1a2e", paddingBottom: 4, marginTop: 22, marginBottom: 10 }}>Core Competencies</h2>
          <p style={{ fontSize: 12 }}>{skills.join("  \u2022  ")}</p>
        </section>
      )}
    </div>
  )
}

// 4. Creative Edge - left accent bars
function CreativeEdge({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif", color: "#2d2d2d", lineHeight: 1.6 }}>
      {data.fullName && <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  \u00b7  ")}
        </p>
      )}
      {data.summary && (
        <section style={{ borderLeft: "4px solid #2bb573", paddingLeft: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: "#444" }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#2bb573", marginTop: 16, marginBottom: 10 }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ borderLeft: "3px solid #e0e0e0", paddingLeft: 14, marginBottom: 16, marginLeft: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>{exp.title}</h3>
                <span style={{ fontSize: 11, color: "#999" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.company && <p style={{ fontSize: 12, color: "#2bb573", fontWeight: 500 }}>{exp.company}</p>}
              {exp.description && <p style={{ fontSize: 12, marginTop: 4, whiteSpace: "pre-line", color: "#555" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#2bb573", marginTop: 16, marginBottom: 10 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ borderLeft: "3px solid #e0e0e0", paddingLeft: 14, marginBottom: 8, marginLeft: 2 }}>
              <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
              <p style={{ fontSize: 12, color: "#666" }}>{[edu.school, edu.year].filter(Boolean).join(", ")}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#2bb573", marginTop: 16, marginBottom: 10 }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, background: "#e8f5ee", color: "#2d2d2d" }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// 5. Compact Efficient - tight spacing, more content per page
function CompactEfficient({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", color: "#1a1a1a", lineHeight: 1.45, fontSize: 12 }}>
      {data.fullName && <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 1 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
        </p>
      )}
      {data.summary && (
        <section style={{ marginBottom: 8 }}>
          <div style={{ height: 1, background: "#333", marginBottom: 6 }} />
          <p style={{ fontSize: 11.5 }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <div style={{ height: 1, background: "#333", marginTop: 8, marginBottom: 6 }} />
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span><strong>{exp.title}</strong>{exp.company ? ` \u2014 ${exp.company}` : ""}</span>
                <span style={{ fontSize: 10, color: "#777", whiteSpace: "nowrap" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.description && <p style={{ fontSize: 11, marginTop: 2, whiteSpace: "pre-line", color: "#444" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <div style={{ height: 1, background: "#333", marginTop: 6, marginBottom: 6 }} />
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 4 }}>
              <span><strong>{edu.degree}</strong>{edu.school ? ` \u2014 ${edu.school}` : ""}{edu.year ? `, ${edu.year}` : ""}</span>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={{ height: 1, background: "#333", marginTop: 6, marginBottom: 6 }} />
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Skills</h2>
          <p style={{ fontSize: 11 }}>{skills.join("  \u2022  ")}</p>
        </section>
      )}
    </div>
  )
}

// 6. Two-Column Pro - sidebar layout
function TwoColumnPro({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", color: "#222", lineHeight: 1.5 }}>
      <div style={{ display: "flex", gap: 24 }}>
        {/* Sidebar */}
        <div style={{ width: 180, flexShrink: 0 }}>
          <div style={{ background: "#f5f7fa", borderRadius: 8, padding: 16 }}>
            <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#888", marginBottom: 8 }}>Contact</h2>
            {data.email && <p style={{ fontSize: 11, marginBottom: 4, wordBreak: "break-all" }}>{data.email}</p>}
            {data.phone && <p style={{ fontSize: 11, marginBottom: 4 }}>{data.phone}</p>}
            {data.location && <p style={{ fontSize: 11, marginBottom: 12 }}>{data.location}</p>}

            {skills.length > 0 && (
              <>
                <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#888", marginBottom: 8 }}>Skills</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {skills.map((s) => (
                    <span key={s} style={{ fontSize: 11, color: "#333" }}>{s}</span>
                  ))}
                </div>
              </>
            )}

            {data.education.length > 0 && (
              <>
                <h2 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#888", marginTop: 16, marginBottom: 8 }}>Education</h2>
                {data.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600 }}>{edu.degree}</p>
                    <p style={{ fontSize: 10, color: "#666" }}>{edu.school}</p>
                    <p style={{ fontSize: 10, color: "#888" }}>{edu.year}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          {data.fullName && <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{data.fullName}</h1>}
          {data.summary && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "2px solid #222", paddingBottom: 3, marginBottom: 8 }}>Summary</h2>
              <p style={{ fontSize: 12 }}>{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section>
              <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, borderBottom: "2px solid #222", paddingBottom: 3, marginBottom: 8 }}>Experience</h2>
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600 }}>{exp.title}</h3>
                    <span style={{ fontSize: 10, color: "#888" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
                  </div>
                  {exp.company && <p style={{ fontSize: 11, color: "#555" }}>{exp.company}</p>}
                  {exp.description && <p style={{ fontSize: 11.5, marginTop: 4, whiteSpace: "pre-line", color: "#444" }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

// 7. Tech Focused - monospace touches, code-like feel
function TechFocused({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Inter', 'SF Mono', sans-serif", color: "#1a1a2e", lineHeight: 1.55 }}>
      {data.fullName && <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0a66c2", marginBottom: 2 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 11, color: "#666", fontFamily: "'SF Mono', 'Courier New', monospace", marginBottom: 14 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  //  ")}
        </p>
      )}
      {skills.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#0a66c2", borderBottom: "2px solid #0a66c2", paddingBottom: 3, marginBottom: 8 }}>Tech Stack</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {skills.map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#f0f4f8", border: "1px solid #dde4ec", fontFamily: "'SF Mono', 'Courier New', monospace" }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {data.summary && (
        <section style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#0a66c2", borderBottom: "2px solid #0a66c2", paddingBottom: 3, marginBottom: 8 }}>About</h2>
          <p style={{ fontSize: 12.5 }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#0a66c2", borderBottom: "2px solid #0a66c2", paddingBottom: 3, marginBottom: 8 }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 600 }}>{exp.title}</h3>
                <span style={{ fontSize: 10, color: "#888", fontFamily: "monospace" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" -> ")}</span>
              </div>
              {exp.company && <p style={{ fontSize: 12, color: "#0a66c2" }}>{exp.company}</p>}
              {exp.description && <p style={{ fontSize: 12, marginTop: 4, whiteSpace: "pre-line", color: "#444" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#0a66c2", borderBottom: "2px solid #0a66c2", paddingBottom: 3, marginTop: 16, marginBottom: 8 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: 12.5 }}>{edu.degree}</strong>
              <p style={{ fontSize: 11, color: "#666" }}>{[edu.school, edu.year].filter(Boolean).join(" | ")}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

// 8. Academic Formal - centered header, italic emphasis
function AcademicFormal({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: "#1a1a1a", lineHeight: 1.55 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        {data.fullName && <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>{data.fullName}</h1>}
        {(data.email || data.phone || data.location) && (
          <p style={{ fontSize: 12, color: "#555" }}>
            {[data.email, data.phone, data.location].filter(Boolean).join("  \u2022  ")}
          </p>
        )}
        <div style={{ height: 1, background: "#333", marginTop: 12 }} />
      </div>
      {data.summary && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, fontVariant: "small-caps", letterSpacing: 1, marginBottom: 6 }}>Research Interests</h2>
          <p style={{ fontSize: 12.5, fontStyle: "italic" }}>{data.summary}</p>
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, fontVariant: "small-caps", letterSpacing: 1, marginTop: 18, marginBottom: 8 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
                <span style={{ fontSize: 11, color: "#777" }}>{edu.year}</span>
              </div>
              <p style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{edu.school}</p>
            </div>
          ))}
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, fontVariant: "small-caps", letterSpacing: 1, marginTop: 18, marginBottom: 8 }}>Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: 13, fontWeight: 600 }}>{exp.title}</h3>
                <span style={{ fontSize: 10, color: "#777" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.company && <p style={{ fontSize: 12, color: "#555", fontStyle: "italic" }}>{exp.company}</p>}
              {exp.description && <p style={{ fontSize: 12, marginTop: 4, whiteSpace: "pre-line" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 600, fontVariant: "small-caps", letterSpacing: 1, marginTop: 18, marginBottom: 6 }}>Technical Proficiencies</h2>
          <p style={{ fontSize: 12 }}>{skills.join(", ")}</p>
        </section>
      )}
    </div>
  )
}

// 9. Sales Impact - metrics-focused
function SalesImpact({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Helvetica Neue', 'Arial', sans-serif", color: "#1a1a1a", lineHeight: 1.55 }}>
      {data.fullName && <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 2, textTransform: "uppercase", letterSpacing: 2 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
        </p>
      )}
      {data.summary && (
        <section style={{ background: "#f8f9fa", borderRadius: 6, padding: 14, marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 500 }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, borderBottom: "3px solid #1a1a1a", paddingBottom: 4, marginBottom: 12 }}>Track Record</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>{exp.title}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555" }}>
                <span style={{ fontWeight: 600 }}>{exp.company}</span>
                <span>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.description && <p style={{ fontSize: 12, marginTop: 6, whiteSpace: "pre-line", color: "#333" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, borderBottom: "3px solid #1a1a1a", paddingBottom: 4, marginTop: 20, marginBottom: 10 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
              <p style={{ fontSize: 12, color: "#555" }}>{[edu.school, edu.year].filter(Boolean).join(", ")}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, borderBottom: "3px solid #1a1a1a", paddingBottom: 4, marginTop: 20, marginBottom: 10 }}>Key Competencies</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, background: "#1a1a1a", color: "#fff" }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// 10. Clean Starter - gentle, approachable
function CleanStarter({ data }: { data: ResumeData }) {
  const skills = getSkills(data.skills)
  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", color: "#333", lineHeight: 1.6 }}>
      {data.fullName && <h1 style={{ fontSize: 24, fontWeight: 600, color: "#2d6a4f", marginBottom: 2 }}>{data.fullName}</h1>}
      {(data.email || data.phone || data.location) && (
        <p style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  \u00b7  ")}
        </p>
      )}
      {data.summary && (
        <section style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, color: "#555" }}>{data.summary}</p>
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#2d6a4f", paddingBottom: 4, borderBottom: "2px solid #2d6a4f", marginBottom: 10 }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
                <span style={{ fontSize: 11, color: "#888" }}>{edu.year}</span>
              </div>
              <p style={{ fontSize: 12, color: "#666" }}>{edu.school}</p>
            </div>
          ))}
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#2d6a4f", paddingBottom: 4, borderBottom: "2px solid #2d6a4f", marginTop: 18, marginBottom: 10 }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 600 }}>{exp.title}</h3>
                <span style={{ fontSize: 10, color: "#999" }}>{[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              {exp.company && <p style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 500 }}>{exp.company}</p>}
              {exp.description && <p style={{ fontSize: 12, marginTop: 4, whiteSpace: "pre-line", color: "#555" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#2d6a4f", paddingBottom: 4, borderBottom: "2px solid #2d6a4f", marginTop: 18, marginBottom: 10 }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skills.map((s) => (
              <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#e8f5ee", color: "#2d6a4f" }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Template renderer map
const templateRenderers: Record<string, React.FC<{ data: ResumeData }>> = {
  "classic-professional": ClassicProfessional,
  "modern-minimal": ModernMinimal,
  "executive-bold": ExecutiveBold,
  "creative-edge": CreativeEdge,
  "compact-efficient": CompactEfficient,
  "two-column-pro": TwoColumnPro,
  "tech-focused": TechFocused,
  "academic-formal": AcademicFormal,
  "sales-impact": SalesImpact,
  "clean-starter": CleanStarter,
}

export function ResumePreview({ data, templateId }: ResumePreviewProps) {
  if (!hasContent(data)) {
    return <EmptyState />
  }

  const Renderer = templateRenderers[templateId] || ClassicProfessional
  return <Renderer data={data} />
}

// Export for print function
export function getTemplatePrintStyles(templateId: string): string {
  const baseStyles = `* { margin: 0; padding: 0; box-sizing: border-box; } @media print { body { padding: 20px; } }`

  const templateStyles: Record<string, string> = {
    "classic-professional": `${baseStyles} body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.55; }`,
    "modern-minimal": `${baseStyles} body { font-family: 'Inter', 'Helvetica Neue', sans-serif; color: #222; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }`,
    "executive-bold": `${baseStyles} body { font-family: 'Georgia', serif; color: #1a1a1a; padding: 0; max-width: 800px; margin: 0 auto; line-height: 1.55; }`,
    "creative-edge": `${baseStyles} body { font-family: 'Helvetica Neue', 'Arial', sans-serif; color: #2d2d2d; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }`,
    "compact-efficient": `${baseStyles} body { font-family: 'Arial', 'Helvetica', sans-serif; color: #1a1a1a; padding: 30px; max-width: 800px; margin: 0 auto; line-height: 1.45; font-size: 12px; }`,
    "two-column-pro": `${baseStyles} body { font-family: 'Helvetica Neue', sans-serif; color: #222; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.5; }`,
    "tech-focused": `${baseStyles} body { font-family: 'Inter', 'SF Mono', sans-serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.55; }`,
    "academic-formal": `${baseStyles} body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.55; }`,
    "sales-impact": `${baseStyles} body { font-family: 'Helvetica Neue', 'Arial', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.55; }`,
    "clean-starter": `${baseStyles} body { font-family: 'Inter', 'Helvetica Neue', sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }`,
  }

  return templateStyles[templateId] || templateStyles["classic-professional"]
}
