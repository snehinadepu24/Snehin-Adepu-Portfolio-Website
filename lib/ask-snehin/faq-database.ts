/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — FAQ Database
   40+ verified FAQs with question variants, approved answers,
   related links, and follow-up suggestions.
   ═══════════════════════════════════════════════════════════════ */

import type { FAQEntry } from "./types";

export const faqDatabase: FAQEntry[] = [
  // ── Profile ────────────────────────────────────────────────

  {
    id: "profile-intro",
    category: "profile",
    question: "Who is Snehin Adepu?",
    variants: [
      "Tell me about Snehin",
      "Give me a 30-second introduction to Snehin",
      "Who is this person?",
      "Introduce yourself",
      "What does Snehin do?",
      "Brief intro",
      "Who are you",
      "What's your background",
    ],
    answer:
      "Snehin Adepu is a Systems Engineer specializing in AI/ML and backend development, based in Hyderabad, India. He's currently a CSE (AI & ML) student at VNR Vignana Jyothi Institute (CGPA 8.55) and a Tech Enterprise Automation Intern at **Eli Lilly and Company**. Previously, he optimized LLM pipelines at Loomylabs (70%+ inference cost reduction) and built data ingestion systems at Alfago Research. His work spans LLM optimization, backend systems on GCP, IoT security research, and AI-powered platforms.",
    relatedLinks: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
      { label: "GitHub", url: "https://github.com/snehinadepu24" },
    ],
    relatedQuestions: ["leadership-awssbg", "experience-current", "skills-technical"],
    tags: ["introduction", "overview", "about", "background"],
  },
  {
    id: "profile-location",
    category: "profile",
    question: "Where is Snehin based?",
    variants: [
      "Where does Snehin live?",
      "What city is he in?",
      "Where is he located?",
      "Is he open to relocation?",
      "Location",
    ],
    answer:
      "Snehin is based in **Hyderabad, Telangana, India** (17.38° N, 78.48° E). He's open to worldwide relocation and remote opportunities for high-impact SWE, ML, and Backend engineering roles.",
    relatedQuestions: ["contact-email", "profile-intro"],
    tags: ["location", "hyderabad", "remote", "relocation"],
  },
  {
    id: "profile-interests",
    category: "profile",
    question: "What are Snehin's interests outside of work?",
    variants: [
      "What does Snehin do for fun?",
      "Hobbies",
      "What are his interests?",
      "Outside of engineering",
    ],
    answer:
      "Outside of work, Snehin enjoys presenting research at conferences, pushing code late at night, and thinking about system design. He's passionate about exploring the intersection of backend systems and machine learning — building things that are fast, accurate, and built to last.",
    relatedQuestions: ["profile-intro", "achievements-research"],
    tags: ["hobbies", "interests", "personal"],
  },

  // ── Education ──────────────────────────────────────────────

  {
    id: "education-college",
    category: "education",
    question: "Where does Snehin study?",
    variants: [
      "What's his educational background?",
      "Where did Snehin go to college?",
      "What's his CGPA?",
      "Education details",
      "What degree is he pursuing?",
      "University",
      "College",
    ],
    answer:
      "Snehin is pursuing **B.Tech in CSE (AI & ML)** at **VNR Vignana Jyothi Institute of Engineering and Technology**, Hyderabad. His current CGPA is **8.55**. The program focuses on artificial intelligence, machine learning, and software engineering fundamentals.",
    relatedQuestions: ["profile-intro", "skills-technical"],
    tags: ["education", "college", "university", "degree", "cgpa", "vnr"],
  },

  // ── Skills ─────────────────────────────────────────────────

  {
    id: "skills-technical",
    category: "skills",
    question: "What are Snehin's technical skills?",
    variants: [
      "What technologies does Snehin know?",
      "Tech stack",
      "What languages and frameworks does he use?",
      "Skills and tools",
      "What programming languages does he know?",
      "What tools does he work with?",
    ],
    answer:
      "Snehin's core capabilities span four domains:\n\n**ML & AI Systems:** LLM optimization, Vertex AI, Generative AI, XGBoost, CNN, NLP\n\n**Backend Engineering:** FastAPI, Python, PostgreSQL, Supabase, REST APIs, GCP\n\n**Data & Pipelines:** AWS S3, Apache Parquet, Time-series analysis, CI/CD, Docker, Git\n\n**Research:** IoT Security, DDoS Detection, 3D Reconstruction, LiDAR, Unity",
    relatedQuestions: ["skills-ml", "skills-backend", "experience-loomylabs"],
    tags: ["skills", "tech", "tools", "programming", "languages", "frameworks"],
  },
  {
    id: "skills-ml",
    category: "skills",
    question: "What ML and AI skills does Snehin have?",
    variants: [
      "Machine learning experience",
      "AI capabilities",
      "Deep learning",
      "What AI tools does he use?",
      "LLM experience",
      "Generative AI skills",
    ],
    answer:
      "In ML & AI, Snehin has hands-on experience with:\n\n• **LLM Optimization** — Reduced inference costs by 70%+ at Loomylabs through prompt engineering and pipeline optimization\n• **Vertex AI & Generative AI** — Benchmarked LLMs for production architecture\n• **XGBoost** — Built DDoS detection model (99.03% accuracy) and fare prediction model (RMSE: 1.84)\n• **CNN** — Hybrid XGBoost+CNN architecture for IoT security\n• **NLP** — Multilingual processing for JanSamadhan platform\n• **3D Reconstruction** — iPad LiDAR + SAM model for monument restoration",
    relatedQuestions: ["projects-iot-ddos", "experience-loomylabs", "projects-monument"],
    tags: ["ml", "ai", "llm", "deep-learning", "machine-learning"],
  },
  {
    id: "skills-backend",
    category: "skills",
    question: "What backend skills does Snehin have?",
    variants: [
      "Backend development experience",
      "What backend technologies does he use?",
      "Server-side skills",
      "API development",
      "Cloud experience",
    ],
    answer:
      "Snehin's backend expertise includes:\n\n• **FastAPI & Python** — Primary backend stack for building REST APIs\n• **PostgreSQL / Supabase** — Database design and schema management\n• **GCP** — Deployed backend services with CI/CD pipelines, DNS/networking setup\n• **AWS S3 + Apache Parquet** — Optimized data storage (35% cost reduction)\n• **Docker & CI/CD** — Containerized deployments with automated pipelines\n• **Load Balancing** — Handled 1,000+ concurrent users at Loomylabs",
    relatedQuestions: ["experience-loomylabs", "projects-price-feed", "skills-technical"],
    tags: ["backend", "api", "cloud", "gcp", "aws", "database"],
  },

  // ── Projects ───────────────────────────────────────────────

  {
    id: "projects-best",
    category: "projects",
    question: "What are Snehin's best projects?",
    variants: [
      "Tell me about his projects",
      "Most interesting project",
      "What has he built?",
      "Show me his work",
      "Explain his most interesting AI project",
      "Portfolio projects",
      "What projects has Snehin worked on?",
    ],
    answer:
      "Here are Snehin's standout projects:\n\n**1. JanSamadhan** — AI-powered civic grievance platform with multilingual NLP and WhatsApp integration. Selected among Top 1000 teams in India Innovates 2026.\n\n**2. IoT DDoS Detection** — XGBoost + CNN hybrid achieving 99.03% accuracy. Published conference paper at ICONFEST 2025.\n\n**3. AI Monument Restoration** — iPad LiDAR + SAM model for 3D reconstruction of historical monuments with Unity walkthrough.\n\n**4. Price Feed Pipeline** — OHLCV data ingestion at 50,000+ records/day using Apache Parquet on S3 (35% cost reduction).",
    relatedLinks: [
      { label: "JanSamadhan Demo", url: "https://crm-five-gold-48.vercel.app/" },
      { label: "IoT Paper", url: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks" },
      { label: "3D Model", url: "https://skfb.ly/pIrCK" },
    ],
    relatedQuestions: ["projects-jansamadhan", "projects-iot-ddos", "projects-monument"],
    tags: ["projects", "work", "portfolio", "best"],
  },
  {
    id: "projects-jansamadhan",
    category: "projects",
    question: "Tell me about JanSamadhan",
    variants: [
      "What is JanSamadhan?",
      "AI grievance platform",
      "Civic complaint system",
      "India Innovates project",
      "WhatsApp AI project",
    ],
    answer:
      "**JanSamadhan** is an AI-powered civic grievance platform (student project demo) featuring:\n\n• **AI Classification** — Automated complaint routing using AI\n• **Multilingual NLP** — Supports multiple languages for accessibility\n• **WhatsApp Integration** — Citizens can file complaints via WhatsApp\n• **Real-time Dashboards** — Live analytics for civic authorities\n\nSelected among **Top 1000 teams** in India Innovates 2026 at Bharat Mandapam, Delhi.",
    relatedLinks: [
      { label: "Live Demo", url: "https://crm-five-gold-48.vercel.app/" },
    ],
    relatedQuestions: ["projects-best", "skills-ml", "achievements-india-innovates"],
    tags: ["jansamadhan", "ai", "nlp", "whatsapp", "civic", "grievance"],
  },
  {
    id: "projects-iot-ddos",
    category: "projects",
    question: "Tell me about the IoT DDoS detection research",
    variants: [
      "IoT security project",
      "DDoS detection paper",
      "ICONFEST paper",
      "XGBoost CNN hybrid model",
      "Conference paper",
      "Network security research",
    ],
    answer:
      "**Securing IoT Networks Using Hybrid Machine Learning Model Against DDoS Attacks**\n\nThis is a published conference research paper presented at ICONFEST 2025:\n\n• **Architecture:** Hybrid XGBoost + CNN model\n• **Accuracy:** 99.03%\n• **Domain:** IoT network security, DDoS attack detection\n• **Tech:** XGBoost, CNN, Python, Network Security\n\nThe research addresses the growing vulnerability of IoT devices to distributed denial-of-service attacks using a novel hybrid machine learning approach.",
    relatedLinks: [
      { label: "Research Paper", url: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks" },
    ],
    relatedQuestions: ["skills-ml", "achievements-research", "projects-best"],
    tags: ["iot", "ddos", "security", "research", "paper", "xgboost", "cnn"],
  },
  {
    id: "projects-monument",
    category: "projects",
    question: "Tell me about the 3D monument restoration project",
    variants: [
      "Monument restoration",
      "LiDAR project",
      "3D reconstruction",
      "Heritage preservation",
      "Virtual tourism",
      "Unity walkthrough project",
    ],
    answer:
      "**AI-Based Monument Restoration & Virtual Tourism**\n\nThis project uses cutting-edge technology for heritage preservation:\n\n• **iPad LiDAR** — 3D scanning of historical monuments\n• **SAM Model** — Segment Anything Model for precise reconstruction\n• **Unity Walkthrough** — Interactive virtual tour, mobile-optimized\n• **Cost-effective** — Significantly cheaper than traditional LiDAR + NeRF approaches\n\nThe project enables virtual tourism and aids in digital preservation of cultural heritage sites.",
    relatedLinks: [
      { label: "3D Model on Sketchfab", url: "https://skfb.ly/pIrCK" },
    ],
    relatedQuestions: ["projects-best", "skills-ml"],
    tags: ["monument", "lidar", "3d", "reconstruction", "heritage", "unity", "sam"],
  },
  {
    id: "projects-uber",
    category: "projects",
    question: "Tell me about the Uber rides analysis",
    variants: [
      "Uber data analysis",
      "Fare prediction model",
      "Ride analysis project",
      "XGBoost regression project",
    ],
    answer:
      "**Uber Rides Analysis**\n\nA data science project analyzing ride-hailing patterns:\n\n• **Dataset:** 500,000+ ride records analyzed\n• **Model:** XGBoost regression for fare prediction\n• **Performance:** RMSE of 1.84\n• **Techniques:** Feature engineering, hyperparameter tuning, demand pattern analysis\n• **Insights:** Uncovered pricing and demand patterns from large-scale ride data",
    relatedQuestions: ["skills-ml", "projects-best"],
    tags: ["uber", "data-analysis", "xgboost", "regression", "prediction"],
  },
  {
    id: "projects-price-feed",
    category: "projects",
    question: "Tell me about the Price Feed Pipeline",
    variants: [
      "OHLCV pipeline",
      "Data pipeline project",
      "Alfago price tracker",
      "Time-series data system",
      "S3 data pipeline",
    ],
    answer:
      "**Price Feed Tracker Pipeline** (Built at Alfago Research)\n\n• **Throughput:** 50,000+ records/day, fetching OHLCV data every 5 minutes\n• **Storage:** AWS S3 using Apache Parquet format\n• **Optimization:** 35% cost reduction and 2× speed improvement\n• **Aggregation:** Multi-resolution time-series (1m / 5m / 1h / 1d intervals)\n• **Architecture:** Redis hot-cache layer → S3/Parquet cold storage → time-series aggregation",
    relatedQuestions: ["experience-alfago", "skills-backend", "projects-best"],
    tags: ["pipeline", "data", "ohlcv", "s3", "parquet", "time-series"],
  },

  // ── Experience ─────────────────────────────────────────────

  {
    id: "experience-current",
    category: "experience",
    question: "Where does Snehin currently work?",
    variants: [
      "Current role",
      "What's his current job?",
      "Current internship",
      "Where is he interning?",
      "Current position",
    ],
    answer:
      "Snehin is currently a **Tech Enterprise Automation Intern at Eli Lilly and Company** (Jul 2026 – Dec 2026). The internship runs through **December 17, 2026**. He's:\n\n• Developing enterprise automation solutions integrating ServiceNow with multiple enterprise data sources\n• Building an AI-powered daily summarizer that aggregates updates from Jira, GitHub, email, calendars, and internal platforms\n• Collaborating with engineering teams on scalable automation for operational efficiency",
    relatedLinks: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
    ],
    relatedQuestions: ["experience-lilly-dates", "experience-all", "experience-loomylabs", "skills-technical"],
    tags: ["current", "eli-lilly", "internship", "automation"],
  },
  {
    id: "experience-lilly-dates",
    category: "experience",
    question: "When does Snehin's Eli Lilly internship end?",
    variants: [
      "When does the Lilly internship end",
      "Lilly internship duration",
      "How long is his internship",
      "When is his internship over",
      "Internship end date",
      "When does his current internship finish",
      "How long is he at Eli Lilly",
      "Lilly internship period",
      "Internship timeline",
    ],
    answer:
      "Snehin's internship at **Eli Lilly and Company** runs from **July 2026 through December 17, 2026** — approximately six months. He is working as a Tech Enterprise Automation Intern, developing enterprise automation solutions and AI-powered tools integrating ServiceNow with internal platforms.",
    relatedLinks: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
    ],
    relatedQuestions: ["experience-current", "experience-all", "skills-technical"],
    tags: ["eli-lilly", "internship", "dates", "duration", "end", "timeline"],
  },
  {
    id: "experience-all",
    category: "experience",
    question: "What internship experience does Snehin have?",
    variants: [
      "Tell me about his internships",
      "Work experience",
      "Professional experience",
      "What did he accomplish during his internships?",
      "Career history",
      "Employment history",
    ],
    answer:
      "Snehin has three significant internship experiences:\n\n**1. Eli Lilly and Company** (Jul 2026 – Dec 2026)\nTech Enterprise Automation Intern — Building AI-powered automation integrating ServiceNow with enterprise systems. Ends December 17, 2026.\n\n**2. Loomylabs** (May 2025 – Nov 2025)\nAI/ML & Backend Intern — Reduced LLM inference costs by 70%+, deployed on GCP, handled 1,000+ concurrent users.\n\n**3. Alfago Research LLP** (Oct 2025 – Dec 2025)\nProject Intern — Built price feed pipeline processing 50,000+ records/day with 35% cost reduction.",
    relatedQuestions: ["experience-current", "experience-loomylabs", "experience-alfago"],
    tags: ["experience", "internship", "work", "career"],
  },
  {
    id: "experience-loomylabs",
    category: "experience",
    question: "Tell me about the Loomylabs internship",
    variants: [
      "What did he do at Loomylabs?",
      "Loomylabs experience",
      "LLM optimization work",
      "Backend intern at Loomylabs",
      "70% cost reduction internship",
    ],
    answer:
      "**AI/ML & Backend Intern at Loomylabs** (May 2025 – Nov 2025)\n\nKey accomplishments:\n• **LLM Optimization** — Optimized prompting pipelines, reducing inference costs by **70%+**\n• **GCP Deployment** — Deployed backend services with CI/CD pipelines and DNS/networking\n• **Database Design** — Designed PostgreSQL schemas (Supabase), handling **1,000+ concurrent users**\n• **Architecture** — Evaluated AI frameworks and cloud tools for production use\n• **Vertex AI** — Benchmarked LLMs using Vertex AI & Generative AI tools",
    relatedQuestions: ["experience-all", "skills-ml", "skills-backend"],
    tags: ["loomylabs", "llm", "gcp", "backend", "optimization"],
  },
  {
    id: "experience-alfago",
    category: "experience",
    question: "Tell me about the Alfago Research internship",
    variants: [
      "What did he do at Alfago?",
      "Alfago experience",
      "Price feed tracker internship",
    ],
    answer:
      "**Project Intern at Alfago Research LLP** (Oct 2025 – Dec 2025)\n\n• Built a price feed pipeline fetching **OHLCV data every 5 minutes** (50,000+ records/day)\n• Stored data in **AWS S3 using Apache Parquet** — achieved 35% cost reduction and 2× speed\n• Developed **time-series aggregation** at multiple resolutions (1m / 5m / 1h / 1d)",
    relatedQuestions: ["experience-all", "projects-price-feed", "skills-backend"],
    tags: ["alfago", "pipeline", "data", "s3"],
  },

  // ── Achievements ───────────────────────────────────────────

  {
    id: "achievements-research",
    category: "achievements",
    question: "Has Snehin published any research?",
    variants: [
      "Research papers",
      "Published papers",
      "Conference presentations",
      "Academic publications",
      "Research work",
    ],
    answer:
      "Yes. Snehin has published conference research:\n\n• **\"Securing IoT Networks Using Hybrid Machine Learning Model Against DDoS Attacks\"**\n• Presented at **ICONFEST 2025**\n• Hybrid XGBoost + CNN model with **99.03% accuracy**\n• Published on ResearchGate",
    relatedLinks: [
      { label: "Read Paper", url: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks" },
    ],
    relatedQuestions: ["projects-iot-ddos", "skills-ml"],
    tags: ["research", "paper", "publication", "conference"],
  },
  {
    id: "achievements-india-innovates",
    category: "achievements",
    question: "Tell me about the India Innovates achievement",
    variants: [
      "India Innovates 2026",
      "National competition",
      "Bharat Mandapam",
      "Top 1000 teams",
      "Awards and recognitions",
    ],
    answer:
      "Snehin's team with **JanSamadhan** was selected among **Top 1000 teams in India Innovates 2026** at Bharat Mandapam, New Delhi. This national-level innovation competition recognizes promising student-led solutions addressing real-world civic challenges.",
    relatedQuestions: ["projects-jansamadhan", "achievements-research"],
    tags: ["award", "competition", "national", "innovation"],
  },
  {
    id: "achievements-stats",
    category: "achievements",
    question: "What are Snehin's key metrics and stats?",
    variants: [
      "Impact numbers",
      "Key achievements in numbers",
      "Quantifiable results",
      "Performance metrics",
    ],
    answer:
      "Key quantifiable achievements:\n\n• **70%+** — LLM inference cost reduction at Loomylabs\n• **1,000+** — Concurrent users handled on GCP infrastructure\n• **50,000+** — Records processed daily in Alfago data pipeline\n• **99.03%** — Accuracy on IoT DDoS detection model\n• **35%** — Cost reduction on data storage (S3 + Parquet)\n• **Top 1000** — India Innovates 2026 national rank\n• **8.55** — CGPA at VNR VJIET",
    relatedQuestions: ["experience-all", "projects-best", "profile-intro"],
    tags: ["metrics", "stats", "numbers", "impact"],
  },
  {
    id: "leadership-awssbg",
    category: "achievements",
    question: "What is Snehin's role as AWS Student Builder Group Leader?",
    variants: [
      "AWS Student Builder Group",
      "AWS SBG leader",
      "AWS community leader",
      "AWS student leader",
      "AWS Student Builder Group Leader of VNR VJIET",
      "What is Snehin's leadership role?",
      "Campus leadership",
      "Leadership experience",
      "Extracurricular activities",
      "Community building",
      "AWS SBGL",
      "Student builder group",
    ],
    answer:
      "Snehin is the **AWS Student Builder Group Leader (SBGL)** at VNR VJIET, Hyderabad (tenure: July 2026 – July 2027).\n\nIn this leadership position, he spearheads the campus technology community focused on AWS, cloud architecture, DevOps, and AI/ML:\n\n• **Community Leadership** — Building peer-to-peer technical learning initiatives across the engineering campus\n• **Workshops & Challenges** — Planning and organizing hands-on technical sessions (including DevOps Unboxed and Breakpoint competitions)\n• **Team Coordination** — Directing core committee members and student volunteers across technical, operations, and creative tracks\n• **Industry Collaboration** — Coordinating with industry speakers, faculty advisors, and technology sponsors",
    relatedLinks: [
      { label: "AWSSBG Launch", url: "https://www.linkedin.com/feed/update/urn:li:activity:7488809819978735616" },
      { label: "AWSSBG Committee", url: "https://www.linkedin.com/feed/update/urn:li:activity:7499001159274364928" },
    ],
    relatedQuestions: ["recruiter-beyond-code", "experience-all", "profile-intro"],
    tags: ["leadership", "aws", "sbg", "builder", "community", "devops", "vnrvjiet"],
  },
  {
    id: "recruiter-beyond-code",
    category: "general",
    question: "What makes Snehin a strong candidate beyond technical skills?",
    variants: [
      "Beyond technical skills",
      "Soft skills",
      "Why hire Snehin beyond coding",
      "Leadership and teamwork",
      "What sets him apart as a teammate",
      "Communication skills",
    ],
    answer:
      "Beyond backend and ML engineering, Snehin demonstrates verified initiative and leadership:\n\n• **Technical Community Leadership** — As AWS Student Builder Group Leader at VNR VJIET, he mobilizes peers, leads committees, and organizes campus-wide technical workshops.\n• **Cross-functional Coordination** — Experience managing volunteers across operations, marketing, and content delivery.\n• **Mentorship & Ownership** — He not only builds software systems, but creates platforms for fellow students to learn modern cloud and engineering practices.\n• **Articulate Communication** — Proven through conference presentations (ICONFEST 2025) and technical event facilitation.",
    relatedQuestions: ["leadership-awssbg", "recruiter-why-hire", "experience-all"],
    tags: ["leadership", "soft-skills", "recruiter", "teamwork", "communication"],
  },

  // ── Recruiter / Career Fit ─────────────────────────────────

  {
    id: "recruiter-why-hire",
    category: "general",
    question: "Why should we hire Snehin?",
    variants: [
      "Why might he be a good fit?",
      "What makes Snehin stand out?",
      "Why is Snehin a strong candidate?",
      "Hiring pitch",
      "Why might he be a good fit for an AI engineering role?",
      "What makes him special?",
      "Strengths as a candidate",
    ],
    answer:
      "Here's what makes Snehin a strong candidate:\n\n**1. Proven Impact** — 70%+ LLM cost reduction, 1,000+ concurrent users, 50K+ records/day at scale\n\n**2. Full-Stack ML** — From XGBoost models (99.03% accuracy) to production GCP deployments with CI/CD\n\n**3. Research + Engineering** — Published conference paper (ICONFEST 2025) AND ships production code\n\n**4. Industry Experience** — Three internships spanning Eli Lilly, Loomylabs, and Alfago Research\n\n**5. Real-World Systems** — Builds pipelines, APIs, and databases — not just notebooks\n\n**6. National Recognition** — Top 1000 in India Innovates 2026 with JanSamadhan\n\n**7. Campus Leadership** — AWS Student Builder Group Leader at VNR VJIET (community building, technical workshops, peer mentorship)",
    relatedLinks: [
      { label: "LinkedIn", url: "https://www.linkedin.com/feed/update/urn:li:activity:7488809819978735616" },
      { label: "GitHub", url: "https://github.com/snehinadepu24" },
    ],
    relatedQuestions: ["leadership-awssbg", "recruiter-beyond-code", "experience-all"],
    tags: ["recruiter", "hire", "candidate", "fit", "strengths"],
  },
  {
    id: "recruiter-career-goals",
    category: "general",
    question: "What type of roles is Snehin looking for?",
    variants: [
      "Career goals",
      "What roles is he interested in?",
      "Job preferences",
      "What kind of work does he want?",
      "Career aspirations",
      "Is he looking for a job?",
    ],
    answer:
      "Snehin is open to **new-grad SWE, ML, and Backend engineering roles**. He's interested in positions where he can:\n\n• Work on large-scale ML/AI systems in production\n• Design and optimize backend infrastructure\n• Apply both research skills and engineering execution\n• Contribute to impactful products used by real people\n\nHe's open to worldwide relocation and remote opportunities.",
    relatedLinks: [
      { label: "Email", url: "mailto:adepu.snehin@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
    ],
    relatedQuestions: ["contact-email", "recruiter-why-hire", "profile-intro"],
    tags: ["career", "roles", "goals", "job", "new-grad"],
  },
  {
    id: "recruiter-ai-fit",
    category: "general",
    question: "Is Snehin a good fit for an AI/ML engineering role?",
    variants: [
      "AI engineer fit",
      "ML engineer suitability",
      "Good for machine learning role?",
      "AI role match",
    ],
    answer:
      "Yes — Snehin is well-suited for AI/ML engineering roles because:\n\n**Production ML Experience:**\n• Optimized LLM pipelines in production (70%+ cost cut) — not just academic projects\n• Deployed models on GCP with proper CI/CD\n\n**Strong Research Foundation:**\n• Published conference paper with 99.03% accuracy on DDoS detection\n• Hands-on with XGBoost, CNN, NLP, Generative AI, Vertex AI\n\n**Full-Stack Ability:**\n• Builds the backend too — FastAPI, PostgreSQL, AWS S3, Docker\n• Understands system design, not just model training\n\n**Continuous Learning:**\n• Currently working with enterprise AI at Eli Lilly\n• Active in research and engineering simultaneously",
    relatedQuestions: ["recruiter-why-hire", "skills-ml", "experience-loomylabs"],
    tags: ["ai-fit", "ml-engineer", "career-fit"],
  },
  {
    id: "recruiter-backend-fit",
    category: "general",
    question: "Is Snehin a good fit for a backend engineering role?",
    variants: [
      "Backend engineer fit",
      "Server-side role match",
      "Good for SWE role?",
      "Software engineer suitability",
    ],
    answer:
      "Absolutely — Snehin has strong backend credentials:\n\n• **GCP Production Deployment** — CI/CD pipelines, DNS/networking, load balancing (1,000+ concurrent users)\n• **Database Design** — PostgreSQL schemas on Supabase for production workloads\n• **Data Pipelines** — 50,000+ records/day on AWS S3 with Apache Parquet (35% cost cut, 2× speed)\n• **API Development** — FastAPI REST APIs, Python backend services\n• **DevOps** — Docker containerization, CI/CD automation, Git workflows\n\nPlus he brings ML/AI skills, making him versatile for teams building intelligent systems.",
    relatedQuestions: ["recruiter-why-hire", "skills-backend", "experience-loomylabs"],
    tags: ["backend-fit", "swe", "career-fit"],
  },

  // ── Contact ────────────────────────────────────────────────

  {
    id: "contact-email",
    category: "contact",
    question: "How can I contact Snehin?",
    variants: [
      "Contact information",
      "Email address",
      "How to reach Snehin",
      "Get in touch",
      "Contact details",
      "How do I reach him?",
      "How to connect to him",
      "How to connect with Snehin",
      "Connect with Snehin",
      "What is Snehin LinkedIn",
      "What is his LinkedIn",
      "LinkedIn profile",
      "Linkdin",
      "Connect on LinkedIn",
    ],
    answer:
      "You can reach Snehin through:\n\n• **Email:** adepu.snehin@gmail.com\n• **LinkedIn:** linkedin.com/in/snehin-adepu-1774b928b\n• **GitHub:** github.com/snehinadepu24",
    relatedLinks: [
      { label: "Email", url: "mailto:adepu.snehin@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
      { label: "GitHub", url: "https://github.com/snehinadepu24" },
    ],
    relatedQuestions: ["profile-intro", "recruiter-career-goals"],
    tags: ["contact", "email", "linkedin", "linkdin", "connect", "github"],
  },
  {
    id: "contact-linkedin",
    category: "contact",
    question: "What is Snehin's LinkedIn profile?",
    variants: [
      "LinkedIn",
      "LinkedIn profile",
      "what is snehin linkdin",
      "what is snehin linkedin",
      "what is snehin linkdin hwo to connect to him",
      "linkdin",
      "how to connect to him",
      "how to connect with snehin",
      "connect on linkedin",
      "snehin linkedin profile",
    ],
    answer:
      "You can connect with Snehin on LinkedIn at **[linkedin.com/in/snehin-adepu-1774b928b](https://www.linkedin.com/in/snehin-adepu-1774b928b/)**.\n\nHe is also reachable via email at **adepu.snehin@gmail.com** or on GitHub at **github.com/snehinadepu24**.",
    relatedLinks: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
      { label: "Email", url: "mailto:adepu.snehin@gmail.com" },
      { label: "GitHub", url: "https://github.com/snehinadepu24" },
    ],
    relatedQuestions: ["contact-email", "contact-resume"],
    tags: ["linkedin", "linkdin", "connect", "contact", "social"],
  },
  {
    id: "contact-resume",
    category: "contact",
    question: "Can I see Snehin's resume?",
    variants: [
      "Resume",
      "CV",
      "Download resume",
      "Where's his resume?",
      "Get his resume",
      "Curriculum vitae",
    ],
    answer:
      "You can download Snehin's resume directly from this portfolio — click the **Résumé** button in the hero section or the contact section. It includes his complete education, experience, projects, and skills.",
    relatedQuestions: ["contact-email", "profile-intro", "recruiter-why-hire"],
    tags: ["resume", "cv", "download"],
  },
  {
    id: "contact-github",
    category: "contact",
    question: "What's Snehin's GitHub?",
    variants: [
      "GitHub profile",
      "Source code",
      "Open source contributions",
      "Code repositories",
    ],
    answer:
      "Snehin's GitHub is **github.com/snehinadepu24** — you'll find his project repositories, research code, and open-source contributions there.",
    relatedLinks: [
      { label: "GitHub", url: "https://github.com/snehinadepu24" },
    ],
    relatedQuestions: ["contact-email", "projects-best"],
    tags: ["github", "code", "repositories"],
  },

  // ── General / Meta ─────────────────────────────────────────

  {
    id: "general-portfolio",
    category: "general",
    question: "Tell me about this portfolio website",
    variants: [
      "How was this website built?",
      "Tech stack of this site",
      "What technology is this portfolio using?",
      "Website details",
    ],
    answer:
      "This portfolio is built with **Next.js App Router**, **React 19**, and **TypeScript** with some standout features:\n\n• **3D Visuals** — Three.js pipeline visualizations and COBE globe\n• **Animations** — GSAP scroll-triggered reveals, Framer Motion micro-interactions\n• **Design System** — Custom warm editorial palette (copper/bone/ink)\n• **AI Chat** — This very assistant, Ask Snehin, using local semantic search + Gemini Flash\n• **Performance** — Optimized with dynamic imports, image optimization, and code splitting\n\nDeployed on **Vercel** with Cloudflare DNS.",
    relatedQuestions: ["skills-technical", "profile-intro"],
    tags: ["portfolio", "website", "nextjs", "tech-stack"],
  },
  {
    id: "general-ask-snehin",
    category: "general",
    question: "What is Ask Snehin?",
    variants: [
      "What is this chatbot?",
      "How does this AI work?",
      "Tell me about the AI assistant",
      "What powers this chat?",
    ],
    answer:
      "**Ask Snehin** is an AI-powered portfolio assistant that helps visitors learn about Snehin through natural conversation. It uses:\n\n• **FAQ Knowledge Base** — Verified answers for common questions\n• **Semantic Search** — Matches question meanings, not just exact words\n• **Intent Classification** — Understands what kind of answer you need\n• **Gemini Flash** — AI generation for complex questions, grounded in verified portfolio data\n\nMost questions are answered instantly from the FAQ database. AI generation is only used when truly needed.",
    relatedQuestions: ["general-portfolio", "profile-intro"],
    tags: ["ask-snehin", "chatbot", "ai", "assistant"],
  },

  // ── Greetings / Filler ─────────────────────────────────────

  {
    id: "greeting-hello",
    category: "general",
    question: "Hello",
    variants: [
      "Hi",
      "Hey",
      "What's up",
      "Good morning",
      "Good afternoon",
      "Good evening",
      "Howdy",
      "Sup",
    ],
    answer:
      "Hello. I am an assistant for Snehin Adepu's portfolio. You can ask about his engineering projects, technical stack, enterprise experience at Eli Lilly, or how to get in touch.",
    relatedQuestions: ["profile-intro", "projects-best", "experience-all"],
    tags: ["greeting", "hello", "hi"],
  },
  {
    id: "greeting-thanks",
    category: "general",
    question: "Thank you",
    variants: [
      "Thanks",
      "Thanks a lot",
      "Thank you so much",
      "Appreciate it",
      "Cheers",
    ],
    answer:
      "You are welcome. Feel free to ask any further questions regarding Snehin's engineering work, skills, or background.",
    relatedQuestions: ["contact-email", "recruiter-why-hire"],
    tags: ["thanks", "gratitude"],
  },
  {
    id: "greeting-bye",
    category: "general",
    question: "Goodbye",
    variants: [
      "Bye",
      "See you",
      "Gotta go",
      "Talk later",
      "Peace out",
    ],
    answer:
      "Thank you for visiting. If you would like to connect with Snehin directly, feel free to reach out via email or LinkedIn.",
    relatedLinks: [
      { label: "Email", url: "mailto:adepu.snehin@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
    ],
    tags: ["goodbye", "bye"],
  },
];

/**
 * Look up a FAQ by exact ID.
 */
export function getFAQById(id: string): FAQEntry | undefined {
  return faqDatabase.find((faq) => faq.id === id);
}

/**
 * Get all FAQs in a given category.
 */
export function getFAQsByCategory(category: FAQEntry["category"]): FAQEntry[] {
  return faqDatabase.filter((faq) => faq.category === category);
}

/**
 * Attempt exact match by normalizing the query and checking
 * against every FAQ question and variant.
 */
export function exactMatchFAQ(query: string): FAQEntry | null {
  const normalized = query.toLowerCase().trim().replace(/[?!.,]+$/g, "");

  for (const faq of faqDatabase) {
    const allPhrases = [faq.question, ...faq.variants];
    for (const phrase of allPhrases) {
      const normalizedPhrase = phrase.toLowerCase().trim().replace(/[?!.,]+$/g, "");
      if (normalized === normalizedPhrase) {
        return faq;
      }
    }
  }

  return null;
}
