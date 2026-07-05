// mockJobs.js
// Static dataset standing in for an API response.
// salaryMin/salaryMax are annual USD figures used to drive the
// "market position" bar on each ledger entry.

export const CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Data",
  "Marketing",
  "Operations",
];

export const JOB_TYPES = ["Remote", "Hybrid", "Onsite"];

export const LEVELS = ["Junior", "Mid", "Senior", "Lead"];

// Market-wide floor/ceiling used to position each job's bar.
export const MARKET_MIN = 55000;
export const MARKET_MAX = 220000;

const rawJobs = [
  { title: "Frontend Engineer", company: "Northwind Labs", category: "Engineering", type: "Remote", level: "Mid", salaryMin: 95000, salaryMax: 120000, posted: "2026-06-28", tags: ["React", "TypeScript"], description: "Build and maintain customer-facing dashboards used by thousands of teams daily. You'll work closely with design and product to ship polished, accessible interfaces." },
  { title: "Senior Product Designer", company: "Acme Co", category: "Design", type: "Remote", level: "Senior", salaryMin: 110000, salaryMax: 140000, posted: "2026-07-01", tags: ["Figma", "Design Systems"], description: "Own the end-to-end design of our core product surfaces, from early concept through shipped feature, and help evolve our design system." },
  { title: "Backend Engineer (Go)", company: "Fenwick Systems", category: "Engineering", type: "Hybrid", level: "Senior", salaryMin: 130000, salaryMax: 165000, posted: "2026-06-20", tags: ["Go", "Distributed Systems"], description: "Design and operate the services powering our payments pipeline, with an emphasis on correctness, observability, and graceful failure." },
  { title: "Product Manager", company: "Harborline", category: "Product", type: "Onsite", level: "Mid", salaryMin: 100000, salaryMax: 130000, posted: "2026-06-15", tags: ["Roadmapping", "B2B"], description: "Lead a small squad shipping features for our SMB customers, translating support tickets and interviews into a clear, prioritized roadmap." },
  { title: "Data Analyst", company: "Cobalt Insights", category: "Data", type: "Remote", level: "Junior", salaryMin: 65000, salaryMax: 82000, posted: "2026-06-30", tags: ["SQL", "dbt"], description: "Turn messy operational data into dashboards and narratives that the leadership team actually reads and acts on." },
  { title: "Growth Marketer", company: "Alder & Finch", category: "Marketing", type: "Hybrid", level: "Mid", salaryMin: 78000, salaryMax: 95000, posted: "2026-06-25", tags: ["Lifecycle", "SEO"], description: "Run experiments across acquisition and retention channels, and build the reporting that tells us which ones are actually working." },
  { title: "Staff Software Engineer", company: "Northwind Labs", category: "Engineering", type: "Remote", level: "Lead", salaryMin: 170000, salaryMax: 205000, posted: "2026-06-18", tags: ["Architecture", "Mentorship"], description: "Set technical direction across three teams, review architecture decisions, and mentor senior engineers toward staff-level thinking." },
  { title: "UX Researcher", company: "Acme Co", category: "Design", type: "Remote", level: "Mid", salaryMin: 92000, salaryMax: 115000, posted: "2026-06-22", tags: ["Interviews", "Usability"], description: "Plan and run studies that shape our roadmap, from quick guerrilla tests to longitudinal studies of retention behavior." },
  { title: "Operations Coordinator", company: "Harborline", category: "Operations", type: "Onsite", level: "Junior", salaryMin: 58000, salaryMax: 70000, posted: "2026-06-10", tags: ["Logistics", "Vendor Mgmt"], description: "Keep the day-to-day machinery running: vendor coordination, scheduling, and the dozens of small fires that come up each week." },
  { title: "Machine Learning Engineer", company: "Cobalt Insights", category: "Engineering", type: "Hybrid", level: "Senior", salaryMin: 145000, salaryMax: 180000, posted: "2026-07-02", tags: ["PyTorch", "MLOps"], description: "Take models from notebook to production, building the pipelines and monitoring that keep them reliable at scale." },
  { title: "Product Designer", company: "Fenwick Systems", category: "Design", type: "Remote", level: "Junior", salaryMin: 70000, salaryMax: 88000, posted: "2026-06-29", tags: ["Figma", "Prototyping"], description: "Contribute to a small design team shipping fast, with real ownership over features from day one." },
  { title: "Director of Product", company: "Alder & Finch", category: "Product", type: "Hybrid", level: "Lead", salaryMin: 165000, salaryMax: 210000, posted: "2026-06-12", tags: ["Strategy", "Leadership"], description: "Own product strategy across two business lines and build the team needed to execute on a three-year vision." },
  { title: "Data Engineer", company: "Harborline", category: "Data", type: "Remote", level: "Mid", salaryMin: 105000, salaryMax: 128000, posted: "2026-06-27", tags: ["Airflow", "Spark"], description: "Build and maintain the pipelines that feed every dashboard and model in the company, with an eye toward reliability over cleverness." },
  { title: "Content Marketing Lead", company: "Alder & Finch", category: "Marketing", type: "Remote", level: "Senior", salaryMin: 98000, salaryMax: 122000, posted: "2026-06-19", tags: ["Content Strategy", "SEO"], description: "Set the editorial direction for the blog, newsletter, and long-form guides, and build a small team of writers." },
  { title: "Site Reliability Engineer", company: "Fenwick Systems", category: "Engineering", type: "Onsite", level: "Senior", salaryMin: 135000, salaryMax: 168000, posted: "2026-06-24", tags: ["Kubernetes", "Incident Response"], description: "Own uptime for our core platform, lead incident response, and invest in the tooling that prevents the next outage." },
  { title: "Junior Data Analyst", company: "Cobalt Insights", category: "Data", type: "Onsite", level: "Junior", salaryMin: 60000, salaryMax: 74000, posted: "2026-07-03", tags: ["Excel", "SQL"], description: "Support the analytics team with ad-hoc reporting and help maintain the metrics that drive weekly business reviews." },
  { title: "Engineering Manager", company: "Northwind Labs", category: "Engineering", type: "Hybrid", level: "Lead", salaryMin: 160000, salaryMax: 195000, posted: "2026-06-16", tags: ["People Management", "Planning"], description: "Manage a team of six engineers, own quarterly planning, and stay hands-on enough to review the occasional design doc." },
  { title: "Marketing Coordinator", company: "Harborline", category: "Marketing", type: "Onsite", level: "Junior", salaryMin: 55000, salaryMax: 68000, posted: "2026-06-14", tags: ["Events", "Social"], description: "Coordinate campaign logistics, manage the social calendar, and support the wider marketing team on launch days." },
  { title: "Operations Manager", company: "Alder & Finch", category: "Operations", type: "Hybrid", level: "Mid", salaryMin: 90000, salaryMax: 112000, posted: "2026-06-21", tags: ["Process Design", "Reporting"], description: "Design the processes that let a fast-growing team stay coordinated, and own the reporting that keeps leadership informed." },
  { title: "Principal Engineer", company: "Cobalt Insights", category: "Engineering", type: "Remote", level: "Lead", salaryMin: 185000, salaryMax: 220000, posted: "2026-06-26", tags: ["Systems Design", "Mentorship"], description: "Set technical strategy for the core platform, work across every team in the org, and mentor engineers toward technical leadership." },
];

export const JOBS = rawJobs.map((job, i) => ({
  id: String(i + 1).padStart(4, "0"),
  ...job,
}));