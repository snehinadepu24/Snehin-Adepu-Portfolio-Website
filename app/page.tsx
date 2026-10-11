"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Mail, ExternalLink, Code2 } from "lucide-react";
import type { PipelineNode } from "@/components/PipelineScene";

import ScrollReveal from "@/components/ScrollReveal";
import SplitHeading from "@/components/SplitHeading";
import MediaCarousel from "@/components/MediaCarousel";
import { useRocketLaunch } from "@/components/RocketLaunchOverlay";
import { projects, experience } from "@/content/data";
import styles from "./page.module.css";

// ── Heavy client-only components ─────────────────────────────
const HeroLattice = dynamic(() => import("@/components/HeroLattice"), { ssr: false });
const FrameScrubPortrait = dynamic(() => import("@/components/FrameScrubPortrait"), { ssr: false });
const Threads = dynamic(() => import("@/components/Threads"), { ssr: false });
const Aurora = dynamic(() => import("@/components/Aurora"), { ssr: false });
const Magnet = dynamic(() => import("@/components/Magnet"), { ssr: false });
const DecryptedText = dynamic(() => import("@/components/DecryptedText"), { ssr: false });
const SpotlightCard = dynamic(() => import("@/components/SpotlightCard"), { ssr: false });
const PipelineScene = dynamic(() => import("@/components/PipelineScene"), { ssr: false });
const LoadBalancer3D = dynamic(() => import("@/components/LoadBalancer3D"), { ssr: false });
const NumberTicker = dynamic(() => import("@/components/NumberTicker"), { ssr: false });
const CobeGlobe = dynamic(() => import("@/components/CobeGlobe"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ── Capabilities ─────────────────────────────────────────────
const capabilities = [
  { area: "ML & AI Systems", items: ["LLM optimization", "Vertex AI", "Generative AI", "XGBoost", "CNN", "NLP"] },
  { area: "Backend Engineering", items: ["FastAPI", "Python", "PostgreSQL", "Supabase", "REST APIs", "GCP"] },
  { area: "Data & Pipelines", items: ["AWS S3", "Apache Parquet", "Time-series", "CI/CD", "Docker", "Git"] },
  { area: "Research", items: ["IoT Security", "DDoS Detection", "3D Reconstruction", "LiDAR", "Unity"] },
];

// ── Lab items ────────────────────────────────────────────────
const labItems = [
  { num: "01", title: "IoT DDoS Detection", desc: "XGBoost + CNN hybrid — 99.03% accuracy. Presented at ICONFEST 2025.", link: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks", tag: "Conference Paper" },
  { num: "02", title: "3D Monument Restoration", desc: "iPad LiDAR + SAM for heritage site reconstruction. Unity walkthrough, mobile-optimised.", link: "https://skfb.ly/pIrCK", tag: "Research Project" },
  { num: "03", title: "AI Grievance Platform", desc: "JanSamadhan — multilingual AI complaint routing with WhatsApp integration. Top 1000 in India Innovates 2026.", link: "https://crm-five-gold-48.vercel.app/", tag: "Live Demo" },
  { num: "04", title: "Price Feed Pipeline", desc: "OHLCV data at 5-min intervals. 50,000+ records/day. Apache Parquet on S3 — 35% cost reduction.", link: undefined, tag: "System Design" },
];

// ── LLM / RAG Pipeline nodes & edges (Work section) ─────────
const llmNodes: PipelineNode[] = [
  { label: "User Query", sublabel: "input", shape: "sphere", color: "#F3EEE6", x: -4.2, y: 0, z: 0 },
  { label: "Embedding", sublabel: "text-ada", shape: "octahedron", color: "#C45C26", x: -2.2, y: 0.5, z: 0 },
  { label: "Vector DB", sublabel: "pgvector", shape: "cylinder", color: "#8A847A", x: -0.2, y: -0.3, z: 0 },
  { label: "Context", sublabel: "top-k chunks", shape: "box", color: "#C45C26", x: 1.8, y: 0.4, z: 0 },
  { label: "LLM", sublabel: "Vertex AI", shape: "octahedron", color: "#FF8040", x: 3.5, y: 0, z: 0.2 },
  { label: "Response", sublabel: "output", shape: "sphere", color: "#F3EEE6", x: 5.0, y: -0.2, z: 0 },
];
const llmEdges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]];

// ── Data Ingestion Pipeline nodes & edges (Lab section) ──────
const dataPipeNodes: PipelineNode[] = [
  { label: "OHLCV Feed", sublabel: "5-min interval", shape: "sphere", color: "#F3EEE6", x: -4.0, y: 0, z: 0 },
  { label: "Ingestor", sublabel: "Python service", shape: "octahedron", color: "#C45C26", x: -2.2, y: 0.4, z: 0 },
  { label: "Redis Cache", sublabel: "hot layer", shape: "cylinder", color: "#FF4040", x: -0.2, y: -0.2, z: 0 },
  { label: "S3 / Parquet", sublabel: "35% cost cut", shape: "box", color: "#3ecf6e", x: 1.8, y: 0.5, z: 0 },
  { label: "Aggregator", sublabel: "1m/5m/1h/1d", shape: "octahedron", color: "#C45C26", x: 3.5, y: 0, z: 0 },
  { label: "Time-series", sublabel: "dashboard", shape: "sphere", color: "#F3EEE6", x: 5.0, y: -0.3, z: 0 },
];
const dataPipeEdges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]];

