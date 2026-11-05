export const siteConfig = {
  name: "Raymond Willy Tanumihardja",
  firstName: "Raymond",
  initials: "RWT",
  role: "Full-Stack Developer",
  tagline:
    "Membangun Sistem Backend yang Andal, Efisien, dan Terstruktur untuk Solusi Digital.",
  location: "Indonesia · Open to remote",
  email: "raymondwillytan@gmail.com",
  resumeUrl: "/Raymond-Willy-Tanumihardja-CV.pdf",
  url: "https://example.com",
  description:"",
  hero: {
    badge: "Open to full-stack & backend roles",
    titles: [
      "Backend Engineer",
      "Full-Stack Developer",
      "Real-Time Systems Builder",
      "AI & ML Researcher",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Laravel",
      "Node.js",
      "PostgreSQL",
      "Supabase",
    ],
  },
  about: {
    intro:
      "Where creativity meets technology.",
    background:
      "Saya merupakan lulusan Teknik Informatika BINUS dengan IPK 3,79/4,00 dan pernah mengikuti program pertukaran di University of Southern Denmark. Saya juga memiliki pengalaman sebagai full-stack developer intern dalam pengembangan sistem visa dan imigrasi pemerintah.",
    quote: "The best systems are the ones users never have to think about.",
  },
  skills: [
    {
      title: "Frontend",
      description: "Fast, accessible interfaces with modern frameworks.",
      items: ["React", "Next.js", "SvelteKit", "Tailwind CSS", "HTML/CSS"],
    },
    {
      title: "Backend",
      description: "APIs, workflow systems, and real-time data.",
      items: [
        "Node.js",
        "Laravel",
        "REST APIs",
        "PHP",
        "JavaScript/TypeScript",
      ],
    },
    {
      title: "Databases & Infra",
      description: "Reliable storage, auth, and deployment.",
      items: [
        "PostgreSQL",
        "MySQL",
        "Supabase",
        "Firebase",
        "Docker",
        "Vercel",
      ],
    },
    {
      title: "AI & ML",
      description: "Applied machine learning and computer vision.",
      items: [
        "Python",
        "Computer Vision",
        "NLP",
        "Deep Learning",
        "ResNet",
      ],
    },
  ],
  timeline: [
    {
      type: "work",
      title: "Full-Stack Developer Intern",
      organization: "PT. Pro Sistimatika Automasi",
      period: "Sep 2025 – Feb 2026",
      description:
        "Built and maintained an internal government visa and immigration platform, including PDF report generation and end-to-end workflow features.",
      description_id: 
      "Membangun dan memelihara platform internal visa dan keimigrasian pemerintah, termasuk fitur pembuatan laporan PDF dan pengelolaan alur kerja secara menyeluruh.",
      },
    {
      type: "education",
      title: "B.Sc. Computer Science",
      organization: "Bina Nusantara University",
      period: "Sep 2022 – Aug 2026",
      description: "Graduated with a 3.79/4.00 GPA.",
    },
    {
      type: "exchange",
      title: "Exchange Semester",
      organization: "University of Southern Denmark",
      period: "Jan - Jul 2025",
      description: "Completed one semester of study abroad in Denmark.",
    },
  ],
  socials: [
    {
      platform: "LinkedIn",
      label: "LinkedIn",
      handle: "Connect with me",
      href: "https://www.linkedin.com/in/raymond-willy-tanumihardja/",
    },
    {
      platform: "GitHub",
      label: "GitHub",
      handle: "@Raym-z",
      href: "https://github.com/Raym-z",
    },
    {
      platform: "Instagram",
      label: "Instagram",
      handle: "raymond.w.t",
      href: "https://www.instagram.com/raymond.w.t",
    },
    {
      platform: "Discord",
      label: "Discord",
      handle: "raym._.",
      href: "https://discord.com/users/raym._.",
    },
  ],
  stats: {
    experienceSince: 2022,
    yearsExperience: 4,
  },
  nav: [
    { label: "Home", labelKey: "nav.home", href: "#home" },
    { label: "About", labelKey: "nav.about", href: "#about" },
    { label: "Projects", labelKey: "nav.projects", href: "#projects" },
    { label: "Research", labelKey: "nav.research", href: "#certificates" },
    { label: "Contact", labelKey: "nav.contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
