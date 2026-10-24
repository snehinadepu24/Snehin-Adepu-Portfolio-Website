export type Project = {
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  demoUrl?: string;
  githubUrl?: string;
  category: "work" | "lab";
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
};

export const projects: Project[] = [
  {
    slug: "jansamadhan",
    title: "JanSamadhan — AI Civic Grievance Platform (Student Project Demo)",
    shortDesc: "AI-powered complaint classification platform with WhatsApp integration.",
    description: "**⚠️ STUDENT PROJECT DEMO** — This is an educational demonstration project. Not affiliated with government entities. AI-powered complaint classification platform with multilingual support and WhatsApp integration. Features real-time dashboards for civic authorities. Selected among Top 1000 teams in India Innovates 2026 (Bharat Mandapam, Delhi).",
    tech: ["AI Classification", "Multilingual NLP", "WhatsApp API", "Dashboards"],
    metrics: [
      { label: "National Rank", value: "Top 1000" },
      { label: "AI Feature", value: "Multilingual" }
    ],
    demoUrl: "https://crm-five-gold-48.vercel.app/",
    category: "work"
  },
  {
    slug: "monument-restoration",
    title: "AI-Based Monument Restoration & Virtual Tourism",
    shortDesc: "iPad LiDAR + SAM model for 3D reconstruction of historical monuments.",
    description: "Used iPad LiDAR + SAM model for 3D reconstruction of historical monuments. Built Unity walkthrough with mobile optimization. Reduced cost vs traditional LiDAR + NeRF methods for heritage preservation.",
    tech: ["iPad LiDAR", "SAM Model", "Unity", "3D Reconstruction"],
    metrics: [
      { label: "Optimization", value: "Mobile-first" },
      { label: "Approach", value: "Cost-effective 3D" }
    ],
    demoUrl: "https://skfb.ly/pIrCK",
    category: "work"
  },
  {
    slug: "uber-rides-analysis",
    title: "Uber Rides Analysis",
    shortDesc: "Analyzed 500,000+ ride records to uncover pricing and demand patterns.",
    description: "Analyzed 500,000+ ride records to uncover pricing and demand patterns. Built an XGBoost regression model achieving RMSE: 1.84 for fare prediction with feature engineering and hyperparameter tuning.",
    tech: ["XGBoost", "Python", "Data Analysis", "ML"],
    metrics: [
      { label: "Model RMSE", value: "1.84" },
      { label: "Dataset", value: "500K+ records" }
    ],
    category: "work"
  },
  {
    slug: "iot-ddos-security",
    title: "Securing IoT Networks Using Hybrid Machine Learning Model Against DDoS Attacks",
    shortDesc: "Conference research — IoT DDoS detection using XGBoost + CNN (99.03% accuracy).",
    description: "Presented conference research in IoT security. Built an XGBoost + CNN model for IoT DDoS detection, achieving 99.03% accuracy. Presented at ICONFEST 2025.",
    tech: ["XGBoost", "CNN", "Python", "Network Security"],
    metrics: [
      { label: "Accuracy", value: "99.03%" },
      { label: "Event", value: "ICONFEST 2025" }
    ],
    demoUrl: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks",
    category: "lab"
  },
  {
    slug: "price-feed-tracker",
    title: "Price Feed Tracker Pipeline",
    shortDesc: "Pipeline fetching OHLCV data every 5 minutes (50,000+ records/day).",
    description: "Built pipeline fetching OHLCV data every 5 minutes (50,000+ records/day) during Alfago Research internship. Stored data in AWS S3 using Apache Parquet (35% cost reduction, 2× speed). Developed time-series aggregation (1m/5m/1h/1d).",
    tech: ["AWS S3", "Apache Parquet", "Data Pipelines", "Time-series Analysis"],
    metrics: [
      { label: "Cost Reduction", value: "35%" },
      { label: "Volume", value: "50,000+ records/day" }
    ],
    category: "work"
  }
];

export const experience: Experience[] = [
  {
    id: "lilly",
    role: "Tech Enterprise Automation Intern",
    company: "Eli Lilly and Company",
    date: "Jul 2026 – Dec 17, 2026",
    description: "Developing enterprise automation solutions integrating ServiceNow and multiple enterprise data sources. Building an AI-powered daily summarizer that aggregates updates from Jira, GitHub, email, calendars, and other internal platforms. Collaborating with engineering teams on scalable automation that improves information accessibility and operational efficiency."
  },
  {
    id: "loomy",
    role: "AIML & Backend Intern",
    company: "Loomylabs",
    date: "May 2025 – Nov 2025",
    description: "Optimized LLM prompting pipelines, reducing inference costs by 70%+. Deployed backend services on GCP with CI/CD pipelines and DNS/networking setup. Designed PostgreSQL schemas (Supabase) and handled 1,000+ concurrent users. Evaluated AI frameworks and cloud tools for production architecture. Worked with Vertex AI & Generative AI for benchmarking LLMs."
  },
  {
    id: "alfago",
    role: "Project Intern — Price Feed Tracker",
    company: "Alfago Research LLP",
    date: "Oct 2025 – Dec 2025",
    description: "Built pipeline fetching OHLCV data every 5 minutes (50,000+ records/day). Stored data in AWS S3 using Apache Parquet (35% cost reduction, 2× speed). Developed time-series aggregation (1m/5m/1h/1d)."
  }
];