// ── Wave gate duration — removed ─────────────────────────────

// ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { triggerLaunch } = useRocketLaunch();

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Detect mobile (disable Magnet on small screens)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // GSAP scroll animations
  useGSAP(() => {
    if (prefersReduced) return;

    // Batch headings — one ScrollTrigger for the group instead of one per element
    ScrollTrigger.batch(".section-heading", {
      start: "top 88%",
      onEnter: (els) => {
        gsap.fromTo(els,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 24, opacity: 0 },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", y: 0, opacity: 1,
            duration: 1, ease: "power4.out", stagger: 0.1
          }
        );
      },
      once: true,
    });

    // Work rows stagger up — batched
    ScrollTrigger.batch(".work-row", {
      start: "top 90%",
      onEnter: (els) => {
        gsap.fromTo(els, { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.09 });
      },
      once: true,
    });

    // Experience items slide from left — batched
    ScrollTrigger.batch(".exp-item", {
      start: "top 87%",
      onEnter: (els) => {
        gsap.fromTo(els, { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06 });
      },
      once: true,
    });

    // Cap cards scale up — batched
    ScrollTrigger.batch(".cap-item", {
      start: "top 90%",
      onEnter: (els) => {
        gsap.fromTo(els, { y: 40, scale: 0.95, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.65, ease: "power2.out", stagger: 0.08 });
      },
      once: true,
    });

    // Lab cards stagger from right — batched
    ScrollTrigger.batch(".lab-card", {
      start: "top 90%",
      onEnter: (els) => {
        gsap.fromTo(els, { x: 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.1 });
      },
      once: true,
    });

    // Section parallax backgrounds — scrub (must stay per-element for scrub)
    gsap.utils.toArray<HTMLElement>(".parallax-section").forEach((sec) => {
      const bg = sec.querySelector<HTMLElement>(".section-bg");
      if (!bg) return;
      gsap.fromTo(bg, { yPercent: -15 },
        {
          yPercent: 15, ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true }
        }
      );
    });

    // Pipeline scene fade in — batched
    ScrollTrigger.batch(".pipeline-canvas-wrap", {
      start: "top 85%",
      onEnter: (els) => {
        gsap.fromTo(els, { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
      },
      once: true,
    });
  }, { scope: containerRef, dependencies: [prefersReduced] });

  const workProjects = projects.filter((p) => p.category === "work");

  return (
    <>
      <div className={styles.page} ref={containerRef}>

        {/* ══════════════════════════════════════════════════════
            HERO — 300vh scroll runway with pinned sticky hero
            ══════════════════════════════════════════════════════ */}
        <div id="hero-runway" className={styles.heroScrollRunway}>
          <section className={styles.heroSticky}>

            {/* Threads */}
            {!prefersReduced && (
              <div className={styles.threadsLayer} aria-hidden="true">
                <Threads color="#C45C26" accentColor="#8A847A" amplitude={0.9} distance={0.28} lineCount={55} speed={0.3} opacity={0.10} angle={18} fade={0.22} />
              </div>
            )}

            {/* Social rail */}
            <div className={styles.heroSocials} role="list" aria-label="Social links">
              <a href="https://github.com/snehinadepu24" target="_blank" rel="noopener noreferrer" className={styles.socialLink} role="listitem" aria-label="GitHub" data-cursor="visit">
                <Code2 size={15} aria-hidden="true" /><span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/snehin-adepu-1774b928b/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} role="listitem" aria-label="LinkedIn" data-cursor="visit">
                <ExternalLink size={15} aria-hidden="true" /><span>LinkedIn</span>
              </a>
              <a href="mailto:adepu.snehin@gmail.com" className={styles.socialLink} role="listitem" aria-label="Email" data-cursor="visit">
                <Mail size={15} aria-hidden="true" /><span>Email</span>
              </a>
              <div className={styles.socialRailLine} aria-hidden="true" />
            </div>

            <div className={`container ${styles.heroContainer}`}>
              {/* Left copy */}
              <div className={styles.heroContent} ref={heroContentRef}>
                <p className={`label ${styles.heroLabel}`}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  Systems Engineer · ML · Backend
                </p>
                <h1 className={styles.headline}>
                  <span className={styles.headlineLine}>Snehin</span>
                  <span className={`${styles.headlineLine} ${styles.headlineAccent}`}>Adepu.</span>
                </h1>
                <p className={styles.tagline}>
                  Building backend systems and ML pipelines that scale.{" "}
                  <span className={styles.taglineAccent}>Currently at Eli Lilly.</span>{" "}
                  Previously Loomylabs &amp; Alfago.
                </p>
                <div className={styles.heroStats}>
                  <div className={styles.stat}>
                    <span className={styles.statVal}>
                      <NumberTicker value={70} suffix="%+" delay={0.2} />
                    </span>
                    <span className={styles.statLabel}>Inference cost cut</span>
                  </div>
                  <div className={styles.statDivider} aria-hidden="true" />
                  <div className={styles.stat}>
                    <span className={styles.statVal}>
                      <NumberTicker value={1000} suffix="+" delay={0.3} />
                    </span>
                    <span className={styles.statLabel}>Concurrent users</span>
                  </div>
                  <div className={styles.statDivider} aria-hidden="true" />
                  <div className={styles.stat}>
                    <span className={styles.statVal}>
                      <NumberTicker value={50} suffix="K+" delay={0.4} />
                    </span>
                    <span className={styles.statLabel}>Records / day</span>
                  </div>
                </div>
                <div className={styles.heroCtas}>
                  <Magnet magnetStrength={3} disabled={isMobile}>
                    <button
                      type="button"
                      onClick={() => triggerLaunch({ type: "resume" })}
                      className={styles.btnPrimary}
                      data-cursor="launch"
                      aria-label="Résumé"
                    >
                      Résumé <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  </Magnet>
                  <Magnet magnetStrength={3} disabled={isMobile}>
                    <a href="https://www.linkedin.com/in/snehin-adepu-1774b928b/" target="_blank" rel="noopener noreferrer" className={styles.btnSecondary} data-cursor="visit">
                      LinkedIn <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  </Magnet>
                  <Magnet magnetStrength={3} disabled={isMobile}>
                    <a
                      href="mailto:adepu.snehin@gmail.com"
                      className={styles.btnSecondary}
                      data-cursor="launch"
                    >
                      Contact <Mail size={15} aria-hidden="true" />
                    </a>
                  </Magnet>
                </div>
              </div>

              {/* Right — morphing brain + frame scrubber overlay */}
              <div className={styles.heroVisuals} aria-hidden="true" data-cursor="drag">
                {/* 3D behind */}
                <div className={styles.latticeWrapper}><HeroLattice /></div>
                <div className={styles.scrubberWrapper}><FrameScrubPortrait /></div>
              </div>
            </div>

          </section>
        </div>

        {/* ══════════════════════════════════════════════════════
            SELECTED WORK  +  LLM/RAG Pipeline 3D
            ══════════════════════════════════════════════════════ */}
        <section id="work" className={`${styles.sectionWork} parallax-section`}>
          <div className={`${styles.sectionBgNoise} section-bg`} aria-hidden="true" />
          <div className="container">

            <div className={styles.sectionHeader}>
              <p className="label">Selected Work</p>
              <SplitHeading as="h2" text="Engineering at scale" className={`${styles.sectionTitle} section-heading`} />
            </div>

            {/* ── LLM / RAG Pipeline visual ── */}
            <div className={`${styles.pipelineWrap} pipeline-canvas-wrap`} data-cursor="drag">
              <div className={styles.pipelineLabel}>
                <span className={styles.pipelineTag}>LLM · RAG Pipeline</span>
                <span className={styles.pipelineDesc}>Loomylabs inference architecture — 70%+ cost reduction</span>
              </div>
              <PipelineScene
                nodes={llmNodes}
                edges={llmEdges}
                height="400px"
                camZ={6.8}
                particleSpeed={0.65}
                particleCount={6}
              />
            </div>

            <div className={styles.workList}>
              {workProjects.map((project, idx) => (
                <Link key={project.slug} href={`/work/${project.slug}`} className={`${styles.workRow} work-row`} data-cursor="view">
                  <div className={styles.workRowNumber}>{String(idx + 1).padStart(2, "0")}</div>
                  <div className={styles.workRowContent}>
                    <div className={styles.workRowTop}>
                      <h3 className={styles.workRowTitle}>{project.title}</h3>
                      <ArrowUpRight className={styles.workRowArrow} size={20} aria-hidden="true" />
                    </div>
                    <p className={styles.workRowDesc}>{project.shortDesc}</p>
                    <div className={styles.workRowMeta}>
                      <div className={styles.techList}>
                        {project.tech.slice(0, 4).map((t) => (
                          <span key={t} className={styles.techTag}>{t}</span>
                        ))}
                      </div>
                      {project.metrics[0] && (
                        <div className={styles.workMetric}>
                          <span className={styles.metricVal}>{project.metrics[0].value}</span>
                          <span className={styles.metricLabel}>{project.metrics[0].label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className={styles.sectionFooter}>
                <Link href="/work" className={styles.viewAllLink}>View all projects <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            EXPERIENCE  +  Load Balancer 3D
            ══════════════════════════════════════════════════════ */}
        <section id="experience" className={`${styles.sectionExp} parallax-section`}>
          <div className={`${styles.sectionBgGrid} section-bg`} aria-hidden="true" />
          <div className="container">

            <div className={styles.sectionHeader}>
              <p className="label">Experience</p>
              <SplitHeading as="h2" text="Where I've built" className={`${styles.sectionTitle} section-heading`} />
            </div>

            {/* ── Load Balancer visual ── */}
            <div className={`${styles.pipelineWrap} pipeline-canvas-wrap`} data-cursor="drag">
              <div className={styles.pipelineLabel}>
                <span className={styles.pipelineTag}>GCP · Load Balancing</span>
                <span className={styles.pipelineDesc}>Loomylabs backend — 1,000+ concurrent users handled</span>
              </div>
              <LoadBalancer3D height="400px" />
            </div>

            <div className={styles.expList}>
              {experience.map((exp) => (
                <div key={exp.id} className={`${styles.expItem} exp-item`}>
                  <div className={styles.expLeft}>
                    <p className={styles.expDate}>{exp.date}</p>
                    <div className={styles.expLine} aria-hidden="true" />
                  </div>
                  <div className={styles.expRight}>
                    <p className={styles.expCompany}>{exp.company}</p>
                    <h3 className={styles.expRole}>{exp.role}</h3>
                    <p className={styles.expDesc}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CAPABILITIES
            ══════════════════════════════════════════════════════ */}
        <section className={`${styles.sectionCap} parallax-section`}>
          <div className={`${styles.sectionBgDots} section-bg`} aria-hidden="true" />
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className="label">Capabilities</p>
              <SplitHeading as="h2" text="What I work with" className={`${styles.sectionTitle} section-heading`} />
            </div>
            <div className={styles.capGrid}>
              {capabilities.map((cap) => (
                <SpotlightCard key={cap.area} className={`${styles.capCard} cap-item`} spotlightColor="#C45C26" intensity={0.12} ambient>
                  <h4 className={styles.capArea}>{cap.area}</h4>
                  <ul className={styles.capList}>
                    {cap.items.map((item) => (
                      <li key={item} className={styles.capTag}>
                        <DecryptedText text={item} animateOn="hover" sequential speed={30}
                          className={styles.capTagText} encryptedClassName={styles.capTagEncrypted}
                          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                        />
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LAB & RESEARCH  +  Data Ingestion Pipeline 3D
            ══════════════════════════════════════════════════════ */}
        <section id="lab" className={`${styles.sectionLab} parallax-section`}>
          <div className={`${styles.sectionBgNoise} section-bg`} aria-hidden="true" />
          <div className="container">

            <div className={styles.sectionHeader}>
              <p className="label">Lab &amp; Research</p>
              <SplitHeading as="h2" text="Experiments & explorations" className={`${styles.sectionTitle} section-heading`} />
            </div>

            {/* ── Data pipeline visual ── */}
            <div className={`${styles.pipelineWrap} pipeline-canvas-wrap`} data-cursor="drag">
              <div className={styles.pipelineLabel}>
                <span className={styles.pipelineTag}>Data Pipeline · Redis · S3</span>
                <span className={styles.pipelineDesc}>Alfago price-feed system — 50,000+ records/day</span>
              </div>
              <PipelineScene
                nodes={dataPipeNodes}
                edges={dataPipeEdges}
                height="400px"
                camZ={6.8}
                particleSpeed={0.8}
                particleCount={6}
              />
            </div>

            <div className={styles.labGrid}>
              {labItems.map((item) => (
                <SpotlightCard key={item.num} className={`${styles.labCard} lab-card`} spotlightColor="#C45C26" intensity={0.13} borderGlow={0.4}>
                  <div className={styles.labCardTop}>
                    <span className={styles.labNum}>{item.num}</span>
                    <span className={styles.labTag}>{item.tag}</span>
                  </div>
                  <h3 className={styles.labTitle}>{item.title}</h3>
                  <p className={styles.labDesc}>{item.desc}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.labLink} data-cursor="view">
                      View <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                </SpotlightCard>
              ))}
            </div>

            <ScrollReveal delay={150}>
              <Link href="/lab" className={styles.viewAllLink} style={{ marginTop: "3rem", display: "inline-flex" }} data-cursor="view">
                All lab work <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ABOUT
            ══════════════════════════════════════════════════════ */}
        <section id="about" className={styles.sectionAbout}>
          <div className="container">
            <div className={styles.aboutGrid}>
              <div className={styles.aboutLeft}>
                <ScrollReveal>
                  <p className="label">About</p>
                  <SplitHeading as="h2" text="The Engineer" className={`${styles.sectionTitle} section-heading`} />
                </ScrollReveal>
                <ScrollReveal delay={150}>
                  <div className={styles.aboutImage}>
                    <Image src="/profile.png" alt="Snehin Adepu" width={260} height={260} className={styles.profileImg} />
                  </div>
                </ScrollReveal>
              </div>
              <div className={styles.aboutRight}>
                <ScrollReveal delay={100}>
                  <p className={styles.aboutText}>
                    CSE (AI &amp; ML) student at{" "}
                    <span className={styles.aboutAccent}>VNR Vignana Jyothi Institute</span>,
                    Hyderabad — CGPA 8.55. My work sits at the intersection of backend systems
                    and machine learning: building things that are fast, accurate, and built to last.
                  </p>
                  <p className={styles.aboutText}>
                    Currently a Tech Enterprise Automation Intern at{" "}
                    <span className={styles.aboutAccent}>Eli Lilly and Company</span>, integrating
                    ServiceNow with enterprise data sources and building AI-powered workflow tools.
                  </p>
                  <p className={styles.aboutText}>
                    Outside of work: presenting research at conferences, pushing code late at night,
                    thinking about system design more than is healthy.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            MEDIA & ENGAGEMENTS
            ══════════════════════════════════════════════════════ */}
        <section id="media" className={styles.sectionMedia}>
          <div className="container" style={{ textAlign: "center" }}>
            <p className="label">Media &amp; Engagements</p>
            <SplitHeading as="h2" text="Latest Posts & Videos" className={`${styles.sectionTitle} section-heading`} />
          </div>
          <MediaCarousel />
        </section>

        {/* ══════════════════════════════════════════════════════
            CONTACT
            ══════════════════════════════════════════════════════ */}
        <section id="contact" className={`${styles.sectionContact} parallax-section`}>
          {!prefersReduced && (
            <div className={styles.contactAurora} aria-hidden="true">
              <Aurora colorStops={["#0C0B09", "#3A1A0A", "#C45C26"]} amplitude={0.8} blend={0.45} speed={0.3} />
            </div>
          )}
          <div className="container">
            <div className={styles.contactGrid}>
              {/* Left Column: Contact info & CTAs */}
              <ScrollReveal>
                <div className={styles.contactInner}>
                  <p className="label">Contact</p>
                  <SplitHeading as="h2" text="Let's build something." className={`${styles.contactHeadline} section-heading`} />
                  <p className={styles.contactSubtitle}>
                    Open to new-grad SWE · ML · Backend roles. Reach me directly.
                  </p>
                  <div className={styles.contactLinks}>
                    <Magnet magnetStrength={3} disabled={isMobile}>
                      <a
                        href="mailto:adepu.snehin@gmail.com"
                        className={styles.contactLink}
                        data-cursor="launch"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                      >
                        <Mail size={18} aria-hidden="true" />adepu.snehin@gmail.com
                      </a>
                    </Magnet>
                    <Magnet magnetStrength={3} disabled={isMobile}>
                      <a href="https://github.com/snehinadepu24" target="_blank" rel="noopener noreferrer" className={styles.contactLink} data-cursor="visit">
                        <Code2 size={18} aria-hidden="true" />github.com/snehinadepu24
                      </a>
                    </Magnet>
                    <Magnet magnetStrength={3} disabled={isMobile}>
                      <a href="https://www.linkedin.com/in/snehin-adepu-1774b928b/" target="_blank" rel="noopener noreferrer" className={styles.contactLink} data-cursor="visit">
                        <ExternalLink size={18} aria-hidden="true" />linkedin.com/in/snehin-adepu
                      </a>
                    </Magnet>
                  </div>
                  <div className={styles.resumeRow}>
                    <Magnet magnetStrength={2} disabled={isMobile}>
                      <button
                        type="button"
                        onClick={() => triggerLaunch({ type: "resume" })}
                        className={styles.btnPrimary}
                        data-cursor="launch"
                        aria-label="Download Résumé"
                      >
                        Download Résumé <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                    </Magnet>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Column: 3D Globe with contextual availability */}
              <ScrollReveal delay={150}>
                <div className={styles.contactGlobeCard}>
                  <div className={styles.globeCardHeader}>
                    <span className={styles.globeCardLabel}>Global Availability</span>
                    <span className={styles.globeStatusBadge}>
                      <span className={styles.globeLiveDot} />
                      Worldwide Relocation &amp; Remote
                    </span>
                  </div>
                  <p className={styles.globeCardDescription}>
                    Based in <strong className={styles.aboutAccent}>Hyderabad, India</strong> (17.38° N, 78.48° E) — open to high-impact SWE, ML &amp; Backend engineering roles worldwide.
                  </p>
                  <div className={styles.globeCanvasWrap}>
                    <CobeGlobe />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
