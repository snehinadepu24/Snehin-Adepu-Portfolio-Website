"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRocketLaunch } from "@/components/RocketLaunchOverlay";
import styles from "./Footer.module.css";

const techStack = [
  "FastAPI", "Python", "PostgreSQL", "GCP", "AWS S3",
  "Vertex AI", "XGBoost", "Apache Parquet", "LLMs",
];

const links = {
  work: [
    { label: "Selected Work",      href: "/work" },
    { label: "JanSamadhan",        href: "/work/jansamadhan" },
    { label: "Monument Restoration", href: "/work/monument-restoration" },
    { label: "Price Feed Pipeline", href: "/work/price-feed-tracker" },
  ],
  connect: [
    { label: "GitHub",    href: "https://github.com/snehinadepu24",                        external: true, type: "launch" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/snehin-adepu-1774b928b/",    external: true, type: "launch" },
    { label: "Email",     href: "mailto:adepu.snehin@gmail.com",                          external: false, type: "launch" },
    { label: "Résumé",    href: "/Snehin-Adepu-Resume.pdf",                               external: true, type: "resume" },
  ],
};

export default function Footer() {
  const { triggerLaunch } = useRocketLaunch();
  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Top rule with gradient */}
      <div className={styles.topRule} aria-hidden="true" />

      <div className="container">
        {/* ── Main grid ── */}
        <div className={styles.grid}>

          {/* Identity */}
          <div className={styles.identity}>
            <p className={styles.name}>Snehin Adepu</p>
            <p className={styles.tagline}>
              Systems Engineer · ML · Backend
            </p>
            <p className={styles.bio}>
              Building pipelines and systems that scale —
              from LLM inference to data ingestion.
              Currently at Eli Lilly, Hyderabad.
            </p>
            <div className={styles.availability}>
              <span className={styles.availDot} aria-hidden="true" />
              Open to new-grad SWE · ML · Backend roles
            </div>
          </div>

          {/* Work links */}
          <div className={styles.col}>
            <p className={styles.colHead}>Work</p>
            <ul className={styles.linkList}>
              {links.work.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.footerLink} data-cursor="view">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div className={styles.col}>
            <p className={styles.colHead}>Connect</p>
            <ul className={styles.linkList}>
              {links.connect.map(l => (
                <li key={l.href}>
                  {l.type === "resume" ? (
                    <button
                      type="button"
                      onClick={() => triggerLaunch({ type: "resume" })}
                      className={styles.footerLink}
                      data-cursor="launch"
                      style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "2px", padding: 0 }}
                    >
                      {l.label}
                      <ArrowUpRight size={11} aria-hidden="true" className={styles.extIcon} />
                    </button>
                  ) : (
                    <a
                      href={l.href}
                      className={styles.footerLink}
                      data-cursor="visit"
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                      {l.external && <ArrowUpRight size={11} aria-hidden="true" className={styles.extIcon} />}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div className={styles.col}>
            <p className={styles.colHead}>Stack</p>
            <div className={styles.techGrid}>
              {techStack.map(t => (
                <span key={t} className={styles.techPill}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={styles.bottomBar}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Snehin Adepu. Built with Next.js, R3F &amp; GSAP.
          </p>
          <div className={styles.bottomLinks}>
            <a
              href="https://github.com/snehinadepu24"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomLink}
              data-cursor="visit"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/snehin-adepu-1774b928b/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomLink}
              data-cursor="visit"
            >
              LinkedIn
            </a>
            <a href="mailto:adepu.snehin@gmail.com" className={styles.bottomLink} data-cursor="visit">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
