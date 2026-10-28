/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Knowledge Base
   Detailed verified facts organized by category.
   Used as context when Gemini needs to generate answers.
   ═══════════════════════════════════════════════════════════════ */

import type { KnowledgeRecord } from "./types";

export const knowledgeBase: KnowledgeRecord[] = [
  // ── Profile ────────────────────────────────────────────────

  {
    id: "kb-profile-bio",
    category: "profile",
    content:
      "Snehin Adepu is a Systems Engineer specializing in AI/ML and backend development based in Hyderabad, India. He is a CSE (AI & ML) student at VNR Vignana Jyothi Institute of Engineering and Technology with a CGPA of 8.55. His work sits at the intersection of backend systems and machine learning: building things that are fast, accurate, and built to last.",
    tags: ["bio", "introduction", "profile"],
    links: [
      { label: "Portfolio", url: "https://www.snehinadepu.me/" },
    ],
  },
  {
    id: "kb-profile-current",
    category: "profile",
    content:
      "Currently a Tech Enterprise Automation Intern at Eli Lilly and Company (Jul 2026 – Dec 2026). The internship runs through December 17, 2026. Integrating ServiceNow with enterprise data sources and building AI-powered workflow tools. Previously worked as AI/ML & Backend Intern at Loomylabs and Project Intern at Alfago Research.",
    tags: ["current", "status", "role"],
  },
  {
    id: "kb-profile-ai-model",
    category: "profile",
    content:
      "Ask Snehin AI Assistant: Powered by Google Gemini 3.8 Flash (gemini-3.8-flash) combined with a custom local TF-IDF vector retrieval engine. Operates with temperature 0.3 for high factual accuracy, sub-second latency for common portfolio queries, and strict domain guardrails focused strictly on Snehin's engineering work.",
    tags: ["model", "llm", "gemini", "gemini-3.8-flash", "ask-snehin", "ai", "architecture"],
  },

  // ── Education ──────────────────────────────────────────────

  {
    id: "kb-education-degree",
    category: "education",
    content:
      "B.Tech in Computer Science and Engineering (AI & ML specialization) at VNR Vignana Jyothi Institute of Engineering and Technology, Hyderabad, Telangana, India. Current CGPA: 8.55 out of 10.",
    tags: ["education", "degree", "cgpa", "university"],
  },

  // ── Skills ─────────────────────────────────────────────────

  {
    id: "kb-skills-ml",
    category: "skills",
    content:
      "ML & AI Systems: LLM optimization, Vertex AI, Generative AI, XGBoost, CNN, NLP. Experience with prompt engineering, model benchmarking, and inference cost optimization. Built hybrid ML models achieving 99.03% accuracy.",
    tags: ["ml", "ai", "llm", "deep-learning", "nlp"],
  },
  {
    id: "kb-skills-backend",
    category: "skills",
    content:
      "Backend Engineering: FastAPI, Python, PostgreSQL, Supabase, REST APIs, GCP. Experience with CI/CD pipelines, DNS/networking setup, load balancing, and containerized deployments with Docker.",
    tags: ["backend", "api", "gcp", "database", "devops"],
  },
  {
    id: "kb-skills-data",
    category: "skills",
    content:
      "Data & Pipelines: AWS S3, Apache Parquet, Time-series analysis, CI/CD, Docker, Git. Built data ingestion pipelines processing 50,000+ records/day with 35% cost reduction.",
    tags: ["data", "pipeline", "aws", "s3", "parquet"],
  },
  {
    id: "kb-skills-research",
    category: "skills",
    content:
      "Research: IoT Security, DDoS Detection, 3D Reconstruction, LiDAR scanning, Unity development. Published conference paper at ICONFEST 2025.",
    tags: ["research", "iot", "3d", "lidar", "unity"],
  },

  // ── Projects ───────────────────────────────────────────────

  {
    id: "kb-project-jansamadhan",
    category: "projects",
    content:
      "JanSamadhan — AI Civic Grievance Platform (Student Project Demo). AI-powered complaint classification with multilingual NLP and WhatsApp integration. Features real-time dashboards for civic authorities. Selected among Top 1000 teams in India Innovates 2026 at Bharat Mandapam, Delhi. Tech: AI Classification, Multilingual NLP, WhatsApp API, Dashboards.",
    tags: ["jansamadhan", "ai", "nlp", "whatsapp", "civic"],
    links: [{ label: "Live Demo", url: "https://crm-five-gold-48.vercel.app/" }],
  },
  {
    id: "kb-project-iot-ddos",
    category: "projects",
    content:
      "Securing IoT Networks Using Hybrid Machine Learning Model Against DDoS Attacks — Conference research paper. Built hybrid XGBoost + CNN model achieving 99.03% accuracy for IoT DDoS detection. Presented at ICONFEST 2025 and published on ResearchGate. Tech: XGBoost, CNN, Python, Network Security.",
    tags: ["iot", "ddos", "security", "xgboost", "cnn", "research"],
    links: [{ label: "Research Paper", url: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks" }],
  },
  {
    id: "kb-project-monument",
    category: "projects",
    content:
      "AI-Based Monument Restoration & Virtual Tourism. Used iPad LiDAR + SAM (Segment Anything Model) for 3D reconstruction of historical monuments. Built Unity walkthrough with mobile optimization. Cost-effective alternative to traditional LiDAR + NeRF methods for heritage preservation. Tech: iPad LiDAR, SAM Model, Unity, 3D Reconstruction.",
    tags: ["monument", "lidar", "3d", "sam", "unity", "heritage"],
    links: [{ label: "3D Model", url: "https://skfb.ly/pIrCK" }],
  },
  {
    id: "kb-project-uber",
    category: "projects",
    content:
      "Uber Rides Analysis. Analyzed 500,000+ ride records to uncover pricing and demand patterns. Built XGBoost regression model achieving RMSE: 1.84 for fare prediction with feature engineering and hyperparameter tuning. Tech: XGBoost, Python, Data Analysis, ML.",
    tags: ["uber", "data", "xgboost", "regression", "analysis"],
  },
  {
    id: "kb-project-pricefeed",
    category: "projects",
    content:
      "Price Feed Tracker Pipeline (Alfago Research). Pipeline fetching OHLCV data every 5 minutes — 50,000+ records/day. Stored in AWS S3 using Apache Parquet format (35% cost reduction, 2× speed). Multi-resolution time-series aggregation: 1m/5m/1h/1d intervals. Architecture: Redis hot-cache → S3/Parquet cold storage → time-series aggregation. Tech: AWS S3, Apache Parquet, Data Pipelines, Time-series Analysis.",
    tags: ["pipeline", "ohlcv", "s3", "parquet", "redis", "time-series"],
  },

  // ── Experience ─────────────────────────────────────────────

  {
    id: "kb-exp-lilly",
    category: "experience",
    content:
      "Tech Enterprise Automation Intern at Eli Lilly and Company (Jul 2026 – Dec 2026). The internship ends on December 17, 2026. Developing enterprise automation solutions integrating ServiceNow and multiple enterprise data sources. Building an AI-powered daily summarizer that aggregates updates from Jira, GitHub, email, calendars, and other internal platforms. Collaborating with engineering teams on scalable automation that improves information accessibility and operational efficiency.",
    tags: ["eli-lilly", "automation", "servicenow", "ai", "enterprise", "internship-dates"],
  },
  {
    id: "kb-exp-loomylabs",
    category: "experience",
    content:
      "AI/ML & Backend Intern at Loomylabs (May 2025 – Nov 2025). Optimized LLM prompting pipelines reducing inference costs by 70%+. Deployed backend services on GCP with CI/CD pipelines and DNS/networking setup. Designed PostgreSQL schemas (Supabase) handling 1,000+ concurrent users. Evaluated AI frameworks and cloud tools for production architecture. Worked with Vertex AI & Generative AI for benchmarking LLMs.",
    tags: ["loomylabs", "llm", "gcp", "backend", "optimization", "supabase"],
  },
  {
    id: "kb-exp-alfago",
    category: "experience",
    content:
      "Project Intern — Price Feed Tracker at Alfago Research LLP (Oct 2025 – Dec 2025). Built pipeline fetching OHLCV data every 5 minutes (50,000+ records/day). Stored data in AWS S3 using Apache Parquet (35% cost reduction, 2× speed). Developed time-series aggregation (1m/5m/1h/1d).",
    tags: ["alfago", "pipeline", "data", "s3", "parquet"],
  },

  // ── Achievements ───────────────────────────────────────────

  {
    id: "kb-achievement-iconfest",
    category: "achievements",
    content:
      "Published conference paper 'Securing IoT Networks Using Hybrid Machine Learning Model Against DDoS Attacks' at ICONFEST 2025. Hybrid XGBoost + CNN model achieving 99.03% accuracy.",
    tags: ["research", "paper", "iconfest", "publication"],
    links: [{ label: "Paper", url: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks" }],
  },
  {
    id: "kb-achievement-india-innovates",
    category: "achievements",
    content:
      "JanSamadhan project selected among Top 1000 teams in India Innovates 2026 at Bharat Mandapam, New Delhi. National-level innovation competition.",
    tags: ["award", "national", "innovation", "competition"],
  },

  // ── Leadership & Community ─────────────────────────────────

  {
    id: "kb-leadership-awssbg-role",
    category: "leadership",
    content:
      "AWS Student Builder Group Leader (SBGL) at VNR VJIET, Hyderabad (Program period: July 2026 – July 2027). Leads and builds a student technology community at VNR VJIET focused on AWS, cloud computing, DevOps, AI/ML, and modern software development.",
    tags: ["leadership", "aws", "sbg", "sbgl", "builder", "vnrvjiet", "community", "cloud"],
    links: [
      { label: "AWSSBG Launch", url: "https://www.linkedin.com/feed/update/urn:li:activity:7488809819978735616" },
      { label: "AWSSBG Committee", url: "https://www.linkedin.com/feed/update/urn:li:activity:7499001159274364928" },
    ],
  },
  {
    id: "kb-leadership-awssbg-responsibilities",
    category: "leadership",
    content:
      "As AWS Student Builder Group Leader, Snehin plans and coordinates hands-on workshops, technical challenges, hackathons, and peer-learning initiatives (e.g., DevOps Unboxed, Breakpoint case study competitions). Leads and coordinates student volunteers and core committee members across technical, operations, marketing, and creative teams, as well as coordinating industry speakers, faculty, and sponsors.",
    tags: ["leadership", "community", "workshops", "devops", "team", "volunteers", "mentorship"],
  },
  {
    id: "kb-leadership-positioning",
    category: "leadership",
    content:
      "Beyond technical and engineering skills, Snehin brings strong campus leadership, community building, and event management abilities. He does not just learn technology and build systems; he creates opportunities for other students to learn, collaborate, and engage with the broader technology ecosystem.",
    tags: ["leadership", "soft-skills", "recruiter", "collaboration", "strengths"],
  },

  // ── Links ──────────────────────────────────────────────────

  {
    id: "kb-links-contact",
    category: "links",
    content:
      "Email: adepu.snehin@gmail.com. LinkedIn: linkedin.com/in/snehin-adepu-1774b928b. GitHub: github.com/snehinadepu24. Portfolio: snehinadepu.me.",
    tags: ["contact", "email", "linkedin", "github"],
    links: [
      { label: "Email", url: "mailto:adepu.snehin@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
      { label: "GitHub", url: "https://github.com/snehinadepu24" },
    ],
  },
];

/**
 * Retrieve knowledge records matching any of the given categories.
 */
export function getKnowledgeByCategories(
  categories: KnowledgeRecord["category"][]
): KnowledgeRecord[] {
  return knowledgeBase.filter((r) => categories.includes(r.category));
}

/**
 * Retrieve knowledge records matching any of the given tags.
 */
export function getKnowledgeByTags(tags: string[]): KnowledgeRecord[] {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  return knowledgeBase.filter((r) =>
    r.tags.some((t) => tagSet.has(t.toLowerCase()))
  );
}

/**
 * Retrieve all knowledge records for building full context.
 */
export function getAllKnowledge(): KnowledgeRecord[] {
  return knowledgeBase;
}
