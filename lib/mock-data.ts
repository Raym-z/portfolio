import type {
  Certificate,
  Comment,
  ContactMessage,
  Project,
} from "@/types";

const baseDate = "2026-01-12T10:00:00.000Z";
const githubProfile = "https://github.com/Raym-z";

export const mockProjects: Project[] = [
  {
    id: "mock-nook",
    slug: "nook-collaborative-notes",
    title: "Nook — Collaborative Notes",
    description:
      "A real-time collaborative note-taking and productivity workspace with Firebase-backed file and folder sync. Designed for thousands of concurrent users with sub-200ms synchronization and AI-generated study flashcards.",
    thumbnailUrl: "/mock/project-nook.svg",
    techStack: ["SvelteKit", "Firebase", "JavaScript", "OpenAI API"],
    features: [
      "Real-time file and folder synchronization",
      "Designed for thousands of concurrent users at <200ms latency",
      "ChatGPT-powered flashcard generation from notes",
      "Collaborative productivity workspace for shared knowledge",
    ],
    liveUrl: null,
    githubUrl: githubProfile,
    published: true,
    displayOrder: 1,
    createdAt: "2023-04-01T10:00:00.000Z",
    updatedAt: baseDate,
  },
  {
    id: "mock-bookcast",
    slug: "bookcast-audiobooks",
    title: "Bookcast — Audiobook Web App",
    description:
      "A full-stack audiobook platform for discovering and streaming free audiobooks through an intuitive, responsive interface. Includes favorites and listening history so users can return to what they were enjoying.",
    thumbnailUrl: "/mock/project-bookcast.svg",
    techStack: ["Next.js", "Tailwind CSS", "Supabase", "LibriVox"],
    features: [
      "Audiobook browsing, discovery, and streaming",
      "Favorites and listening-history persistence",
      "Responsive listening interface",
      "Supabase-backed content and user data",
    ],
    liveUrl: null,
    githubUrl: githubProfile,
    published: true,
    displayOrder: 2,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: baseDate,
  },
  {
    id: "mock-visa",
    slug: "visa-immigration-platform",
    title: "Visa & Immigration Platform",
    description:
      "An internal government visa and immigration workflow system built during my internship at PT. Pro Sistimatika Automasi. Contributed across the frontend and backend, including automated PDF report generation.",
    thumbnailUrl: "/mock/project-visa.svg",
    techStack: ["Laravel", "PHP", "MySQL", "PDF Generation"],
    features: [
      "Internal visa and immigration workflow management",
      "Automated PDF generation for application data and reports",
      "Frontend and backend feature development",
      "Production internal tooling for government workflows",
    ],
    liveUrl: null,
    githubUrl: null,
    published: true,
    displayOrder: 3,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: baseDate,
  },
  {
    id: "mock-choreboard",
    slug: "choreboard",
    title: "Choreboard — Gamified Chores",
    description:
      "A gamified household chore tracker built with Laravel 12. Supports households, invitations, role-based access, recurring tasks, streak bonuses, and leaderboard-driven rewards.",
    thumbnailUrl: "/mock/project-choreboard.svg",
    techStack: ["Laravel 12", "MySQL", "Tailwind CSS", "FullCalendar"],
    features: [
      "Task scheduling with frequency, deadlines, and streak bonuses",
      "Leaderboard and gamified rewards",
      "Role-based access for admins and members",
      "Household creation, invitations, and pivot-based task assignment",
    ],
    liveUrl: null,
    githubUrl: githubProfile,
    published: true,
    displayOrder: 4,
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: baseDate,
  },
  {
    id: "mock-finance",
    slug: "personal-finance-tracker",
    title: "Personal Finance Tracker",
    description:
      "A responsive Laravel web app for tracking income, expenses, budgets, and financial goals, with an interactive Chart.js dashboard and secure receipt uploads.",
    thumbnailUrl: "/mock/project-finance.svg",
    techStack: ["Laravel", "MySQL", "Chart.js", "Bootstrap"],
    features: [
      "Income, expense, and financial goal tracking",
      "Interactive Chart.js dashboard",
      "Custom tags, budget management, and receipt uploads",
      "Secure user authentication",
    ],
    liveUrl: null,
    githubUrl: githubProfile,
    published: true,
    displayOrder: 5,
    createdAt: "2025-09-01T10:00:00.000Z",
    updatedAt: baseDate,
  },
  {
    id: "mock-catastrophe",
    slug: "catastrophe-last-cat-standing",
    title: "Catastrophe: Last Cat Standing",
    description:
      "A Unity game project where I built core gameplay mechanics, enemy AI, character movement, combat, dungeon generation, and level design. Published on itch.io.",
    thumbnailUrl: "/mock/project-catastrophe.svg",
    techStack: ["Unity", "C#"],
    features: [
      "Core gameplay mechanics and combat",
      "Enemy AI and dungeon generation",
      "Character movement and level design",
      "Game balancing and itch.io release",
    ],
    liveUrl: null,
    githubUrl: githubProfile,
    published: true,
    displayOrder: 6,
    createdAt: "2023-03-01T10:00:00.000Z",
    updatedAt: baseDate,
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: "mock-paper-fake-profiles",
    title: "Uncovering Fake Profiles Using Machine Learning Algorithms",
    issuer: "ICoABCD 2024",
    imageUrl: "/mock/publication-fake-profiles.svg",
    url: "https://ieeexplore.ieee.org/document/10704439/",
    displayOrder: 1,
    createdAt: "2024-08-01T10:00:00.000Z",
  },
  {
    id: "mock-paper-style-transfer",
    title:
      "Navigating the Ethics of AI-Generated Artworks Through Style Transfer Detection",
    issuer: "CENIM 2025",
    imageUrl: "/mock/publication-style-transfer.svg",
    url: "https://ieeexplore.ieee.org/document/11325823/",
    displayOrder: 2,
    createdAt: "2025-06-01T10:00:00.000Z",
  },
];

export const mockComments: Comment[] = [];

export const mockMessages: ContactMessage[] = [];
