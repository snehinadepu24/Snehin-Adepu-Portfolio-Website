import { projects } from "@/content/data";
import styles from "./lab.module.css";

export const metadata = {
  title: "Lab | Snehin Adepu",
  description: "Experiments, research, and lab projects by Snehin Adepu.",
};

export default function LabIndex() {
  const labProjects = projects.filter((p) => p.category === "lab");

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Digital Laboratory</h1>
          <p className={styles.subtitle}>
            Research papers, experiments, and technical explorations.
          </p>
        </div>
      </section>

      <section className={styles.projectsList}>
        <div className="container">
          <div className="grid">
            {labProjects.map((project) => (
              <div key={project.slug} className={styles.labCard}>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <p className={styles.projectDesc}>{project.description}</p>
                
                <div className={styles.techList}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.techTag}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className={styles.metricsBox}>
                  {project.metrics.map((m) => (
                    <div key={m.label} className={styles.metric}>
                      <span className={styles.metricLabel}>{m.label}</span>
                      <span className={styles.metricValue}>{m.value}</span>
                    </div>
                  ))}
                </div>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.extLink}
                  >
                    View Resource ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
