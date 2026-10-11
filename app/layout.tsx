import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { RocketLaunchProvider } from "@/components/RocketLaunchOverlay";

/* ── Fonts ─────────────────────────────────────────────────── */

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const geist = GeistSans;

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

/* ── Metadata ──────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.snehinadepu.me"),
  title: {
    default: "Snehin Adepu — Systems Engineer",
    template: "%s | Snehin Adepu",
  },
  description:
    "Snehin Adepu — AI/ML Engineer & Backend Developer in Hyderabad. VNR VJIET. LLM, FastAPI, GCP. Reduced inference costs 70%+; 1,000+ concurrent users.",
  keywords: [
    "Snehin Adepu",
    "AI ML Engineer",
    "Backend Developer",
    "LLM optimization",
    "FastAPI",
    "GCP",
    "Vertex AI",
    "VNR VJIET",
    "Hyderabad",
    "software engineer",
  ],
  authors: [{ name: "Snehin Adepu" }],
  creator: "Snehin Adepu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    url: "https://www.snehinadepu.me/",
    title: "Snehin Adepu — Systems Engineer",
    description:
      "AI/ML Engineer & Backend Developer. LLM optimization, FastAPI, GCP. Reduced inference costs 70%+.",
    siteName: "Snehin Adepu",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Snehin Adepu — AI/ML Engineer and Backend Developer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snehin Adepu — Systems Engineer",
    description:
      "AI/ML Engineer & Backend Developer. LLM optimization, FastAPI, GCP. Reduced inference costs 70%+.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.snehinadepu.me/",
    languages: {
      "en-IN": "https://www.snehinadepu.me/",
      "en":    "https://www.snehinadepu.me/",
    },
  },
  other: {
    // ── Geo / Location ──────────────────────────────────────
    // Region code: IN (India) + TG (Telangana)
    "geo.region":    "IN-TG",
    "geo.placename": "Hyderabad, Telangana, India",
    // WGS-84 decimal: lat;lon  (no spaces — legacy geo.position format)
    "geo.position":  "17.3850;78.4867",
    // ICBM format (lat, lon with space after comma — used by some crawlers)
    ICBM:            "17.3850, 78.4867",
    // DC subject / coverage — Dublin Core geographic coverage
    "DC.subject":    "Software Engineer Hyderabad India",
    "DC.coverage":   "Hyderabad, Telangana, India",
    // ── Misc ────────────────────────────────────────────────
    "theme-color":   "#0C0B09",
  },
};

/* ── JSON-LD Structured Data ───────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.snehinadepu.me/#website",
      name: "Snehin Adepu",
      url: "https://www.snehinadepu.me/",
      inLanguage: "en-IN",
      publisher: { "@id": "https://www.snehinadepu.me/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://www.snehinadepu.me/#person",
      name: "Snehin Adepu",
      url: "https://www.snehinadepu.me/",
      image: "https://www.snehinadepu.me/profile.png",
      email: "mailto:adepu.snehin@gmail.com",
      jobTitle: "AI/ML Engineer and Backend Developer",
      description:
        "AI/ML Engineer and Backend Developer in Hyderabad. CSE (AI and ML) student at VNR VJIET. Currently a Tech Enterprise Automation Intern at Eli Lilly and Company, with experience in LLM optimization, FastAPI, and GCP.",
      worksFor: {
        "@type": "Organization",
        name: "Eli Lilly and Company",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "VNR Vignana Jyothi Institute of Engineering and Technology",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "FastAPI",
        "Google Cloud Platform",
        "Amazon Web Services",
        "Vertex AI",
        "Large Language Models",
        "Backend Development",
        "Python",
        "PostgreSQL",
      ],
      sameAs: [
        "https://www.linkedin.com/in/snehin-adepu-1774b928b/",
        "https://github.com/snehinadepu24",
      ],
    },
    {
      "@type": "ScholarlyArticle",
      "@id": "https://www.snehinadepu.me/#paper-iot-ddos",
      name: "Securing IoT Networks Using Hybrid Machine Learning Model Against DDoS Attacks",
      url: "https://www.researchgate.net/publication/412146269_Securing_IoT_Networks_Using_Hybrid_Machine_Learning_Model_Against_DDoS_Attacks",
      author: { "@id": "https://www.snehinadepu.me/#person" },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://www.snehinadepu.me/#profilepage",
      url: "https://www.snehinadepu.me/",
      name: "Snehin Adepu | AI/ML Engineer and Backend Developer",
      isPartOf: { "@id": "https://www.snehinadepu.me/#website" },
      mainEntity: { "@id": "https://www.snehinadepu.me/#person" },
      about: { "@id": "https://www.snehinadepu.me/#person" },
    },
    {
      // BreadcrumbList helps Google understand site structure
      "@type": "BreadcrumbList",
      "@id": "https://www.snehinadepu.me/#breadcrumbs",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.snehinadepu.me/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Work",
          item: "https://www.snehinadepu.me/work",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Lab",
          item: "https://www.snehinadepu.me/lab",
        },
      ],
    },
  ],
};

/* ── Root Layout ───────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geist.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CustomCursor />
        {/* Skip to main content — accessibility */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <RocketLaunchProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </RocketLaunchProvider>
      </body>
    </html>
  );
}
