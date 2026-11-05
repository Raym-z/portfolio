import type { Metadata } from "next";
import { AboutSection } from "@/components/home/about-section";
import { Hero } from "@/components/home/hero";
import { ProjectsSection } from "@/components/projects/projects-section";
import { CertificatesSection } from "@/components/certificates/certificates-section";
import { CommentsSection } from "@/components/comments/comments-section";
import { ContactSection } from "@/components/contact/contact-section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    description: siteConfig.description,
    sameAs: siteConfig.socials.map((social) => social.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <CertificatesSection />
      <CommentsSection />
      <ContactSection />
    </>
  );
}
