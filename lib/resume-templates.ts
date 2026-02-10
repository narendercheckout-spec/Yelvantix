export interface Experience {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  id: string
  degree: string
  school: string
  year: string
}

export interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
  skills: string
  experience: Experience[]
  education: Education[]
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: string
  sampleData: ResumeData
}

export const emptyResume: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  experience: [],
  education: [],
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Clean serif layout with traditional formatting. Best for corporate and executive roles.",
    category: "Traditional",
    sampleData: {
      fullName: "James Anderson",
      email: "james.anderson@email.com",
      phone: "(555) 234-5678",
      location: "New York, NY",
      summary: "Seasoned business analyst with 8+ years of experience driving strategic initiatives and process optimization across Fortune 500 companies. Proven track record of delivering data-driven insights that reduce costs by up to 20%.",
      skills: "Strategic Planning, Financial Analysis, SQL, Tableau, Project Management, Stakeholder Communication, Risk Assessment",
      experience: [
        { id: "1", title: "Senior Business Analyst", company: "Goldman Sachs", startDate: "Mar 2020", endDate: "Present", description: "Lead cross-functional teams of 12+ members to deliver quarterly business intelligence reports.\nReduced operational costs by $2.4M through process automation initiatives.\nDeveloped predictive models that improved forecasting accuracy by 35%." },
        { id: "2", title: "Business Analyst", company: "Deloitte Consulting", startDate: "Jun 2016", endDate: "Feb 2020", description: "Analyzed client business processes and recommended improvements for 15+ engagements.\nCreated dashboards and reports using Tableau for C-suite stakeholders.\nManaged project budgets exceeding $500K with consistent on-time delivery." },
      ],
      education: [
        { id: "1", degree: "MBA, Finance", school: "Columbia Business School", year: "2016" },
        { id: "2", degree: "B.S. Economics", school: "University of Michigan", year: "2014" },
      ],
    },
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean sans-serif design with ample white space. Ideal for tech and startup roles.",
    category: "Modern",
    sampleData: {
      fullName: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "(555) 876-5432",
      location: "San Francisco, CA",
      summary: "Full-stack software engineer with 5 years of experience building scalable web applications. Passionate about clean code, performance optimization, and creating delightful user experiences.",
      skills: "React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, GraphQL, CI/CD, Agile",
      experience: [
        { id: "1", title: "Senior Software Engineer", company: "Stripe", startDate: "Jan 2022", endDate: "Present", description: "Architected and built payment processing microservices handling 10M+ daily transactions.\nReduced API response times by 40% through query optimization and caching strategies.\nMentored 4 junior engineers and led technical design reviews." },
        { id: "2", title: "Software Engineer", company: "Airbnb", startDate: "Aug 2019", endDate: "Dec 2021", description: "Developed React components for the host dashboard, serving 4M+ active hosts.\nImplemented A/B testing framework that increased booking conversions by 12%.\nContributed to open-source design system used across 20+ internal teams." },
      ],
      education: [
        { id: "1", degree: "B.S. Computer Science", school: "Stanford University", year: "2019" },
      ],
    },
  },
  {
    id: "executive-bold",
    name: "Executive Bold",
    description: "Strong header with bold section dividers. Perfect for senior leadership positions.",
    category: "Executive",
    sampleData: {
      fullName: "Michael Torres",
      email: "m.torres@email.com",
      phone: "(555) 345-6789",
      location: "Chicago, IL",
      summary: "Results-driven VP of Operations with 15+ years of leadership experience in manufacturing and supply chain management. Expert in lean methodology, having led transformations generating $50M+ in cumulative savings.",
      skills: "Operations Management, Lean Six Sigma, Supply Chain Optimization, P&L Management, Team Leadership, Change Management, ERP Systems, Strategic Sourcing",
      experience: [
        { id: "1", title: "Vice President of Operations", company: "Caterpillar Inc.", startDate: "Jul 2018", endDate: "Present", description: "Oversee operations for 3 manufacturing plants with 2,000+ employees and $800M annual revenue.\nImplemented lean manufacturing processes reducing waste by 30% across all facilities.\nNegotiated vendor contracts saving $12M annually in material costs." },
        { id: "2", title: "Director of Supply Chain", company: "John Deere", startDate: "Mar 2013", endDate: "Jun 2018", description: "Managed end-to-end supply chain for North American operations.\nReduced lead times by 25% through strategic supplier partnerships.\nLed digital transformation initiative implementing SAP S/4HANA across the division." },
      ],
      education: [
        { id: "1", degree: "MBA, Operations Management", school: "Kellogg School of Management", year: "2013" },
        { id: "2", degree: "B.S. Industrial Engineering", school: "Purdue University", year: "2008" },
      ],
    },
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    description: "Modern layout with accent color sidebar markers. Great for marketing and design roles.",
    category: "Creative",
    sampleData: {
      fullName: "Emma Rodriguez",
      email: "emma.r@email.com",
      phone: "(555) 456-7890",
      location: "Austin, TX",
      summary: "Award-winning marketing strategist with 6+ years crafting brand narratives for tech startups and consumer brands. Expertise in digital campaigns that drive measurable growth and brand awareness.",
      skills: "Brand Strategy, Content Marketing, SEO/SEM, Google Analytics, Social Media, Adobe Creative Suite, Copywriting, A/B Testing, HubSpot, Market Research",
      experience: [
        { id: "1", title: "Senior Marketing Manager", company: "Shopify", startDate: "May 2021", endDate: "Present", description: "Lead a team of 8 marketers executing multi-channel campaigns reaching 2M+ merchants.\nGrew organic traffic by 65% through content strategy and SEO optimization.\nLaunched influencer partnership program generating $4M in attributed revenue." },
        { id: "2", title: "Marketing Specialist", company: "HubSpot", startDate: "Jan 2018", endDate: "Apr 2021", description: "Managed email marketing campaigns with 500K+ subscriber base and 28% open rates.\nCreated lead generation funnels that increased MQLs by 45% quarter-over-quarter.\nProduced 50+ blog posts and whitepapers driving 100K+ monthly organic visits." },
      ],
      education: [
        { id: "1", degree: "B.A. Marketing Communications", school: "University of Texas at Austin", year: "2017" },
      ],
    },
  },
  {
    id: "compact-efficient",
    name: "Compact Efficient",
    description: "Dense single-column layout maximizing content per page. Ideal for experienced professionals.",
    category: "Traditional",
    sampleData: {
      fullName: "David Kim",
      email: "david.kim@email.com",
      phone: "(555) 567-8901",
      location: "Seattle, WA",
      summary: "Data scientist with 7+ years of experience in machine learning, statistical modeling, and big data analytics. Published researcher with expertise in NLP and recommendation systems.",
      skills: "Python, R, TensorFlow, PyTorch, SQL, Spark, Hadoop, scikit-learn, NLP, Deep Learning, A/B Testing, Data Visualization, MLOps",
      experience: [
        { id: "1", title: "Staff Data Scientist", company: "Amazon", startDate: "Apr 2021", endDate: "Present", description: "Built recommendation engine serving 300M+ customers, increasing click-through rates by 18%.\nDesigned NLP pipeline for product review analysis processing 50M+ reviews monthly.\nLed team of 5 data scientists on personalization initiatives." },
        { id: "2", title: "Senior Data Scientist", company: "Microsoft", startDate: "Sep 2018", endDate: "Mar 2021", description: "Developed predictive models for Azure cloud usage forecasting with 92% accuracy.\nImplemented real-time anomaly detection system reducing service incidents by 40%.\nPublished 3 papers at top-tier ML conferences (NeurIPS, ICML)." },
        { id: "3", title: "Data Scientist", company: "Zillow", startDate: "Jun 2016", endDate: "Aug 2018", description: "Built the Zestimate valuation model improvements for the Seattle metro area.\nCreated automated feature engineering pipeline reducing model iteration time by 60%." },
      ],
      education: [
        { id: "1", degree: "Ph.D. Computer Science (Machine Learning)", school: "University of Washington", year: "2016" },
        { id: "2", degree: "B.S. Mathematics", school: "UC Berkeley", year: "2012" },
      ],
    },
  },
  {
    id: "two-column-pro",
    name: "Two-Column Pro",
    description: "Sidebar layout with skills and contact on the left. Popular for project managers and consultants.",
    category: "Modern",
    sampleData: {
      fullName: "Rachel Foster",
      email: "rachel.foster@email.com",
      phone: "(555) 678-9012",
      location: "Boston, MA",
      summary: "Certified PMP with 10+ years managing complex IT projects across healthcare and fintech industries. Known for delivering projects on time and under budget while maintaining exceptional stakeholder satisfaction.",
      skills: "Project Management, Agile/Scrum, JIRA, Confluence, Risk Management, Budgeting, Stakeholder Management, Waterfall, SAFe, Resource Planning",
      experience: [
        { id: "1", title: "Senior Project Manager", company: "Fidelity Investments", startDate: "Feb 2020", endDate: "Present", description: "Manage portfolio of 6 concurrent projects with combined budgets of $15M+.\nDelivered core banking platform migration 2 weeks ahead of schedule.\nImplemented agile transformation across 4 development teams (40+ members)." },
        { id: "2", title: "Project Manager", company: "Epic Systems", startDate: "Aug 2015", endDate: "Jan 2020", description: "Led EHR implementation projects for 12 hospital systems across the Northeast.\nManaged cross-functional teams of 25+ clinicians, developers, and analysts.\nAchieved 98% client satisfaction score across all managed deployments." },
      ],
      education: [
        { id: "1", degree: "M.S. Information Systems", school: "Boston University", year: "2015" },
        { id: "2", degree: "B.A. Business Administration", school: "Northeastern University", year: "2013" },
      ],
    },
  },
  {
    id: "tech-focused",
    name: "Tech Focused",
    description: "Monospace-inspired layout emphasizing technical skills. Built for developers and engineers.",
    category: "Technical",
    sampleData: {
      fullName: "Alex Nguyen",
      email: "alex.nguyen@email.com",
      phone: "(555) 789-0123",
      location: "Portland, OR",
      summary: "DevOps engineer with 6+ years building and maintaining cloud infrastructure at scale. Expert in containerization, CI/CD automation, and infrastructure-as-code. Passionate about reliability engineering and developer experience.",
      skills: "Kubernetes, Docker, Terraform, AWS, GCP, Jenkins, GitHub Actions, Prometheus, Grafana, Linux, Ansible, Python, Go, Helm",
      experience: [
        { id: "1", title: "Senior DevOps Engineer", company: "Nike", startDate: "Jun 2021", endDate: "Present", description: "Architected Kubernetes platform serving 200+ microservices with 99.99% uptime.\nBuilt CI/CD pipelines reducing deployment time from 45 minutes to 5 minutes.\nImplemented infrastructure-as-code with Terraform managing 500+ AWS resources." },
        { id: "2", title: "DevOps Engineer", company: "New Relic", startDate: "Mar 2018", endDate: "May 2021", description: "Managed monitoring infrastructure processing 1B+ data points daily.\nAutomated server provisioning reducing setup time from 2 days to 30 minutes.\nDesigned disaster recovery procedures achieving 15-minute RTO." },
      ],
      education: [
        { id: "1", degree: "B.S. Computer Engineering", school: "Oregon State University", year: "2018" },
      ],
    },
  },
  {
    id: "academic-formal",
    name: "Academic Formal",
    description: "Structured layout with emphasis on education and publications. Ideal for academic and research roles.",
    category: "Academic",
    sampleData: {
      fullName: "Dr. Priya Sharma",
      email: "p.sharma@email.com",
      phone: "(555) 890-1234",
      location: "Cambridge, MA",
      summary: "Biomedical researcher with 12+ years in drug discovery and molecular biology. Published 25+ peer-reviewed papers with 1,500+ citations. Experienced in leading multidisciplinary research teams and securing federal grants.",
      skills: "Molecular Biology, Drug Discovery, CRISPR, Bioinformatics, Grant Writing, Clinical Trials, Statistical Analysis, Lab Management, GMP Compliance, Scientific Writing",
      experience: [
        { id: "1", title: "Principal Research Scientist", company: "MIT Lincoln Laboratory", startDate: "Aug 2019", endDate: "Present", description: "Lead a team of 8 researchers on NIH-funded cancer therapeutics program ($3.2M grant).\nDiscovered novel biomarker panel improving early cancer detection sensitivity by 40%.\nPublished 8 papers in Nature, Cell, and Science journals." },
        { id: "2", title: "Research Scientist", company: "Pfizer", startDate: "Jun 2014", endDate: "Jul 2019", description: "Conducted preclinical research for 3 drug candidates now in Phase II trials.\nDeveloped high-throughput screening assay reducing compound evaluation time by 50%.\nCollaborated with 5 academic institutions on translational research projects." },
      ],
      education: [
        { id: "1", degree: "Ph.D. Molecular Biology", school: "Harvard University", year: "2014" },
        { id: "2", degree: "M.S. Biochemistry", school: "Johns Hopkins University", year: "2010" },
        { id: "3", degree: "B.S. Biology", school: "University of Delhi", year: "2008" },
      ],
    },
  },
  {
    id: "sales-impact",
    name: "Sales Impact",
    description: "Numbers-driven layout highlighting achievements and metrics. Perfect for sales and BD roles.",
    category: "Business",
    sampleData: {
      fullName: "Marcus Johnson",
      email: "marcus.j@email.com",
      phone: "(555) 901-2345",
      location: "Dallas, TX",
      summary: "Top-performing enterprise sales executive with 9+ years consistently exceeding quota by 130%+. Expertise in SaaS solutions, complex deal negotiations, and building high-performing sales teams from the ground up.",
      skills: "Enterprise Sales, SaaS, Salesforce, Account Management, Pipeline Development, Negotiation, Team Leadership, CRM Strategy, Revenue Forecasting, Client Relations",
      experience: [
        { id: "1", title: "Regional Sales Director", company: "Salesforce", startDate: "Jan 2021", endDate: "Present", description: "Manage $25M annual revenue target across Southwest region with team of 12 AEs.\nAchieved 145% of quota in FY2024, ranking #1 among 8 regional directors.\nClosed largest enterprise deal in region history at $4.2M ARR." },
        { id: "2", title: "Senior Account Executive", company: "Oracle", startDate: "Mar 2017", endDate: "Dec 2020", description: "Consistently exceeded annual quota of $3M, averaging 135% attainment.\nBuilt and managed a pipeline of 50+ enterprise accounts across energy and healthcare verticals.\nWon Sales Excellence Award 3 consecutive years (2018-2020)." },
      ],
      education: [
        { id: "1", degree: "BBA, Marketing", school: "Southern Methodist University", year: "2015" },
      ],
    },
  },
  {
    id: "clean-starter",
    name: "Clean Starter",
    description: "Simple, well-organized layout for entry-level and career changers. Highlights education and potential.",
    category: "Entry Level",
    sampleData: {
      fullName: "Olivia Park",
      email: "olivia.park@email.com",
      phone: "(555) 012-3456",
      location: "Denver, CO",
      summary: "Recent computer science graduate with strong foundations in web development and UI/UX design. Completed 3 internships and led a capstone project building an accessible healthcare scheduling app used by 500+ patients.",
      skills: "JavaScript, React, HTML/CSS, Figma, Python, Git, Accessibility (WCAG), User Research, Wireframing, REST APIs",
      experience: [
        { id: "1", title: "Software Engineering Intern", company: "Spotify", startDate: "May 2024", endDate: "Aug 2024", description: "Built React components for the podcast discovery feature used by 10M+ listeners.\nImproved page load performance by 25% through code splitting and lazy loading.\nCollaborated with design team to implement accessible UI patterns." },
        { id: "2", title: "UX Design Intern", company: "IBM", startDate: "Jun 2023", endDate: "Aug 2023", description: "Conducted user research interviews with 30+ enterprise clients.\nDesigned wireframes and prototypes for cloud management dashboard.\nPresented design recommendations to product leadership team." },
      ],
      education: [
        { id: "1", degree: "B.S. Computer Science", school: "University of Colorado Boulder", year: "2025" },
      ],
    },
  },
]
