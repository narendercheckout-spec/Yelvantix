import { NextRequest, NextResponse } from "next/server"

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ""
const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search"

interface JSearchJob {
  job_id: string
  job_title: string
  employer_name: string
  employer_logo: string | null
  job_city: string
  job_state: string
  job_country: string
  job_employment_type: string
  job_description: string
  job_apply_link: string
  job_posted_at_datetime_utc: string
  job_min_salary: number | null
  job_max_salary: number | null
  job_salary_currency: string | null
  job_salary_period: string | null
  job_required_experience?: {
    no_experience_required?: boolean
    required_experience_in_months?: number | null
    experience_mentioned?: boolean
  }
  job_highlights?: {
    Qualifications?: string[]
    Responsibilities?: string[]
  }
}

function getExperienceLabel(job: JSearchJob): string {
  const exp = job.job_required_experience
  if (!exp || exp.no_experience_required) return "Fresher (0-1 yrs)"
  const months = exp.required_experience_in_months
  if (!months) return "Any Experience"
  const years = months / 12
  if (years <= 1) return "Fresher (0-1 yrs)"
  if (years <= 3) return "Junior (1-3 yrs)"
  if (years <= 5) return "Mid-Level (3-5 yrs)"
  if (years <= 8) return "Senior (5-8 yrs)"
  return "Lead / Principal (8+ yrs)"
}

function formatSalary(job: JSearchJob): string | undefined {
  if (job.job_min_salary && job.job_max_salary && job.job_salary_currency) {
    const currency = job.job_salary_currency === "INR" ? "" : job.job_salary_currency + " "
    const period = job.job_salary_period === "YEAR" ? "/yr" : job.job_salary_period === "MONTH" ? "/mo" : ""
    if (job.job_salary_currency === "INR") {
      const minL = (job.job_min_salary / 100000).toFixed(1).replace(/\.0$/, "")
      const maxL = (job.job_max_salary / 100000).toFixed(1).replace(/\.0$/, "")
      return `${minL}L - ${maxL}L ${period}`
    }
    return `${currency}${job.job_min_salary.toLocaleString()} - ${job.job_max_salary.toLocaleString()} ${period}`
  }
  return undefined
}

