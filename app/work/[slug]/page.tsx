import { projects } from "@/content/data";
import { notFound } from "next/navigation";
import styles from "./case-study.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} | Work`,
    description: project.shortDesc,
  };
}

export function generateStaticParams() {
  return projects
    .filter((p) => p.category === "work")
    .map((p) => ({ slug: p.slug }));
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className="label">Case Study</p>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
      </header>

      <section className={styles.content}>
        <div className="container">
          <div className="grid">
            <div className={styles.mainCol}>
              <h2>Overview</h2>
              <p className={styles.description}>{project.description}</p>
              
              <div className={styles.techStack}>
                <h3>Technologies</h3>
                <div className={styles.tags}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className={styles.sideCol}>
              {project.metrics.length > 0 && (
                <div className={styles.metricsBox}>
                  {project.metrics.map((m) => (
                    <div key={m.label} className={styles.metric}>
                      <span className={styles.metricValue}>{m.value}</span>
                      <span className={styles.metricLabel}>{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.demoLink}
                >
                  View Live Demo ↗
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
