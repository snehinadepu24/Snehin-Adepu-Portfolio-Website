"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Drawer } from "vaul";
import { useRocketLaunch } from "@/components/RocketLaunchOverlay";
import styles from "./Nav.module.css";

const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/lab", label: "Lab" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { triggerLaunch } = useRocketLaunch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo — two-tone: white & orange */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoFirst}>Snehin</span>
          <span className={styles.logoLast}>Adepu</span>
        </Link>

        {/* Desktop Links */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.navActions}>
            <button
              type="button"
              onClick={() => triggerLaunch({ type: "resume" })}
              className={styles.resumeBtn}
              data-cursor="launch"
              aria-label="Download Résumé"
            >
              Résumé
            </button>
            <span className={styles.availability}>
              Open to new-grad SWE · ML
            </span>
          </div>
        </nav>

        {/* Mobile Nav Drawer (Vaul) */}
        <div className={styles.mobileNavTrigger}>
          <Drawer.Root open={isOpen} onOpenChange={setIsOpen} direction="right">
            <Drawer.Trigger asChild>
              <button aria-label="Open menu" className={styles.menuBtn}>
                <Menu size={24} />
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className={styles.drawerOverlay} />
              <Drawer.Content className={styles.drawerContent}>
                <div className={styles.drawerHeader}>
                  <Drawer.Title className={styles.drawerTitle}>
                    Navigation
                  </Drawer.Title>
                  <Drawer.Close asChild>
                    <button aria-label="Close menu" className={styles.menuBtn}>
                      <X size={24} />
                    </button>
                  </Drawer.Close>
                </div>
                <div className={styles.drawerBody}>
                  <nav className={styles.mobileNavLinks}>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={styles.mobileNavLink}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      className={styles.mobileNavLink}
                      onClick={() => {
                        setIsOpen(false);
                        triggerLaunch({ type: "resume" });
                      }}
                      style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", width: "100%" }}
                    >
                      Résumé
                    </button>
                  </nav>
                  <div className={styles.mobileAvailability}>
                    Open to new-grad SWE · ML
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>
    </header>
  );
}