function formatPostedDate(dateStr: string): string {
  try {
    const posted = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - posted.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`
  } catch {
    return "Recently"
  }
}

/** Check if a user skill matches a job skill using exact word boundary matching */
function skillMatches(userSkill: string, jobSkill: string): boolean {
  const u = userSkill.toLowerCase().trim()
  const j = jobSkill.toLowerCase().trim()
  // Exact match
  if (u === j) return true
  // Handle common aliases
  const aliases: Record<string, string[]> = {
    "js": ["javascript"],
    "javascript": ["js"],
    "ts": ["typescript"],
    "typescript": ["ts"],
    "node": ["node.js", "nodejs"],
    "node.js": ["node", "nodejs"],
    "nodejs": ["node", "node.js"],
    "react": ["react.js", "reactjs"],
    "react.js": ["react", "reactjs"],
    "next": ["next.js", "nextjs"],
    "next.js": ["next", "nextjs"],
    "vue": ["vue.js", "vuejs"],
    "vue.js": ["vue", "vuejs"],
    "ml": ["machine learning"],
    "machine learning": ["ml"],
    "k8s": ["kubernetes"],
    "kubernetes": ["k8s"],
    "postgres": ["postgresql"],
    "postgresql": ["postgres"],
    "design": ["figma", "ui/ux", "ui ux", "uiux"],
    "figma": ["design"],
    "devops": ["ci/cd"],
  }
  if (aliases[u]?.includes(j)) return true
  return false
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const role = searchParams.get("role") || ""
  const location = searchParams.get("location") || "India"
  const experienceFilter = searchParams.get("experience") || "any"
  const page = searchParams.get("page") || "1"

  if (!role.trim()) {
    return NextResponse.json({ jobs: [], total: 0, error: "No role provided" })
  }

  // Map IT roles to search queries and skills
  const roleMap: Record<string, { query: string; skills: string[] }> = {
    "frontend-developer": { query: "Frontend Developer", skills: ["react", "javascript", "typescript", "css", "html", "vue", "angular"] },
    "backend-developer": { query: "Backend Developer", skills: ["node.js", "python", "java", "sql", "spring", "django", "rest api"] },
    "fullstack-developer": { query: "Full Stack Developer", skills: ["react", "node.js", "javascript", "typescript", "sql", "mongodb"] },
    "mobile-developer": { query: "Mobile Developer", skills: ["flutter", "react native", "swift", "kotlin", "mobile", "ios", "android"] },
    "devops-engineer": { query: "DevOps Engineer", skills: ["aws", "docker", "kubernetes", "linux", "python", "ci/cd", "terraform"] },
    "data-scientist": { query: "Data Scientist", skills: ["python", "machine learning", "sql", "data analysis", "tensorflow", "pytorch"] },
    "data-analyst": { query: "Data Analyst", skills: ["python", "sql", "excel", "data analysis", "power bi", "tableau"] },
    "qa-engineer": { query: "QA Engineer", skills: ["testing", "selenium", "python", "java", "sql", "automation"] },
    "ui-ux-designer": { query: "UI UX Designer", skills: ["figma", "design", "css", "html", "photoshop", "sketch"] },
    "product-designer": { query: "Product Designer", skills: ["figma", "design", "css", "html", "prototyping", "user research"] },
    "cloud-engineer": { query: "Cloud Engineer", skills: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform"] },
    "database-admin": { query: "Database Administrator", skills: ["sql", "mysql", "postgresql", "mongodb", "oracle", "performance tuning"] },
    "security-engineer": { query: "Security Engineer", skills: ["cybersecurity", "penetration testing", "network security", "python", "linux"] },
    "technical-writer": { query: "Technical Writer", skills: ["writing", "documentation", "html", "markdown", "api documentation"] },
    "product-manager": { query: "Product Manager", skills: ["product management", "agile", "jira", "data analysis", "roadmap"] },
  }

  const roleData = roleMap[role]
  if (!roleData) {
    return NextResponse.json({ jobs: [], total: 0, error: "Invalid role" })
  }

  const searchQuery = `${roleData.query} in ${location}`
  const userSkills = roleData.skills


  // Try JSearch API first
  if (RAPIDAPI_KEY) {
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        page,
        num_pages: "1",
        date_posted: "month",
      })

      if (experienceFilter !== "any") {
        const expMap: Record<string, string> = {
          fresher: "under_3_years",
          junior: "under_3_years",
          mid: "more_than_3_years",
          senior: "more_than_3_years",
          lead: "more_than_3_years",
        }
        if (expMap[experienceFilter]) {
          params.set("job_requirements", expMap[experienceFilter])
        }
      }

      const response = await fetch(`${JSEARCH_URL}?${params.toString()}`, {
        method: "GET",
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
        next: { revalidate: 300 },
      })

      if (response.ok) {
        const data = await response.json()
        const apiJobs: JSearchJob[] = data.data || []

        if (apiJobs.length > 0) {
          // Only return jobs where at least one user skill actually appears in the job
          const relevantJobs = apiJobs.filter((job) => {
            const jobText = `${job.job_title} ${job.job_description} ${(job.job_highlights?.Qualifications || []).join(" ")}`.toLowerCase()
            return userSkills.some((skill: string) => jobText.includes(skill))
          })

          const jobs = relevantJobs.map((job, idx) => ({
            id: job.job_id || `api-${idx}`,
            title: job.job_title,
            company: job.employer_name,
            location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") || location,
            type: (job.job_employment_type || "Full-time").replace("FULLTIME", "Full-time").replace("PARTTIME", "Part-time").replace("CONTRACTOR", "Contract").replace("INTERN", "Internship"),
            experienceLabel: getExperienceLabel(job),
            matchedSkills: extractSkillsFromJob(job, userSkills),
            description: truncateDescription(job.job_description),
            postedDate: formatPostedDate(job.job_posted_at_datetime_utc),
            salary: formatSalary(job),
            applyLink: job.job_apply_link,
            employerLogo: job.employer_logo,
            source: "live" as const,
          }))

          if (jobs.length > 0) {
            return NextResponse.json({
              jobs,
              total: jobs.length,
              source: "jsearch",
            })
          }
        }
      }
    } catch (err) {
      console.error("JSearch API error:", err)
    }
  }

  // Fallback: curated jobs matched strictly by role and location
  const fallbackJobs = getFallbackJobs(role, userSkills, location, experienceFilter)

  return NextResponse.json({
    jobs: fallbackJobs,
    total: fallbackJobs.length,
    source: "curated",
  })
}

function extractSkillsFromJob(job: JSearchJob, userSkills: string[]): string[] {
  const text = `${job.job_title} ${job.job_description} ${(job.job_highlights?.Qualifications || []).join(" ")}`.toLowerCase()
  const matched = new Set<string>()

  // Only add skills that actually appear in the job text
  for (const skill of userSkills) {
    if (text.includes(skill.toLowerCase())) {
      matched.add(skill)
    }
  }

  // Add other well-known skills found in the text (up to 8 total)
  const knownSkills = [
    "javascript", "python", "react", "sql", "node.js", "typescript",
    "css", "html", "aws", "docker", "figma", "excel", "java", "go",
    "rust", "c++", "c#", ".net", "angular", "vue", "next.js", "django",
    "flask", "spring", "mongodb", "postgresql", "mysql", "redis",
    "kubernetes", "terraform", "git", "linux", "azure", "gcp",
    "graphql", "rest api", "machine learning", "data analysis", "power bi",
    "tableau", "seo", "content", "marketing", "photoshop",
    "illustrator", "flutter", "swift", "kotlin", "php", "laravel",
    "ruby", "rails", "salesforce", "devops", "ci/cd",
    "selenium", "testing", "qa",
  ]

  for (const skill of knownSkills) {
    if (text.includes(skill) && matched.size < 8) {
      matched.add(skill)
    }
  }

  return Array.from(matched)
}

function truncateDescription(desc: string): string {
  if (!desc) return ""
  const clean = desc.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  if (clean.length <= 250) return clean
  return clean.slice(0, 250).replace(/\s\S*$/, "") + "..."
}

// Curated fallback jobs - strict role + location filtering
function getFallbackJobs(role: string, userSkills: string[], location: string, experience: string) {
  const loc = location.toLowerCase().trim()

  const ALL_FALLBACK_JOBS = [
    // ===== BENGALURU =====
    { id: "b1", title: "React Frontend Developer", company: "Infosys", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Develop interactive UI components for enterprise web applications using React, Redux, and TypeScript. Collaborate with UX designers and backend teams.", postedDate: "1 day ago", salary: "6L - 10L /yr", applyLink: "https://www.naukri.com/react-developer-jobs", source: "curated" as const },
    { id: "b2", title: "Senior React Engineer", company: "Flipkart", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["react", "javascript", "typescript", "node.js", "aws"], description: "Lead frontend architecture for Flipkart's e-commerce platform serving millions of users. Mentor junior developers.", postedDate: "2 days ago", salary: "22L - 38L /yr", applyLink: "https://www.naukri.com/react-engineer-jobs", source: "curated" as const },
    { id: "b3", title: "Full Stack Developer (MERN)", company: "PhonePe", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "node.js", "javascript", "mongodb", "typescript"], description: "Build end-to-end features for PhonePe's merchant dashboard. Work across React frontends and Node.js microservices.", postedDate: "1 day ago", salary: "14L - 24L /yr", applyLink: "https://www.naukri.com/mern-stack-developer-jobs", source: "curated" as const },
    { id: "b4", title: "Data Scientist", company: "Mu Sigma", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["python", "machine learning", "sql", "data analysis", "tableau"], description: "Apply statistical modeling and machine learning to solve business problems for Fortune 500 clients.", postedDate: "3 days ago", salary: "12L - 20L /yr", applyLink: "https://www.naukri.com/data-scientist-jobs", source: "curated" as const },
    { id: "b5", title: "Data Analyst", company: "Swiggy", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["python", "sql", "excel", "data analysis", "power bi"], description: "Analyze user behavior data, build dashboards, and provide actionable insights to drive product decisions at Swiggy.", postedDate: "2 days ago", salary: "4L - 7L /yr", applyLink: "https://www.naukri.com/data-analyst-jobs", source: "curated" as const },
    { id: "b6", title: "ML Engineer", company: "Ola Cabs", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["python", "machine learning", "sql", "aws", "docker"], description: "Design and deploy ML models for demand prediction, dynamic pricing, and route optimization at scale.", postedDate: "1 day ago", salary: "22L - 40L /yr", applyLink: "https://www.naukri.com/ml-engineer-jobs", source: "curated" as const },
    { id: "b7", title: "UI/UX Designer", company: "Zerodha", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["figma", "design", "css", "html", "photoshop"], description: "Lead product design for India's largest stock brokerage. Simplify complex trading interfaces for millions of investors.", postedDate: "5 days ago", salary: "18L - 30L /yr", applyLink: "https://www.naukri.com/uiux-designer-jobs", source: "curated" as const },
    { id: "b8", title: "Product Designer", company: "Swiggy", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["figma", "design", "css", "html", "javascript"], description: "Design intuitive food delivery and quick commerce experiences. Conduct user research and create prototypes.", postedDate: "2 days ago", salary: "12L - 22L /yr", applyLink: "https://www.naukri.com/product-designer-jobs", source: "curated" as const },
    { id: "b9", title: "SRE Engineer", company: "CRED", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["linux", "docker", "kubernetes", "python", "aws", "devops"], description: "Build and maintain observability infrastructure. Automate incident response for premium fintech services.", postedDate: "3 days ago", salary: "20L - 35L /yr", applyLink: "https://www.naukri.com/sre-engineer-jobs", source: "curated" as const },
    { id: "b10", title: "Java Microservices Developer", company: "Walmart Labs", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["java", "spring", "sql", "docker", "kubernetes"], description: "Build scalable Java microservices for Walmart's global e-commerce platform handling millions of orders.", postedDate: "1 day ago", salary: "16L - 28L /yr", applyLink: "https://www.naukri.com/java-microservices-jobs", source: "curated" as const },
    { id: "b11", title: "Digital Marketing Manager", company: "Meesho", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["marketing", "seo", "content", "excel", "data analysis"], description: "Plan and execute digital campaigns across channels for India's fastest-growing social commerce platform.", postedDate: "1 day ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/digital-marketing-manager-jobs", source: "curated" as const },
    { id: "b12", title: "Lead Software Engineer", company: "Myntra", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Lead / Principal (8+ yrs)", matchedSkills: ["react", "node.js", "typescript", "javascript", "aws"], description: "Lead a squad building next-gen e-commerce experiences for India's top fashion platform.", postedDate: "1 day ago", salary: "35L - 55L /yr", applyLink: "https://www.naukri.com/lead-software-engineer-jobs", source: "curated" as const },
    { id: "b13", title: "Python Backend Developer", company: "Razorpay", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["python", "django", "sql", "rest api", "docker"], description: "Build payment processing APIs and backend services for India's leading payment gateway.", postedDate: "2 days ago", salary: "8L - 14L /yr", applyLink: "https://www.naukri.com/python-developer-bengaluru-jobs", source: "curated" as const },
    { id: "b14", title: "DevOps Engineer", company: "Flipkart", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["aws", "docker", "kubernetes", "linux", "python", "ci/cd", "devops"], description: "Manage cloud infrastructure and deploy microservices at scale for India's largest online marketplace.", postedDate: "3 days ago", salary: "15L - 25L /yr", applyLink: "https://www.naukri.com/devops-bengaluru-jobs", source: "curated" as const },
    { id: "b15", title: "Flutter Mobile Developer", company: "Groww", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["flutter", "mobile", "javascript", "design"], description: "Build cross-platform mobile apps for India's popular investment platform used by 70M+ users.", postedDate: "1 day ago", salary: "8L - 15L /yr", applyLink: "https://www.naukri.com/flutter-bengaluru-jobs", source: "curated" as const },
    { id: "b16", title: "Visual Designer", company: "Flipkart", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["figma", "photoshop", "illustrator", "design", "css"], description: "Create visual design systems and marketing assets for Flipkart's brand campaigns and product pages.", postedDate: "4 days ago", salary: "6L - 10L /yr", applyLink: "https://www.naukri.com/visual-designer-bengaluru-jobs", source: "curated" as const },
    { id: "b17", title: "Software Engineer", company: "Accenture", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["java", "python", "sql", "javascript", "html"], description: "Join Accenture's technology practice. Work on diverse enterprise projects across cloud and digital transformation.", postedDate: "1 day ago", salary: "3.5L - 5.5L /yr", applyLink: "https://www.naukri.com/software-engineer-bengaluru-jobs", source: "curated" as const },
    { id: "b18", title: "QA Automation Engineer", company: "Wipro", location: "Bengaluru, Karnataka", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["testing", "selenium", "python", "javascript", "sql", "qa"], description: "Design and maintain automated testing frameworks for enterprise applications across multiple platforms.", postedDate: "2 days ago", salary: "8L - 14L /yr", applyLink: "https://www.naukri.com/qa-automation-bengaluru-jobs", source: "curated" as const },

    // ===== GURUGRAM =====
    { id: "g1", title: "Graphic Designer", company: "Urban Company", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["figma", "photoshop", "illustrator", "design", "content"], description: "Create marketing creatives, social media assets, and app graphics for India's leading home services marketplace.", postedDate: "1 day ago", salary: "3.5L - 6L /yr", applyLink: "https://www.naukri.com/graphic-designer-jobs", source: "curated" as const },
    { id: "g2", title: "Senior UI Designer", company: "Zomato", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["figma", "design", "photoshop", "css", "html"], description: "Lead the visual design team for Zomato's consumer app and web platform. Define design language and component systems.", postedDate: "2 days ago", salary: "20L - 35L /yr", applyLink: "https://www.naukri.com/senior-ui-designer-jobs", source: "curated" as const },
    { id: "g3", title: "UX Researcher", company: "MakeMyTrip", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["design", "figma", "content", "data analysis", "excel"], description: "Conduct user research studies, usability tests, and create insights to improve travel booking experiences.", postedDate: "3 days ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/ux-researcher-jobs", source: "curated" as const },
    { id: "g4", title: "Product Designer", company: "PolicyBazaar", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["figma", "design", "css", "html", "photoshop"], description: "Design intuitive insurance comparison interfaces. Simplify complex financial products for everyday consumers.", postedDate: "1 day ago", salary: "12L - 20L /yr", applyLink: "https://www.naukri.com/product-designer-gurugram-jobs", source: "curated" as const },
    { id: "g5", title: "Motion Designer", company: "Zomato", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["design", "illustrator", "photoshop", "figma", "content"], description: "Create engaging motion graphics and animations for Zomato's marketing campaigns and in-app experiences.", postedDate: "2 days ago", salary: "6L - 10L /yr", applyLink: "https://www.naukri.com/motion-designer-jobs", source: "curated" as const },
    { id: "g6", title: "Brand Designer", company: "Cars24", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["design", "photoshop", "illustrator", "figma", "content"], description: "Develop and maintain brand visual identity across all touchpoints for India's largest used car platform.", postedDate: "4 days ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/brand-designer-jobs", source: "curated" as const },
    { id: "g7", title: "Interaction Designer", company: "Nykaa", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["figma", "design", "css", "javascript", "html"], description: "Define interaction patterns and micro-animations for Nykaa's e-commerce experience across web and mobile.", postedDate: "1 day ago", salary: "16L - 28L /yr", applyLink: "https://www.naukri.com/interaction-designer-jobs", source: "curated" as const },
    { id: "g8", title: "React Developer", company: "Lenskart", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Build interactive e-commerce interfaces for Lenskart's virtual try-on and lens recommendation features.", postedDate: "2 days ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/react-developer-gurugram-jobs", source: "curated" as const },
    { id: "g9", title: "Python Data Engineer", company: "Airtel", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["python", "sql", "aws", "data analysis", "docker"], description: "Build data pipelines and analytics infrastructure for Airtel's 350M+ subscriber base.", postedDate: "1 day ago", salary: "12L - 22L /yr", applyLink: "https://www.naukri.com/data-engineer-gurugram-jobs", source: "curated" as const },
    { id: "g10", title: "Content Writer", company: "PolicyBazaar", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["writing", "seo", "content", "marketing"], description: "Write compelling insurance and financial content. Create blog posts, landing pages, and email campaigns.", postedDate: "2 days ago", salary: "3L - 5L /yr", applyLink: "https://www.naukri.com/content-writer-jobs", source: "curated" as const },
    { id: "g11", title: "Flutter Developer", company: "MakeMyTrip", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["flutter", "mobile", "javascript", "design"], description: "Develop and maintain Flutter-based travel booking apps. Implement smooth animations and offline-first features.", postedDate: "2 days ago", salary: "7L - 12L /yr", applyLink: "https://www.naukri.com/flutter-developer-jobs", source: "curated" as const },
    { id: "g12", title: "QA Engineer", company: "Cars24", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["testing", "selenium", "sql", "python", "qa"], description: "Test web and mobile applications for Cars24's car buying and selling platform. Write automated test suites.", postedDate: "3 days ago", salary: "5L - 8L /yr", applyLink: "https://www.naukri.com/qa-engineer-gurugram-jobs", source: "curated" as const },
    { id: "g13", title: "Java Backend Developer", company: "Paytm", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["java", "spring", "sql", "aws", "docker"], description: "Build high-performance backend services for Paytm's payment and financial services ecosystem.", postedDate: "1 day ago", salary: "12L - 22L /yr", applyLink: "https://www.naukri.com/java-developer-gurugram-jobs", source: "curated" as const },
    { id: "g14", title: "SEO Specialist", company: "Nykaa", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["seo", "content", "html", "marketing", "excel"], description: "Drive organic traffic growth for India's top beauty e-commerce platform through technical and content SEO.", postedDate: "5 days ago", salary: "4L - 8L /yr", applyLink: "https://www.naukri.com/seo-specialist-gurugram-jobs", source: "curated" as const },
    { id: "g15", title: "Node.js Developer", company: "Lenskart", location: "Gurugram, Haryana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["node.js", "javascript", "typescript", "sql", "mongodb"], description: "Build backend APIs and real-time services for Lenskart's e-commerce platform serving millions of customers.", postedDate: "3 days ago", salary: "7L - 12L /yr", applyLink: "https://www.naukri.com/nodejs-gurugram-jobs", source: "curated" as const },

    // ===== MUMBAI =====
    { id: "m1", title: "Senior Java Engineer", company: "Jio Platforms", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["java", "spring", "sql", "aws", "docker", "kubernetes"], description: "Architect high-throughput microservices for Jio's digital ecosystem serving 450M+ subscribers.", postedDate: "1 day ago", salary: "20L - 35L /yr", applyLink: "https://www.naukri.com/senior-java-engineer-jobs", source: "curated" as const },
    { id: "m2", title: "React Native Developer", company: "Dream11", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "javascript", "typescript", "mobile", "css"], description: "Build cross-platform mobile experiences for India's biggest fantasy sports platform with 200M+ users.", postedDate: "3 days ago", salary: "14L - 25L /yr", applyLink: "https://www.naukri.com/react-native-developer-jobs", source: "curated" as const },
    { id: "m3", title: "iOS Developer", company: "PhonePe", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["swift", "mobile", "javascript", "design"], description: "Build high-performance iOS experiences for India's largest UPI payment app. Focus on security and payments.", postedDate: "1 day ago", salary: "20L - 35L /yr", applyLink: "https://www.naukri.com/ios-developer-jobs", source: "curated" as const },
    { id: "m4", title: "UI/UX Designer", company: "Dream11", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["figma", "design", "css", "photoshop", "illustrator"], description: "Design engaging fantasy sports interfaces. Create intuitive dashboards and game-day experiences.", postedDate: "2 days ago", salary: "12L - 22L /yr", applyLink: "https://www.naukri.com/designer-mumbai-jobs", source: "curated" as const },
    { id: "m5", title: "Visual Designer", company: "Tata Digital", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["figma", "design", "photoshop", "illustrator", "content"], description: "Create visual design assets for Tata Neu super app. Design campaign creatives and in-app illustrations.", postedDate: "3 days ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/visual-designer-mumbai-jobs", source: "curated" as const },
    { id: "m6", title: "Python Developer", company: "HDFC Bank", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["python", "sql", "django", "data analysis", "rest api"], description: "Build fintech applications and data processing pipelines for India's largest private bank.", postedDate: "1 day ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/python-developer-mumbai-jobs", source: "curated" as const },
    { id: "m7", title: "Data Analyst", company: "Kotak Mahindra", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["python", "sql", "excel", "data analysis", "power bi"], description: "Analyze banking data to generate insights for risk management and customer segmentation.", postedDate: "2 days ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/data-analyst-mumbai-jobs", source: "curated" as const },
    { id: "m8", title: "React Frontend Developer", company: "Tata Digital", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Build responsive web interfaces for Tata Neu super app's e-commerce and loyalty features.", postedDate: "4 days ago", salary: "6L - 10L /yr", applyLink: "https://www.naukri.com/react-developer-mumbai-jobs", source: "curated" as const },
    { id: "m9", title: "DevOps Engineer", company: "ICICI Bank", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["aws", "docker", "kubernetes", "linux", "python", "ci/cd", "devops"], description: "Manage cloud infrastructure and CI/CD pipelines for banking applications with 99.99% uptime requirements.", postedDate: "2 days ago", salary: "12L - 20L /yr", applyLink: "https://www.naukri.com/devops-mumbai-jobs", source: "curated" as const },
    { id: "m10", title: "Angular Developer", company: "L&T Infotech", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["angular", "typescript", "javascript", "css", "html"], description: "Build enterprise Angular dashboards for banking and insurance domain clients across APAC.", postedDate: "3 days ago", salary: "8L - 14L /yr", applyLink: "https://www.naukri.com/angular-developer-mumbai-jobs", source: "curated" as const },
    { id: "m11", title: "Digital Marketing Executive", company: "Nykaa", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["marketing", "seo", "content", "excel"], description: "Execute digital marketing campaigns for Nykaa's beauty and fashion brands across social media channels.", postedDate: "1 day ago", salary: "3L - 5L /yr", applyLink: "https://www.naukri.com/digital-marketing-mumbai-jobs", source: "curated" as const },
    { id: "m12", title: "Full Stack Developer", company: "BrowserStack", location: "Mumbai, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "node.js", "javascript", "typescript", "mongodb"], description: "Build features for BrowserStack's developer tools used by 50,000+ companies worldwide.", postedDate: "1 day ago", salary: "14L - 24L /yr", applyLink: "https://www.naukri.com/fullstack-mumbai-jobs", source: "curated" as const },

    // ===== HYDERABAD =====
    { id: "h1", title: "JavaScript Developer", company: "TCS", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["javascript", "html", "css", "react"], description: "Join TCS Digital as a JavaScript developer working on client-facing web applications for BFSI and retail domains.", postedDate: "3 days ago", salary: "3.5L - 5.5L /yr", applyLink: "https://www.naukri.com/javascript-developer-jobs", source: "curated" as const },
    { id: "h2", title: "Java Developer", company: "Deloitte", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["java", "spring", "sql", "html", "javascript"], description: "Develop enterprise Java applications using Spring Boot. Work on consulting projects for global clients.", postedDate: "2 days ago", salary: "5L - 8L /yr", applyLink: "https://www.naukri.com/java-developer-hyderabad-jobs", source: "curated" as const },
    { id: "h3", title: "Python Data Scientist", company: "Amazon", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["python", "machine learning", "sql", "aws", "data analysis"], description: "Build ML models for Amazon's recommendation engine and supply chain optimization. Work with massive datasets.", postedDate: "1 day ago", salary: "18L - 32L /yr", applyLink: "https://www.naukri.com/data-scientist-hyderabad-jobs", source: "curated" as const },
    { id: "h4", title: "DevOps Engineer", company: "Microsoft", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["azure", "docker", "kubernetes", "linux", "python", "ci/cd", "devops"], description: "Manage Azure cloud infrastructure and deployment pipelines for Microsoft's enterprise products.", postedDate: "3 days ago", salary: "15L - 28L /yr", applyLink: "https://www.naukri.com/devops-hyderabad-jobs", source: "curated" as const },
    { id: "h5", title: "React Frontend Engineer", company: "ServiceNow", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Build enterprise workflow interfaces using React. Work on ServiceNow's ITSM platform used by Fortune 500 companies.", postedDate: "2 days ago", salary: "14L - 24L /yr", applyLink: "https://www.naukri.com/react-hyderabad-jobs", source: "curated" as const },
    { id: "h6", title: "SQL Database Developer", company: "DBS Bank", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["sql", "python", "excel", "data analysis"], description: "Write complex SQL queries and stored procedures for banking data warehousing and business intelligence.", postedDate: "4 days ago", salary: "5L - 8L /yr", applyLink: "https://www.naukri.com/sql-developer-hyderabad-jobs", source: "curated" as const },
    { id: "h7", title: "QA Automation Engineer", company: "Qualcomm", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["testing", "selenium", "python", "java", "sql", "qa"], description: "Build automated testing frameworks for Qualcomm's chipset software. Ensure quality across mobile platforms.", postedDate: "2 days ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/qa-automation-hyderabad-jobs", source: "curated" as const },
    { id: "h8", title: "UI/UX Designer", company: "Amazon", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["figma", "design", "css", "html", "photoshop"], description: "Design shopping and checkout experiences for Amazon India. Conduct A/B testing and user research.", postedDate: "1 day ago", salary: "20L - 35L /yr", applyLink: "https://www.naukri.com/designer-hyderabad-jobs", source: "curated" as const },
    { id: "h9", title: "Node.js Backend Developer", company: "Deloitte", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["node.js", "javascript", "typescript", "sql", "mongodb"], description: "Build RESTful APIs and backend services for consulting projects across healthcare and retail.", postedDate: "3 days ago", salary: "6L - 10L /yr", applyLink: "https://www.naukri.com/nodejs-hyderabad-jobs", source: "curated" as const },
    { id: "h10", title: "Cloud Solutions Architect", company: "Google", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Lead / Principal (8+ yrs)", matchedSkills: ["gcp", "aws", "docker", "kubernetes", "python", "terraform", "devops"], description: "Design cloud architecture for Google Cloud's enterprise clients across India and APAC.", postedDate: "2 days ago", salary: "40L - 65L /yr", applyLink: "https://www.naukri.com/cloud-architect-hyderabad-jobs", source: "curated" as const },
    { id: "h11", title: "Flutter Mobile Developer", company: "Capgemini", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["flutter", "mobile", "javascript", "design"], description: "Build cross-platform mobile applications using Flutter for enterprise clients in banking and retail.", postedDate: "4 days ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/flutter-hyderabad-jobs", source: "curated" as const },
    { id: "h12", title: "Technical Writer", company: "Microsoft", location: "Hyderabad, Telangana", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["writing", "html", "content", "javascript"], description: "Write developer documentation and API guides for Microsoft Azure services used worldwide.", postedDate: "3 days ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/technical-writer-hyderabad-jobs", source: "curated" as const },

    // ===== CHENNAI =====
    { id: "c1", title: "Python Backend Developer", company: "Zoho Corporation", location: "Chennai, Tamil Nadu", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["python", "django", "sql", "rest api"], description: "Build scalable backend APIs using Python and Django for Zoho's productivity applications serving millions.", postedDate: "5 hours ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/python-developer-chennai-jobs", source: "curated" as const },
    { id: "c2", title: "Node.js Backend Developer", company: "Freshworks", location: "Chennai, Tamil Nadu", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["node.js", "javascript", "sql", "mongodb", "rest api"], description: "Develop high-performance APIs and real-time features for Freshworks' customer engagement SaaS platform.", postedDate: "3 days ago", salary: "7L - 12L /yr", applyLink: "https://www.naukri.com/nodejs-developer-chennai-jobs", source: "curated" as const },
    { id: "c3", title: "Java Developer", company: "Cognizant", location: "Chennai, Tamil Nadu", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["java", "spring", "sql", "aws", "docker"], description: "Build enterprise Java microservices for healthcare and financial services clients globally.", postedDate: "2 days ago", salary: "8L - 15L /yr", applyLink: "https://www.naukri.com/java-developer-chennai-jobs", source: "curated" as const },
    { id: "c4", title: "React Developer", company: "Zoho Corporation", location: "Chennai, Tamil Nadu", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Build frontend interfaces for Zoho's suite of business applications used by 80M+ users worldwide.", postedDate: "1 day ago", salary: "8L - 14L /yr", applyLink: "https://www.naukri.com/react-developer-chennai-jobs", source: "curated" as const },
    { id: "c5", title: "UI Designer", company: "Freshworks", location: "Chennai, Tamil Nadu", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["figma", "design", "css", "html", "photoshop"], description: "Design SaaS product interfaces for Freshworks' customer support and CRM solutions.", postedDate: "3 days ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/ui-designer-chennai-jobs", source: "curated" as const },
    { id: "c6", title: "Data Analyst", company: "TCS", location: "Chennai, Tamil Nadu", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["python", "sql", "excel", "data analysis", "power bi"], description: "Analyze business data and create dashboards for enterprise clients across banking and telecom domains.", postedDate: "2 days ago", salary: "3.5L - 5.5L /yr", applyLink: "https://www.naukri.com/data-analyst-chennai-jobs", source: "curated" as const },

    // ===== PUNE =====
    { id: "p1", title: "Java Developer", company: "TCS", location: "Pune, Maharashtra", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["java", "spring", "sql", "html", "javascript"], description: "Develop enterprise Java applications using Spring Boot. Work on banking and insurance domain projects.", postedDate: "6 hours ago", salary: "3.5L - 5L /yr", applyLink: "https://www.naukri.com/java-developer-pune-jobs", source: "curated" as const },
    { id: "p2", title: "Vue.js Developer", company: "Razorpay", location: "Pune, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["javascript", "vue", "typescript", "css"], description: "Develop payment dashboard interfaces using Vue.js. Work on merchant-facing tools handling lakhs of transactions.", postedDate: "1 day ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/vue-developer-pune-jobs", source: "curated" as const },
    { id: "p3", title: "Python Developer", company: "Persistent Systems", location: "Pune, Maharashtra", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["python", "django", "sql", "rest api", "docker"], description: "Build backend services and automation tools using Python for enterprise clients across healthcare.", postedDate: "2 days ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/python-developer-pune-jobs", source: "curated" as const },
    { id: "p4", title: "DevOps Engineer", company: "Syntel", location: "Pune, Maharashtra", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["aws", "docker", "kubernetes", "linux", "python", "ci/cd", "devops"], description: "Manage cloud infrastructure and CI/CD for insurance domain applications.", postedDate: "3 days ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/devops-pune-jobs", source: "curated" as const },
    { id: "p5", title: "React Developer", company: "Infosys", location: "Pune, Maharashtra", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Build responsive web interfaces for enterprise clients using React and modern frontend technologies.", postedDate: "1 day ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/react-developer-pune-jobs", source: "curated" as const },
    { id: "p6", title: "QA Engineer", company: "Persistent Systems", location: "Pune, Maharashtra", type: "Full-time", experienceLabel: "Fresher (0-1 yrs)", matchedSkills: ["testing", "sql", "excel", "html", "qa"], description: "Execute test cases, report bugs, and validate fixes for healthcare software applications.", postedDate: "4 days ago", salary: "3L - 5L /yr", applyLink: "https://www.naukri.com/qa-engineer-pune-jobs", source: "curated" as const },

    // ===== NOIDA =====
    { id: "n1", title: "Angular Frontend Developer", company: "HCLTech", location: "Noida, Uttar Pradesh", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["javascript", "typescript", "angular", "css", "html"], description: "Build and maintain Angular-based enterprise dashboards for global banking clients.", postedDate: "2 days ago", salary: "8L - 14L /yr", applyLink: "https://www.naukri.com/angular-developer-noida-jobs", source: "curated" as const },
    { id: "n2", title: "DevOps Engineer", company: "Paytm", location: "Noida, Uttar Pradesh", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["aws", "docker", "kubernetes", "linux", "python", "ci/cd", "devops"], description: "Manage cloud infrastructure and CI/CD pipelines for India's leading digital payments platform.", postedDate: "12 hours ago", salary: "12L - 22L /yr", applyLink: "https://www.naukri.com/devops-engineer-noida-jobs", source: "curated" as const },
    { id: "n3", title: "Cloud Engineer", company: "Wipro", location: "Noida, Uttar Pradesh", type: "Full-time", experienceLabel: "Lead / Principal (8+ yrs)", matchedSkills: ["aws", "azure", "terraform", "docker", "kubernetes", "linux", "devops"], description: "Lead enterprise cloud migration projects. Design multi-cloud architecture for Fortune 500 clients.", postedDate: "2 days ago", salary: "30L - 50L /yr", applyLink: "https://www.naukri.com/cloud-engineer-noida-jobs", source: "curated" as const },
    { id: "n4", title: "React Developer", company: "HCLTech", location: "Noida, Uttar Pradesh", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["react", "javascript", "typescript", "css", "html"], description: "Build interactive web interfaces for enterprise applications. Work with cross-functional teams.", postedDate: "1 day ago", salary: "5L - 9L /yr", applyLink: "https://www.naukri.com/react-developer-noida-jobs", source: "curated" as const },

    // ===== KOLKATA =====
    { id: "k1", title: "Python Automation Engineer", company: "Wipro", location: "Kolkata, West Bengal", type: "Full-time", experienceLabel: "Junior (1-3 yrs)", matchedSkills: ["python", "selenium", "testing", "sql", "linux"], description: "Develop test automation frameworks and scripts using Python and Selenium for enterprise clients.", postedDate: "4 days ago", salary: "4.5L - 7.5L /yr", applyLink: "https://www.naukri.com/python-automation-kolkata-jobs", source: "curated" as const },
    { id: "k2", title: "Database Administrator", company: "Tech Mahindra", location: "Kolkata, West Bengal", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["sql", "mysql", "postgresql", "linux", "python"], description: "Manage and optimize enterprise databases. Handle performance tuning and disaster recovery.", postedDate: "2 days ago", salary: "7L - 13L /yr", applyLink: "https://www.naukri.com/dba-kolkata-jobs", source: "curated" as const },

    // ===== REMOTE (INDIA) =====
    { id: "r1", title: "Technical Writer", company: "Postman", location: "Remote, India", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["writing", "html", "content", "javascript"], description: "Write API documentation, developer guides, and tutorials for millions of developers using Postman.", postedDate: "3 days ago", salary: "10L - 18L /yr", applyLink: "https://www.naukri.com/technical-writer-remote-jobs", source: "curated" as const },
    { id: "r2", title: "React Developer", company: "Toptal", location: "Remote, India", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "javascript", "typescript", "node.js", "css"], description: "Work with top global clients on React projects. Flexible remote work with competitive pay.", postedDate: "1 day ago", salary: "15L - 30L /yr", applyLink: "https://www.naukri.com/react-remote-india-jobs", source: "curated" as const },
    { id: "r3", title: "Python Developer", company: "Turing", location: "Remote, India", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["python", "django", "sql", "aws", "rest api"], description: "Work remotely with US-based companies building Python backend services and APIs.", postedDate: "2 days ago", salary: "12L - 25L /yr", applyLink: "https://www.naukri.com/python-remote-india-jobs", source: "curated" as const },
    { id: "r4", title: "UI/UX Designer", company: "Lemon.io", location: "Remote, India", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["figma", "design", "css", "html", "photoshop"], description: "Design product interfaces for international startups. Work remotely with flexible hours.", postedDate: "1 day ago", salary: "10L - 20L /yr", applyLink: "https://www.naukri.com/designer-remote-india-jobs", source: "curated" as const },
    { id: "r5", title: "DevOps Engineer", company: "GitLab", location: "Remote, India", type: "Full-time", experienceLabel: "Senior (5-8 yrs)", matchedSkills: ["aws", "docker", "kubernetes", "linux", "python", "ci/cd", "devops", "terraform"], description: "Build and maintain CI/CD infrastructure for GitLab's globally distributed development platform.", postedDate: "3 days ago", salary: "25L - 45L /yr", applyLink: "https://www.naukri.com/devops-remote-india-jobs", source: "curated" as const },
    { id: "r6", title: "Full Stack Developer", company: "Turing", location: "Remote, India", type: "Full-time", experienceLabel: "Mid-Level (3-5 yrs)", matchedSkills: ["react", "node.js", "javascript", "typescript", "sql"], description: "Work remotely on full-stack projects for US tech companies. Competitive compensation.", postedDate: "1 day ago", salary: "15L - 30L /yr", applyLink: "https://www.naukri.com/fullstack-remote-india-jobs", source: "curated" as const },
  ]

  // STEP 1: Filter by role skills - show jobs that have ANY overlap with the role's skills
  let filtered = ALL_FALLBACK_JOBS.filter((job) => {
    return job.matchedSkills.some((jobSkill) =>
      userSkills.some((userSkill) => skillMatches(userSkill, jobSkill))
    )
  })

  // If no matches found with skill matching, try broader matching by job title
  if (filtered.length === 0) {
    const roleQuery = role.replace(/-/g, " ")
    filtered = ALL_FALLBACK_JOBS.filter((job) => {
      const jobTitle = job.title.toLowerCase()
      return jobTitle.includes(roleQuery) || roleQuery.split(" ").some(word => word.length > 3 && jobTitle.includes(word))
    })
  }

  // STEP 2: Location filtering - only show jobs in the user's specified location
  if (loc && loc !== "india" && loc !== "") {
    filtered = filtered.filter((job) => {
      const jobLoc = job.location.toLowerCase()
      // Match if the job location contains the user's search location
      // Also include remote jobs
      return jobLoc.includes(loc) || jobLoc.includes("remote")
    })
  }

  // STEP 3: Apply experience filter
  if (experience !== "any") {
    const expMap: Record<string, string> = {
      fresher: "Fresher",
      junior: "Junior",
      mid: "Mid-Level",
      senior: "Senior",
      lead: "Lead",
    }
    const expLabel = expMap[experience] || ""
    const expFiltered = filtered.filter((job) =>
      job.experienceLabel.includes(expLabel)
    )
    // Only apply experience filter if it returns results; otherwise keep all skill+location matches
    if (expFiltered.length > 0) filtered = expFiltered
  }

  // NO random fallback - if no matches found, return empty array
  // The user asked to show ONLY relevant jobs

  // Sort by relevance: jobs matching MORE user skills come first
  filtered.sort((a, b) => {
    const aCount = a.matchedSkills.filter((js) =>
      userSkills.some((us) => skillMatches(us, js))
    ).length
    const bCount = b.matchedSkills.filter((js) =>
      userSkills.some((us) => skillMatches(us, js))
    ).length
    return bCount - aCount
  })

  return filtered
}
