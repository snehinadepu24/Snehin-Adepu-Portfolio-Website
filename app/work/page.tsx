import { projects } from "@/content/data";
import Link from "next/link";
import styles from "./work.module.css";

export const metadata = {
  title: "Work | Snehin Adepu",
  description: "Selected engineering work and projects by Snehin Adepu.",
};

export default function WorkIndex() {
  const workProjects = projects.filter((p) => p.category === "work");

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Selected Work</h1>
          <p className={styles.subtitle}>
            AI systems, pipelines, and software engineering.
          </p>
        </div>
      </section>

      <section className={styles.projectsList}>
        <div className="container">
          {workProjects.map((project, idx) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className={styles.projectCard}
            >
              <div className={styles.projectNumber}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className={styles.projectContent}>
                <h2 className={styles.projectTitle}>{project.title}</h2>
                <p className={styles.projectDesc}>{project.shortDesc}</p>
                <div className={styles.techList}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.techTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
